from fastapi import APIRouter

from app.schemas.auth_schema import LoginRequest, MfaRequest


router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/login")
def login(request: LoginRequest):
    return {"mfa_required": True, "message": "Mock login accepted", "email": request.email}


@router.post("/verify-mfa")
def verify_mfa(request: MfaRequest):
    return {"authenticated": request.code == "123456", "message": "Mock MFA verification complete"}
