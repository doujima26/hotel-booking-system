from fastapi import FastAPI
from sqlalchemy import text
from app.core.database import engine

app = FastAPI(title="Hotel Booking API")

@app.get("/")
def root():
    with engine.connect() as conn:
        result = conn.execute(text("SELECT 1"))
        return {"db_test": result.scalar()}
