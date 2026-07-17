from pydantic import BaseModel

class Budget(BaseModel):
    amount: float
    month: str