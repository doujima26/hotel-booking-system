from sqlalchemy.orm import Session
from app.models.invoice import Invoice
from app.models.booking import Booking
from app.models.room import Room
from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from app.models.user import User

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
            Invoice.issued_at
        )
        .join(Booking, Invoice.booking_id == Booking.booking_id)
        .join(Room, Booking.room_id == Room.room_id)
        .filter(Room.hotel_id == hotel_id)
        .order_by(Invoice.issued_at.desc())
        .all()
    )

    return results


#Xac nhan thanh toan hoa don
def confirm_invoice_service(
    db: Session,
    invoice_id: int,
    current_user: User
):

    # 1. Lay invoice
    invoice = db.query(Invoice).filter(
        Invoice.invoice_id == invoice_id
    ).first()

    if not invoice:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Khong tim thay hoa don"
        )

    # 2. Kiem tra da thanh toan chua
    if invoice.status == "paid":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Hoa don da duoc thanh toan"
        )

    # 3. Lay booking
    booking = db.query(Booking).filter(
        Booking.booking_id == invoice.booking_id
    ).first()

    # 4. Lay room
    room = db.query(Room).filter(
        Room.room_id == booking.room_id
    ).first()

    # 5. Kiem tra chi nhanh
    if room.hotel_id != current_user.hotel_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Khong duoc phep xu ly hoa don chi nhanh khac"
        )

    try:
        # 6. Cap nhat trang thai
        invoice.status = "paid"
        booking.status = "confirmed"
        room.status = "reserved"

        db.commit()
        db.refresh(invoice)

        return invoice

    except Exception:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Loi khi xac nhan hoa don"
        )
