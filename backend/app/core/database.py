import os

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.orm import DeclarativeBase
from app.core.config import settings

#ket noi database postgres
DATABASE_URL = os.getenv("DATABASE_URL")

# tao engine ket noi den database
engine = create_engine(settings.DATABASE_URL)

# tao sesion local
SessionLocal = sessionmaker(
    bind=engine,
    autoflush=False,
    autocommit=False
)

#base class cho model
class Base(DeclarativeBase):
    pass

#dependency dung cho fastapi
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
