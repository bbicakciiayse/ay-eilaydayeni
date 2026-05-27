from pydantic import BaseModel


class PredictionRequest(BaseModel):
    values: dict


class SensitivityRequest(BaseModel):
    values: dict = {}
    min_price: float = 10000
    max_price: float = 50000
    step_size: float = 5000
    selected_price: float = 24000
