from http.client import HTTPException

from app.models.room import Room
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.core.permissions import require_admin
from app.schemas.room import RoomCreate, RoomResponse
from app.services.room_service import create_room_service, delete_room_service, update_room_service
from app.models.user import User
from app.services.room_service import get_rooms_by_branch_service
from app.schemas.room import RoomUpdate
from app.services.room_service import get_available_rooms_service

from datetime import date
from fastapi import Query

from app.core.dependencies import get_current_user

router = APIRouter(
    prefix="/rooms",
    tags=["Rooms"]
)

# API tao phong moi, chi admin moi su dung duoc
@router.post("/", response_model=RoomResponse)
def create_room(
    room_data: RoomCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    #chi Admin moi su dung duoc API tao phong
    return create_room_service(db, room_data, current_user)

# API lay danh sach phong theo chi nhanh
@router.get("/get_my_branch_rooms")
def get_my_branch_rooms(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return get_rooms_by_branch_service(db, current_user)


#API cap nhat thong tin phong
@router.put("/{room_id}", response_model=RoomResponse)
def update_room(
    room_id: int,
    room_data: RoomUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):

    return update_room_service(db, room_id, room_data, current_user)


#API xoa phong
@router.delete("/{room_id}")
def delete_room(
    room_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):

    return delete_room_service(db, room_id, current_user)

#API lay danh sach phong trong theo ngay nhan va tra phong
@router.get("/available/{hotel_id}", response_model=List[RoomResponse])
def get_available_rooms(
    hotel_id: int,
    check_in: date = Query(...),
    check_out: date = Query(...),
    db: Session = Depends(get_db)
):
    
    return get_available_rooms_service(
        db,
        hotel_id,
        check_in,
        check_out
    )

#API lay thong tin chi tiet cua phong theo ID
@router.get("/{room_id}")
def get_room(room_id: int, db: Session = Depends(get_db)):
    room = db.query(Room).filter(Room.room_id == room_id).first()

    if not room:
        raise HTTPException(status_code=404, detail="Không tìm thấy phòng")

    return room