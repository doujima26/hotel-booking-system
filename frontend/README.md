# Frontend - Hotel Booking System

## 1. Tong quan

Day la ung dung frontend cho he thong dat phong khach san Continental, duoc xay dung bang Next.js (App Router).

Giao dien duoc tach theo vai tro:

- `guest`: xem trang gioi thieu, thong tin khach san
- `user`: tim phong trong, dat phong, xem lich su dat
- `admin/staff`: quan ly phong, trang thai check-in/check-out, xac nhan hoa don

---

## 2. Cong nghe su dung

- Next.js `16.1.6` (App Router)
- React `19.2.3`
- TypeScript
- CSS Modules
- Axios (goi API)
- Context API (`AuthContext`) de quan ly phien dang nhap

---

## 3. Cau truc thu muc

```text
frontend/
|-- app/
|   |-- admin/
|   |   |-- invoices/
|   |   |-- rooms/
|   |       |-- status/
|   |-- hotel/
|   |-- login/
|   |-- register/
|   |-- rooms/[id]/
|   |-- user/
|       |-- my-bookings/
|-- components/
|-- context/
|   |-- AuthContext.tsx
|-- lib/
|   |-- api.ts
|-- public/
|-- package.json
|-- tsconfig.json
|-- next.config.ts
```

---

## 4. Bien moi truong

Tao file `.env.local` trong thu muc `frontend`:

```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

Luu y:

- Bien nay can co de dang ky tai khoan (`/register`) hoat dong dung.
- Axios client trong `lib/api.ts` se dung bien tren lam `baseURL`.

---

## 5. Cai dat va chay local

```bash
cd frontend
npm install
npm run dev
```

Mac dinh frontend chay tai: `http://localhost:3000`

Yeu cau backend da khoi dong truoc do (API server).

---

## 6. Scripts

```bash
npm run dev    # chay moi truong phat trien
npm run build  # build production
npm run start  # chay ban build
npm run lint   # kiem tra lint
```

---

## 7. Cac route chinh

| Route                                  | Mo ta                                                  |
| -------------------------------------- | ------------------------------------------------------ |
| `/`                                    | Trang home theo vai tro dang nhap (`guest/user/admin`) |
| `/login`                               | Dang nhap                                              |
| `/register`                            | Dang ky da buoc theo vai tro                           |
| `/hotel`                               | Trang gioi thieu khach san                             |
| `/rooms/[id]?checkIn=...&checkOut=...` | Chi tiet phong va dat phong                            |
| `/user/my-bookings`                    | Lich su dat phong cua nguoi dung                       |
| `/admin`                               | Trang tong quan admin                                  |
| `/admin/invoices`                      | Quan ly hoa don chi nhanh                              |
| `/admin/rooms`                         | CRUD phong trong chi nhanh                             |
| `/admin/rooms/status`                  | Quan ly check-in/check-out theo booking                |
| `/me`                                  | Trang debug thong tin user hien tai                    |

---

## 8. API endpoints frontend dang su dung

- `POST /auth/login`
- `POST /auth/register`
- `GET /users/me`
- `GET /rooms/available/{hotelId}`
- `GET /rooms/{id}`
- `POST /bookings`
- `GET /invoices/me`
- `GET /invoices/branch`
- `PUT /invoices/{invoiceId}/confirm`
- `GET /rooms/get_my_branch_rooms`
- `POST /rooms`
- `PUT /rooms/{id}`
- `DELETE /rooms/{id}`
- `GET /bookings/active`
- `PUT /bookings/{bookingId}/check-in`
- `PUT /bookings/{bookingId}/check-out`

---

## 9. Luong xac thuc

- Token duoc luu trong `localStorage` voi key: `access_token`.
- `lib/api.ts` tu dong gan header `Authorization: Bearer <token>` cho cac request.
- `context/AuthContext.tsx` tai thong tin user khi app khoi dong.

---

## 10. Ghi chu phat trien

- Kiem tra CORS o backend de frontend co the goi API tu `http://localhost:3000`.
- Neu thay doi domain API, cap nhat `NEXT_PUBLIC_API_URL` va khoi dong lai frontend.
