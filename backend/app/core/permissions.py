from fastapi import Depends, HTTPException, status
from app.core.dependencies import get_current_user
from app.models.user import User


def require_admin(current_user: User = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Chi admin moi co quyen truy cap"
        )
    return current_user


def require_staff(current_user: User = Depends(get_current_user)):
    if current_user.role not in ["staff", "admin"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Chi staff hoac admin moi co quyen"
        )
    return current_user
