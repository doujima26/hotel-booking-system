INSERT INTO users (name, email, phone_number, password_hash, role, dob)
VALUES
-- Admin
('Quản lý hệ thống', 'admin@hotel.com', '0900000001', 'hashed_password', 'admin', '1990-01-01'),

-- Staff
('Nguyễn Doanh', 'doanh@hotel.com', '0900000002', 'hashed_password', 'staff', '1998-05-20'),
('Hoàng Dung', 'dung@hotel.com', '0900000003', 'hashed_password', 'staff', '1999-03-15'),

-- Customer
('Minh Hiếu', 'hieu@gmail.com', '0900000004', 'hashed_password', 'user', '2001-07-10'),
('Hoàng Anh', 'anh@gmail.com', '0900000005', 'hashed_password', 'user', '2000-11-25');

INSERT INTO staff (user_id, position)
VALUES
(2, 'Lễ tân'),
(3, 'Nhân viên hỗ trợ');

INSERT INTO room (room_number, room_type, price, status)
VALUES
('101', 'VIP – 2 người – 1 giường đôi', 2500000, 'available'),
('102', 'Standard – 4 người – 2 giường đơn', 1500000, 'available'),
('201', 'Deluxe – 2 người – 1 giường king', 3000000, 'available'),
('202', 'VIP – 3 người – 2 giường đơn', 2800000, 'maintenance');

INSERT INTO booking (user_id, room_id, check_in, check_out, status)
VALUES
(4, 1, '2026-02-01', '2026-02-03', 'pending'),
(5, 2, '2026-02-05', '2026-02-07', 'confirmed');

INSERT INTO invoice (booking_id, total_amount, status)
VALUES
(1, 5000000, 'pending'),
(2, 3000000, 'confirmed');

INSERT INTO staff_schedule (staff_id, work_date, time_slot)
VALUES
-- Nguyễn Doanh
(1, '2026-02-01', '06:45-09:30'),
(1, '2026-02-02', '09:30-12:00'),

-- Hoàng Dung
(2, '2026-02-01', '12:00-15:30'),
(2, '2026-02-02', '15:30-19:30');


SELECT * FROM users;
SELECT * FROM staff;
SELECT * FROM room;
SELECT * FROM booking;
SELECT * FROM invoice;
SELECT * FROM staff_schedule;


SELECT
    u.name AS customer_name,
    r.room_number,
    r.room_type,
    b.check_in,
    b.check_out,
    i.total_amount,
    i.status AS invoice_status
FROM invoice i
JOIN booking b ON i.booking_id = b.booking_id
JOIN users u ON b.user_id = u.user_id
JOIN room r ON b.room_id = r.room_id;







