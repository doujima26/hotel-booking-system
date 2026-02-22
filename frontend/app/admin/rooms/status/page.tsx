"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import styles from "./RoomStatus.module.css";

export default function RoomStatusPage() {
  const router = useRouter();
  const pathname = usePathname();

  const isEdit = pathname === "/admin/rooms";
  const isStatus = pathname === "/admin/rooms/status";

  const [bookings, setBookings] = useState<any[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("access_token")
      : null;

  // ==========================
  // LOAD BOOKING DATA
  // ==========================
  const loadBookings = async () => {
    try {
        const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/bookings/active`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error();

      setBookings(data);
    } catch {
      alert("Lỗi tải danh sách");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) loadBookings();
  }, []);

  // ==========================
  // CHECK IN
  // ==========================
  const handleCheckIn = async () => {
    if (!selectedBooking) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/bookings/${selectedBooking.booking_id}/check-in`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error();

      setBookings((prev) =>
        prev.map((b) =>
          b.booking_id === selectedBooking.booking_id
            ? { ...b, booking_status: "checked_in" }
            : b
        )
      );

      setSelectedBooking({
        ...selectedBooking,
        booking_status: "checked_in",
      });

      alert("Check-in thành công!");
    } catch {
      alert("Check-in thất bại");
    }
  };

  // ==========================
  // CHECK OUT
  // ==========================
  const handleCheckOut = async () => {
    if (!selectedBooking) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/bookings/${selectedBooking.booking_id}/check-out`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error();

      setBookings((prev) =>
        prev.map((b) =>
          b.booking_id === selectedBooking.booking_id
            ? { ...b, booking_status: "completed" }
            : b
        )
      );

      setSelectedBooking({
        ...selectedBooking,
        booking_status: "completed",
      });

      alert("Check-out thành công!");
    } catch {
      alert("Check-out thất bại");
    }
  };

  if (loading) return <p>Đang tải...</p>;

  return (
    <div className={styles.wrapper}>
      {/* HEADER */}
      <div className={styles.headerCard}>
        <div className={styles.headerTitle}>
          Trạng thái phòng
        </div>

        <div className={styles.headerButtons}>
          <button
            className={
              isStatus
                ? styles.headerBtnDark
                : styles.headerBtnLight
            }
            onClick={() =>
              router.push("/admin/rooms/status")
            }
          >
            Trạng thái phòng
          </button>

          <button
            className={
              isEdit
                ? styles.headerBtnDark
                : styles.headerBtnLight
            }
            onClick={() =>
              router.push("/admin/rooms")
            }
          >
            Chỉnh sửa phòng
          </button>
        </div>
      </div>

      {/* CARD LIST */}
      <div className={styles.grid}>
        {bookings.map((booking) => (
          <div
            key={booking.booking_id}
            className={`${styles.card} ${
              selectedBooking?.booking_id ===
              booking.booking_id
                ? styles.selected
                : ""
            }`}
            onClick={() => setSelectedBooking(booking)}
          >
            <p><strong>Khách:</strong> {booking.customer_name}</p>
            <p><strong>Phòng:</strong> {booking.room_number}</p>
            <p><strong>Check-in:</strong> {booking.check_in}</p>
            <p><strong>Check-out:</strong> {booking.check_out}</p>
          </div>
        ))}
      </div>

      {/* ACTION BUTTONS */}
      <div className={styles.actions}>
        <button
          className={styles.checkInBtn}
          disabled={
            !selectedBooking ||
            selectedBooking.booking_status !== "confirmed"
          }
          onClick={handleCheckIn}
        >
          CHECK IN
        </button>

        <button
          className={styles.checkOutBtn}
          disabled={
            !selectedBooking ||
            selectedBooking.booking_status !== "checked_in"
          }
          onClick={handleCheckOut}
        >
          CHECK OUT
        </button>
      </div>
    </div>
  );
}