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

  // ==============================
  // HELPER STATUS
  // ==============================
  const getStatusLabel = (status: string) => {
    if (status === "paid") return "Đặt thành công";
    if (status === "pending") return "Chờ xác nhận";
    return status;
  };

  const getStatusStyle = (status: string) => {
    if (status === "paid") {
      return {
        backgroundColor: "#c8f7c5",
        color: "#2e7d32",
      };
    }
    if (status === "pending") {
      return {
        backgroundColor: "#ffe9b3",
        color: "#b26a00",
      };
    }
    return {};
  };

  // ==============================
  // FETCH DATA
  // ==============================
  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const res = await fetch(
          "http://127.0.0.1:8000/invoices/me",
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
      </div>

      <div className={styles.grid}>
        {invoices.map((invoice) => (
          <div key={invoice.invoice_id} className={styles.card}>
            <p><strong>Số phòng:</strong> {invoice.room_number}</p>
            <p><strong>Loại phòng:</strong> {invoice.room_type}</p>

            <p>
              <strong>Ngày nhận:</strong>{" "}
              {new Date(invoice.check_in).toLocaleDateString("vi-VN")}
            </p>

            <p>
              <strong>Ngày trả:</strong>{" "}
              {new Date(invoice.check_out).toLocaleDateString("vi-VN")}
            </p>

            <p>
              <strong>Ngày đặt:</strong>{" "}
              {new Date(invoice.issued_at).toLocaleString("vi-VN")}
            </p>

            <p>
              <strong>Tổng tiền:</strong>{" "}
              {Number(invoice.total_amount).toLocaleString()} VND
            </p>

            <p>
              <strong>Trạng thái:</strong>{" "}
              <span
                style={{
                  padding: "6px 12px",
                  borderRadius: "8px",
                  fontWeight: 600,
                  ...getStatusStyle(invoice.status),
                }}
              >
                {getStatusLabel(invoice.status)}
              </span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}