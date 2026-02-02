from pydantic import BaseModel
from datetime import date, datetime

# Tao moi booking
class BookingCreate(BaseModel):
    room_id: int
    check_in: date
    check_out: date

# Tra du lieu ve client
class BookingResponse(BaseModel):
    booking_id: int
    room_id: int
    check_in: date
    check_out: date
    status: str
    created_at: datetime

    class Config:
        from_attributes = True