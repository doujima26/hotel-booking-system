# Backend - Hotel Booking System

## 1. Tong quan

Day la backend API cho he thong dat phong khach san, xay dung bang FastAPI + SQLAlchemy + PostgreSQL.

Backend cung cap cac nhom chuc nang chinh:

- Xac thuc va phan quyen (`auth`, `users`)
- Quan ly phong theo chi nhanh (`rooms`)
- Dat phong, check-in, check-out (`bookings`)
- Quan ly hoa don va xac nhan thanh toan (`invoices`)
- Gui email xac nhan dat phong sau khi thanh toan

---

## 2. Cong nghe su dung

- Python 3.10+ (khuyen nghi 3.11+)
- FastAPI
- SQLAlchemy
- PostgreSQL
- Pydantic v2
- JWT (`python-jose`) + `passlib[bcrypt]`
- FastAPI-Mail
- Uvicorn

---

## 3. Cau truc thu muc

```text
backend/
|-- app/
|   |-- core/          # config, database, security, permissions
|   |-- models/        # SQLAlchemy models
|   |-- schemas/       # Pydantic schemas
|   |-- services/      # business logic
|   |-- routers/       # API routers
|   |-- main.py        # FastAPI app entrypoint
|-- requirements.txt
|-- .env
|-- README.md
```

---

## 4. Yeu cau truoc khi chay

1. Da cai Python va pip.
2. Da cai PostgreSQL va tao database.
3. Da import schema (co the dung file `database/schema.sql` tu thu muc database cua du an).

---

## 5. Cai dat

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

---

## 6. Cau hinh moi truong

Tao file `.env` trong thu muc `backend` voi noi dung mau:

```env
# Database
DATABASE_URL=postgresql://postgres:password@127.0.0.1:5432/hotel_booking

# Hoac dung tung bien rieng neu khong dung DATABASE_URL
DB_USER=postgres
DB_PASSWORD=password
DB_HOST=127.0.0.1
DB_PORT=5432
DB_NAME=hotel_booking

# JWT
SECRET_KEY=your_secret_key_here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=5

# Mail
MAIL_USERNAME=your_email@gmail.com
MAIL_PASSWORD=your_app_password
MAIL_FROM=your_email@gmail.com
MAIL_PORT=587
MAIL_SERVER=smtp.gmail.com
MAIL_STARTTLS=True
MAIL_SSL_TLS=False
```

Luu y:

- `DATABASE_URL` duoc uu tien. Neu khong co, he thong se ghep tu `DB_USER/DB_PASSWORD/DB_HOST/DB_PORT/DB_NAME`.
- Token dang nhap hien tai duoc tao voi thoi han 5 phut.

---

## 7. Chay ung dung

```bash
cd backend
venv\Scripts\activate
uvicorn app.main:app --reload
```

Mac dinh API chay tai:

- `http://127.0.0.1:8000`
- Swagger UI: `http://127.0.0.1:8000/docs`
- ReDoc: `http://127.0.0.1:8000/redoc`

Endpoint test nhanh ket noi DB:

- `GET /` -> tra ve `{"db_test": 1}` neu DB ok

---

## 8. Xac thuc va phan quyen

- API dang nhap: `POST /auth/login`
- Token tra ve dang `Bearer` va gui qua header:
  - `Authorization: Bearer <access_token>`
- API lay user hien tai: `GET /users/me`

Phan quyen role:

- `admin`: duoc CRUD phong trong chi nhanh cua minh.
- `staff` va `admin`: duoc check-in/check-out va xac nhan hoa don.
- `user`: dat phong va xem hoa don ca nhan.

---

## 9. Quy tac dang ky tai khoan

- `role = user`: khong can `hotel_id` va `secret_key`.
- `role = admin` hoac `staff`:
  - bat buoc `hotel_id`
  - bat buoc `secret_key`
  - `secret_key` phai khop khoa dang ky cua chi nhanh trong bang `hotel`.

---

## 10. Vong doi booking va hoa don

Trang thai booking:

1. `pending`: vua tao booking
2. `confirmed`: sau khi hoa don duoc xac nhan thanh toan
3. `checked_in`: sau thao tac check-in
4. `checked_out`: sau thao tac check-out

Trang thai phong:

1. `available`: phong trong
2. `reserved`: da thanh toan, cho check-in
3. `occupied`: dang co khach o

Trang thai hoa don:

1. `pending`
2. `paid`

Khi `PUT /invoices/{invoice_id}/confirm` thanh cong:

- `invoice.status -> paid`
- `booking.status -> confirmed`
- `room.status -> reserved`
- Gui email xac nhan dat phong (neu gui email loi thi du lieu da commit van duoc giu).

---

## 11. Danh sach endpoint chinh

### Auth

- `POST /auth/register`
- `POST /auth/login`

### Users

- `GET /users/me`

### Rooms

- `POST /rooms/` (admin)
- `GET /rooms/get_my_branch_rooms` (admin/staff)
- `PUT /rooms/{room_id}` (admin)
- `DELETE /rooms/{room_id}` (admin)
- `GET /rooms/available/{hotel_id}?check_in=YYYY-MM-DD&check_out=YYYY-MM-DD`
- `GET /rooms/{room_id}`

### Bookings

- `POST /bookings/` (can login)
- `PUT /bookings/{booking_id}/check-in` (admin/staff)
- `PUT /bookings/{booking_id}/check-out` (admin/staff)
- `GET /bookings/active` (admin/staff)

### Invoices

- `GET /invoices/me` (can login)
- `GET /invoices/branch` (admin/staff)
- `PUT /invoices/{invoice_id}/confirm` (admin/staff)

---

## 12. Ghi chu van hanh

- CORS hien dang mo (`allow_origins=["*"]`) de phuc vu local dev.
- Neu deploy production, can gioi han `allow_origins`.
- Backend khong dung migration tool (Alembic) trong code hien tai; can dong bo schema DB thu cong hoac bang script SQL.
