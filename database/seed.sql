-- =========================
-- SEED DATA FOR HOTEL BOOKING SYSTEM
-- =========================

-- HOTEL (CHI NHÁNH)
INSERT INTO hotel (city, admin_register_key, staff_register_key)
VALUES
    ('Ha Noi', 'HN_ADMIN_KEY_2024', 'HN_STAFF_KEY_2024'),
    ('Tuyen Quang', 'TQ_ADMIN_KEY_2024', 'TQ_STAFF_KEY_2024'),
    ('Ho Chi Minh', 'HCM_ADMIN_KEY_2024', 'HCM_STAFF_KEY_2024');

-- ADMIN Ha Noi
INSERT INTO users (name, email, phone_number, password_hash, role, hotel_id)
VALUES (
    'Admin Ha Noi',
    'admin_hn@gmail.com',
    '0900000001',
    'hashed_password',
    'admin',
    (SELECT hotel_id FROM hotel WHERE city = 'Ha Noi')
);

-- STAFF Ha Noi
INSERT INTO users (name, email, phone_number, password_hash, role, hotel_id)
VALUES (
    'Staff Ha Noi',
    'staff_hn@gmail.com',
    '0900000002',
    'hashed_password',
    'staff',
    (SELECT hotel_id FROM hotel WHERE city = 'Ha Noi')
);

-- USER (khach hang – khong gan chi nhanh)
INSERT INTO users (name, email, phone_number, password_hash, role)
VALUES (
    'Nguyen Van A',
    'user1@gmail.com',
    '0900000003',
    'hashed_password',
    'user'
);

-- STAFF
INSERT INTO staff (user_id, position)
VALUES (
    (SELECT user_id FROM users WHERE email = 'staff_hn@gmail.com'),
    'Le tan'
);

--ROOM
INSERT INTO room (hotel_id, room_number, room_type, price, status)
VALUES
-- Ha Noi
((SELECT hotel_id FROM hotel WHERE city = 'Ha Noi'), '101', '2 nguoi - 1 giuong doi', 500000, 'available'),
((SELECT hotel_id FROM hotel WHERE city = 'Ha Noi'), '102', '2 nguoi - 2 giuong don', 600000, 'reserved'),
((SELECT hotel_id FROM hotel WHERE city = 'Ha Noi'), '201', '4 nguoi - 2 giuong doi', 900000, 'available'),

-- Tuyen Quang
((SELECT hotel_id FROM hotel WHERE city = 'Tuyen Quang'), '101', '2 nguoi - 1 giuong doi', 400000, 'available'),
((SELECT hotel_id FROM hotel WHERE city = 'Tuyen Quang'), '102', '2 nguoi - 2 giuong don', 500000, 'reserved'),

-- Ho Chi Minh
((SELECT hotel_id FROM hotel WHERE city = 'Ho Chi Minh'), '301', '2 nguoi - 1 giuong doi', 800000, 'available'),
((SELECT hotel_id FROM hotel WHERE city = 'Ho Chi Minh'), '302', '4 nguoi - 2 giuong doi', 1200000, 'reserved');

--BOOKING
INSERT INTO booking (user_id, room_id, check_in, check_out, status)
VALUES (
    (SELECT user_id FROM users WHERE email = 'user1@gmail.com'),
    (SELECT room_id FROM room WHERE room_number = '101' AND hotel_id = (SELECT hotel_id FROM hotel WHERE city = 'Ha Noi')),
    '2026-02-01',
    '2026-02-03',
    'confirmed'
);
-- INVOICE
INSERT INTO invoice (booking_id, total_amount, status)
VALUES (
    (SELECT booking_id FROM booking LIMIT 1),
    1600000,
    'confirmed'
);

-- STAFF SCHEDULE
INSERT INTO staff_schedule (staff_id, work_date, time_slot)
VALUES
(
    (SELECT staff_id FROM staff LIMIT 1),
    '2026-02-01',
    '06:00-14:00'
),
(
    (SELECT staff_id FROM staff LIMIT 1),
    '2026-02-02',
    '14:00-22:00'
);

