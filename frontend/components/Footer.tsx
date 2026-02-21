import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>

        <div>
          <div className={styles.logo}>
            Continental.com
          </div>
          <div className={styles.copy}>
            Copyright 2026 | Sothanhtra
          </div>
        </div>

        <div>
          <div className={styles.contactTitle}>
            LIÊN HỆ:
          </div>
          <div className={styles.contactItem}>
            0231-232-999
          </div>
          <div className={styles.contactItem}>
            abc@gmail.com
          </div>
        </div>

      </div>
    </footer>
  );
}