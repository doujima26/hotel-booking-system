from sqlalchemy import Column, Integer, Numeric, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.core.database import Base


class Invoice(Base):
    __tablename__ = "invoice"

    invoice_id = Column(Integer, primary_key=True, index=True)

    booking_id = Column(Integer,ForeignKey("booking.booking_id", ondelete="CASCADE"),nullable=False,unique=True)

    total_amount = Column(Numeric(12, 2), nullable=False)
    status = Column(String(20), nullable=False)
    issued_at = Column(DateTime, server_default=func.now())
# Quan he
    booking = relationship("Booking", back_populates="invoice")
