from fastapi import APIRouter

from app.services.dashboard_service import get_dashboard_summary, get_saved_results, save_result


router = APIRouter(tags=["dashboard"])


@router.post("/save-result")
def save_prediction_result(payload: dict):
    return save_result(payload)


@router.get("/saved-results")
def saved_results():
    return get_saved_results()


@router.get("/dashboard-summary")
def dashboard_summary():
    return get_dashboard_summary()
