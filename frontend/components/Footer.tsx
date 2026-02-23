"use client";

import styles from "./Footer.module.css";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        
        {/* CỘT 1: BRAND & GIỚI THIỆU */}
        <div className={styles.column}>
          <div className={styles.logo}>
            Continental<span>.com</span>
          </div>
          <p className={styles.tagline}>
            Trải nghiệm kỳ nghỉ đẳng cấp thế giới với hệ thống khách sạn hàng đầu. Chúng tôi mang lại sự sang trọng và tiện nghi trong từng chi tiết.
          </p>
          <div className={styles.socials}>
            <a href="#" className={styles.socialIcon}>fb</a>
            <a href="#" className={styles.socialIcon}>ig</a>
            <a href="#" className={styles.socialIcon}>tw</a>
          </div>
        </div>

        {/* CỘT 2: LIÊN KẾT NHANH */}
        <div className={styles.column}>
          <h3 className={styles.columnTitle}>Khám phá</h3>
          <ul className={styles.links}>
            <li><Link href="/hotel">Về chúng tôi</Link></li>
            <li><Link href="/">Phòng nghỉ</Link></li>
            <li><Link href="/">Dịch vụ Spa</Link></li>
            <li><Link href="/">Nhà hàng</Link></li>
          </ul>
        </div>

        {/* CỘT 3: HỖ TRỢ */}
        <div className={styles.column}>
          <h3 className={styles.columnTitle}>Hỗ trợ</h3>
          <ul className={styles.links}>
            <li><Link href="/">Trung tâm trợ giúp</Link></li>
            <li><Link href="/">Chính sách bảo mật</Link></li>
            <li><Link href="/">Điều khoản sử dụng</Link></li>
            <li><Link href="/">FAQs</Link></li>
          </ul>
        </div>

        {/* CỘT 4: LIÊN HỆ */}
        <div className={styles.column}>
          <h3 className={styles.columnTitle}>Liên hệ</h3>
          <div className={styles.contactItem}>
            <span className={styles.icon}></span> 0231-232-999
          </div>
          <div className={styles.contactItem}>
            <span className={styles.icon}></span> contact@continental.com
          </div>
          <div className={styles.contactItem}>
            <span className={styles.icon}></span> 45 Nguyễn Trãi, Hà Nội
          </div>
        </div>

      </div>

      {/* DÒNG BẢN QUYỀN DƯỚI CÙNG */}
      <div className={styles.bottomBar}>
        <div className={styles.bottomContainer}>
          <p>© 2026 Continental Hotel Group. All rights reserved.</p>
          <p>Designed by <span className={styles.author}>HoangHaDung</span></p>
        </div>
      </div>
    </footer>
  );
}