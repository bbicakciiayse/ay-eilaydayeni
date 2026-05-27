from pydantic import BaseModel


class PaymentRequest(BaseModel):
    plan_name: str = "Professional Plan"


class PaymentConfirmRequest(BaseModel):
    checkout_id: str
    cardholder_name: str
    card_number: str
    expiry_date: str
    cvv: str
    billing_email: str
