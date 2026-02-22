"use client";

import styles from "@/app/page.module.css";

export default function AdminHome() {
  return (
    <main className={styles.container}>
      <section className={styles.heroWrapper}>
        <div className={styles.hero}>
          <div className={styles.overlay}></div>

          <h1 className={styles.heroTitle}>
            ADMIN DASHBOARD
            <br />
            QUẢN LÝ HỆ THỐNG KHÁCH SẠN
          </h1>
        </div>
      </section>

      {/* Có thể thêm thống kê ở đây sau */}
    </main>
  );
}