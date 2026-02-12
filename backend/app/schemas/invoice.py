from pydantic import BaseModel
from datetime import datetime, date


class InvoiceResponse(BaseModel):
    invoice_id: int
    booking_id: int

    # thong tin phong
    room_number: str
    room_type: str
    price: float

    # thong tin dat phong
    check_in: date
    check_out: date

    # thong tin hoa don
    total_amount: float
    status: str
    issued_at: datetime

    class Config:
        from_attributes = True
