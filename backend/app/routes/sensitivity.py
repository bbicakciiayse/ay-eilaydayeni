from fastapi import APIRouter, HTTPException

from app.schemas.prediction_schema import SensitivityRequest
from app.services.sensitivity_service import build_sensitivity


router = APIRouter(tags=["sensitivity"])


@router.post("/price-sensitivity")
def price_sensitivity(request: SensitivityRequest):
    try:
        return build_sensitivity(request)
    except Exception as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
