from fastapi import FastAPI
from sqlalchemy import text
from app.core.database import engine

from app.core.database import Base
from app.models import *

from fastapi.middleware.cors import CORSMiddleware
from app.routers import users

from app.routers import auth

from app.routers import room

from app.routers import invoice

from app.routers import booking





app = FastAPI(title="Hotel Booking API")

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://hotel-booking-system-wine-beta.vercel.app",
        "https://hotel-booking-system-gcx84eu9g-hdung261204-8804s-projects.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(room.router)
app.include_router(invoice.router)
app.include_router(booking.router)



@app.get("/")
def root():
    with engine.connect() as conn:
        result = conn.execute(text("SELECT 1"))
        return {"db_test": result.scalar()}
