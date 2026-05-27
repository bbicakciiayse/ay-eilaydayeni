from __future__ import annotations

import shutil
import uuid
from pathlib import Path
from typing import Any

import numpy as np
import pandas as pd
from fastapi import UploadFile


DATA_DIR = Path(__file__).resolve().parents[1] / "data" / "uploaded"

current_dataset: dict[str, Any] = {
    "path": None,
    "filename": None,
    "dataframe": None,
}


def clean_value(value):
    if isinstance(value, (np.integer,)):
        return int(value)
    if isinstance(value, (np.floating, float)):
        if pd.isna(value) or np.isinf(value):
            return None
        return float(value)
    if pd.isna(value):
        return None
    return value


def dataframe_preview(df: pd.DataFrame, limit: int = 20):
    return df.head(limit).map(clean_value).to_dict(orient="records")


async def save_uploaded_dataset(file: UploadFile):
    suffix = Path(file.filename or "").suffix.lower()
    if suffix not in {".xlsx", ".xls", ".csv"}:
        raise ValueError("Only .xlsx, .xls, and .csv files are supported.")

    DATA_DIR.mkdir(parents=True, exist_ok=True)
    destination = DATA_DIR / f"{uuid.uuid4().hex}{suffix}"
    with destination.open("wb") as output:
        shutil.copyfileobj(file.file, output)

    df = pd.read_csv(destination) if suffix == ".csv" else pd.read_excel(destination)
    current_dataset.update({"path": destination, "filename": file.filename, "dataframe": df})

    return {
        "filename": file.filename,
        "rows": int(df.shape[0]),
        "columns": [str(col) for col in df.columns],
        "preview": dataframe_preview(df),
    }


def get_current_dataset() -> pd.DataFrame:
    df = current_dataset.get("dataframe")
    if df is None:
        raise ValueError("No dataset uploaded yet.")
    return df.copy()


def get_uploaded_data_preview():
    df = get_current_dataset()
    return {
        "filename": current_dataset.get("filename"),
        "rows": int(df.shape[0]),
        "columns": [str(col) for col in df.columns],
        "preview": dataframe_preview(df),
    }
