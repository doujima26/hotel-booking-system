"use client";

import { useEffect, useState } from "react";
import styles from "./AdminInvoices.module.css";

export default function AdminInvoices() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  // ==========================
  // GET TOKEN SAFELY
  // ==========================
  useEffect(() => {
    const storedToken = localStorage.getItem("access_token");
    setToken(storedToken);
  }, []);

  // ==========================
  // LOAD INVOICES
  // ==========================
  useEffect(() => {
    if (!token) return;

    const loadInvoices = async () => {
      try {
        const res = await fetch(
          "http://127.0.0.1:8000/invoices/branch",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();
        if (!res.ok) throw new Error(data.detail);

        setInvoices(data);
      } catch (err: any) {
        console.error(err);
        alert(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadInvoices();
  }, [token]);

  // ==========================
  // CONFIRM INVOICE
  // ==========================
    const confirmInvoice = async (invoiceId: number) => {
        try {
            const res = await fetch(
            `http://127.0.0.1:8000/invoices/${invoiceId}/confirm`,
            {
                method: "PUT",
                headers: {
                Authorization: `Bearer ${token}`,
                },
            }
            );

            const data = await res.json();
            if (!res.ok) throw new Error(data.detail);

            // Update state ngay lập tức
            setInvoices((prev) =>
            prev.map((invoice) =>
                invoice.invoice_id === invoiceId
                ? { ...invoice, status: "paid" }
                : invoice
            )
            );

        } catch (err: any) {
            alert(err.message);
        }
    };

  if (loading) return <p>Đang tải...</p>;

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h2>Quản lý hóa đơn</h2>
      </div>

      <div className={styles.grid}>
        {invoices.map((invoice) => (
          <div key={invoice.invoice_id} className={styles.card}>
            <p><strong>Khách hàng:</strong> {invoice.customer_name}</p>
            <p><strong>Số phòng:</strong> {invoice.room_number}</p>
            <p><strong>Loại phòng:</strong> {invoice.room_type}</p>
            <p><strong>Ngày nhận phòng:</strong> {invoice.check_in}</p>
            <p><strong>Ngày trả phòng:</strong> {invoice.check_out}</p>
            <p>
            <strong>Ngày đặt:</strong>{" "}
            {new Date(invoice.issued_at).toLocaleString("vi-VN")}
            </p>
            <p>
              <strong>Tổng tiền:</strong>{" "}
              {Number(invoice.total_amount).toLocaleString()} VND
            </p>

            {invoice.status === "paid" ? (
              <button className={styles.confirmedBtn} disabled>
                Đã xác nhận
              </button>
            ) : (
              <button
                className={styles.confirmBtn}
                onClick={() => confirmInvoice(invoice.invoice_id)}
              >
                Xác nhận
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}