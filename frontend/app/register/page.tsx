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
    name: "", phone: "", dob: "", password: "", confirmPassword: "", hotelId: "", secretKey: "",
  });

  const validateEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    let newErrors: any = { name: "", phone: "", dob: "", password: "", confirmPassword: "", hotelId: "", secretKey: "" };
    let hasError = false;

    if (!name.trim()) { newErrors.name = "Vui lòng nhập tên"; hasError = true; }
    if (!/^[0-9]{9,11}$/.test(phone)) { newErrors.phone = "SĐT không hợp lệ"; hasError = true; }
    if (!dob) { newErrors.dob = "Chọn ngày sinh"; hasError = true; }
    if (password.length < 8) { newErrors.password = "Tối thiểu 8 ký tự"; hasError = true; }
    if (password !== confirmPassword) { newErrors.confirmPassword = "Mật khẩu không khớp"; hasError = true; }
    if ((role === "admin" || role === "staff") && !hotelId.trim()) { newErrors.hotelId = "Nhập mã chi nhánh"; hasError = true; }
    if ((role === "admin" || role === "staff") && !secretKey.trim()) { newErrors.secretKey = "Nhập mã xác thực"; hasError = true; }

    setErrors(newErrors);
    if (hasError) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name, email, password, phone_number: phone, role, dob,
          hotel_id: (role === "admin" || role === "staff") ? Number(hotelId) : null,
          secret_key: (role === "admin" || role === "staff") ? secretKey : null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Đăng ký thất bại");
      router.push("/login");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.registerCard}>
        {/* Progress Bar */}
        <div className={styles.stepper}>
          <div className={`${styles.step} ${step === "email" ? styles.active : ""} ${step !== "email" ? styles.completed : ""}`}>1</div>
          <div className={styles.line}></div>
          <div className={`${styles.step} ${step === "role" ? styles.active : ""} ${step === "form" ? styles.completed : ""}`}>2</div>
          <div className={styles.line}></div>
          <div className={`${styles.step} ${step === "form" ? styles.active : ""}`}>3</div>
        </div>

        {/* STEP 1: EMAIL */}
        {step === "email" && (
          <div className={styles.content}>
            <h1 className={styles.title}>Bắt đầu ngay</h1>
            <p className={styles.subtitle}>Nhập email của bạn</p>
            <div className={styles.inputGroup}>
              <input
                type="email"
                className={`${styles.input} ${emailError ? styles.inputError : ""}`}
                placeholder="ten-cua-ban@gmail.com"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setEmailError(""); }}
              />
              {emailError && <p className={styles.errorMessage}>{emailError}</p>}
            </div>
            <button
              className={styles.primaryBtn}
              onClick={() => {
                if (!validateEmail(email)) {
                  setEmailError("Địa chỉ email không hợp lệ.");
                  return;
                }
                setStep("role");
              }}
            >
              Tiếp tục
            </button>
          </div>
        )}

        {/* STEP 2: ROLE */}
        {step === "role" && (
          <div className={styles.content}>
            <button className={styles.backLink} onClick={() => setStep("email")}>← Quay lại</button>
            <h1 className={styles.title}>Bạn là ai?</h1>
            <p className={styles.subtitle}>Chọn vai trò phù hợp để chúng tôi thiết lập không gian cho bạn</p>
            <div className={styles.roleGrid}>
              {[
                { id: "user", label: "Khách hàng", desc: "Đặt phòng & Trải nghiệm" },
                { id: "staff", label: "Nhân viên", desc: "Quản lý phòng & Dịch vụ" },
                { id: "admin", label: "Quản lý", desc: "Điều hành toàn bộ chi nhánh" }
              ].map((r) => (
                <button
                  key={r.id}
                  className={styles.roleCard}
                  onClick={() => { setRole(r.id); setStep("form"); }}
                >
                  <span className={styles.roleLabel}>{r.label}</span>
                  <span className={styles.roleDesc}>{r.desc}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 3: FORM */}
        {step === "form" && (
          <div className={styles.content}>
            <button className={styles.backLink} onClick={() => setStep("role")}>← Quay lại bước chọn vai trò</button>
            <h1 className={styles.title}>Thông tin cá nhân</h1>
            <p className={styles.subtitle}>Sắp hoàn tất! Chỉ cần một vài thông tin nữa thôi.</p>
            
            <form className={styles.form} onSubmit={handleRegister}>
              <div className={styles.formGrid}>
                <div className={styles.inputGroup}>
                  <label>Họ và tên</label>
                  <input className={errors.name ? styles.inputError : ""} value={name} onChange={(e) => setName(e.target.value)} placeholder="Nguyễn Văn A" />
                  {errors.name && <p className={styles.errorMessage}>{errors.name}</p>}
                </div>

                <div className={styles.inputGroup}>
                  <label>Số điện thoại</label>
                  <input className={errors.phone ? styles.inputError : ""} value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="09xxxxxxxx" />
                  {errors.phone && <p className={styles.errorMessage}>{errors.phone}</p>}
                </div>

                <div className={styles.inputGroup}>
                  <label>Ngày sinh</label>
                  <input type="date" className={errors.dob ? styles.inputError : ""} value={dob} onChange={(e) => setDob(e.target.value)} />
                  {errors.dob && <p className={styles.errorMessage}>{errors.dob}</p>}
                </div>

                <div className={styles.inputGroup}>
                  <label>Mật khẩu</label>
                  <input type="password" className={errors.password ? styles.inputError : ""} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
                  {errors.password && <p className={styles.errorMessage}>{errors.password}</p>}
                </div>

                <div className={styles.inputGroup}>
                  <label>Xác nhận mật khẩu</label>
                  <input type="password" className={errors.confirmPassword ? styles.inputError : ""} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••" />
                  {errors.confirmPassword && <p className={styles.errorMessage}>{errors.confirmPassword}</p>}
                </div>

                {(role === "admin" || role === "staff") && (
                  <>
                    <div className={styles.inputGroup}>
                      <label>Mã chi nhánh</label>
                      <input className={errors.hotelId ? styles.inputError : ""} value={hotelId} onChange={(e) => setHotelId(e.target.value)} placeholder="ID" />
                      {errors.hotelId && <p className={styles.errorMessage}>{errors.hotelId}</p>}
                    </div>
                    <div className={styles.inputGroup}>
                      <label>Mã xác thực nội bộ</label>
                      <input type="password" className={errors.secretKey ? styles.inputError : ""} value={secretKey} onChange={(e) => setSecretKey(e.target.value)} placeholder="Secret Key" />
                      {errors.secretKey && <p className={styles.errorMessage}>{errors.secretKey}</p>}
                    </div>
                  </>
                )}
              </div>

              {error && <p className={styles.mainError}>{error}</p>}

              <button type="submit" className={styles.primaryBtn}>Hoàn tất đăng ký</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}