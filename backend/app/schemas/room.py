from pydantic import BaseModel
from typing import Optional

# Tao moi phong
class RoomCreate(BaseModel):
    room_number: str
    room_type: str
    price: float
    status: str
    

# Tra du lieu phong ve client
class RoomResponse(BaseModel):
    room_id: int
    room_number: str
    room_type: str
    price: float
    status: str
    

    class Config:
        from_attributes = True

# Cap nhat thong tin phong
class RoomUpdate(BaseModel):
    room_number: Optional[str] = None
    room_type: Optional[str] = None
    price: Optional[float] = None
    status: Optional[str] = None