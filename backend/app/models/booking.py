from sqlalchemy import Column, Integer, Date, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base


class Booking(Base):
    __tablename__ = "booking"

    booking_id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer,ForeignKey("users.user_id"),nullable=False)

    room_id = Column(Integer,ForeignKey("room.room_id"),nullable=False)

    check_in = Column(Date, nullable=False)
    check_out = Column(Date, nullable=False)

    status = Column(String(20), nullable=False)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    # Quan he
    user = relationship("User", back_populates="bookings")
    room = relationship("Room", back_populates="bookings")
    invoice = relationship("Invoice",back_populates="booking",uselist=False,cascade="all, delete-orphan")
