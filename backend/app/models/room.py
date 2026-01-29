from sqlalchemy import Column, Integer, String, ForeignKey, Numeric
from sqlalchemy.orm import relationship

from app.core.database import Base


class Room(Base):
    __tablename__ = "room"

    room_id = Column(Integer, primary_key=True, index=True)
    hotel_id = Column(Integer,ForeignKey("hotel.hotel_id", ondelete="CASCADE"),nullable=False)

    room_number = Column(String(20), nullable=False)
    room_type = Column(String(255), nullable=False)
    price = Column(Numeric(12, 2), nullable=False)
    status = Column(String(20), nullable=False)

    # Quan he
    hotel = relationship("Hotel", back_populates="rooms")
    bookings = relationship("Booking",back_populates="room",cascade="all, delete-orphan")
