from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from datetime import date

from app.models.booking import Booking
from app.models.room import Room
from app.models.invoice import Invoice
from app.models.user import User

#Xu ly nghiep vu dat phong, tao booking va invoice trong cung mot transaction
def create_booking_service(
    db: Session,
    room_id: int,
    check_in: date,
    check_out: date,
    current_user: User
):

    # Kiem tra phong co ton tai khong
    room = db.query(Room).filter(Room.room_id == room_id).first()
    if not room:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Phong khong ton tai"
        )

    # logic kiem tra trung lich
    overlapping_booking = db.query(Booking).filter(
        Booking.room_id == room_id,
        Booking.status.in_(["confirmed", "checked_in"]),
        Booking.check_in < check_out, #Khách cũ đến trước khi khách mới đi
        Booking.check_out > check_in  #Khách cũ đi sau khi khách mới đến
    ).first()

    if overlapping_booking:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Phong da duoc dat trong khoang thoi gian nay"
        )

    try:
        # Tao booking
        new_booking = Booking(
            user_id=current_user.user_id,
            room_id=room_id,
            check_in=check_in,
            check_out=check_out,
            status="confirmed"
        )

        db.add(new_booking)
        db.flush()  
        # flush de lay booking_id ma chua commit

        # Tinh tong tien
        number_of_days = (check_out - check_in).days
        total_amount = number_of_days * room.price

        # Tao invoice
        new_invoice = Invoice(
            booking_id=new_booking.booking_id,
            total_amount=total_amount,
            status="confirmed"
        )

        db.add(new_invoice)

        # Commit tat ca
        db.commit()

        return new_booking

    except Exception:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Loi he thong khi dat phong"
        )
