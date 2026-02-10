from fastapi import FastAPI
from sqlalchemy import text
from app.core.database import engine
from app.routers import users

from app.routers import auth

from app.routers import room

app = FastAPI(title="Hotel Booking API")

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(room.router)


@app.get("/")
def root():
    with engine.connect() as conn:
        result = conn.execute(text("SELECT 1"))
        return {"db_test": result.scalar()}
