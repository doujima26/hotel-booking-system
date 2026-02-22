from sqlalchemy.orm import Session
from app.models.invoice import Invoice
from app.models.booking import Booking
from app.models.room import Room
from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from app.models.user import User
from app.services.mailer_service import send_booking_confirmation_email
from app.schemas import booking


#Lay danh sach hoa don cua user
def get_user_invoices_service(db: Session, user_id: int):

    results = (
        db.query(
            Invoice.invoice_id,
            Invoice.booking_id,
            Room.room_number,
            Room.room_type,
            Room.price,
            Booking.check_in,
            Booking.check_out,
            Invoice.total_amount,
            Invoice.status,
            Invoice.issued_at
        )
        .join(Booking, Invoice.booking_id == Booking.booking_id)
        .join(Room, Booking.room_id == Room.room_id)
        .filter(Booking.user_id == user_id)
        .order_by(Invoice.issued_at.desc())
        .all()
    )

    return results

#Lay danh sach hoa don theo chi nhanh
def get_hotel_invoices_service(db: Session, hotel_id: int):

    results = (
        db.query(
            Invoice.invoice_id,
            Invoice.booking_id,
            Room.room_number,
            Room.room_type,
            Room.price,
            Booking.check_in,
            Booking.check_out,
            Invoice.total_amount,
            Invoice.status,
            Invoice.issued_at,
            User.name.label("customer_name")
        )
        .join(Booking, Invoice.booking_id == Booking.booking_id)
        .join(Room, Booking.room_id == Room.room_id)
        .join(User, Booking.user_id == User.user_id)
        .filter(Room.hotel_id == hotel_id)
        .order_by(Invoice.issued_at.desc())
        .all()
    )

    return results


# Xac nhan thanh toan hoa don
async def confirm_invoice_service(
    db: Session,
    invoice_id: int,
    current_user: User
):


    # Lay invoice
    invoice = db.query(Invoice).filter(
        Invoice.invoice_id == invoice_id
    ).first()

    if not invoice:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Khong tim thay hoa don"
        )

    if invoice.status == "paid":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Hoa don da duoc thanh toan"
        )

    # Lay booking
    booking = db.query(Booking).filter(
        Booking.booking_id == invoice.booking_id
    ).first()

    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Khong tim thay booking"
        )

    # Lay room
    room = db.query(Room).filter(
        Room.room_id == booking.room_id
    ).first()

    if not room:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Khong tim thay phong"
        )

    # Kiem tra chi nhanh
    if room.hotel_id != current_user.hotel_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Khong duoc phep xu ly hoa don chi nhanh khac"
        )

    # PHAN TRANSACTION
    try:
        invoice.status = "paid"
        booking.status = "confirmed"
        room.status = "reserved"

        db.commit()

    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Loi DB: {str(e)}"
        )

    # PHAN GUI EMAIL (KHONG ROLLBACK)
    try:
        await send_booking_confirmation_email(
            to_email=booking.user.email,
            customer_name=booking.user.name,
            room_number=room.room_number,
            check_in=booking.check_in,
            check_out=booking.check_out,
            total_amount=invoice.total_amount
)
    except Exception as e:
        print("LOI GUI EMAIL:", str(e))


    # QUERY LAI DE TRA VE DUNG RESPONSE_MODEL
    result = (
        db.query(
            Invoice.invoice_id,
            Invoice.booking_id,
            Room.room_number,
            Room.room_type,
            Room.price,
            Booking.check_in,
            Booking.check_out,
            Invoice.total_amount,
            Invoice.status,
            Invoice.issued_at
        )
        .join(Booking, Invoice.booking_id == Booking.booking_id)
        .join(Room, Booking.room_id == Room.room_id)
        .filter(Invoice.invoice_id == invoice_id)
        .first()
    )

    return result
