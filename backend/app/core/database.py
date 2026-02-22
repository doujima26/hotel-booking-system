from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.orm import DeclarativeBase

#ket noi database postgres
DATABASE_URL = "postgresql://neondb_owner:npg_KdSD3ZPvBnf9@ep-flat-union-a1znunxz-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

# tao engine ket noi den database
engine = create_engine(
    DATABASE_URL,
    echo=True,         
    future=True
)

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
