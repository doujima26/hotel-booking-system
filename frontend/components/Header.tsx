"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import styles from "./Header.module.css";
import api from "@/lib/api";

export default function Header() {
  const router = useRouter();
  const { user, logout, loading } = useAuth();

  const [showAccount, setShowAccount] = useState(false);

  if (loading) return null;

  // ===== ACCOUNT CLICK =====
  const handleAccountClick = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) return;

    try {
      await api.get("/users/me");

      setShowAccount(true);

    } catch (error: any) {
      console.error(
        error.response?.data?.detail || "Không thể lấy thông tin"
      );
    }
  };

  return (
    <>
      <header className={styles.header}>
        <div className={styles.logo}>
          Continental.com
        </div>

        <div className={styles.searchBox}>
          <input
            className={styles.searchInput}
            placeholder="Tìm kiếm..."
          />
        </div>

        <nav className={styles.nav}>
          <Link href="/" className={styles.link}>
            Trang chủ
          </Link>

          {/* ===== GUEST ===== */}
          {!user && (
            <>
              <Link href="#" className={styles.link}>Khách sạn</Link>
              <Link href="#" className={styles.link}>Đặt phòng</Link>
              <Link href="#" className={styles.link}>Dịch vụ</Link>

              <Link href="/login" className={styles.link}>
                Đăng nhập
              </Link>
              <Link href="/register" className={styles.registerBtn}>
                Đăng ký
              </Link>
            </>
          )}

          {/* ===== USER ===== */}
          {user?.role === "user" && (
            <>
              <Link href="#" className={styles.link}>Khách sạn</Link>
              <Link href="/user/my-bookings" className={styles.link}>Đặt phòng</Link>
              <Link href="#" className={styles.link}>Dịch vụ</Link>

              <button
                className={styles.accountBtn}
                onClick={() => setShowAccount(true)}
              >
                Tài khoản
              </button>
            </>
          )}

          {/* ===== ADMIN ===== */}
          {user?.role === "admin" && (
            <>
              <Link href="/admin/invoices" className={styles.link}>
                Hóa đơn
              </Link>

              <Link href="/admin/rooms" className={styles.link}>
                Phòng
              </Link>

              <Link href="/admin/services" className={styles.link}>
                Dịch vụ
              </Link>

              <Link href="/admin/staff" className={styles.link}>
                Nhân viên
              </Link>

              <button
                className={styles.accountBtn}
                onClick={() => setShowAccount(true)}
              >
                Tài khoản
              </button>
            </>
          )}
        </nav>
      </header>

      {/* ===== ACCOUNT POPUP ===== */}
      {showAccount && user && (
        <div className={styles.overlay}>
          <div className={styles.accountCard}>

            <div className={styles.accountHeader}>
              Thông tin tài khoản cá nhân
            </div>

            <div className={styles.accountBody}>
              <div className={styles.avatar}>
                <img src="/images/avt.png" alt="avatar" />
              </div>

              <div className={styles.info}>
                <h2>{user.name}</h2>
                <p><span>Vai trò:</span> {user.role}</p>
                <p><span>DOB:</span> {user.dob}</p>
                <p><span>Email:</span> {user.email}</p>
                <p><span>SĐT:</span> {user.phone_number}</p>

                <button
                  className={styles.logoutBtn}
                  onClick={() => {
                    logout();
                    setShowAccount(false);
                    router.push("/");
                  }}
                >
                  Đăng xuất
                </button>
              </div>
            </div>

            <button
              className={styles.closeBtn}
              onClick={() => setShowAccount(false)}
            >
              ✕
            </button>

          </div>
        </div>
      )}
    </>
  );
}