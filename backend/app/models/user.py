from sqlalchemy import Column, Integer, String, Boolean, Date, ForeignKey, Text, TIMESTAMP
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base


class User(Base):
    __tablename__ = "users"

    user_id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(150), nullable=False, unique=True, index=True)
    phone_number = Column(String(20))
    password_hash = Column(Text, nullable=False)
    role = Column(String(20), nullable=False) #'quanly', 'nhanvien', 'khachhang'
    dob = Column(Date)
    is_active = Column(Boolean, default=True)
    hotel_id = Column(Integer, ForeignKey("hotel.hotel_id"), nullable=True) # chi nhanh Null voi khach hang
    created_at = Column(TIMESTAMP, server_default=func.now())

    hotel = relationship("Hotel", back_populates="users")
    staff = relationship("Staff", back_populates="user", uselist=False) # Quan he 1-1 voi Staff
    bookings = relationship("Booking", back_populates="user",cascade="all, delete-orphan") # Quan he 1-N voi Booking