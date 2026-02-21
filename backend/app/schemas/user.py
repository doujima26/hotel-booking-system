from datetime import date
from pydantic import BaseModel, EmailStr
from typing import Optional


# Dang ky
class UserCreate(BaseModel):
    name: str
    email: EmailStr
    phone_number: Optional[str] = None
    password: str
    role: str   # admin / staff / user
    dob: Optional[date] = None
    hotel_id: Optional[int] = None
    secret_key: Optional[str] = None

# Dang nhap
class UserLogin(BaseModel):
    email: EmailStr
    password: str

# Tra du lieu ve client
from datetime import date

class UserResponse(BaseModel):
    user_id: int
    name: str
    email: str
    phone_number: str
    dob: date
    role: str

    class Config:
        from_attributes = True
