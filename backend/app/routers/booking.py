from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import date
from typing import List

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.schemas.booking import ActiveBookingResponse, BookingCreate, BookingResponse
from app.services.booking_service import create_booking_service, get_active_bookings_service
from app.models.user import User
from app.core.permissions import require_staff_or_admin
from app.services.booking_service import check_in_service, check_out_service

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

#API check in cho khach hang
@router.put("/{booking_id}/check-in", response_model=BookingResponse)
def check_in(
    booking_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_staff_or_admin)
):

    return check_in_service(db, booking_id, current_user)

#API check out cho khach hang
@router.put("/{booking_id}/check-out", response_model=BookingResponse)
def check_out(
    booking_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_staff_or_admin)
):

    return check_out_service(db, booking_id, current_user)

#API lay danh sach booking dang hoat dong (chua check out) theo chi nhanh
@router.get("/active", response_model=List[ActiveBookingResponse])
def get_active_bookings(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_staff_or_admin)
):
    return get_active_bookings_service(db, current_user.hotel_id)