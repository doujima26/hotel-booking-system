"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import styles from "./AdminRooms.module.css";

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

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("access_token")
      : null;

  const [errors, setErrors] = useState({
    roomNumber: "",
    roomType: "",
    price: "",
  });

  // ==============================
  // LOAD ROOMS
  // ==============================
  const loadRooms = async () => {
    try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/rooms/get_my_branch_rooms`,
          {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error("Không thể tải phòng");

      setRooms(data);
    } catch (err) {
      alert("Lỗi tải danh sách phòng");
    }
  };

  useEffect(() => {
    loadRooms();
  }, []);

  // ==============================
  // RESET FORM
  // ==============================
  const resetForm = () => {
    setSelectedId(null);
    setRoomNumber("");
    setRoomType("");
    setPrice("");
    setErrors({
      roomNumber: "",
      roomType: "",
      price: "",
    });
  };

  // ==============================
  // VALIDATE
  // ==============================
  const validate = () => {
    let newErrors = {
      roomNumber: "",
      roomType: "",
      price: "",
    };

    let hasError = false;

    if (!roomNumber.trim()) {
      newErrors.roomNumber = "Vui lòng nhập số phòng";
      hasError = true;
    }

    if (!roomType.trim()) {
      newErrors.roomType = "Vui lòng nhập loại phòng";
      hasError = true;
    }

    if (!price || Number(price) <= 0) {
      newErrors.price = "Giá phải lớn hơn 0";
      hasError = true;
    }

    setErrors(newErrors);
    return !hasError;
  };

  // ==============================
  // CREATE ROOM
  // ==============================
  const createRoom = async () => {
    if (!validate()) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/rooms`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          room_number: roomNumber,
          room_type: roomType,
          price: Number(price),
          status: "available",
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail);

      alert("Tạo phòng thành công!");
      resetForm();
      loadRooms();
    } catch (err: any) {
      alert(err.message);
    }
  };

  // ==============================
  // UPDATE ROOM
  // ==============================
  const updateRoom = async () => {
    if (!selectedId) return;
    if (!validate()) return;

    try {
      const selectedRoom = rooms.find(
        (r) => r.room_id === selectedId
      );

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/rooms/${selectedId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            room_number: roomNumber,
            room_type: roomType,
            price: Number(price),
            status: selectedRoom?.status || "available",
          }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail);

      alert("Cập nhật thành công!");
      resetForm();
      loadRooms();
    } catch (err: any) {
      alert(err.message);
    }
  };

  // ==============================
  // DELETE ROOM
  // ==============================
  const deleteRoom = async () => {
    if (!selectedId) return;
    if (!confirm("Bạn có chắc muốn xóa phòng này?"))
      return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/rooms/${selectedId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Xóa thất bại");

      alert("Xóa phòng thành công!");
      resetForm();
      loadRooms();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className={styles.adminWrapper}>
      {/* HEADER */}
      <div className={styles.headerCard}>
        <div className={styles.headerTitle}>
          Chỉnh sửa phòng
        </div>

        <div className={styles.headerButtons}>
          <button
            className={
              isStatus
                ? styles.headerBtnDark
                : styles.headerBtnLight
            }
            onClick={() =>
              router.push("/admin/rooms/status")
            }
          >
            Trạng thái phòng
          </button>

          <button
            className={
              isEdit
                ? styles.headerBtnDark
                : styles.headerBtnLight
            }
            onClick={() =>
              router.push("/admin/rooms")
            }
          >
            Chỉnh sửa phòng
          </button>
        </div>
      </div>

      {/* FORM */}
      <div className={styles.formSection}>
        <div className={styles.inputGroup}>
          <label className={styles.inputLabel}>
            Số phòng
          </label>
          <input
            className={styles.inputField}
            value={roomNumber}
            onChange={(e) => {
              setRoomNumber(e.target.value);
              setErrors({
                ...errors,
                roomNumber: "",
              });
            }}
          />
          {errors.roomNumber && (
            <div className={styles.errorText}>
              {errors.roomNumber}
            </div>
          )}
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.inputLabel}>
            Loại phòng
          </label>
          <input
            className={styles.inputField}
            value={roomType}
            onChange={(e) => {
              setRoomType(e.target.value);
              setErrors({
                ...errors,
                roomType: "",
              });
            }}
          />
          {errors.roomType && (
            <div className={styles.errorText}>
              {errors.roomType}
            </div>
          )}
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.inputLabel}>
            Giá (VND)
          </label>
          <input
            type="number"
            className={styles.inputField}
            value={price}
            onChange={(e) => {
              setPrice(e.target.value);
              setErrors({
                ...errors,
                price: "",
              });
            }}
          />
          {errors.price && (
            <div className={styles.errorText}>
              {errors.price}
            </div>
          )}
        </div>

        <div className={styles.buttonGroup}>
          <button
            className={styles.actionBtn}
            onClick={createRoom}
          >
            Thêm mới
          </button>
          <button
            className={styles.actionBtn}
            onClick={updateRoom}
          >
            Cập nhật
          </button>
          <button
            className={styles.actionBtn}
            onClick={deleteRoom}
          >
            Xóa
          </button>
          <button
            className={styles.actionBtn}
            onClick={loadRooms}
          >
            Làm mới
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className={styles.tableCard}>
        <div className={styles.tableHeader}>
          <div className={styles.tableHeaderRow}>
            <div>ID</div>
            <div>Số phòng</div>
            <div>Loại phòng</div>
            <div>Giá (VND)</div>
            <div>Trạng thái</div>
          </div>
        </div>

        <div className={styles.tableBody}>
          {rooms.map((room) => (
            <div
              key={room.room_id}
              className={`${styles.tableRow} ${
                selectedId === room.room_id
                  ? styles.selectedRow
                  : ""
              }`}
              onClick={() => {
                setSelectedId(room.room_id);
                setRoomNumber(room.room_number);
                setRoomType(room.room_type);
                setPrice(room.price);
              }}
            >
              <div>{room.room_id}</div>
              <div>{room.room_number}</div>
              <div>{room.room_type}</div>
              <div>{room.price}</div>
              <div>{room.status}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}