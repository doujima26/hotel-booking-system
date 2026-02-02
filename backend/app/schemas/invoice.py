from pydantic import BaseModel
from datetime import datetime

class InvoiceResponse(BaseModel):
    invoice_id: int
    booking_id: int
    total_amount: float
    status: str
    issued_at: datetime

    class Config:
        from_attributes = True
