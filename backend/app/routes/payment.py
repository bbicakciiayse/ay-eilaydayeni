from fastapi import APIRouter

from app.schemas.payment_schema import PaymentConfirmRequest, PaymentRequest


router = APIRouter(prefix="/payment", tags=["payment"])


@router.post("/create-checkout")
def create_checkout(request: PaymentRequest):
    return {"checkout_id": "mock_checkout_001", "plan": request.plan_name, "amount": 49}


@router.post("/confirm")
def confirm_payment(request: PaymentConfirmRequest):
    return {"paid": True, "checkout_id": request.checkout_id, "message": "Mock payment confirmed"}
