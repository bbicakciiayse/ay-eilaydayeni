from __future__ import annotations

from typing import Any

import numpy as np
import pandas as pd

from app.schemas.prediction_schema import PredictionRequest
from app.schemas.training_schema import TrainRequest
from app.services.data_service import clean_value, get_current_dataset
from app.services.notebook_runtime import load_notebook_model


AUTO_FEATURES = {
    "Price_Log",
    "Price_Per_User",
    "Price_Per_User_Log",
    "Offer_Year",
    "Offer_Month",
    "Offer_Quarter",
    "User_Log",
    "Has_Competition",
    "Competition_Count",
    "Has_Partner",
    "Product_Opportunity_Type",
    "Sector_Source",
    "Project_End_Known",
}

runtime = load_notebook_model()

model_state: dict[str, Any] = {
    "target_column": None,
    "data": None,
    "final_features": [],
    "all_subset_results": {},
    "final_model": None,
    "base_scenario": {},
    "metrics": pd.DataFrame(),
}


def _prepare_dataset(target_column: str):
    df = runtime.standardize_column_names(get_current_dataset())
    if target_column not in df.columns:
        raise ValueError(f"Target column not found: {target_column}")

    y = runtime.map_target(df[target_column])
    valid_mask = ~y.isna()
    if valid_mask.sum() == 0:
        raise ValueError("Target column does not contain valid won/lost values.")

    df = df.loc[valid_mask].copy()
    y = y.loc[valid_mask].astype(int).copy()
    if y.nunique() < 2:
        raise ValueError("Target column must contain both won and lost classes.")

    X = df.drop(columns=[target_column]).copy()
    removable = {col for col in runtime.LEAKAGE_RISK_COLUMNS if col in X.columns}
    removable.update(runtime.find_suspicious_columns(list(X.columns)))
    removed_columns = sorted(removable)
    if removed_columns:
        X = X.drop(columns=removed_columns)

    X, engineered_columns = runtime.add_feature_engineering(X)
    numerical_cols = [col for col in X.columns if pd.api.types.is_numeric_dtype(X[col])]
    categorical_cols = [col for col in X.columns if col not in numerical_cols]
    for col in categorical_cols:
        X[col] = X[col].fillna("missing").astype(str)

    price_col = runtime.find_column_ignore_case(X.columns, runtime.PRICE_COLUMN) or runtime.PRICE_COLUMN
    if price_col not in X.columns:
        raise ValueError(f"Price column not found after preprocessing: {runtime.PRICE_COLUMN}")

    return {
        "X": X,
        "y": y,
        "numerical_cols": numerical_cols,
        "categorical_cols": categorical_cols,
        "price_col": price_col,
        "engineered_columns": engineered_columns,
        "removed_columns": removed_columns,
    }


def _records(df: pd.DataFrame):
    if df is None or df.empty:
        return []
    return df.map(clean_value).to_dict(orient="records")


def _best_model_name(comparison_df: pd.DataFrame):
    if comparison_df.empty or "Model" not in comparison_df.columns:
        return "Lasso Logistic Regression"
    return str(comparison_df.iloc[0]["Model"])


def train_notebook_model(request: TrainRequest):
    data = _prepare_dataset(request.target_column)
    engineered_df, removed_df = runtime.build_engineered_feature_table(data)
    impact_df = runtime.evaluate_feature_additions(data)
    final_features, final_features_df, dropped_df = runtime.build_final_feature_set(data, impact_df)
    all_results = runtime.run_feature_subset_nested_cv_comparison(
        data["X"],
        data["y"],
        data_dict=data,
        selected_features=final_features,
    )
    comparison_df = runtime.combine_all_nested_subset_results(all_results)
    final_model, base_scenario = runtime.build_lasso_price_probability_model(
        data["X"],
        data["y"],
        final_features,
        all_results,
        data["price_col"],
    )
    if final_model is None:
        raise ValueError("Lasso price probability model could not be built with the selected features.")

    model_state.update(
        {
            "target_column": request.target_column,
            "data": data,
            "final_features": final_features,
            "all_subset_results": all_results,
            "final_model": final_model,
            "base_scenario": base_scenario,
            "metrics": comparison_df,
        }
    )

    best_model = _best_model_name(comparison_df)
    return {
        "message": "Notebook model training complete.",
        "target_column": request.target_column,
        "selected_metric": request.metric,
        "selected_model": best_model,
        "rows_used": int(len(data["y"])),
        "price_column": data["price_col"],
        "model_input_columns": final_features,
        "metrics_table": _records(comparison_df),
        "engineered_features": _records(engineered_df),
        "removed_columns": _records(removed_df),
        "final_features": _records(final_features_df),
        "dropped_engineered_features": _records(dropped_df),
    }


def get_model_metrics():
    metrics = model_state.get("metrics")
    return {"metrics": _records(metrics)}


def get_model_input_schema():
    data = model_state.get("data")
    if data is None:
        raise ValueError("Train the model before requesting model input schema.")

    X = data["X"]
    fields = []
    for col in model_state["final_features"]:
        if col in AUTO_FEATURES or col not in X.columns:
            continue
        is_numeric = pd.api.types.is_numeric_dtype(X[col])
        options = []
        if not is_numeric:
            options = [clean_value(v) for v in X[col].dropna().astype(str).value_counts().head(50).index]
        fields.append(
            {
                "name": col,
                "type": "number" if is_numeric else "text",
                "required": True,
                "default": clean_value(model_state["base_scenario"].get(col)),
                "options": options,
            }
        )
    return {
        "price_column": data["price_col"],
        "model_input_columns": model_state["final_features"],
        "fields": fields,
    }


def _scenario_from_values(values: dict):
    data = model_state.get("data")
    if data is None:
        raise ValueError("Train the model before prediction.")
    X = data["X"]
    scenario = model_state["base_scenario"].copy()
    for col in model_state["final_features"]:
        if col in AUTO_FEATURES or col not in X.columns:
            continue
        value = values.get(col, scenario.get(col))
        if value in {None, ""}:
            continue
        if pd.api.types.is_numeric_dtype(X[col]):
            scenario[col] = float(value)
        else:
            scenario[col] = str(value)
    return scenario


def predict_notebook_result(request: PredictionRequest):
    data = model_state.get("data")
    if data is None or model_state.get("final_model") is None:
        raise ValueError("Train the model before prediction.")

    scenario = _scenario_from_values(request.values)
    price_col = data["price_col"]
    price = float(scenario[price_col])
    probability = runtime.predict_win_probability_for_price(
        model_state["final_model"],
        scenario,
        model_state["final_features"],
        price_col,
        price,
    )
    return {
        "predicted_result": "Won" if probability >= 0.5 else "Lost",
        "win_probability": probability,
        "expected_value": price * probability,
        "selected_model": "Lasso Logistic Regression",
        "price": price,
        "scenario": {key: clean_value(value) for key, value in scenario.items() if key in model_state["final_features"]},
        "model_comment": "This prediction uses the notebook model logic loaded through the backend wrapper.",
    }


def build_price_sensitivity_for_values(values: dict, min_price=None, max_price=None, step_size=None, selected_price=None):
    data = model_state.get("data")
    if data is None or model_state.get("final_model") is None:
        raise ValueError("Train the model before price sensitivity analysis.")

    X = data["X"]
    price_col = data["price_col"]
    scenario = _scenario_from_values(values)
    price_values = pd.Series(pd.to_numeric(X[price_col], errors="coerce")).dropna()
    if price_values.empty:
        raise ValueError("No valid price values found in the uploaded dataset.")

    min_price = float(min_price if min_price is not None else price_values.quantile(0.05))
    max_price = float(max_price if max_price is not None else price_values.quantile(0.95))
    step_size = float(step_size if step_size is not None else max((max_price - min_price) / 59, 1))

    points = []
    current_price = min_price
    while current_price <= max_price + 1e-9:
        probability = runtime.predict_win_probability_for_price(
            model_state["final_model"],
            scenario,
            model_state["final_features"],
            price_col,
            float(current_price),
        )
        points.append(
            {
                "price": float(current_price),
                "win_probability": float(probability),
                "expected_value": float(current_price * probability),
            }
        )
        current_price += step_size

    optimum = max(points, key=lambda item: item["expected_value"]) if points else None
    return {
        "selected_price": selected_price,
        "price_column": price_col,
        "points": points,
        "optimum_price": optimum,
        "risk_zone": "High" if optimum and optimum["win_probability"] < 0.5 else "Normal",
    }
