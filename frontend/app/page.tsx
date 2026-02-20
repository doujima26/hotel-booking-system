export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header đơn giản */}
      <header className="bg-blue-600 p-6 text-white shadow-md">
        <h1 className="text-3xl font-bold">Hotel Booking</h1>
        <p className="text-sm">Tìm kiếm chỗ nghỉ chân lý tưởng cho bạn</p>
      </header>

      {/* Phần tìm kiếm */}
      <section className="container mx-auto mt-10 p-4">
        <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">Địa điểm</label>
            <input 
              type="text" 
              placeholder="Bạn muốn đi đâu?" 
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">Ngày nhận phòng</label>
            <input type="date" className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
          </div>
          <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-6 rounded-md transition">
            Tìm kiếm
          </button>
        </div>
      </section>

      {/* Gợi ý khách sạn (Placeholder) */}
      <section className="container mx-auto mt-10 p-4">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Khách sạn nổi bật</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg overflow-hidden shadow">
            <div className="h-48 bg-gray-200 flex items-center justify-center text-gray-500 italic">Ảnh khách sạn</div>
            <div className="p-4">
              <h3 className="font-bold">Hotel Luxury Plaza</h3>
              <p className="text-gray-600 text-sm">Hà Nội, Việt Nam</p>
              <p className="text-blue-600 font-bold mt-2">1,200,000đ / đêm</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}