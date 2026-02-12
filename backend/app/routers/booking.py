from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import date
from typing import List

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.schemas.booking import BookingCreate, BookingResponse
from app.services.booking_service import create_booking_service, get_user_bookings_service
from app.models.user import User

router = APIRouter(
    prefix="/bookings",
    tags=["Bookings"]
)

#API dat phong cho khach hang, yeu cau dang nhap
@router.post("/", response_model=BookingResponse)
def create_booking(
    booking_data: BookingCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return create_booking_service(
        db,
        booking_data.room_id,
        booking_data.check_in,
        booking_data.check_out,
        current_user
    )
