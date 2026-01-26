from fastapi import FastAPI
from sqlalchemy import text
from app.core.database import engine

app = FastAPI()

@app.get("/")
def root():
    with engine.connect() as conn:
        result = conn.execute(text("SELECT 1"))
        return {"db_test": result.scalar()}

if register_role == "admin":
    if secret_key != ADMIN_REGISTER_KEY:
        raise HTTPException(403, "Ma xac thuc khong hop le")
    role = "admin"

elif register_role == "staff":
    if secret_key != STAFF_REGISTER_KEY:
        raise HTTPException(403, "Ma xac thuc khong hop le")
    role = "staff"

else:
    role = "user"
