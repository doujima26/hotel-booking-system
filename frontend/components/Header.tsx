"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "./Header.module.css";

export default function Header() {
  const [role, setRole] = useState<string | null>(null);
  const [showAccount, setShowAccount] = useState(false);
  const [userInfo, setUserInfo] = useState<any>(null);

  useEffect(() => {
    const savedRole = localStorage.getItem("role");
    setRole(savedRole);
  }, []);

  const handleAccountClick = async () => {
    const token = localStorage.getItem("access_token");

    if (!token) return;

    try {
      const res = await fetch("http://127.0.0.1:8000/users/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error("Không thể lấy thông tin");
      }

      setUserInfo(data);
      setShowAccount(true);

    } catch (err) {
      console.error(err);
    }
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("role");
    window.location.reload();
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
          <Link href="/" className={styles.link}>Trang chủ</Link>
          <Link href="#" className={styles.link}>Khách sạn</Link>
          <Link href="#" className={styles.link}>Đặt phòng</Link>
          <Link href="#" className={styles.link}>Dịch vụ</Link>

          {/* ===== GUEST ===== */}
          {!role && (
            <>
              <Link href="/login" className={styles.link}>
                Đăng nhập
              </Link>
              <Link href="/register" className={styles.registerBtn}>
                Đăng ký
              </Link>
            </>
          )}

          {/* ===== USER ===== */}
          {role === "user" && (
            <button
              className={styles.link}
              onClick={handleAccountClick}
            >
              Tài khoản
            </button>
          )}
        </nav>
      </header>

      {/* ===== ACCOUNT POPUP ===== */}
      {showAccount && userInfo && (
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
                <h2>{userInfo.name}</h2>
                <p><span>Vai trò:</span> Khách hàng</p>
                <p><span>DOB:</span> {userInfo.dob}</p>
                <p><span>Email:</span> {userInfo.email}</p>
                <p><span>SĐT:</span> {userInfo.phone_number}</p>

                <button
                  className={styles.logoutBtn}
                  onClick={logout}
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