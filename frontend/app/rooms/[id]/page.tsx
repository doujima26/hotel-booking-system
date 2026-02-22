"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import styles from "./RoomDetail.module.css";

export default function RoomDetail() {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const checkIn = searchParams.get("checkIn");
  const checkOut = searchParams.get("checkOut");

  const [room, setRoom] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("access_token")
      : null;

  useEffect(() => {
    const fetchRoom = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/rooms/${id}`);
      const data = await res.json();
      setRoom(data);
    };
    fetchRoom();
  }, [id]);

  const calculateDays = () => {
    if (!checkIn || !checkOut) return 0;
    const inDate = new Date(checkIn);
    const outDate = new Date(checkOut);
    return Math.floor(
      (outDate.getTime() - inDate.getTime()) /
        (1000 * 3600 * 24)
    );
  };

  const totalPrice =
    room?.price && calculateDays() > 0
      ? Number(room.price) * calculateDays()
      : 0;

  const handleBooking = async () => {
    if (!token) {
      alert("Vui lòng đăng nhập");
      router.push("/login");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          room_id: Number(id),
          check_in: checkIn,
          check_out: checkOut,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail);

      alert("Đặt phòng thành công!");
      router.push("/");
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!room) return null;

  return (
    <div className={styles.wrapper}>

      {/* ===== PHẦN TRÊN ===== */}
      <div className={styles.topSection}>

        {/* LEFT INFO */}
        <div className={styles.infoCard}>
          <h3>Thông tin phòng</h3>

          <p><strong>Loại phòng:</strong> {room.room_type}</p>
          <p><strong>Số phòng:</strong> {room.room_number}</p>
          <p><strong>Giá:</strong> ${Number(room.price).toLocaleString()} / đêm</p>

          <div className={styles.descriptionBox}>
            <h4>Mô tả phòng:</h4>
            <p>
              Phòng mang đến không gian hiện đại và sang trọng,
              được thiết kế tinh tế với đầy đủ tiện nghi.
              Mang lại cảm giác thư giãn tuyệt đối cho kỳ nghỉ của bạn.
            </p>
          </div>
        </div>

        {/* RIGHT IMAGES */}
        <div className={styles.imageLayout}>
          <div className={styles.smallImages}>
            <img src="/images/room1.jpg" />
            <img src="/images/room2.jpg" />
          </div>
          <img
            src="/images/room3.jpg"
            className={styles.largeImage}
          />
        </div>

      </div>

      {/* ===== PHẦN DƯỚI ===== */}
      <div className={styles.paymentCard}>

        <div className={styles.paymentHeader}>
          <h3>Chọn phương thức thanh toán</h3>

          <div className={styles.tabs}>
            <span className={styles.activeTab}>
              Thẻ tín dụng/Ghi nợ
            </span>
            <span>Ví điện tử</span>
            <span>Mobile banking</span>
          </div>
        </div>

        <div className={styles.paymentForm}>
          <input placeholder="Số thẻ" />
          <input placeholder="Tên chủ thẻ" />
          <input placeholder="Địa chỉ thanh toán" />
        </div>

        <div className={styles.bottomRow}>
          <div className={styles.total}>
            TỔNG: ${Number(totalPrice).toLocaleString()}
          </div>

          <button
            className={styles.bookBtn}
            onClick={handleBooking}
            disabled={loading}
          >
            {loading ? "Đang đặt..." : "Đặt phòng"}
          </button>
        </div>

      </div>

    </div>
  );
}