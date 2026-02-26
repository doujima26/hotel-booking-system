"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import styles from "./Header.module.css";
import api from "@/lib/api";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout, loading } = useAuth();
  const [showAccount, setShowAccount] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (loading) return null;

  return (
    <>
      <header className={`${styles.header} ${scrolled ? styles.scrolled : ""}`}>
        <div className={styles.container}>
          <div className={styles.logo} onClick={() => router.push("/")}>
            Continental<span>.com</span>
          </div>

          <div className={styles.searchBox}>
            <span className={styles.searchIcon}></span>
            <input className={styles.searchInput} placeholder="Tìm kiếm điểm đến..." />
          </div>

          <nav className={styles.nav}>
            <Link href="/" className={`${styles.link} ${pathname === "/" ? styles.active : ""}`}>
              Trang chủ
            </Link>

            {/* ===== GUEST ===== */}
            {!user && (
              <>
                <Link href="/hotel" className={styles.link}>Khách sạn</Link>
                <Link href="/login" className={styles.link}>Đăng nhập</Link>
                <Link href="/register" className={styles.registerBtn}>Đăng ký</Link>
              </>
            )}

            {/* ===== USER ===== */}
            {user?.role === "user" && (
              <>
                <Link href="/hotel" className={styles.link}>Khách sạn</Link>
                <Link href="/user/my-bookings" className={styles.link}>Đặt phòng</Link>
                <button className={styles.accountBtn} onClick={() => setShowAccount(true)}>
                  <div className={styles.avatarMini}>
                    <img src="/images/avt.png" alt="avt" />
                  </div>
                  Tài khoản
                </button>
              </>
            )}

            {/* ===== ADMIN / STAFF ===== */}
            {(user?.role === "admin" || user?.role === "staff") && (
              <>
                <Link href="/admin/invoices" className={styles.link}>Quản lý hóa đơn</Link>
                <Link href="/admin/rooms" className={styles.link}>Quản lý phòng</Link>

                
                <button className={styles.accountBtn} onClick={() => setShowAccount(true)}>
                  <div className={styles.avatarMini}>
                    <img src="/images/avt.png" alt="avt" />
                  </div>
                  Tài khoản
                </button>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* ===== ACCOUNT POPUP ===== */}
      {showAccount && user && (
        <div className={styles.overlay} onClick={() => setShowAccount(false)}>
          <div className={styles.accountCard} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeBtn} onClick={() => setShowAccount(false)}>✕</button>
            
            <div className={styles.cardHeader}>
              <div className={styles.coverPhoto}></div>
              <div className={styles.profilePic}>
                <img src="/images/avt.png" alt="avatar" />
              </div>
            </div>

            <div className={styles.cardBody}>
              <h2 className={styles.userName}>{user.name}</h2>
              <p className={styles.userRole}>{user.role.toUpperCase()}</p>
              
              <div className={styles.infoGrid}>
                <div className={styles.infoItem}>
                  <label>Email</label>
                  <p>{user.email}</p>
                </div>
                <div className={styles.infoItem}>
                  <label>Số điện thoại</label>
                  <p>{user.phone_number}</p>
                </div>
                <div className={styles.infoItem}>
                  <label>Ngày sinh</label>
                  <p>{user.dob || "Chưa cập nhật"}</p>
                </div>
              </div>

              <div className={styles.actions}>
                <button className={styles.editBtn}>Chỉnh sửa hồ sơ</button>
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
          </div>
        </div>
      )}
    </>
  );
}