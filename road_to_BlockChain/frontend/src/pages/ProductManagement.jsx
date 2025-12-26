// src/pages/ProductManagementPage.jsx
import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
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
  ArrowLeft,
  Truck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { FastTrackDB } from "../utils/fast_track_db";

/* ====== Subcomponents ====== */
function StatusBadge({ status }) {
  const map = {
    "Đã kiểm định": "bg-green-100 text-green-700 ring-1 ring-green-200",
    "Đang chờ kiểm định": "bg-amber-100 text-amber-700 ring-1 ring-amber-200",
  };
  return (
    <span
      className={`px - 3 py - 1 rounded - full text - [13px] font - semibold ${map[status] || "bg-slate-100 text-slate-700 ring-1 ring-slate-200"
        } `}
    >
      {status}
    </span>
  );
}

function ProductCard({ p, onEdit, onDelete, onCreateOrder }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className="group bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border border-white/40 dark:border-white/10 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
    >
      {/* Media */}
      <div className="relative aspect-[16/10] overflow-hidden">
        {p.image ? (
          <img
            src={p.image}
            alt={p.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full grid place-items-center bg-slate-100 dark:bg-slate-700 text-slate-400">
            <ImageOff className="w-8 h-8" />
          </div>
        )}
        {/* Overlay + badges */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <StatusBadge status={p.status} />
          <span className="px-2.5 py-1 rounded-full text-[12px] font-semibold bg-white/90 dark:bg-slate-800/90 text-slate-700 dark:text-slate-200 ring-1 ring-slate-200 dark:ring-slate-600">
            {p.qrCode}
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="p-5 space-y-3">
        <h3 className="text-[18px] font-semibold text-slate-900 dark:text-white leading-snug line-clamp-2 flex items-start gap-2">
          <Package className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
          {p.name}
        </h3>

        <div className="text-[14.5px] text-slate-700 dark:text-slate-300 space-y-1.5">
          <p className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-slate-400" />
            <span className="text-slate-500 dark:text-slate-400">Loại:</span>&nbsp;{p.type}
          </p>
          <p className="flex items-center gap-2">
            <Factory className="w-4 h-4 text-slate-400" />
            {p.supplier}
          </p>
          <p className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span className="text-slate-500 dark:text-slate-400">Ngày nhập:</span>&nbsp;{p.date}
          </p>
          <p className="text-slate-500 dark:text-slate-400 italic line-clamp-2">{p.note}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="px-5 py-4 border-t border-slate-100 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/50">
        <div className="flex items-center justify-between mb-3">
          <div className="text-[13px] text-slate-500 dark:text-slate-400 flex items-center gap-2">
            <QrCode className="w-4 h-4" />
            {p.qrCode}
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => onCreateOrder(p)}
            className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-200 dark:hover:bg-emerald-800/50 font-medium text-[14px] transition-colors"
            title="Tạo vận đơn nhanh"
          >
            <Truck className="w-4 h-4" /> Vận đơn
          </button>
          <button
            onClick={() => onEdit(p)}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-200 dark:hover:bg-indigo-800/50 font-medium text-[14px] transition-colors"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(p.id)}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-300 hover:bg-rose-200 dark:hover:bg-rose-800/50 font-medium text-[14px] transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

/* ====== Page ====== */
export default function ProductManagementPage() {
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("Tất cả");

  const [products, setProducts] = useState([
    {
      id: 1,
      name: "Táo đỏ Fuji",
      qrCode: "QR-TAO-001",
      supplier: "Nông trại Đà Lạt Xanh",
      type: "Trái cây tươi",
      date: "27/12/2024",
      note: "Táo đỏ Fuji nhập khẩu, bảo quản lạnh 2-4°C, hạn sử dụng 14 ngày",
      status: "Đã kiểm định",
      image: "/assets/tao do.jpg",
    },
    {
      id: 2,
      name: "Lê vàng",
      qrCode: "QR-LE-002",
      supplier: "Vườn Trái Cây Mekong",
      type: "Trái cây tươi",
      date: "27/12/2024",
      note: "Lê vàng tươi ngọt, giàu chất xơ, bảo quản lạnh 3-5°C, hạn sử dụng 10 ngày",
      status: "Đã kiểm định",
      image: "/assets/trai le.jpg",
    },
    {
      id: 3,
      name: "Cam vàng Úc",
      qrCode: "QR-CAM-003",
      supplier: "Nhập khẩu Australia Fresh",
      type: "Trái cây nhập khẩu",
      date: "26/12/2024",
      note: "Cam vàng Úc ngọt thanh, giàu Vitamin C, bảo quản 5-8°C, hạn sử dụng 21 ngày",
      status: "Đã kiểm định",
      image: "/assets/trai cam.jpg",
    },
    {
      id: 4,
      name: "Quýt Tangerine",
      qrCode: "QR-QUYT-004",
      supplier: "Nông trại Cần Thơ",
      type: "Trái cây tươi",
      date: "26/12/2024",
      note: "Quýt Tangerine vỏ mỏng, ngọt đậm đà, bảo quản 4-6°C, hạn sử dụng 14 ngày",
      status: "Đang chờ kiểm định",
      image: "/assets/trai quyt.jpg",
    },
    {
      id: 5,
      name: "Hồng giòn (Crispy Persimmons)",
      qrCode: "QR-HONG-005",
      supplier: "Vườn Hồng Đà Lạt",
      type: "Trái cây mùa",
      date: "25/12/2024",
      note: "Hồng giòn ngọt thanh, giòn tan, bảo quản lạnh 2-4°C, hạn sử dụng 14 ngày",
      status: "Đã kiểm định",
      image: "/assets/trai hong gion.jpg",
    },
    {
      id: 6,
      name: "Mận Water Apple (Roi)",
      qrCode: "QR-MAN-006",
      supplier: "Nông trại Bình Thuận",
      type: "Trái cây nhiệt đới",
      date: "25/12/2024",
      note: "Mận Water Apple giòn ngọt, nhiều nước, mát lạnh, bảo quản 5-7°C, hạn sử dụng 10 ngày",
      status: "Đã kiểm định",
      image: "/assets/qua roi.jpg",
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

  const handleCreateOrder = (p) => {
    if (confirm(`Tạo vận đơn cho sản phẩm "${p.name}"?`)) {
      FastTrackDB.createOrder(p);
      alert("Đã tạo vận đơn thành công! Chuyển sang vai trò 'Công ty vận tải' để kiểm tra.");
    }
  };

  const resetFilter = () => {
    setSearch("");
    setFilterType("Tất cả");
  };

  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#f8fafc] dark:bg-[#0f172a] transition-colors duration-500">
      {/* Animated Background Mesh */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[20%] -left-[10%] w-[60vw] h-[60vw] bg-purple-300/30 dark:bg-purple-900/20 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-screen animate-blob" />
        <div className="absolute top-[30%] -right-[10%] w-[50vw] h-[50vw] bg-blue-300/30 dark:bg-blue-900/20 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-screen animate-blob animation-delay-2000" />
        <div className="absolute -bottom-[20%] left-[20%] w-[50vw] h-[50vw] bg-pink-300/30 dark:bg-pink-900/20 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-screen animate-blob animation-delay-4000" />
      </div>

      {/* Main Content */}
      <main className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-10 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap items-center justify-between gap-4 mb-8"
        >
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/dashboard")}
              className="p-2 rounded-xl bg-white/60 dark:bg-slate-800/60 backdrop-blur-md border border-white/20 hover:bg-white dark:hover:bg-slate-700 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-300" />
            </button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400">
                Quản lý sản phẩm
              </h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                Tìm kiếm, lọc và thao tác nhanh trên danh mục lô hàng.
              </p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => alert("Thêm sản phẩm mới (phát triển sau)")}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold shadow-lg hover:shadow-indigo-500/30 transition-all text-sm"
          >
            <PlusCircle className="w-5 h-5" /> Thêm sản phẩm
          </motion.button>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/40 dark:border-white/10 rounded-2xl shadow-lg p-4 sm:p-5 flex flex-wrap items-center gap-3 mb-8"
        >
          <div className="relative flex-1 min-w-[260px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Tìm theo tên / mã QR / nhà cung cấp…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 focus:ring-2 focus:ring-indigo-400 text-[15px] text-slate-800 dark:text-slate-200 placeholder:text-slate-400 transition-all"
            />
          </div>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 text-[15px] text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-indigo-400 transition-all"
          >
            <option>Tất cả</option>
            <option>Đang chờ kiểm định</option>
            <option>Đã kiểm định</option>
          </select>

          <button
            onClick={resetFilter}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-700 text-[15px] text-slate-700 dark:text-slate-300 transition-all"
          >
            <RefreshCw className="w-5 h-5" /> Làm mới
          </button>
        </motion.div>

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
                  onCreateOrder={handleCreateOrder}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}