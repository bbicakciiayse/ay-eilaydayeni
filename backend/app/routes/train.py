from fastapi import APIRouter, HTTPException

from app.schemas.training_schema import TrainRequest
from app.services.model_service import get_model_input_schema, get_model_metrics, train_notebook_model


router = APIRouter(tags=["training"])


@router.post("/train")
def train(request: TrainRequest):
    try:
        return train_notebook_model(request)
    except Exception as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.get("/model-metrics")
def model_metrics():
    try:
        return get_model_metrics()
    except Exception as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.post("/save-model")
def save_model():
    return {"saved": True, "message": "Current in-memory notebook model is ready for prediction."}


@router.get("/model-input-schema")
def model_input_schema():
    try:
        return get_model_input_schema()
    except Exception as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
