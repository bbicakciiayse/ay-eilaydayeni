from fastapi import APIRouter, File, HTTPException, UploadFile

from app.services.data_service import get_uploaded_data_preview, save_uploaded_dataset


router = APIRouter(tags=["upload"])


@router.post("/upload-data")
async def upload_data(file: UploadFile = File(...)):
    try:
        return await save_uploaded_dataset(file)
    except Exception as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.get("/uploaded-data-preview")
def uploaded_data_preview():
    try:
        return get_uploaded_data_preview()
    except Exception as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.post("/select-target")
def select_target(payload: dict):
    return {"target_column": payload.get("target_column"), "message": "Target column selected"}
