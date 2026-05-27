from app.schemas.prediction_schema import SensitivityRequest
from app.services.model_service import build_price_sensitivity_for_values


def build_sensitivity(request: SensitivityRequest):
    return build_price_sensitivity_for_values(
        values=request.values,
        min_price=request.min_price,
        max_price=request.max_price,
        step_size=request.step_size,
        selected_price=request.selected_price,
    )
