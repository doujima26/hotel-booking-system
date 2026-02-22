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
  const [dob, setDob] = useState("");
  const [secretKey, setSecretKey] = useState("");

  const [errors, setErrors] = useState({
    name: "",
    phone: "",
    dob: "",
    password: "",
    confirmPassword: "",
    hotelId: "",
    secretKey: "",
  });

  const validateEmail = (value: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(value);
  };

  // =========================
  // STEP 1
  // =========================
  if (step === "email") {
    return (
      <div className={styles.container}>
        <h1>Tạo tài khoản mới</h1>

        <div className={styles.emailBox}>
          <input
            type="email"
            className={`${styles.emailInput} ${
              emailError ? styles.inputError : ""
            }`}
            placeholder="abc@mail.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setEmailError("");
            }}
          />

          {/* luôn render để không lệch */}
          <p className={styles.error}>{emailError}</p>

          <button
            className={styles.primaryBtn}
            onClick={() => {
              if (!validateEmail(email)) {
                setEmailError(
                  "Vui lòng kiểm tra xem địa chỉ email bạn vừa nhập có đúng hay không."
                );
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
  // STEP 2
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

    let newErrors: any = {
      name: "",
      phone: "",
      dob: "",
      password: "",
      confirmPassword: "",
      hotelId: "",
    };

    let hasError = false;

    if (!name.trim()) {
      newErrors.name = "Vui lòng nhập tên người dùng";
      hasError = true;
    }

    if (!/^[0-9]{9,11}$/.test(phone)) {
      newErrors.phone = "Số điện thoại không hợp lệ";
      hasError = true;
    }

    if (!dob) {
      newErrors.dob = "Vui lòng chọn ngày sinh";
      hasError = true;
    }

    if (password.length < 8) {
      newErrors.password = "Mật khẩu phải ít nhất 8 ký tự";
      hasError = true;
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu không khớp";
      hasError = true;
    }

    if ((role === "admin" || role === "staff") && !hotelId.trim()) {
      newErrors.hotelId = "Vui lòng nhập mã chi nhánh";
      hasError = true;
    }

    if ((role === "admin" || role === "staff") && !secretKey.trim()) {
      newErrors.secretKey = "Vui lòng nhập mã xác thực nội bộ";
      hasError = true;
    }

    setErrors(newErrors);

    if (hasError) return;

    try {
      const res = await fetch("http://127.0.0.1:8000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
          secret_key:
            role === "admin" || role === "staff"
              ? secretKey
              : null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || "Đăng ký thất bại");
      }

      router.push("/login");

    } catch (err: any) {
      setError(err.message);
    }
  };

  // =========================
  // STEP 3 FORM
  // =========================
  return (
    <div className={styles.container}>
      <h1>
        {role === "admin" && "Đăng ký tài khoản quản lý"}
        {role === "staff" && "Đăng ký tài khoản nhân viên"}
        {role === "user" && "Đăng ký tài khoản khách hàng"}
      </h1>

      <form className={styles.form} onSubmit={handleRegister}>

        {/* NAME */}
        <div className={styles.inputGroup}>
          <label>Tên người dùng:</label>
          <input
            className={`${styles.input} ${errors.name ? styles.inputError : ""}`}
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setErrors({ ...errors, name: "" });
            }}
          />
          <p className={styles.error}>{errors.name}</p>
        </div>

        {/* PHONE */}
        <div className={styles.inputGroup}>
          <label>Số điện thoại:</label>
          <input
            className={`${styles.input} ${errors.phone ? styles.inputError : ""}`}
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value);
              setErrors({ ...errors, phone: "" });
            }}
          />
          <p className={styles.error}>{errors.phone}</p>
        </div>

        {/* DOB */}
        <div className={styles.inputGroup}>
          <label>Ngày sinh:</label>
          <input
            type="date"
            className={`${styles.input} ${errors.dob ? styles.inputError : ""}`}
            value={dob}
            onChange={(e) => {
              setDob(e.target.value);
              setErrors({ ...errors, dob: "" });
            }}
          />
          <p className={styles.error}>{errors.dob}</p>
        </div>

        {/* PASSWORD */}
        <div className={styles.inputGroup}>
          <label>Mật khẩu:</label>
          <input
            type="password"
            className={`${styles.input} ${
              errors.password ? styles.inputError : ""
            }`}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setErrors({ ...errors, password: "" });
            }}
          />
          <p className={styles.error}>{errors.password}</p>
        </div>

        {/* CONFIRM PASSWORD */}
        <div className={styles.inputGroup}>
          <label>Xác nhận mật khẩu:</label>
          <input
            type="password"
            className={`${styles.input} ${
              errors.confirmPassword ? styles.inputError : ""
            }`}
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              setErrors({ ...errors, confirmPassword: "" });
            }}
          />
          <p className={styles.error}>{errors.confirmPassword}</p>
        </div>

        {/* HOTEL ID */}
        {(role === "admin" || role === "staff") && (
          <>
            {/* HOTEL ID */}
            <div className={styles.inputGroup}>
              <label>Mã chi nhánh:</label>
              <input
                className={`${styles.input} ${
                  errors.hotelId ? styles.inputError : ""
                }`}
                value={hotelId}
                onChange={(e) => {
                  setHotelId(e.target.value);
                  setErrors({ ...errors, hotelId: "" });
                }}
              />
              <p className={styles.error}>{errors.hotelId}</p>
            </div>

            {/* SECRET KEY */}
            <div className={styles.inputGroup}>
              <label>Mã xác thực nội bộ:</label>
              <input
                type="password"
                className={`${styles.input} ${
                  errors.secretKey ? styles.inputError : ""
                }`}
                value={secretKey}
                onChange={(e) => {
                  setSecretKey(e.target.value);
                  setErrors({ ...errors, secretKey: "" });
                }}
              />
              <p className={styles.error}>{errors.secretKey}</p>
            </div>
          </>
        )}

        <p className={styles.error}>{error}</p>

        <button type="submit" className={styles.submitBtn}>
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