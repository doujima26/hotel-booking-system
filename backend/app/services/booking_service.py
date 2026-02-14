from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from datetime import date
from typing import List

from app.models.booking import Booking
from app.models.room import Room
from app.models.invoice import Invoice
from app.models.user import User
from app.models.invoice import Invoice


# Xu ly nghiep vu dat phong va tao invoice trong cung mot transaction
def create_booking_service(
    db: Session,
    room_id: int,
    check_in: date,
    check_out: date,
    current_user: User
):

    # Kiem tra phong ton tai
    room = db.query(Room).filter(Room.room_id == room_id).first()
    if not room:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Phong khong ton tai"
        )

    # Kiem tra trung lich
    overlapping_booking = db.query(Booking).filter(
        Booking.room_id == room_id,
        Booking.status.in_(["pending", "confirmed", "checked_in"]),
        Booking.check_in < check_out,
        Booking.check_out > check_in
    ).first()

    if overlapping_booking:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Phong da duoc dat trong khoang thoi gian nay"
        )

    try:
        # Tao booking (PENDING)
        new_booking = Booking(
            user_id=current_user.user_id,
            room_id=room_id,
            check_in=check_in,
            check_out=check_out,
            status="pending"
        )

        db.add(new_booking)
        db.flush()  # Lay booking_id ma chua commit

        # Tinh tong tien
        number_of_days = (check_out - check_in).days
        total_amount = number_of_days * room.price

        # Tao invoice (PENDING)
        new_invoice = Invoice(
            booking_id=new_booking.booking_id,
            total_amount=total_amount,
            status="pending"
        )

        db.add(new_invoice)

        #Commit transaction
        db.commit()
        db.refresh(new_booking)

        return new_booking

    except Exception:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Loi he thong khi dat phong"
        )

# Xu ly check in khi khach den
def check_in_service(
    db: Session,
    booking_id: int,
    current_user: User
):

    booking = db.query(Booking).filter(
        Booking.booking_id == booking_id
    ).first()

    if not booking:
        raise HTTPException(
            status_code=404,
            detail="Khong tim thay booking"
        )

    # Chi cho check in khi booking da confirmed
    if booking.status != "confirmed":
        raise HTTPException(
            status_code=400,
            detail="Booking chua duoc xac nhan hoac khong hop le"
        )

    room = db.query(Room).filter(
        Room.room_id == booking.room_id
    ).first()

    # Kiem tra chi nhanh
    if room.hotel_id != current_user.hotel_id:
        raise HTTPException(
            status_code=403,
            detail="Khong duoc xu ly chi nhanh khac"
        )

    try:
        booking.status = "checked_in"
        room.status = "occupied"

        db.commit()
        db.refresh(booking)

        return booking

    except Exception:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail="Loi khi check in"
        )
    
# Xu ly check out khi khach roi di
def check_out_service(
    db: Session,
    booking_id: int,
    current_user: User
):
    """
    Xu ly check out khi khach roi phong
    """

    booking = db.query(Booking).filter(
        Booking.booking_id == booking_id
    ).first()

    if not booking:
        raise HTTPException(
            status_code=404,
            detail="Khong tim thay booking"
        )

    if booking.status != "checked_in":
        raise HTTPException(
            status_code=400,
            detail="Chi co the check out khi dang o"
        )

    room = db.query(Room).filter(
        Room.room_id == booking.room_id
    ).first()

    if room.hotel_id != current_user.hotel_id:
        raise HTTPException(
            status_code=403,
            detail="Khong duoc xu ly chi nhanh khac"
        )

    try:
        booking.status = "checked_out"
        room.status = "available"

        db.commit()
        db.refresh(booking)

        return booking

    except Exception:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail="Loi khi check out"
        )