from pydantic import BaseModel


class TrainRequest(BaseModel):
    target_column: str
    metric: str = "Best Overall"
