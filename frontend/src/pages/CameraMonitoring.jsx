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
} from "lucide-react";

import { CameraCard } from "../components/monitoring/CameraCard.jsx";

export default function CameraMonitoring() {
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    document.title = "Giám sát Camera - Quản lý trái cây";
  }, []);

  return (
    <div className="bg-slate-50 text-slate-900 flex min-h-screen">
      {/* ===== SIDEBAR ===== */}
      <aside className="fixed inset-y-0 left-0 w-20 bg-white border-r border-slate-200/70 flex flex-col items-center gap-3 p-3">
        <div className="mt-1 mb-1 text-center">
          <span className="inline-grid place-items-center w-14 h-14 rounded-xl bg-sky-50 text-sky-600 border border-sky-200/60">
            {/* Logo text thay vì icon */}
            <span className="text-xs font-bold tracking-wide">LGBT</span>
          </span>
          <div className="mt-1 text-[10px] font-semibold tracking-wide text-sky-700">
            Camera
          </div>
        </div>

        <div className="flex flex-col items-center gap-4 mt-3">
          <SidebarButton icon={<Home />} title="Trang chủ" />
          <SidebarButton icon={<Map />} title="Theo dõi vị trí" />
          <SidebarButton icon={<FileText />} title="Lịch sử giao dịch" />
          <div className="relative">
            <SidebarButton icon={<Bell />} title="Thông báo" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
          </div>
          <SidebarButton icon={<User />} title="Người dùng" />
          <SidebarButton icon={<Settings />} title="Cài đặt" />
        </div>
      </aside>

      {/* ===== MAIN CONTENT ===== */}
      <main className="ml-20 flex-grow flex flex-col">
        {/* ===== HEADER ===== */}
        <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-slate-200">
          <div className="flex items-center justify-between px-5 py-2.5">
            {/* Search */}
            <div className="flex-1 max-w-2xl mr-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm camera, khu vực..."
                  className="w-full h-10 pl-9 pr-24 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-200 focus:border-sky-300 bg-white"
                />
                <button
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-8 px-2 grid place-items-center rounded-lg border border-slate-200 hover:bg-slate-50"
                  title="Bộ lọc"
                >
                  <Filter className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* User */}
            <div className="group inline-flex items-center gap-2 pl-1 pr-2 py-1.5 rounded-full bg-white text-slate-900 border border-slate-200 hover:bg-slate-50 cursor-pointer">
              <img
                src="https://i.pravatar.cc/40?img=8"
                alt="Avatar"
                className="w-8 h-8 rounded-full object-cover"
              />
              <div className="text-left leading-tight hidden sm:block">
                <div className="text-[13px] font-semibold">Harsh Vani</div>
                <div className="text-[11px] text-slate-500 -mt-0.5">
                  Deportation Manager
                </div>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </div>
          </div>
        </header>

        {/* ===== CAMERA + INFO ===== */}
        <section className="p-6 flex-grow flex flex-col">
          {/* Title Row */}
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-[12px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                Camera #A01 • Đang hoạt động
              </span>
              <span className="px-3 py-1 rounded-full text-[12px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                Chờ kiểm định
              </span>
            </div>
          </div>

          <div className="flex gap-6 flex-grow min-h-[420px]">
            {/* LEFT: CAMERA — giữ tỉ lệ, luôn fit khung */}
            <div className="w-2/3">
              <CameraCard className="w-full" cameraId="A01" />
            </div>

            {/* RIGHT: INFO SECTION (gọn, không icon, ít border) */}
            <div className="w-1/3 flex flex-col gap-4">
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

              {/* Alert tinh gọn, không icon */}
              <div className="rounded-xl p-4 border border-rose-200 bg-rose-50 text-rose-800">
                <div className="font-semibold mb-1">Cảnh báo</div>
                <p className="text-[15px]">
                  Dữ liệu chưa khớp giữa mã QR và hệ thống. Vui lòng xác minh.
                </p>
                <div className="mt-3">
                  <button className="text-[12px] px-3 py-1 rounded-lg border border-rose-200 bg-white hover:bg-rose-50">
                    Đã hiểu
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

/* ===== Reusable Components (đã giản lược border/ring & icon) ===== */
const SidebarButton = ({ icon, title }) => (
  <button
    className="w-10 h-10 rounded-xl grid place-items-center text-slate-500 hover:text-sky-700 hover:bg-sky-50"
    title={title}
  >
    {icon}
  </button>
);

/* Thẻ thông tin tối giản: không icon, ít border, cấu trúc 2 cột */
function InfoCardMinimal({ product = {}, supplier = {} }) {
  return (
    <section className="rounded-2xl bg-white border border-slate-200/70 shadow-sm overflow-hidden">
      {/* Header: tên lô + meta ngắn gọn + badge */}
      <header className="px-5 py-3 bg-gradient-to-r from-slate-50 to-white border-b border-slate-200/70 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-[16px] font-semibold text-slate-900 leading-tight line-clamp-1">
            {product.name || "—"}
          </h3>
          <p className="mt-1 text-[12px] text-slate-500 flex flex-wrap items-center gap-x-2 gap-y-1">
            <span>{product.type || "—"}</span>
            <span className="opacity-50">•</span>
            <span>Nhập: {product.dateIn || "—"}</span>
            {product.weight ? (
              <>
                <span className="opacity-50">•</span>
                <span>Khối lượng: {product.weight}</span>
              </>
            ) : null}
          </p>
        </div>

        <div className="shrink-0 flex flex-wrap gap-2 justify-end">
          {product.qr ? (
            <Pill tone="sky">
              <QrCode className="w-3.5 h-3.5 mr-1" />
              {product.qr}
            </Pill>
          ) : null}
          {product.status ? <Pill tone="amber">{product.status}</Pill> : null}
        </div>
      </header>

      {/* Body: 2 phần — Sản phẩm & NCC */}
      <div className="p-5 space-y-5">
        {/* Sản phẩm */}
        <SectionLabel>Thông tin sản phẩm</SectionLabel>
        <KVList
          zebra
          items={[
            ["Tên sản phẩm", product.name],
            ["Loại", product.type],
            ["Khối lượng", product.weight],
            ["Ngày nhập", product.dateIn],
            ["Ghi chú", product.note],
          ]}
        />

        <Divider />

        {/* NCC */}
        <SectionLabel>Nhà cung cấp</SectionLabel>
        <KVList
          zebra
          items={[
            ["Tên", supplier.name],
            ["Người phụ trách", supplier.contact],
            [
              "Địa chỉ",
              supplier.address,
              () => <MapPin className="w-3.5 h-3.5 text-slate-400" />,
            ],
            [
              "SĐT",
              supplier.phone,
              () => <Phone className="w-3.5 h-3.5 text-slate-400" />,
              {
                asLink: supplier.phone
                  ? `tel:${supplier.phone.replace(/\s+/g, "")}`
                  : null,
              },
            ],
          ]}
        />
      </div>
    </section>
  );
}

/* ===== Small UI atoms ===== */
/* ===== Atoms ===== */

const SectionLabel = ({ children }) => (
  <div className="flex items-center gap-2">
    <span className="h-4 w-1.5 rounded bg-sky-400/70" />
    <h4 className="text-[13px] font-semibold text-slate-700">{children}</h4>
  </div>
);

const Divider = () => <hr className="border-t border-slate-200/70" />;

/* Key–Value list: label cố định 120px, zebra nhẹ cho dễ quét mắt */
function KVList({ items = [], zebra = false }) {
  return (
    <dl className="rounded-lg overflow-hidden">
      {items
        .filter(([_, v]) => v != null && v !== "")
        .map(([label, value, IconFn, opts], i) => {
          const RowTag = opts?.asLink ? "a" : "div";
          const rowProps = opts?.asLink
            ? { href: opts.asLink, className: "no-underline hover:underline" }
            : {};
          return (
            <RowTag
              key={i}
              {...rowProps}
              className={[
                "grid grid-cols-[120px_1fr] items-start gap-3 px-3 py-2",
                zebra && i % 2 === 1 ? "bg-slate-50/60" : "bg-white",
              ].join(" ")}
            >
              <dt className="text-[12px] text-slate-500">{label}</dt>
              <dd className="text-[14px] text-slate-900 leading-5 break-words flex items-start gap-2">
                {IconFn ? <span className="mt-0.5">{IconFn()}</span> : null}
                <span className="min-w-0">{value}</span>
              </dd>
            </RowTag>
          );
        })}
    </dl>
  );
}

/* Pill gọn, nổi bật vừa đủ */
const Pill = ({ tone = "sky", children }) => {
  const tones = {
    sky: "bg-sky-50 text-sky-700 border-sky-200",
    amber: "bg-amber-50 text-amber-700 border-amber-200",
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-200",
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-[12px] font-semibold border ${tones[tone]}`}
    >
      {children}
    </span>
  );
};
