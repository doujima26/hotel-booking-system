from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.schemas.invoice import InvoiceResponse
from app.services.invoice_service import get_user_invoices_service
from app.core.permissions import require_staff_or_admin
from app.services.invoice_service import confirm_invoice_service

router = APIRouter(prefix="/invoices", tags=["Invoices"])

#API lay danh sach hoa don cua nguoi dung dang nhap
@router.get("/me", response_model=List[InvoiceResponse])
def get_my_invoices(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return get_user_invoices_service(db, current_user.user_id)

#API xac nhan hoa don
@router.put("/{invoice_id}/confirm", response_model=InvoiceResponse)
def confirm_invoice(
    invoice_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_staff_or_admin)
):
    return confirm_invoice_service(db, invoice_id, current_user)
