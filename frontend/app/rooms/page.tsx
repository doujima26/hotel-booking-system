"use client";

import { useState } from "react";
import api from "@/lib/api";

const hotels = [
    { id: "1", name: "Hà Nội" },
    { id: "2", name: "Tuyên Quang" },
    { id: "3", name: "TP.HCM" },
];

interface Room {
  room_id: number;
  room_number: string;
  room_type: string;
  price: number;
  status: string;
}

export default function RoomsPage() {
  const [hotelId, setHotelId] = useState(hotels[0].id);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(false);

  const searchRooms = async () => {
    if (!checkIn || !checkOut) {
      alert("Vui lòng chọn ngày");
      return;
    }

    try {
      setLoading(true);

      const res = await api.get(
        `/rooms/available/${hotelId}?check_in=${checkIn}&check_out=${checkOut}`
      );

      setRooms(res.data);
    } catch (err: any) {
      alert("Lỗi tìm phòng");
      console.log(err.response?.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-10 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Tìm phòng</h1>

      {/* Form tìm kiếm */}
      <div className="flex flex-col gap-4 mb-8 border p-6 rounded-lg shadow">
        <select
            className="border p-2"
            value={hotelId}
            onChange={(e) => setHotelId(e.target.value)}
        >
            {hotels.map((hotel) => (
                <option key={hotel.id} value={hotel.id}>
                    {hotel.name}
                </option>
            ))}
        </select>

        <input
          type="date"
          className="border p-2"
          onChange={(e) => setCheckIn(e.target.value)}
        />

        <input
          type="date"
          className="border p-2"
          onChange={(e) => setCheckOut(e.target.value)}
        />

        <button
          className="bg-blue-600 text-white p-2 rounded"
          onClick={searchRooms}
        >
          {loading ? "Đang tìm..." : "Tìm phòng"}
        </button>
      </div>

      {/* Danh sách phòng */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {rooms.map((room) => (
          <div
            key={room.room_id}
            className="border p-4 rounded shadow hover:shadow-lg transition"
          >
            <h2 className="text-xl font-semibold">
              Phòng {room.room_number}
            </h2>
            <p>Loại: {room.room_type}</p>
            <p>Giá: {room.price} VND</p>
            <p>Trạng thái: {room.status}</p>

            <button className="mt-3 bg-green-600 text-white px-4 py-2 rounded">
              Đặt phòng
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}