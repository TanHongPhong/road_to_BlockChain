import React, { useMemo, useState, useRef, useEffect } from "react";
import feather from "feather-icons";
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
  ImageOff,
} from "lucide-react";
import Topbar from "@/components/tracking/Topbar";
import Sidebar from "@/components/tracking/Sidebar";

/* ====== Subcomponents ====== */
function StatusBadge({ status }) {
  const map = {
    "Đã kiểm định": "bg-green-100 text-green-700 ring-1 ring-green-200",
    "Đang chờ kiểm định": "bg-amber-100 text-amber-700 ring-1 ring-amber-200",
  };
  return (
    <span
      className={`px-3 py-1 rounded-full text-[13px] font-semibold ${
        map[status] || "bg-slate-100 text-slate-700 ring-1 ring-slate-200"
      }`}
    >
      {status}
    </span>
  );
}

function ProductCard({ p, onEdit, onDelete }) {
  return (
    <div className="group bg-white/85 backdrop-blur-sm border border-slate-200 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
      {/* Media */}
      <div className="relative aspect-[16/10] overflow-hidden">
        {p.image ? (
          <img
            src={p.image}
            alt={p.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full grid place-items-center bg-slate-100 text-slate-400">
            <ImageOff className="w-8 h-8" />
          </div>
        )}
        {/* Overlay + badges */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-70" />
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <StatusBadge status={p.status} />
          <span className="px-2.5 py-1 rounded-full text-[12px] font-semibold bg-white/90 text-slate-700 ring-1 ring-slate-200">
            {p.qrCode}
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="p-5 space-y-3">
        <h3 className="text-[18px] font-semibold text-slate-900 leading-snug line-clamp-2 flex items-start gap-2">
          <Package className="w-5 h-5 text-sky-500 shrink-0 mt-0.5" />
          {p.name}
        </h3>

        <div className="text-[14.5px] text-slate-700 space-y-1.5">
          <p className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-slate-400" />
            <span className="text-slate-600">Loại:</span>&nbsp;{p.type}
          </p>
          <p className="flex items-center gap-2">
            <Factory className="w-4 h-4 text-slate-400" />
            {p.supplier}
          </p>
          <p className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span className="text-slate-600">Ngày nhập:</span>&nbsp;{p.date}
          </p>
          <p className="text-slate-600 italic line-clamp-2">{p.note}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="px-5 py-4 border-t border-slate-100 bg-slate-50/70 flex items-center justify-between">
        <div className="text-[13px] text-slate-500 flex items-center gap-2">
          <QrCode className="w-4 h-4" />
          {p.qrCode}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(p)}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 font-medium text-[14px]"
          >
            <Edit3 className="w-4 h-4" /> Sửa
          </button>
          <button
            onClick={() => onDelete(p.id)}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 font-medium text-[14px]"
          >
            <Trash2 className="w-4 h-4" /> Xóa
          </button>
        </div>
      </div>
    </div>
  );
}

/* ====== Page ====== */
export default function ProductManagementPage() {
  const topbarRef = useRef(null);
  
  useEffect(() => {
    feather.replace();
    
    // Sync CSS var for topbar height
    const syncTopbar = () => {
      if (topbarRef.current) {
        document.documentElement.style.setProperty(
          "--topbar-h",
          `${topbarRef.current.offsetHeight}px`
        );
      }
    };
    syncTopbar();
    window.addEventListener("resize", syncTopbar);
    return () => window.removeEventListener("resize", syncTopbar);
  }, []);
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
        "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcSdaF-rEZU6dF6vER_aqD6bqL1LpVPX6aEvkjB5gnyFR9bZJFAMxwNxnkzCNstvX0qE2QJ7C3Ss4dcn27rQ9tFd0FCX2yGrPszAOWXD2zMg",
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
        "data:image/jpeg;base64,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",
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
        "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcS1-zxF539iJP-jkJs8v4nqOs_KaAEmFtcTeGDaTXfImt4SgbzZ8dWMvSaUr5idIh6v-Sro1DEYVNYFs20QJH_n89_5ZEEwZWBuiY1zEr0tlA",
    },
    {
      id: 4,
      name: "Măng cụt Lái Thiêu",
      type: "Trái cây tươi",
      qrCode: "QR-987654",
      weight: "12 kg",
      supplier: "Trang trại Bình Dương Fresh",
      date: "13/10/2025",
      status: "Đã kiểm định",
      note: "Vỏ tím đậm, cơm trắng, vị ngọt dịu tự nhiên.",
      image:
        "data:image/jpeg;base64,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",
    },
  ]);

  const filtered = useMemo(() => {
    const key = search.trim().toLowerCase();
    return products.filter((p) => {
      const matchSearch =
        !key ||
        p.name.toLowerCase().includes(key) ||
        p.qrCode.toLowerCase().includes(key) ||
        p.supplier.toLowerCase().includes(key);
      const matchFilter = filterType === "Tất cả" || p.status === filterType;
      return matchSearch && matchFilter;
    });
  }, [products, search, filterType]);

  const handleDelete = (id) =>
    setProducts((prev) => prev.filter((p) => p.id !== id));
  const handleEdit = (p) => alert(`Chỉnh sửa: ${p.name} (phát triển sau)`);
  const resetFilter = () => {
    setSearch("");
    setFilterType("Tất cả");
  };

  return (
    <>
      {/* Thanh bên & topbar cố định */}
      <Sidebar />
      <Topbar ref={topbarRef} />

      {/* Nội dung chừa chỗ cho Sidebar (w-20) & Topbar (h-16) */}
      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 text-slate-800 pl-20 pt-16">
        {/* Heading */}
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-[22px] sm:text-[26px] font-bold -tracking-[.01em] text-slate-900">
                Quản lý sản phẩm
              </h1>
              <p className="text-slate-500 text-[14px]">
                Tìm kiếm, lọc và thao tác nhanh trên danh mục lô hàng.
              </p>
            </div>
            <button
              onClick={() => alert("Thêm sản phẩm mới (phát triển sau)")}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 shadow-sm text-[14.5px] font-medium"
            >
              <PlusCircle className="w-5 h-5" /> Thêm sản phẩm
            </button>
          </div>
        </div>

        {/* Bộ lọc */}
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 pb-3">
          <div className="bg-white/85 backdrop-blur-sm border border-slate-200 rounded-2xl shadow-sm p-4 sm:p-5 flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[260px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Tìm theo tên / mã QR / nhà cung cấp…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-400 text-[15px] text-slate-800 placeholder:text-slate-400"
              />
            </div>

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-[15px] text-slate-800 focus:ring-2 focus:ring-sky-400"
            >
              <option>Tất cả</option>
              <option>Đang chờ kiểm định</option>
              <option>Đã kiểm định</option>
            </select>

            <button
              onClick={resetFilter}
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 hover:bg-slate-100 text-[15px] text-slate-800"
            >
              <RefreshCw className="w-5 h-5" /> Làm mới
            </button>
          </div>
        </div>

        {/* Lưới sản phẩm */}
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 pb-10">
          {filtered.length === 0 ? (
            <div className="grid place-items-center h-[42vh] rounded-2xl border border-dashed border-slate-300 bg-white/70">
              <div className="text-center space-y-2">
                <div className="inline-flex p-3 rounded-full bg-slate-100 text-slate-500">
                  <Search className="w-6 h-6" />
                </div>
                <div className="text-slate-800 font-semibold">
                  Không tìm thấy sản phẩm phù hợp
                </div>
                <p className="text-slate-500 text-[14.5px]">
                  Hãy thử đổi từ khóa, bỏ lọc trạng thái, hoặc thêm sản phẩm
                  mới.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 lg:gap-8">
              {filtered.map((p) => (
                <ProductCard
                  key={p.id}
                  p={p}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
