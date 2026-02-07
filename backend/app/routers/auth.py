from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.schemas.user import UserCreate, UserResponse
from app.core.database import get_db
from app.services.auth_service import register_user

from app.schemas.user import UserLogin
from app.schemas.token import TokenResponse
from app.services.auth_service import login_user

router = APIRouter(
    prefix="/auth",
    tags=["Auth"]
)

#router register
@router.post("/register", response_model=UserResponse)
def register(user_data: UserCreate, db: Session = Depends(get_db)):
    return register_user(db, user_data)

#router login
@router.post("/login", response_model=TokenResponse)
def login(user_data: UserLogin, db: Session = Depends(get_db)):
    return login_user(db, user_data)
