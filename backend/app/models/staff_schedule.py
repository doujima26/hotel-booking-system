from sqlalchemy import Column, Integer, String, ForeignKey, Date
from sqlalchemy.orm import relationship

from app.core.database import Base


class StaffSchedule(Base):
    __tablename__ = "staff_schedule"

    schedule_id = Column(Integer, primary_key=True, index=True)
    staff_id = Column(Integer,ForeignKey("staff.staff_id", ondelete="CASCADE"),nullable=False)
    work_date = Column(Date,nullable=False)
    time_slot = Column(String(50),nullable=False)

    staff = relationship("Staff",back_populates="schedules")  # Quan he N-1 voi Staff
