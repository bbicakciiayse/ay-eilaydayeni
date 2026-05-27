from fastapi import APIRouter, HTTPException

from app.schemas.prediction_schema import PredictionRequest
from app.services.model_service import predict_notebook_result


router = APIRouter(tags=["prediction"])


@router.post("/predict")
def predict(request: PredictionRequest):
    try:
        return predict_notebook_result(request)
    except Exception as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
