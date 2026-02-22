"use client";

import styles from "./login.module.css";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";

export default function LoginPage() {
  const router = useRouter();

  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();

  const res = await fetch("http://127.0.0.1:8000/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();

  if (!res.ok) {
    alert(data.detail);
    return;
  }

  login(data.access_token); 
  router.push("/");
};

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Đăng nhập</h1>

      <form className={styles.form} onSubmit={handleLogin}>
        <label>Địa chỉ email</label>
        <input
          type="email"
          placeholder="Nhập địa chỉ email của bạn"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label>Mật khẩu</label>
        <input
          type="password"
          placeholder="******"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit" className={styles.loginBtn}>
          Đăng nhập
        </button>
      </form>
    </div>
  );
}