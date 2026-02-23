"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import styles from "@/app/user/userhome.module.css";
import api from "@/lib/api";

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
    if (!checkIn || !checkOut) {
      setError("Vui lòng chọn đầy đủ ngày nhận và ngày trả");
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
      const res = await api.get(`/rooms/available/${hotelId}`, {
        params: { check_in: checkIn, check_out: checkOut },
      });
      setRooms(res.data);
      // Cuộn xuống kết quả
      setTimeout(() => {
        window.scrollTo({ top: 800, behavior: 'smooth' });
      }, 100);
    } catch (error: any) {
      setError(error.response?.data?.detail || "Không tìm thấy phòng phù hợp");
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
          <div className={styles.heroContent}>
            <p className={styles.heroSub}>CONTINENTAL HOTEL</p>
            <h1 className={styles.heroTitle}>
              Tận Hưởng Kỳ Nghỉ <br /> <span>Trong Mơ Của Bạn</span>
            </h1>
          </div>

          {/* SEARCH BOX - Floating on Hero */}
          <div className={styles.userSearchBox}>
            <div className={styles.searchFields}>
              <div className={styles.userField}>
                <label>📍 Điểm đến</label>
                <select value={hotelId} onChange={(e) => setHotelId(e.target.value)}>
                  <option value="1">Continental Hà Nội</option>
                  <option value="2">Continental Tuyên Quang</option>
                  <option value="3">Continental TP.HCM</option>
                </select>
              </div>
              <div className={styles.searchDivider}></div>
              <div className={styles.userField}>
                <label>📅 Ngày nhận</label>
                <input
                  type="date"
                  min={new Date().toISOString().split("T")[0]}
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                />
              </div>
              <div className={styles.searchDivider}></div>
              <div className={styles.userField}>
                <label>📅 Ngày trả</label>
                <input
                  type="date"
                  min={checkIn || new Date().toISOString().split("T")[0]}
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                />
              </div>
            </div>
            <button className={styles.userSearchBtn} onClick={handleSearch} disabled={loading}>
              {loading ? "..." : "TÌM PHÒNG"}
            </button>
          </div>
        </div>
      </section>

      {error && <div className={styles.errorAlert}>{error}</div>}

      {/* RESULT SECTION */}
      {rooms.length > 0 && (
        <section className={styles.roomSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Phòng trống khả dụng</h2>
            <p>Khám phá các lựa chọn tốt nhất dành cho bạn</p>
          </div>
          <InfiniteSlider rooms={rooms} checkIn={checkIn} checkOut={checkOut} />
        </section>
      )}
    </main>
  );
}

/* ============================= */
/* INFINITE SLIDER COMPONENT */
/* ============================= */
function InfiniteSlider({ rooms, checkIn, checkOut }: any) {
  const router = useRouter();
  const visibleCount = 4;
  const sliderRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(visibleCount);
  const [transition, setTransition] = useState(true);

  const extended = [...rooms.slice(-visibleCount), ...rooms, ...rooms.slice(0, visibleCount)];

  const next = () => setIndex((prev) => prev + 1);
  const prev = () => setIndex((prev) => prev - 1);

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;
    slider.style.transition = transition ? "transform 0.7s cubic-bezier(0.2, 0.8, 0.2, 1)" : "none";
    slider.style.transform = `translateX(-${index * (100 / visibleCount)}%)`;

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
    return () => slider.removeEventListener("transitionend", handleEnd);
  }, [index, rooms.length]);

  useEffect(() => {
    if (!transition) requestAnimationFrame(() => setTransition(true));
  }, [transition]);

  return (
    <div className={styles.sliderWrapper}>
      <button className={`${styles.navBtn} ${styles.prevBtn}`} onClick={prev}>‹</button>
      <div className={styles.sliderContainer}>
        <div ref={sliderRef} className={styles.sliderTrack}>
          {extended.map((room, i) => (
            <div
              key={i}
              className={styles.roomCard}
              onClick={() => router.push(`/rooms/${room.room_id}?checkIn=${checkIn}&checkOut=${checkOut}`)}
            >
              <div className={styles.imageContainer}>
                <img src="/images/room1.jpg" alt="room" />
                <div className={styles.priceTag}>{room.price.toLocaleString()} VND</div>
              </div>
              <div className={styles.roomInfo}>
                <h3>Phòng {room.room_number}</h3>
                <p>Deluxe Suite • King Size Bed</p>
                <div className={styles.cardFooter}>
                  <span className={styles.detailsBtn}>Xem chi tiết</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <button className={`${styles.navBtn} ${styles.nextBtn}`} onClick={next}>›</button>
    </div>
  );
}