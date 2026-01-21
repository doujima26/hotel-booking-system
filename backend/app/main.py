# app/main.py
from fastapi import FastAPI

app = FastAPI(title="Hotel Booking System")

@app.get("/")
def root():
    return {"message": "Backend is running"}
