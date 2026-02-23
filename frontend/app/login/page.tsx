"use client";

import styles from "./login.module.css";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import api from "@/lib/api";
import Link from "next/link"; // Thêm Link để chuyển trang

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // State để hiện lỗi thay cho alert
  const [loading, setLoading] = useState(false); // Hiệu ứng loading

  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/auth/login", {
        email,
        password,
      });

      const data = res.data;
      await login(data.access_token);

      if (data.role === "admin") {
        router.push("/admin");
      } else if (data.role === "staff") {
        router.push("/staff");
      } else {
        router.push("/");
      }
    } catch (error: any) {
        const detail = error.response?.data?.detail;

        if (Array.isArray(detail)) {
          setError(detail[0].msg);
        } else {
          setError(detail || "Email hoặc mật khẩu không chính xác");
        }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.loginCard}>
        <div className={styles.header}>
          <h1 className={styles.title}>Chào mừng trở lại</h1>
          <p className={styles.subtitle}>Vui lòng đăng nhập để tiếp tục</p>
        </div>

        {error && <div className={styles.errorBanner}>{error}</div>}

        <form className={styles.form} onSubmit={handleLogin}>
          <div className={styles.inputGroup}>
            <label>Địa chỉ email</label>
            <input
              type="email"
              placeholder="abc@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <div className={styles.labelRow}>
              <label>Mật khẩu</label>
              <a href="#" className={styles.forgotPass}>Quên mật khẩu?</a>
            </div>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button 
            type="submit" 
            className={styles.loginBtn}
            disabled={loading}
          >
            {loading ? "Đang xử lý..." : "Đăng nhập"}
          </button>
        </form>

        <div className={styles.footer}>
          <span>Chưa có tài khoản? </span>
          <Link href="/register" className={styles.registerLink}>Đăng ký ngay</Link>
        </div>
      </div>
    </div>
  );
}