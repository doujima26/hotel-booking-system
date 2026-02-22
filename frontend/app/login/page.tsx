"use client";

import styles from "./login.module.css";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";

export default function LoginPage() {
  const router = useRouter();


  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

const { login } = useAuth();

const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();

  if (!res.ok) {
    alert(data.detail);
    return;
  }

  await login(data.access_token);

  if (data.role === "admin") {
    router.push("/admin");
  } else if (data.role === "staff") {
    router.push("/staff");
  } else {
    router.push("/");
  }
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