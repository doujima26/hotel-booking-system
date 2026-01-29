from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship

from app.core.database import Base


class Staff(Base):
    __tablename__ = "staff"

    staff_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer,ForeignKey("users.user_id", ondelete="CASCADE"),nullable=False,unique=True)
    position = Column(String(100))
    #Quan he
    user = relationship("User",back_populates="staff")  # Quan he 1-1 voi User
    schedules = relationship("StaffSchedule",back_populates="staff",cascade="all, delete-orphan") # Quan he 1-N voi StaffSchedule 
