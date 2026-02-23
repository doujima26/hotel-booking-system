"use client";

import { useEffect, useState } from "react";
import styles from "./MyBookings.module.css";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

export default function MyBookings() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const res = await api.get("/invoices/me");
        setInvoices(res.data);
      } catch (error: any) {
        console.error(error.response?.data?.detail || "Lỗi tải hóa đơn");
      } finally {
        setLoading(false);
      }
    };
    fetchInvoices();
  }, []);

  if (loading) return (
    <div className={styles.loadingState}>
      <div className={styles.spinner}></div>
      <p>Đang tải lịch sử của bạn...</p>
    </div>
  );

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <header className={styles.headerBox}>
          <div>
            <h2 className={styles.title}>Lịch sử đặt phòng</h2>
            <p className={styles.subtitle}>Quản lý và xem lại lịch sử đặt phòng của bạn</p>
          </div>
          <button className={styles.homeBtn} onClick={() => router.push("/")}>
            Đặt phòng mới
          </button>
        </header>

        {invoices.length === 0 ? (
          <div className={styles.emptyState}>
            <p>Bạn chưa có lịch sử đặt phòng nào.</p>
          </div>
        ) : (
          <div className={styles.grid}>
            {invoices.map((invoice) => (
              <div key={invoice.invoice_id} className={styles.card}>
                {/* Card Header */}
                <div className={styles.cardHeader}>
                  <div className={styles.roomInfo}>
                    <span className={styles.roomNumber}>Phòng {invoice.room_number}</span>
                    <span className={styles.roomType}>{invoice.room_type}</span>
                  </div>
                  <span className={`${styles.statusBadge} ${styles[invoice.status]}`}>
                    {invoice.status === "paid" ? "Đặt thành công" : "Chờ xác nhận"}
                  </span>
                </div>

                {/* Card Body */}
                <div className={styles.cardBody}>
                  <div className={styles.dateRow}>
                    <div className={styles.dateItem}>
                      <label>Nhận phòng</label>
                      <p>{new Date(invoice.check_in).toLocaleDateString("vi-VN")}</p>
                    </div>
                    <div className={styles.arrow}>→</div>
                    <div className={styles.dateItem}>
                      <label>Trả phòng</label>
                      <p>{new Date(invoice.check_out).toLocaleDateString("vi-VN")}</p>
                    </div>
                  </div>

                  <div className={styles.infoLine}>
                    <span>Ngày đặt:</span>
                    <span>{new Date(invoice.issued_at).toLocaleString("vi-VN", { dateStyle: 'short', timeStyle: 'short' })}</span>
                  </div>
                </div>

                {/* Card Footer */}
                <div className={styles.cardFooter}>
                  <div className={styles.priceBox}>
                    <label>Tổng thanh toán</label>
                    <p className={styles.totalPrice}>
                      {Number(invoice.total_amount).toLocaleString()} <span>VND</span>
                    </p>
                  </div>
                  <button className={styles.detailBtn}>Chi tiết</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}