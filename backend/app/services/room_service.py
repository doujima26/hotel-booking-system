from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.models.room import Room
from app.schemas.room import RoomCreate
from app.models.user import User

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
