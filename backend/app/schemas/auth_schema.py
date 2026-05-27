from pydantic import BaseModel


class LoginRequest(BaseModel):
    email: str
    password: str


class MfaRequest(BaseModel):
    email: str | None = None
    code: str
