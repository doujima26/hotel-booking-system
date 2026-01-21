CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,               -- Khóa chính, tự tăng
    name VARCHAR(100) NOT NULL,                -- Tên người dùng
    email VARCHAR(150) NOT NULL UNIQUE,        -- Email đăng nhập (không trùng)
    phone_number VARCHAR(20),                  -- Số điện thoại
    password_hash TEXT NOT NULL,               -- Mật khẩu đã mã hóa
    role VARCHAR(20) NOT NULL                  -- Vai trò người dùng
        CHECK (role IN ('admin', 'staff', 'user')),
    dob DATE,                                  -- Ngày sinh
    is_active BOOLEAN DEFAULT TRUE,             -- Trạng thái tài khoản
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Ngày tạo tài khoản
);

CREATE TABLE staff (
    staff_id SERIAL PRIMARY KEY,     -- Khóa chính nhân viên
    user_id INT NOT NULL UNIQUE,     -- Mỗi staff gắn với đúng 1 user
    position VARCHAR(100),           -- Chức vụ

    FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE
);

CREATE TABLE room (
    room_id SERIAL PRIMARY KEY,          -- Khóa chính phòng
    room_number VARCHAR(20) NOT NULL UNIQUE, -- Số phòng
    room_type VARCHAR(255) NOT NULL,     -- Loại phòng (số người + số giường + loại giường)
    price NUMERIC(12,2) NOT NULL          -- Giá phòng
        CHECK (price >= 0),
    status VARCHAR(20) NOT NULL           -- Trạng thái phòng
        CHECK (status IN ('available', 'maintenance', 'inactive'))
);

CREATE TABLE booking (
    booking_id SERIAL PRIMARY KEY,        -- Khóa chính đặt phòng
    user_id INT NOT NULL,                 -- Khách hàng đặt phòng
    room_id INT NOT NULL,                 -- Phòng được đặt
    check_in DATE NOT NULL,               -- Ngày nhận phòng
    check_out DATE NOT NULL,              -- Ngày trả phòng
    status VARCHAR(20) NOT NULL           -- Trạng thái booking
        CHECK (status IN (
            'pending',
            'confirmed',
            'checked_in',
            'checked_out',
            'cancelled'
        )),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)
        REFERENCES users(user_id),

    FOREIGN KEY (room_id)
        REFERENCES room(room_id),

    CHECK (check_out > check_in)           -- Ràng buộc ngày hợp lệ
);

CREATE TABLE invoice (
    invoice_id SERIAL PRIMARY KEY,        -- Khóa chính hóa đơn
    booking_id INT NOT NULL UNIQUE,       -- Mỗi booking có 1 hóa đơn
    total_amount NUMERIC(12,2) NOT NULL   -- Tổng tiền
        CHECK (total_amount >= 0),
    status VARCHAR(20) NOT NULL           -- Trạng thái hóa đơn
        CHECK (status IN ('pending', 'confirmed')),
    issued_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Thời điểm tạo hóa đơn

    FOREIGN KEY (booking_id)
        REFERENCES booking(booking_id)
        ON DELETE CASCADE
);

CREATE TABLE staff_schedule (
    schedule_id SERIAL PRIMARY KEY,   -- Khóa chính lịch
    staff_id INT NOT NULL,             -- Nhân viên
    work_date DATE NOT NULL,           -- Ngày làm việc
    time_slot VARCHAR(50) NOT NULL,    -- Ca làm (vd: 06:45-09:30)

    FOREIGN KEY (staff_id)
        REFERENCES staff(staff_id)
        ON DELETE CASCADE,

    UNIQUE (staff_id, work_date, time_slot) -- Không trùng ca
);







