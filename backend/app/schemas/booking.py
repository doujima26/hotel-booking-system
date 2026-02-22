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

# Tra du lieu booking dang hoat dong
class ActiveBookingResponse(BaseModel):
    booking_id: int
    room_number: str
    customer_name: str
    check_in: date
    check_out: date
    booking_status: str

    class Config:
        from_attributes = True