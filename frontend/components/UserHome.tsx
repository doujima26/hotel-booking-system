"use client";

import { useState } from "react";
import styles from "@/app/page.module.css";

import { useEffect, useRef } from "react";
export default function UserHome() {
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

          {/* SEARCH BOX */}
          <div className={styles.searchBox}>

            {/* Tabs */}
            <div className={styles.searchTabs}>
              <span className={styles.activeTab}>Khách sạn</span>
              <span>Chuyến bay</span>
              <span>Đặt phòng</span>
            </div>

            {/* Divider */}
            <div className={styles.searchDivider}></div>

            {/* Row */}
            <div className={styles.searchRow}>

              <div className={styles.searchField}>
                <label>Địa chỉ</label>
                <input type="text" defaultValue="45 ĐƯỜNG NGUYỄN TRÃI" />
              </div>

              <div className={styles.searchField}>
                <label>Check in</label>
                <input type="text" defaultValue="06 AUGUST, 2024" />
              </div>

              <div className={styles.searchField}>
                <label>Check out</label>
                <input type="text" defaultValue="07 AUGUST, 2024" />
              </div>

              <button className={styles.searchBtn}>
                SEARCH
              </button>

            </div>
          </div>
        </div>
      </section>

      {/* ===== BLOCK SEARCH RIÊNG THEO FIGMA ===== */}
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
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
            />
          </div>

          <div className={styles.userField}>
            <label>Ngày trả</label>
            <input
              type="date"
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


      {/* ===== RESULT ===== */}
      {rooms.length > 0 && (
        <div className={styles.roomSection}>
          <h2 className={styles.sectionTitle}>PHÒNG PHÙ HỢP</h2>

          <InfiniteSlider rooms={rooms} />
        </div>
      )}

    </main>
  );
}


function InfiniteSlider({ rooms }: { rooms: any[] }) {
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
            <div key={i} className={styles.roomCard}>
              <img src="/images/room1.jpg" alt="room" />
              <div className={styles.cardOverlay}>
                <h3>Phòng {room.room_number}</h3>
                <p>${room.price}</p>
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