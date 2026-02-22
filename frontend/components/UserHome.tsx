"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import styles from "@/app/page.module.css";

export default function UserHome() {
  const router = useRouter();

  const [hotelId, setHotelId] = useState("1");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [rooms, setRooms] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setError("");
    setRooms([]);

    if (!checkIn || !checkOut) {
      setError("Vui lòng chọn ngày nhận và ngày trả");
      return;
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (checkOutDate <= checkInDate) {
      setError("Ngày trả phải sau ngày nhận");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(
        `http://127.0.0.1:8000/rooms/available/${hotelId}?check_in=${checkIn}&check_out=${checkOut}`
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || "Không tìm thấy phòng");
      }

      setRooms(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.container}>
      {/* HERO */}
      <section className={styles.heroWrapper}>
        <div className={styles.hero}>
          <div className={styles.overlay}></div>

          <h1 className={styles.heroTitle}>
            ITS FOR TIME FOR ADVENTURES
            <br />
            & EXPERIENCES
          </h1>
        </div>
      </section>

      {/* SEARCH */}
      <section className={styles.userSearchSection}>
        <div className={styles.userSearchBox}>
          <div className={styles.userField}>
            <label>Địa điểm</label>
            <select
              value={hotelId}
              onChange={(e) => setHotelId(e.target.value)}
            >
              <option value="1">Continental Hà Nội</option>
              <option value="2">Continental Tuyên Quang</option>
              <option value="3">Continental TP.HCM</option>
            </select>
          </div>

          <div className={styles.userField}>
            <label>Ngày nhận</label>
            <input
              type="date"
              min={new Date().toISOString().split("T")[0]}
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
            />
          </div>

          <div className={styles.userField}>
            <label>Ngày trả</label>
            <input
              type="date"
              min={checkIn || new Date().toISOString().split("T")[0]}
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
            />
          </div>

          <button
            className={styles.userSearchBtn}
            onClick={handleSearch}
          >
            {loading ? "Đang tìm..." : "Tìm kiếm"}
          </button>
        </div>
      </section>

      {error && (
        <p style={{ textAlign: "center", color: "red" }}>
          {error}
        </p>
      )}

      {/* RESULT */}
      {rooms.length > 0 && (
        <div className={styles.roomSection}>
          <h2 className={styles.sectionTitle}>PHÒNG PHÙ HỢP</h2>
          <InfiniteSlider
            rooms={rooms}
            checkIn={checkIn}
            checkOut={checkOut}
          />
        </div>
      )}
    </main>
  );
}

/* ============================= */
/* INFINITE SLIDER */
/* ============================= */

function InfiniteSlider({
  rooms,
  checkIn,
  checkOut,
}: {
  rooms: any[];
  checkIn: string;
  checkOut: string;
}) {
  const router = useRouter();
  const visibleCount = 4;
  const sliderRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(visibleCount);
  const [transition, setTransition] = useState(true);

  const extended = [
    ...rooms.slice(-visibleCount),
    ...rooms,
    ...rooms.slice(0, visibleCount),
  ];

  const next = () => setIndex((prev) => prev + 1);
  const prev = () => setIndex((prev) => prev - 1);

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    slider.style.transition = transition
      ? "transform 0.6s cubic-bezier(.25,.8,.25,1)"
      : "none";

    slider.style.transform = `translateX(-${index * 25}%)`;

    const handleEnd = () => {
      if (index >= rooms.length + visibleCount) {
        setTransition(false);
        setIndex(visibleCount);
      }
      if (index <= 0) {
        setTransition(false);
        setIndex(rooms.length);
      }
    };

    slider.addEventListener("transitionend", handleEnd);
    return () =>
      slider.removeEventListener("transitionend", handleEnd);
  }, [index]);

  useEffect(() => {
    if (!transition) {
      requestAnimationFrame(() => setTransition(true));
    }
  }, [transition]);

  return (
    <div className={styles.sliderWrapper}>
      <button className={styles.arrowLeft} onClick={prev}>
        ←
      </button>

      <div className={styles.sliderContainer}>
        <div ref={sliderRef} className={styles.sliderTrack}>
          {extended.map((room, i) => (
            <div
              key={i}
              className={styles.roomCard}
              onClick={() =>
                router.push(
                  `/rooms/${room.room_id}?checkIn=${checkIn}&checkOut=${checkOut}`
                )
              }
              style={{ cursor: "pointer" }}
            >
              <img src="/images/room1.jpg" alt="room" />
              <div className={styles.cardOverlay}>
                <h3>Phòng {room.room_number}</h3>
                <p>{room.price} VND</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button className={styles.arrowRight} onClick={next}>
        →
      </button>
    </div>
  );
}