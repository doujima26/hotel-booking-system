from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.core.permissions import require_admin
from app.schemas.room import RoomCreate, RoomResponse
from app.services.room_service import create_room_service
from app.models.user import User
from app.services.room_service import get_rooms_by_hotel_service

router = APIRouter(
    prefix="/rooms",
    tags=["Rooms"]
)


@router.post("/", response_model=RoomResponse)
def create_room(
    room_data: RoomCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    #chi Admin moi su dung duoc API tao phong
    return create_room_service(db, room_data, current_user)

#API lay danh sach phong theo chi nhanh
@router.get("/hotel/{hotel_id}", response_model=List[RoomResponse])
def get_rooms_by_hotel(
    hotel_id: int,
    db: Session = Depends(get_db)
):

    return get_rooms_by_hotel_service(db, hotel_id)
