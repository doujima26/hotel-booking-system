from pydantic import BaseModel

# Tao moi phong
class RoomCreate(BaseModel):
    room_number: str
    room_type: str
    price: float
    status: str
    hotel_id: int

# Tra du lieu phong ve client
class RoomResponse(BaseModel):
    room_id: int
    room_number: str
    room_type: str
    price: float
    status: str
    hotel_id: int

    class Config:
        from_attributes = True
