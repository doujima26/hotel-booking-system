CREATE TABLE hotel (
    hotel_id SERIAL PRIMARY KEY,
    city VARCHAR(100) NOT NULL UNIQUE,        -- Ha Noi, Tuyen Quang, TP HCM
    admin_register_key VARCHAR(100) NOT NULL,
    staff_register_key VARCHAR(100) NOT NULL
);
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    phone_number VARCHAR(20),
    password_hash TEXT NOT NULL,
    role VARCHAR(20) NOT NULL
        CHECK (role IN ('admin', 'staff', 'user')),
    dob DATE,
    is_active BOOLEAN DEFAULT TRUE,
    hotel_id INT,                            -- chi nhanh (NULL voi user)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (hotel_id)
        REFERENCES hotel(hotel_id)
);
CREATE TABLE staff (
    staff_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    position VARCHAR(100),

    FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE
);
CREATE TABLE room (
    room_id SERIAL PRIMARY KEY,
    hotel_id INT NOT NULL,
    room_number VARCHAR(20) NOT NULL,
    room_type VARCHAR(255) NOT NULL,
    price NUMERIC(12,2) NOT NULL CHECK (price >= 0),
    status VARCHAR(20) NOT NULL
        CHECK (status IN ('available', 'maintenance', 'inactive')),

    FOREIGN KEY (hotel_id)
        REFERENCES hotel(hotel_id),

    UNIQUE (hotel_id, room_number)   -- mỗi chi nhánh có số phòng riêng
);
CREATE TABLE booking (
    booking_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    room_id INT NOT NULL,
    check_in DATE NOT NULL,
    check_out DATE NOT NULL,
    status VARCHAR(20) NOT NULL
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

    CHECK (check_out > check_in)
);
CREATE TABLE invoice (
    invoice_id SERIAL PRIMARY KEY,
    booking_id INT NOT NULL UNIQUE,
    total_amount NUMERIC(12,2) NOT NULL CHECK (total_amount >= 0),
    status VARCHAR(20) NOT NULL
        CHECK (status IN ('pending', 'confirmed')),
    issued_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (booking_id)
        REFERENCES booking(booking_id)
        ON DELETE CASCADE
);
CREATE TABLE staff_schedule (
    schedule_id SERIAL PRIMARY KEY,
    staff_id INT NOT NULL,
    work_date DATE NOT NULL,
    time_slot VARCHAR(50) NOT NULL,

    FOREIGN KEY (staff_id)
        REFERENCES staff(staff_id)
        ON DELETE CASCADE,

    UNIQUE (staff_id, work_date, time_slot)
);

-- Sửa trạng thái phòng 
SELECT conname
FROM pg_constraint
WHERE conrelid = 'room'::regclass
AND contype = 'c';

ALTER TABLE room
DROP CONSTRAINT room_status_check;

ALTER TABLE room
ADD CONSTRAINT room_status_check
CHECK (status IN ('available', 'reserved'));

UPDATE room
SET status = 'available'
WHERE status NOT IN ('available', 'reserved');

SELECT conname, pg_get_constraintdef(oid)
FROM pg_constraint
WHERE conrelid = 'room'::regclass;

DELETE FROM staff_schedule;
DELETE FROM staff;
DELETE FROM invoice;
DELETE FROM booking;
DELETE FROM room;
DELETE FROM users;
DELETE FROM hotel;

SELECT * FROM hotel;
SELECT * FROM room;
SELECT * FROM users;
SELECT * FROM booking;
SELECT * FROM invoice;



