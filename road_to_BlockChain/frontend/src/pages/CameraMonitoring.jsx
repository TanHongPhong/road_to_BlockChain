import React, { useEffect, useState } from "react";
import {
  Search,
  Filter,
  ChevronDown,
  Home,
  Map,
  FileText,
  Bell,
  User,
  Settings,
  QrCode,
  MapPin,
  Phone,
  Camera,
  Circle,
  Pause,
  ArrowLeft,
  Maximize2,
  MoreVertical,
  RotateCcw,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

import { CameraCard } from "../components/monitoring/CameraCard.jsx";

export default function CameraMonitoring() {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Giám sát Camera - Quản lý trái cây";
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#f8fafc] dark:bg-[#0f172a] text-slate-900 dark:text-slate-100 transition-colors duration-500 font-sans">
      {/* Animated Background Mesh */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[20%] -left-[10%] w-[60vw] h-[60vw] bg-purple-300/30 dark:bg-purple-900/20 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-screen animate-blob" />
        <div className="absolute top-[30%] -right-[10%] w-[50vw] h-[50vw] bg-blue-300/30 dark:bg-blue-900/20 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-screen animate-blob animation-delay-2000" />
        <div className="absolute -bottom-[20%] left-[20%] w-[50vw] h-[50vw] bg-pink-300/30 dark:bg-pink-900/20 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-screen animate-blob animation-delay-4000" />
      </div>

      <div className="relative z-10 flex min-h-screen">
        {/* ===== SIDEBAR ===== */}
        <motion.aside
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="fixed inset-y-0 left-0 w-20 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border-r border-slate-200/50 dark:border-slate-800/50 flex flex-col items-center gap-4 p-4 z-40 shadow-xl"
        >
          <div className="mb-2 text-center">
            <span className="inline-grid place-items-center w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/30">
              <Camera className="w-6 h-6" />
            </span>
          </div>

          <nav className="flex flex-col items-center gap-4 w-full">
            <SidebarButton active icon={<Home />} title="Trang chủ" onClick={() => navigate('/role-dashboard')} />
            <SidebarButton icon={<Map />} title="Vị trí" />
            <SidebarButton icon={<FileText />} title="Giao dịch" />

            <div className="w-8 h-[1px] bg-slate-200 dark:bg-slate-700 my-1" />

            <div className="relative">
              <SidebarButton icon={<Bell />} title="Thông báo" />
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white dark:ring-slate-900" />
            </div>
            <SidebarButton icon={<User />} title="Người dùng" />
          </nav>

          <div className="mt-auto flex flex-col gap-4">
            <SidebarButton icon={<Settings />} title="Cài đặt" />
          </div>
        </motion.aside>

        {/* ===== MAIN CONTENT ===== */}
        <main className="ml-20 flex-1 flex flex-col min-h-screen">
          {/* ===== HEADER ===== */}
          <header className="h-16 sticky top-0 z-30 px-6 flex items-center justify-between">
            {/* Glass background for header only when scrolling? Or just keep it clean/transparent? 
                 Let's make it slightly glass to distinguish from content scrolling under it. */}
            <div className="absolute inset-0 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md border-b border-white/20 dark:border-white/5 pointer-events-none" />

            <div className="relative z-10 flex items-center justify-between w-full">
              {/* Left: Breadcrumbs / Title */}
              <div className="flex items-center gap-4">
                <button
                  onClick={() => navigate(-1)}
                  className="p-2 rounded-xl bg-white/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-700 transition-colors border border-white/20"
                >
                  <ArrowLeft className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                </button>
                <div>
                  <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300">
                    Giám sát Camera
                  </h1>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Kho A • Khu vực nhập hàng</p>
                </div>
              </div>

              {/* Center: Search */}
              <div className="hidden md:block flex-1 max-w-lg mx-6">
                <div className="relative group">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm camera, khu vực..."
                    className="w-full h-10 pl-10 pr-12 rounded-xl border border-slate-200/60 dark:border-slate-700/60 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-sm transition-all text-sm"
                  />
                  <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 font-medium transition-colors">
                    <Filter className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Right: User */}
              <div className="flex items-center gap-3">
                <button className="p-2 rounded-xl hover:bg-white/50 dark:hover:bg-slate-800/50 text-slate-600 dark:text-slate-300 transition-colors">
                  <Bell className="w-5 h-5" />
                </button>
                <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-700" />
                <div className="flex items-center gap-3 pl-1 cursor-pointer group">
                  <div className="text-right hidden sm:block">
                    <div className="text-sm font-semibold text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">Harsh Vani</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">Quản lý kho</div>
                  </div>
                  <img
                    src="https://i.pravatar.cc/150?img=11"
                    alt="Avatar"
                    className="w-10 h-10 rounded-full ring-2 ring-white dark:ring-slate-800 shadow-md object-cover"
                  />
                </div>
              </div>
            </div>
          </header>

          {/* ===== CONTENT ===== */}
          <div className="flex-1 p-6 lg:p-8 overflow-hidden">
            <div className="flex flex-col lg:flex-row gap-6 h-full">

              {/* LEFT: CAMERA FEED */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full lg:w-3/4 flex flex-col gap-4"
              >
                {/* Camera Container */}
                <div className="relative group rounded-3xl overflow-hidden bg-slate-900 border border-slate-700/50 shadow-2xl ring-1 ring-white/10 p-1">
                  <CameraCard
                    className="w-full h-auto"
                    cameraId="A01"
                    showControls={true}
                  />
                </div>
              </motion.div>

              {/* RIGHT: INFO PANEL */}
              <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="w-full lg:w-1/4 flex flex-col gap-5 min-w-[320px]"
              >
                {/* Status Card */}
                <div className="p-5 rounded-2xl bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border border-white/40 dark:border-white/5 shadow-lg">
                  <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">Trạng thái</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Kết nối</span>
                      <span className="flex items-center gap-1.5 text-emerald-600 text-sm font-semibold">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        Ổn định
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Băng thông</span>
                      <span className="text-sm font-mono text-slate-600 dark:text-slate-400">4.2 MB/s</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Độ trễ</span>
                      <span className="text-sm font-mono text-slate-600 dark:text-slate-400">24ms</span>
                    </div>
                  </div>
                </div>

                {/* Detected Object Card */}
                <InfoCardMinimal
                  product={{
                    name: "Cam Sành Tiền Giang",
                    type: "Trái cây tươi",
                    weight: "12.4 kg",
                    qr: "QR-985123",
                    status: "Đang chờ kiểm định",
                    dateIn: "14/10/2025",
                    note: "Hàng tươi, chưa phân loại.",
                  }}
                  supplier={{
                    name: "GreenFarm Co., Ltd",
                    contact: "Nguyễn Văn A",
                    address: "Tân Phước, Tiền Giang",
                    phone: "0908 123 456",
                  }}
                />

                {/* Alerts */}
                <AlertCard
                  tone="rose"
                  title="Cảnh báo an ninh"
                  message="Phát hiện chuyển động bất thường tại khu vực cổng sau."
                />

              </motion.div>
            </div>
          </div>
        </main>
      </div>

      {/* Global Styles for Animations */}
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

/* ===== Reusable Components ===== */
const SidebarButton = ({ icon, title, active, onClick }) => (
  <button
    onClick={onClick}
    className={`w-12 h-12 rounded-xl grid place-items-center transition-all duration-300 relative group ${active ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400'}`}
  >
    {icon}
    <div className="absolute left-14 px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-medium opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all pointer-events-none whitespace-nowrap z-50">
      {title}
      <div className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 w-2 h-2 bg-slate-900 rotate-45" />
    </div>
  </button>
);

const ControlButton = ({ icon, label, onClick, active, color = "white" }) => {
  const activeClass = color === "rose" ? "text-rose-500" : "text-white";
  const bgClass = active ? "bg-white/10" : "hover:bg-white/10";

  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-1.5 group ${activeClass}`}
    >
      <div className={`p-3 rounded-full border border-white/10 transition-all ${bgClass} ${active ? 'ring-2 ring-rose-500/50' : ''}`}>
        {icon}
      </div>
      <span className="text-[10px] font-medium text-neutral-400 group-hover:text-white transition-colors">{label}</span>
    </button>
  )
}

function AlertCard({ title, message, tone = "rose", className = "" }) {
  const tones = {
    rose: "border-rose-200/50 bg-rose-50/50 text-rose-800 dark:border-rose-900/50 dark:bg-rose-900/20 dark:text-rose-200",
    amber: "border-amber-200/50 bg-amber-50/50 text-amber-800 dark:border-amber-900/50 dark:bg-amber-900/20 dark:text-amber-200",
    sky: "border-sky-200/50 bg-sky-50/50 text-sky-800 dark:border-sky-900/50 dark:bg-sky-900/20 dark:text-sky-200",
  };
  return (
    <div className={`rounded-2xl p-4 border backdrop-blur-md ${tones[tone]} ${className} shadow-sm`}>
      <div className="flex items-start gap-3">
        <div className="mt-0.5 p-1 rounded-full bg-white/40 dark:bg-black/20">
          <Bell className="w-4 h-4" />
        </div>
        <div>
          <div className="font-semibold text-sm mb-1">{title}</div>
          <p className="text-xs opacity-90 leading-relaxed">{message}</p>
        </div>
      </div>
    </div>
  );
}

/* ===== Info Card ===== */
function InfoCardMinimal({ product = {}, supplier = {} }) {
  return (
    <section className="rounded-2xl bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border border-white/40 dark:border-white/5 shadow-lg overflow-hidden flex flex-col h-auto">
      {/* Header */}
      <header className="px-5 py-4 bg-gradient-to-r from-slate-50/50 to-white/50 dark:from-slate-800/50 dark:to-slate-700/50 border-b border-slate-200/50 dark:border-slate-700/50 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white leading-tight line-clamp-1">
            {product.name || "—"}
          </h3>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 flex flex-wrap items-center gap-x-2">
            <span className="font-medium text-indigo-600 dark:text-indigo-400">{product.type || "—"}</span>
            <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600"></span>
            <span>{product.dateIn || "—"}</span>
          </p>
        </div>
        <div className="shrink-0">
          {product.qr ? (
            <div className="p-2 rounded-xl bg-white dark:bg-slate-700 shadow-sm border border-slate-100 dark:border-slate-600">
              <QrCode className="w-6 h-6 text-slate-800 dark:text-white" />
            </div>
          ) : null}
        </div>
      </header>

      {/* Body */}
      <div className="p-5 space-y-5">
        <div className="flex items-center justify-between">
          <span className="px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-xs font-semibold border border-amber-100 dark:border-amber-800">
            {product.status}
          </span>
          <span className="text-sm font-mono font-medium text-slate-600 dark:text-slate-400">{product.weight}</span>
        </div>

        <Divider />

        <div className="space-y-4">
          <SectionLabel icon={<User className="w-3.5 h-3.5" />}>Nhà cung cấp</SectionLabel>
          <div className="pl-6 space-y-3">
            <div className="text-sm font-medium text-slate-800 dark:text-slate-200">{supplier.name}</div>
            <div className="flex items-start gap-2 text-xs text-slate-500 dark:text-slate-400">
              <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <span>{supplier.address}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <Phone className="w-3.5 h-3.5 shrink-0" />
              <span>{supplier.phone}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ===== Atoms ===== */
const SectionLabel = ({ children, icon }) => (
  <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
    {icon}
    <h4 className="text-xs font-semibold uppercase tracking-wider">{children}</h4>
  </div>
);

const Divider = () => <hr className="border-t border-slate-200/50 dark:border-slate-700/50" />;
