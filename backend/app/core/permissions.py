from fastapi import Depends, HTTPException, status
from app.core.dependencies import get_current_user
from app.models.user import User

# Chi admin moi co quyen
def require_admin(current_user: User = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Chi admin moi co quyen"
        )
    return current_user

# Chi staff hoac admin moi co quyen
def require_staff_or_admin(current_user: User = Depends(get_current_user)):
    if current_user.role not in ["admin", "staff"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Chi staff hoac admin moi co quyen"
        )
    return current_user
