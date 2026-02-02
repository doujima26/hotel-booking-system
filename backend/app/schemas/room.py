from pydantic import BaseModel

# Tra du lieu phong ve client
class RoomResponse(BaseModel):
    room_id: int
    room_number: str
    room_type: str
    price: float
    status: str

    class Config:
        from_attributes = True
