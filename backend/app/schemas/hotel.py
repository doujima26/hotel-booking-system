from pydantic import BaseModel
 
 # Tra du lieu ve client
class HotelResponse(BaseModel):
    hotel_id: int
    city: str

    class Config:
        from_attributes = True
