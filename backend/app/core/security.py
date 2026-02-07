from passlib.context import CryptContext

from datetime import datetime, timedelta
from typing import Optional

from jose import jwt

from app.core.config import settings

#tao context de xu ly hash mat khau
pwd_context = CryptContext(
    schemes=["bcrypt"],   #thuat toan hash su dung
    deprecated="auto"     
)

ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

def hash_password(password: str) -> str:
    return pwd_context.hash(password) #tra ve mat khau da duoc hash

#so sanh mat khau nguoi dung nhap voi mat khau da duoc hash (True/False)
def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

# tao JWT token khi dang nhap thanh cong
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()

    expire = datetime.utcnow() + (
        expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    to_encode.update({"exp": expire})

    encoded_jwt = jwt.encode(
        to_encode,
        settings.SECRET_KEY,
        algorithm=ALGORITHM
    )
    return encoded_jwt
