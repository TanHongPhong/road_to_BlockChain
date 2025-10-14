import React, { useState } from "react";
import {
  Search,
  RefreshCw,
  Package,
  QrCode,
  Factory,
  Calendar,
  Layers,
  Edit3,
  Trash2,
  PlusCircle,
} from "lucide-react";

export default function ProductManagement() {
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("Tất cả");

  const [products, setProducts] = useState([
    {
      id: 1,
      name: "Cam Sành Tiền Giang",
      type: "Trái cây tươi",
      qrCode: "QR-985123",
      weight: "12.4 kg",
      supplier: "Công ty TNHH GreenFarm",
      date: "14/10/2025",
      status: "Đang chờ kiểm định",
      note: "Hàng tươi, chưa phân loại.",
      image:
        "https://cdn.tgdd.vn/Files/2020/05/04/1252738/cong-dung-cua-cam-sanh-voi-suc-khoe-202005041702239325.jpg",
    },
    {
      id: 2,
      name: "Xoài Cát Hòa Lộc",
      type: "Trái cây tươi",
      qrCode: "QR-876543",
      weight: "10.2 kg",
      supplier: "Hợp tác xã Mekong Fruit",
      date: "13/10/2025",
      status: "Đã kiểm định",
      note: "Hàng loại 1, chất lượng cao.",
      image:
        "https://cdn.tgdd.vn/Files/2021/03/04/1330545/nhung-loai-xoai-ngon-nhat-viet-nam-202103041056223237.jpg",
    },
    {
      id: 3,
      name: "Sầu riêng Ri6",
      type: "Trái cây tươi",
      qrCode: "QR-654321",
      weight: "15 kg",
      supplier: "Trang trại Nam Bộ Fruit",
      date: "12/10/2025",
      status: "Đã kiểm định",
      note: "Hàng đạt chuẩn xuất khẩu.",
      image:
        "https://cdn.tgdd.vn/2021/06/CookProduct/saurieng-1200x676.jpg",
    },
  ]);

  const filtered = products.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.qrCode.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filterType === "Tất cả" || p.status === filterType;
    return matchSearch && matchFilter;
  });

  const handleDelete = (id) => setProducts(products.filter((p) => p.id !== id));
  const resetFilter = () => {
    setSearch("");
    setFilterType("Tất cả");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 font-[Inter] text-slate-800 flex flex-col text-[17px] leading-relaxed">
      {/* HEADER */}
      <header className="sticky top-0 z-40 bg-gradient-to-l from-blue-900 via-sky-200 to-white shadow-md border-b border-slate-200">
        <div className="max-w-8xl mx-auto px-12 py-5 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-sky-900 tracking-wide">
            🧺 Quản lý sản phẩm
          </h1>
          <button
            onClick={() => alert('Thêm sản phẩm mới (phát triển sau)')}
            className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-blue-600 text-white hover:bg-blue-700 shadow-sm text-lg"
          >
            <PlusCircle className="w-5 h-5" /> Thêm sản phẩm
          </button>
        </div>
      </header>

      {/* CONTENT */}
      <main className="flex-grow w-full max-w-8xl mx-auto px-12 py-10 space-y-12">
        {/* SEARCH + FILTER */}
        <div className="bg-white border border-slate-200 rounded-3xl shadow-md p-8 flex flex-wrap items-center justify-between gap-6">
          <div className="relative flex-1 min-w-[350px] max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm theo tên hoặc mã QR..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-5 py-3.5 rounded-2xl border border-gray-300 focus:ring-2 focus:ring-sky-400 text-gray-800 text-[17px]"
            />
          </div>

          <div className="flex gap-5">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-5 py-3.5 rounded-2xl border border-gray-300 bg-white focus:ring-2 focus:ring-sky-400 text-gray-800 text-[17px]"
            >
              <option>Tất cả</option>
              <option>Đang chờ kiểm định</option>
              <option>Đã kiểm định</option>
            </select>
            <button
              onClick={resetFilter}
              className="flex items-center gap-2 px-5 py-3.5 rounded-2xl border border-gray-300 bg-gray-50 hover:bg-gray-100 text-gray-800 text-[17px]"
            >
              <RefreshCw className="w-5 h-5" /> Làm mới
            </button>
          </div>
        </div>

        {/* PRODUCT GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-12">
          {filtered.length === 0 ? (
            <div className="col-span-full text-center text-gray-500 py-14 text-xl">
              Không có sản phẩm phù hợp.
            </div>
          ) : (
            filtered.map((p) => (
              <div
                key={p.id}
                className="bg-white border border-slate-200 rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 flex flex-col"
              >
                {/* HÌNH ẢNH */}
                <div className="relative h-64 w-full overflow-hidden">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="object-cover w-full h-full transform hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* THÔNG TIN */}
                <div className="flex-1 p-7 space-y-3">
                  <h2 className="text-2xl font-semibold text-sky-800 flex items-center gap-2">
                    <Package className="w-6 h-6 text-sky-500" /> {p.name}
                  </h2>

                  <div className="text-[16.5px] text-gray-800 space-y-1.5">
                    <p className="flex items-center gap-2">
                      <QrCode className="w-5 h-5 text-slate-500" /> {p.qrCode}
                    </p>
                    <p className="flex items-center gap-2">
                      <Layers className="w-5 h-5 text-slate-500" /> Loại: {p.type}
                    </p>
                    <p className="flex items-center gap-2">
                      <Factory className="w-5 h-5 text-slate-500" /> {p.supplier}
                    </p>
                    <p className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-slate-500" /> Ngày nhập:{" "}
                      {p.date}
                    </p>
                    <p className="text-gray-600 italic">{p.note}</p>
                  </div>
                </div>

                {/* TRẠNG THÁI + NÚT */}
                <div className="flex items-center justify-between px-7 py-5 border-t border-slate-100 bg-slate-50 text-[16.5px]">
                  <span
                    className={`px-4 py-1.5 rounded-full font-semibold ${
                      p.status === "Đã kiểm định"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {p.status}
                  </span>

                  <div className="flex gap-3">
                    <button
                      onClick={() => alert("Chỉnh sửa sản phẩm")}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-100 text-blue-700 hover:bg-blue-200 font-medium"
                    >
                      <Edit3 className="w-5 h-5" /> Sửa
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-100 text-red-600 hover:bg-red-200 font-medium"
                    >
                      <Trash2 className="w-5 h-5" /> Xóa
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
