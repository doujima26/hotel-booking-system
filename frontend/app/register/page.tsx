"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./register.module.css";

type Step = "email" | "role" | "form";

export default function RegisterPage() {
  const router = useRouter();

  const [step, setStep] = useState<Step>("email");

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const [role, setRole] = useState("");

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [hotelId, setHotelId] = useState("");
  const [error, setError] = useState("");

  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [dob, setDob] = useState("");

  // =========================
  // VALIDATE EMAIL
  // =========================
  const validateEmail = (value: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(value);
  };

  // =========================
  // STEP 1: EMAIL
  // =========================
  if (step === "email") {
    return (
      <div className={styles.container}>
        <h1>Tạo tài khoản mới</h1>

        <div className={styles.emailBox}>
          <input
            type="email"
            className={styles.emailInput}
            placeholder="abc@mail.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setEmailError("");
            }}
          />

          {emailError && <p className={styles.error}>{emailError}</p>}

          <button
            className={styles.primaryBtn}
            onClick={() => {
              if (!validateEmail(email)) {
                setEmailError("Email không đúng định dạng");
                return;
              }
              setStep("role");
            }}
          >
            Đăng ký bằng email
          </button>
        </div>
      </div>
    );
  }

  // =========================
  // STEP 2: ROLE
  // =========================
  if (step === "role") {
    return (
      <div className={styles.container}>
        <h1>Tạo tài khoản mới</h1>
        <p>Chọn vai trò của người dùng</p>

        <div className={styles.roleBox}>
          <button
            className={styles.roleBtn}
            onClick={() => {
              setRole("admin");
              setStep("form");
            }}
          >
            Quản lý
          </button>

          <button
            className={styles.roleBtn}
            onClick={() => {
              setRole("staff");
              setStep("form");
            }}
          >
            Nhân viên
          </button>

          <button
            className={styles.roleBtn}
            onClick={() => {
              setRole("user");
              setStep("form");
            }}
          >
            Khách hàng
          </button>
        </div>

        <button
          className={styles.backBtn}
          onClick={() => setStep("email")}
        >
          ←
        </button>
      </div>
    );
  }

  // =========================
  // HANDLE REGISTER
  // =========================
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Mật khẩu phải ít nhất 8 ký tự");
      return;
    }

    if (password !== confirmPassword) {
      setError("Mật khẩu không khớp");
      return;
    }

    try {
      const res = await fetch("http://127.0.0.1:8000/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          phone_number: phone,
          role,
          dob,
          hotel_id:
            role === "admin" || role === "staff"
              ? Number(hotelId)
              : null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || "Đăng ký thất bại");
      }

      // Thành công → chuyển sang login
      router.push("/login");

    } catch (err: any) {
      setError(err.message);
    }
  };

  // =========================
  // STEP 3: FORM
  // =========================
  return (
    <div className={styles.container}>
      <h1>
        {role === "admin" && "Đăng ký tài khoản quản lý"}
        {role === "staff" && "Đăng ký tài khoản nhân viên"}
        {role === "user" && "Đăng ký tài khoản khách hàng"}
      </h1>

      <form className={styles.form} onSubmit={handleRegister}>

        <div className={styles.inputGroup}>
          <label className={styles.label}>Tên người dùng:</label>
          <input
            className={styles.input}
            placeholder="Tên người dùng"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>Số điện thoại:</label>
          <input
            className={styles.input}
            placeholder="Số điện thoại"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>Ngày sinh:</label>
          <input
            type="date"
            className={styles.input}
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>Mật khẩu:</label>
          <input
            type="password"
            className={styles.input}
            placeholder="Mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>Xác nhận mật khẩu:</label>
          <input
            type="password"
            className={styles.input}
            placeholder="Xác nhận mật khẩu"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        {(role === "admin" || role === "staff") && (
          <div className={styles.inputGroup}>
            <label className={styles.label}>Mã chi nhánh:</label>
            <input
              className={styles.input}
              placeholder="Nhập mã chi nhánh"
              value={hotelId}
              onChange={(e) => setHotelId(e.target.value)}
              required
            />
          </div>
        )}

        {error && <p className={styles.error}>{error}</p>}

        <button
          type="submit"
          className={styles.submitBtn}
        >
          Đăng ký
        </button>

      </form>

      <button
        className={styles.backBtn}
        onClick={() => setStep("role")}
      >
        ←
      </button>
    </div>
  );
}