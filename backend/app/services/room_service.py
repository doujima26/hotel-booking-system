from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.models.room import Room
from app.schemas.room import RoomCreate
from app.schemas.room import RoomUpdate
from app.models.user import User
from app.models.booking import Booking
from typing import List

from datetime import date
from sqlalchemy import and_, not_, exists

# Xu ly nghiep vu tao phong moi,Chi admin moi duoc phep goi ham nay
def create_room_service(
    db: Session,
    room_data: RoomCreate,
    current_user: User
):

    # Chi admin duoc tao phong
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Chi admin moi duoc phep tao phong"
        )

    # Kiem tra so phong trung trong cung chi nhanh
    existing_room = db.query(Room).filter(
        Room.hotel_id == room_data.hotel_id,
        Room.room_number == room_data.room_number
    ).first()

    if existing_room:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="So phong da ton tai trong chi nhanh nay"
        )

    # Tao phong moi
    new_room = Room(
        room_number=room_data.room_number,
        room_type=room_data.room_type,
        price=room_data.price,
        status=room_data.status,
        hotel_id=room_data.hotel_id
    )

    db.add(new_room)
    db.commit()
    db.refresh(new_room)

    return new_room

# Ham lay danh sach phong theo chi nhanh
def get_rooms_by_hotel_service(db: Session, hotel_id: int) -> List[Room]:
    rooms = db.query(Room).filter(Room.hotel_id == hotel_id).all()
    return rooms

# Ham cap nhat thong tin phong
def update_room_service(
    db: Session,
    room_id: int,
    room_data: RoomUpdate,
    current_user: User
):
    # Chi admin duoc phep cap nhat phong
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Chi admin moi duoc phep cap nhat phong"
        )

    # Tim phong theo room_id
    room = db.query(Room).filter(Room.room_id == room_id).first()
    if not room:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Khong tim thay phong"
        )

    # Cap nhat cac truong duoc gui len
    if room_data.room_number is not None:
        room.room_number = room_data.room_number

    if room_data.room_type is not None:
        room.room_type = room_data.room_type

    if room_data.price is not None:
        room.price = room_data.price

    if room_data.status is not None:
        room.status = room_data.status

    db.commit()
    db.refresh(room)

    return room

# Ham xoa phong
def delete_room_service(
    db: Session,
    room_id: int,
    current_user: User
):
    # Chi admin duoc phep xoa phong
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Chi admin moi duoc phep xoa phong"
        )

    room = db.query(Room).filter(Room.room_id == room_id).first()
    if not room:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Khong tim thay phong"
        )

    db.delete(room)
    db.commit()

    return {"message": "Xoa phong thanh cong"}

# Ham lay danh sach phong trong theo chi nhanh va khoang thoi gian
def get_available_rooms_service(
    db: Session,
    hotel_id: int,
    check_in: date,
    check_out: date
) -> List[Room]:

    # Subquery kiem tra phong bi trung lich
    overlapping_subquery = db.query(Booking).filter(
        Booking.room_id == Room.room_id,
        Booking.status.in_(["confirmed", "checked_in"]),
        Booking.check_in < check_out,
        Booking.check_out > check_in
    )

    # Lay phong thuoc chi nhanh va khong ton tai booking trung
    rooms = db.query(Room).filter(
        Room.hotel_id == hotel_id,
        Room.status == "available",
        ~overlapping_subquery.exists()
    ).all()

    return rooms