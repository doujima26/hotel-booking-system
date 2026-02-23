"use client";

import { useEffect, useState } from "react";
import styles from "./AdminInvoices.module.css";
import api from "@/lib/api";

export default function AdminInvoices() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadInvoices = async () => {
    try {
      const res = await api.get("/invoices/branch");
      setInvoices(res.data);
    } catch (error: any) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadInvoices(); }, []);

  const confirmInvoice = async (invoiceId: number) => {
    try {
      const res = await api.put(`/invoices/${invoiceId}/confirm`);
      setInvoices((prev) =>
        prev.map((invoice) =>
          invoice.invoice_id === invoiceId ? res.data : invoice
        )
      );
    } catch (error: any) {
      alert(error.response?.data?.detail || "Xác nhận thất bại");
    }
  };

  if (loading) return (
    <div className={styles.loader}>
      <div className={styles.spinner}></div>
      <p>Đang tải dữ liệu hóa đơn...</p>
    </div>
  );

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <header className={styles.header}>
          <div>
            <h2 className={styles.title}>Quản lý hóa đơn</h2>
            <p className={styles.subtitle}>Danh sách các giao dịch thanh toán tại chi nhánh</p>
          </div>
          <button className={styles.refreshBtn} onClick={loadInvoices}>Làm mới ↻</button>
        </header>

        <div className={styles.grid}>
          {invoices.map((invoice) => (
            <div key={invoice.invoice_id} className={styles.card}>
              {/* Card Top: Customer & Status */}
              <div className={styles.cardHeader}>
                <div className={styles.customerInfo}>
                  <div className={styles.avatarText}>{invoice.customer_name.charAt(0)}</div>
                  <div>
                    <h3 className={styles.customerName}>{invoice.customer_name}</h3>
                    <span className={styles.invoiceId}>ID: #{invoice.invoice_id}</span>
                  </div>
                </div>
                <span className={`${styles.statusBadge} ${styles[invoice.status]}`}>
                  {invoice.status === "paid" ? "Đã thanh toán" : "Chờ xác nhận"}
                </span>
              </div>

              {/* Card Middle: Room & Dates */}
              <div className={styles.cardBody}>
                <div className={styles.roomLine}>
                  <strong>Phòng {invoice.room_number}</strong>
                  <span className={styles.roomType}>{invoice.room_type}</span>
                </div>
                
                <div className={styles.dateGrid}>
                  <div className={styles.dateBlock}>
                    <label>Nhận phòng</label>
                    <p>{new Date(invoice.check_in).toLocaleDateString("vi-VN")}</p>
                  </div>
                  <div className={styles.dateBlock}>
                    <label>Trả phòng</label>
                    <p>{new Date(invoice.check_out).toLocaleDateString("vi-VN")}</p>
                  </div>
                </div>

                <div className={styles.issuedAt}>
                  Ngày đặt: {new Date(invoice.issued_at).toLocaleString("vi-VN")}
                </div>
              </div>

              {/* Card Bottom: Price & Action */}
              <div className={styles.cardFooter}>
                <div className={styles.priceSection}>
                  <label>Tổng thanh toán</label>
                  <div className={styles.totalPrice}>
                    {Number(invoice.total_amount).toLocaleString()} <span>VND</span>
                  </div>
                </div>

                {invoice.status === "paid" ? (
                  <button className={styles.confirmedBtn} disabled>✓ Hoàn tất</button>
                ) : (
                  <button
                    className={styles.confirmBtn}
                    onClick={() => confirmInvoice(invoice.invoice_id)}
                  >
                    Xác nhận 
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}