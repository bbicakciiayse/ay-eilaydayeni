from pydantic import BaseModel


class TargetColumnRequest(BaseModel):
    target_column: str
