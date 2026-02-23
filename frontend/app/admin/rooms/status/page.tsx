"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import styles from "./RoomStatus.module.css";
import api from "@/lib/api";

export default function RoomStatusPage() {
  const router = useRouter();
  const pathname = usePathname();
  const isEdit = pathname === "/admin/rooms";
  const isStatus = pathname === "/admin/rooms/status";

  const [bookings, setBookings] = useState<any[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadBookings = async () => {
    try {
      const res = await api.get("/bookings/active");
      setBookings(res.data);
    } catch (error: any) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadBookings(); }, []);

  const handleCheckIn = async () => {
    if (!selectedBooking) return;
    try {
      await api.put(`/bookings/${selectedBooking.booking_id}/check-in`);
      loadBookings();
      setSelectedBooking(null);
      alert("Check-in thành công!");
    } catch (error: any) { alert(error.response?.data?.detail || "Check-in thất bại"); }
  };

  const handleCheckOut = async () => {
    if (!selectedBooking) return;
    try {
      await api.put(`/bookings/${selectedBooking.booking_id}/check-out`);
      loadBookings();
      setSelectedBooking(null);
      alert("Check-out thành công!");
    } catch (error: any) { alert(error.response?.data?.detail || "Check-out thất bại"); }
  };

  if (loading) return (
    <div className={styles.loading}>
      <div className={styles.spinner}></div>
      <p>Đang tải dữ liệu...</p>
    </div>
  );

  return (
    <div className={styles.adminWrapper}>
      {/* HEADER SECTION - Đồng bộ với trang AdminRooms */}
      <div className={styles.headerArea}>
        <div>
          <h1 className={styles.pageTitle}>Quản lý trạng thái phòng</h1>
          <p className={styles.pageSubtitle}>Theo dõi danh sách khách đang chờ check-in hoặc check-out</p>
        </div>

        <div className={styles.tabGroup}>
          <button
            className={isStatus ? styles.activeTab : styles.tab}
            onClick={() => router.push("/admin/rooms/status")}
          >
            Trạng thái phòng
          </button>
          <button
            className={isEdit ? styles.activeTab : styles.tab}
            onClick={() => router.push("/admin/rooms")}
          >
            Chỉnh sửa phòng
          </button>
        </div>
      </div>

      {/* ACTION BAR */}
      <div className={styles.actionBar}>
        <div className={styles.selectedInfo}>
          {selectedBooking ? (
            <p>Đang chọn: <strong>Phòng {selectedBooking.room_number}</strong> - {selectedBooking.customer_name}</p>
          ) : (
            <p>Vui lòng chọn một phòng để thực hiện thao tác</p>
          )}
        </div>
        <div className={styles.actionButtons}>
          <button
            className={styles.checkInBtn}
            disabled={!selectedBooking || selectedBooking.booking_status !== "confirmed"}
            onClick={handleCheckIn}
          >
            Xác nhận Check-in
          </button>
          <button
            className={styles.checkOutBtn}
            disabled={!selectedBooking || selectedBooking.booking_status !== "checked_in"}
            onClick={handleCheckOut}
          >
            Xác nhận Check-out
          </button>
        </div>
      </div>

      {/* GRID LIST */}
      <div className={styles.grid}>
        {bookings.length === 0 ? (
          <div className={styles.emptyState}>Hiện không có lượt đặt phòng nào đang hoạt động.</div>
        ) : (
          bookings.map((booking) => (
            <div
              key={booking.booking_id}
              className={`${styles.card} ${selectedBooking?.booking_id === booking.booking_id ? styles.selected : ""}`}
              onClick={() => setSelectedBooking(booking)}
            >
              <div className={styles.cardHeader}>
                <span className={styles.roomLabel}>Phòng {booking.room_number}</span>
                <span className={`${styles.statusBadge} ${styles[booking.booking_status]}`}>
                  {booking.booking_status === 'confirmed' ? 'Chờ khách' : 'Đã nhận phòng'}
                </span>
              </div>
              
              <div className={styles.cardBody}>
                <h3 className={styles.guestName}>{booking.customer_name}</h3>
                <div className={styles.infoLine}>
                  <span>🕒 Nhận:</span>
                  <span>{new Date(booking.check_in).toLocaleDateString('vi-VN')}</span>
                </div>
                <div className={styles.infoLine}>
                  <span>🕒 Trả:</span>
                  <span>{new Date(booking.check_out).toLocaleDateString('vi-VN')}</span>
                </div>
              </div>

              <div className={styles.cardFooter}>
                <span className={styles.bookingId}>ID: #{booking.booking_id}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}