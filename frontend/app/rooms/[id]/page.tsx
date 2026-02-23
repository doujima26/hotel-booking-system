"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import styles from "./RoomDetail.module.css";
import api from "@/lib/api";

export default function RoomDetail() {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const checkIn = searchParams.get("checkIn");
  const checkOut = searchParams.get("checkOut");

  const [room, setRoom] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const res = await api.get(`/rooms/${id}`);
        setRoom(res.data);
      } catch (error: any) {
        console.error("Lỗi tải thông tin phòng");
      }
    };
    if (id) fetchRoom();
  }, [id]);

  const calculateDays = () => {
    if (!checkIn || !checkOut) return 0;
    const inDate = new Date(checkIn);
    const outDate = new Date(checkOut);
    return Math.max(0, Math.floor((outDate.getTime() - inDate.getTime()) / (1000 * 3600 * 24)));
  };

  const nights = calculateDays();
  const totalPrice = room?.price ? Number(room.price) * nights : 0;

  const handleBooking = async () => {
    if (!localStorage.getItem("access_token")) {
      alert("Vui lòng đăng nhập để đặt phòng");
      router.push("/login");
      return;
    }
    try {
      setLoading(true);
      await api.post("/bookings", {
        room_id: Number(id),
        check_in: checkIn,
        check_out: checkOut,
      });
      alert("Đặt phòng thành công!");
      router.push("/user/my-bookings");
    } catch (error: any) {
      alert(error.response?.data?.detail || "Đặt phòng thất bại");
    } finally {
      setLoading(false);
    }
  };

  if (!room) return null;

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        {/* GALLERY SECTION */}
        <section className={styles.gallery}>
          <div className={styles.mainImage}>
            <img src="/images/room3.jpg" alt="Main" />
          </div>
          <div className={styles.sideImages}>
            <img src="/images/room1.jpg" alt="Detail 1" />
            <img src="/images/room2.jpg" alt="Detail 2" />
          </div>
        </section>

        {/* CONTENT GRID */}
        <div className={styles.contentGrid}>
          {/* LEFT: INFO */}
          <div className={styles.infoSection}>
            <div className={styles.headerInfo}>
              <span className={styles.badge}>{room.room_type}</span>
              <h1 className={styles.roomTitle}>Phòng {room.room_number}</h1>
              <p className={styles.location}> Tầng 5 • Continental Hotel Group</p>
            </div>

            <div className={styles.amenities}>
              <div className={styles.amenity}> Wi-Fi miễn phí</div>
              <div className={styles.amenity}> Điều hòa 2 chiều</div>
              <div className={styles.amenity}> Máy pha cà phê</div>
              <div className={styles.amenity}> Bồn tắm riêng</div>
            </div>

            <div className={styles.description}>
              <h3>Về căn phòng này</h3>
              <p>
                Trải nghiệm sự sang trọng tuyệt đối trong căn phòng được thiết kế tinh tế với 
                nội thất cao cấp. Tận hưởng tầm nhìn tuyệt đẹp ra thành phố cùng với các tiện ích 
                vượt trội, mang lại cho bạn một kỳ nghỉ thư giãn và đẳng cấp nhất.
              </p>
            </div>
          </div>

          {/* RIGHT: BOOKING & PAYMENT CARD */}
          <aside className={styles.bookingSidebar}>
            <div className={styles.paymentCard}>
              <div className={styles.priceHeader}>
                <span className={styles.price}>${Number(room.price).toLocaleString()}</span>
                <span className={styles.unit}> / đêm</span>
              </div>

              <div className={styles.dateInfo}>
                <div className={styles.dateBox}>
                  <label>NHẬN PHÒNG</label>
                  <span>{checkIn || "--/--/--"}</span>
                </div>
                <div className={styles.dateBox}>
                  <label>TRẢ PHÒNG</label>
                  <span>{checkOut || "--/--/--"}</span>
                </div>
              </div>

              <div className={styles.paymentMethod}>
                <label>PHƯƠNG THỨC THANH TOÁN</label>
                <div className={styles.paymentTabs}>
                  <span className={styles.activeTab}>Thẻ</span>
                  <span>Ví điện tử</span>
                </div>
                <div className={styles.inputGroup}>
                  <input type="text" placeholder="Số thẻ: 0000 0000 0000 0000" />
                  <input type="text" placeholder="Tên chủ thẻ (In hoa không dấu)" />
                </div>
              </div>

              <div className={styles.summary}>
                <div className={styles.summaryLine}>
                  <span>${Number(room.price).toLocaleString()} x {nights} đêm</span>
                  <span>${totalPrice.toLocaleString()}</span>
                </div>
                <div className={styles.summaryLine}>
                  <span>Phí dịch vụ</span>
                  <span>$0</span>
                </div>
                <div className={`${styles.summaryLine} ${styles.total}`}>
                  <span>Tổng thanh toán</span>
                  <span>${totalPrice.toLocaleString()}</span>
                </div>
              </div>

              <button 
                className={styles.bookBtn} 
                onClick={handleBooking} 
                disabled={loading || nights === 0}
              >
                {loading ? "ĐANG XỬ LÝ..." : "ĐẶT PHÒNG NGAY"}
              </button>
              
              {nights === 0 && <p className={styles.warning}>* Vui lòng chọn ngày hợp lệ để đặt phòng</p>}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}