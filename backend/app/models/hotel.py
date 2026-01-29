from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from app.core.database import Base


class Hotel(Base):
    __tablename__ = "hotel"

    hotel_id = Column(Integer, primary_key=True, index=True)
    city = Column(String(100), nullable=False)

    admin_register_key = Column(String(100), nullable=False)
    staff_register_key = Column(String(100), nullable=False)

    
    #Quan he   
    rooms = relationship("Room", back_populates="hotel",cascade="all, delete-orphan")
    users = relationship("User", back_populates="hotel",cascade="all, delete-orphan")

