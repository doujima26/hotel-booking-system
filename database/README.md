# Database – Hotel Booking System

## 1. Tổng quan
Thư mục này chứa toàn bộ phần cơ sở dữ liệu của hệ thống đặt phòng khách sạn.
Cơ sở dữ liệu được thiết kế nhằm đáp ứng các chức năng:
- Quản lý người dùng, nhân viên
- Quản lý phòng
- Đặt phòng
- Hóa đơn
- Lịch làm việc của nhân viên

Hệ quản trị cơ sở dữ liệu sử dụng: **PostgreSQL**.

---

## 2. Công nghệ sử dụng
- PostgreSQL
- SQL chuẩn
- Transaction để đảm bảo tính toàn vẹn dữ liệu khi đặt phòng

---

## 3. Cấu trúc thư mục

database/
├── schema.sql  #Định nghĩa cấu trúc bảng, khóa ,ràng buộc 
├── seed.sql    #Dữ liệu mẫu
└── README.md   


---

## 4. Mô tả các bảng chính

### 4.1 users
Lưu thông tin người dùng của hệ thống, bao gồm:
- Khách hàng
- Nhân viên
- Quản lý

Các trường chính:
- user_id (PK)
- name
- email
- phone
- password
- role (admin / staff / user)

---

### 4.2 staff
Lưu thông tin nhân viên, liên kết với bảng users.

Các trường chính:
- staff_id (PK)
- user_id (FK)
- position

---

### 4.3 room
Lưu thông tin phòng khách sạn.

Các trường chính:
- room_id (PK)
- room_number
- room_type (mô tả số người, số giường, loại giường)
- price
- status

---

### 4.4 booking
Lưu thông tin đặt phòng của khách hàng.

Các trường chính:
- booking_id (PK)
- user_id (FK)
- room_id (FK)
- check_in
- check_out
- status

Bảng này có ràng buộc:
- `check_out > check_in` để đảm bảo logic thời gian.

---

### 4.5 invoice
Lưu thông tin hóa đơn được tạo tự động khi khách đặt phòng.

Các trường chính:
- invoice_id (PK)
- booking_id (FK)
- total_amount
- issued_at

---

### 4.6 staff_schedule
Lưu lịch làm việc của nhân viên.

Các trường chính:
- schedule_id (PK)
- staff_id (FK)
- work_date
- time_slot

