from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.models.user import User
from app.models.hotel import Hotel
from app.schemas.user import UserCreate
from app.schemas.user import UserLogin
from app.core.security import hash_password
from app.core.security import verify_password, create_access_token

def register_user(db: Session, user_data: UserCreate):
    # check email ton tai
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email da ton tai"
        )

    # xu ly theo role
    role = user_data.role

    # user
    if role == "user":
        hotel_id = None

    # admin / staff
    elif role in ["admin", "staff"]:
        if not user_data.hotel_id or not user_data.secret_key:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Can hotel_id va secret_key cho admin va staff"
            )

        hotel = db.query(Hotel).filter(Hotel.hotel_id == user_data.hotel_id).first()
        if not hotel:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Khong tim thay chi nhanh"
            )

        if role == "admin":
            if user_data.secret_key != hotel.admin_register_key:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Ma xac thuc admin khong hop le"
                )
        else: # staff
            if user_data.secret_key != hotel.staff_register_key:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Ma xac thuc staff khong hop le"
                )

        hotel_id = hotel.hotel_id

    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Role khong hop le"
        )

    # tao user moi
    new_user = User(
        name=user_data.name,
        email=user_data.email,
        phone_number=user_data.phone_number,
        password_hash = hash_password(user_data.password),
        role=role,
        dob=user_data.dob,
        hotel_id=hotel_id
    )

    # tao user trong db
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user


def login_user(db: Session, user_data: UserLogin):
    # Tim user theo email
    user = db.query(User).filter(User.email == user_data.email).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email hoac mat khau khong dung"
        )

    # Kiem tra mat khau
    if not verify_password(user_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email hoac mat khau khong dung"
        )

    # Tao access token
    access_token = create_access_token(
        data={"sub": str(user.user_id), "role": user.role}
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "role": user.role
    }