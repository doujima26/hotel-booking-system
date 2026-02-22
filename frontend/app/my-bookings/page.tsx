"use client";

import { useEffect, useState } from "react";
import styles from "./MyBookings.module.css";
import { useRouter } from "next/navigation";

export default function MyBookings() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("access_token")
      : null;

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const res = await fetch(
          "http://127.0.0.1:8000/invoices/my",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();
        if (!res.ok) throw new Error(data.detail);

        setInvoices(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchInvoices();
  }, []);

  if (loading) return <p>Đang tải...</p>;

  return (
    <div className={styles.wrapper}>
      <div className={styles.headerBox}>
        <h2>Lịch sử đặt phòng</h2>
        <button className={styles.successBtn}>
          Đặt thành công
        </button>
      </div>

      <div className={styles.grid}>
        {invoices.map((invoice) => (
          <div key={invoice.invoice_id} className={styles.card}>
            <p><strong>Họ và tên:</strong> {invoice.customer_name}</p>
            <p><strong>Số phòng:</strong> {invoice.room_number}</p>
            <p><strong>Loại phòng:</strong> {invoice.room_type}</p>
            <p><strong>Ngày nhận:</strong> {invoice.check_in}</p>
            <p><strong>Ngày trả:</strong> {invoice.check_out}</p>
            <p>
              <strong>Tổng tiền:</strong>{" "}
              {Number(invoice.total_amount).toLocaleString()} VND
              (Đã thanh toán)
            </p>

            <button
              className={styles.detailBtn}
              onClick={() =>
                router.push(`/invoice/${invoice.invoice_id}`)
              }
            >
              chi tiết
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}