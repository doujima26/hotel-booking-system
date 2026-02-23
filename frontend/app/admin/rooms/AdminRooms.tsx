"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import styles from "./AdminRooms.module.css";
import api from "@/lib/api";

export default function AdminRooms() {
  const [rooms, setRooms] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [roomNumber, setRoomNumber] = useState("");
  const [roomType, setRoomType] = useState("");
  const [price, setPrice] = useState("");

  const router = useRouter();
  const pathname = usePathname();
  const isEdit = pathname === "/admin/rooms";
  const isStatus = pathname === "/admin/rooms/status";

  const [errors, setErrors] = useState({ roomNumber: "", roomType: "", price: "" });

  const loadRooms = async () => {
    try {
      const res = await api.get("/rooms/get_my_branch_rooms");
      setRooms(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => { loadRooms(); }, []);

  const resetForm = () => {
    setSelectedId(null);
    setRoomNumber("");
    setRoomType("");
    setPrice("");
    setErrors({ roomNumber: "", roomType: "", price: "" });
  };

  const validate = () => {
    let newErrors = { roomNumber: "", roomType: "", price: "" };
    let hasError = false;
    if (!roomNumber.trim()) { newErrors.roomNumber = "Nhập số phòng"; hasError = true; }
    if (!roomType.trim()) { newErrors.roomType = "Nhập loại phòng"; hasError = true; }
    if (!price || Number(price) <= 0) { newErrors.price = "Giá phải > 0"; hasError = true; }
    setErrors(newErrors);
    return !hasError;
  };

  const createRoom = async () => {
    if (!validate()) return;
    try {
      await api.post("/rooms", { room_number: roomNumber, room_type: roomType, price: Number(price), status: "available" });
      resetForm();
      loadRooms();
    } catch (error: any) { alert(error.response?.data?.detail || "Thất bại"); }
  };

  const updateRoom = async () => {
    if (!selectedId || !validate()) return;
    try {
      const selectedRoom = rooms.find((r) => r.room_id === selectedId);
      await api.put(`/rooms/${selectedId}`, { room_number: roomNumber, room_type: roomType, price: Number(price), status: selectedRoom?.status || "available" });
      resetForm();
      loadRooms();
    } catch (error: any) { alert(error.response?.data?.detail || "Thất bại"); }
  };

  const deleteRoom = async () => {
    if (!selectedId || !confirm("Xác nhận xóa phòng này?")) return;
    try {
      await api.delete(`/rooms/${selectedId}`);
      resetForm();
      loadRooms();
    } catch (error: any) { alert(error.response?.data?.detail || "Thất bại"); }
  };

  return (
    <div className={styles.adminWrapper}>
      {/* HEADER SECTION */}
      <div className={styles.headerArea}>
        <div>
          <h1 className={styles.pageTitle}>Quản lý phòng</h1>
          <p className={styles.pageSubtitle}>Thiết lập và chỉnh sửa danh sách phòng trong chi nhánh</p>
        </div>

        <div className={styles.tabGroup}>
          <button
            className={isStatus ? styles.activeTab : styles.tab}
            onClick={() => router.push("/admin/rooms/status")}
          >
            Trạng thái phòng
          </button>
          <button
            className={isEdit ? styles.activeTab : styles.tab}
            onClick={() => router.push("/admin/rooms")}
          >
            Chỉnh sửa phòng
          </button>
        </div>
      </div>

      <div className={styles.contentGrid}>
        {/* LEFT: FORM SECTION */}
        <div className={styles.formCard}>
          <h2 className={styles.cardTitle}>{selectedId ? "Cập nhật phòng" : "Thêm phòng mới"}</h2>
          
          <div className={styles.inputGroup}>
            <label>Số phòng</label>
            <input
              placeholder="Ví dụ: 101"
              value={roomNumber}
              onChange={(e) => { setRoomNumber(e.target.value); setErrors({ ...errors, roomNumber: "" }); }}
              className={errors.roomNumber ? styles.inputError : ""}
            />
            {errors.roomNumber && <span className={styles.errorText}>{errors.roomNumber}</span>}
          </div>

          <div className={styles.inputGroup}>
            <label>Loại phòng</label>
            <input
              placeholder="Ví dụ: Deluxe Suite"
              value={roomType}
              onChange={(e) => { setRoomType(e.target.value); setErrors({ ...errors, roomType: "" }); }}
              className={errors.roomType ? styles.inputError : ""}
            />
            {errors.roomType && <span className={styles.errorText}>{errors.roomType}</span>}
          </div>

          <div className={styles.inputGroup}>
            <label>Giá (VND)</label>
            <input
              type="number"
              placeholder="Nhập giá phòng"
              value={price}
              onChange={(e) => { setPrice(e.target.value); setErrors({ ...errors, price: "" }); }}
              className={errors.price ? styles.inputError : ""}
            />
            {errors.price && <span className={styles.errorText}>{errors.price}</span>}
          </div>

          <div className={styles.formActions}>
            {!selectedId ? (
              <button className={styles.btnPrimary} onClick={createRoom}>Tạo phòng mới</button>
            ) : (
              <>
                <button className={styles.btnUpdate} onClick={updateRoom}>Lưu cập nhật</button>
                <button className={styles.btnDelete} onClick={deleteRoom}>Xóa phòng</button>
              </>
            )}
            <button className={styles.btnReset} onClick={resetForm}>Hủy bỏ</button>
          </div>
        </div>

        {/* RIGHT: TABLE SECTION */}
        <div className={styles.tableCard}>
          <div className={styles.tableHeader}>
            <h3>Danh sách chi tiết</h3>
            <button className={styles.btnRefresh} onClick={loadRooms}>Làm mới ↻</button>
          </div>
          
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>SỐ PHÒNG</th>
                  <th>LOẠI PHÒNG</th>
                  <th>GIÁ PHÒNG</th>
                  <th>TRẠNG THÁI</th>
                </tr>
              </thead>
              <tbody>
                {rooms.map((room) => (
                  <tr
                    key={room.room_id}
                    className={selectedId === room.room_id ? styles.selectedRow : ""}
                    onClick={() => {
                      setSelectedId(room.room_id);
                      setRoomNumber(room.room_number);
                      setRoomType(room.room_type);
                      setPrice(room.price);
                    }}
                  >
                    <td>#{room.room_id}</td>
                    <td className={styles.bold}>{room.room_number}</td>
                    <td>{room.room_type}</td>
                    <td>{Number(room.price).toLocaleString()}đ</td>
                    <td>
                      <span className={`${styles.statusBadge} ${styles[room.status]}`}>
                        {room.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}