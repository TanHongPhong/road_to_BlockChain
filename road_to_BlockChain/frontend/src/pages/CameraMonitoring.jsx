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
      <aside className="fixed inset-y-0 left-0 w-20 bg-white/95 border-r border-slate-200/70 flex flex-col items-center gap-3 p-3">
        <div className="mt-1 mb-1 text-center">
          <span className="inline-grid place-items-center w-14 h-14 rounded-xl bg-sky-50 text-sky-600 border border-sky-200/60">
            <span className="text-xs font-bold tracking-wide">LGBT</span>
          </span>
          <div className="mt-1 text-[10px] font-semibold tracking-wide text-sky-700">
            Camera
          </div>
        </div>

        <nav className="flex flex-col items-center gap-3 mt-3">
          <SidebarButton icon={<Home />} title="Trang chủ" />
          <SidebarButton icon={<Map />} title="Theo dõi vị trí" />
          <SidebarButton icon={<FileText />} title="Lịch sử giao dịch" />
          <div className="relative">
            <SidebarButton icon={<Bell />} title="Thông báo" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
          </div>
          <SidebarButton icon={<User />} title="Người dùng" />
          <SidebarButton icon={<Settings />} title="Cài đặt" />
        </nav>
      </aside>

      {/* ===== MAIN CONTENT ===== */}
      <main className="ml-20 flex-1 flex flex-col">
        {/* ===== HEADER ===== */}
        <header className="h-14 sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-slate-200">
          <div className="h-14 flex items-center justify-between px-5">
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

        {/* ===== CONTENT ===== */}
        <section className="flex-1 p-6">
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

          <div className="flex gap-6">
            {/* LEFT: CAMERA — sticky to keep always visible */}
            <div className="w-2/3">
              <div className="sticky top-20">
                <div className="rounded-2xl overflow-hidden border border-slate-200/70 bg-slate-900/90 shadow-sm">
                  {/* When CameraCard doesn't constrain ratio, "aspect-video" keeps layout stable */}
                  <div className="aspect-video">
                    <CameraCard className="w-full h-full" cameraId="A01" />
                  </div>
                </div>

                {/* Action Bar */}
                <div className="mt-3 grid grid-cols-3 gap-3">
                  <ToolbarButton onClick={() => setIsRecording((v) => !v)}>
                    {isRecording ? (
                      <>
                        <Pause className="w-4 h-4" />
                        Tạm dừng ghi
                      </>
                    ) : (
                      <>
                        <Camera className="w-4 h-4" />
                        Bắt đầu ghi
                      </>
                    )}
                  </ToolbarButton>
                  <ToolbarButton>
                    <QrCode className="w-4 h-4" />
                    Quét QR
                  </ToolbarButton>
                  <ToolbarButton>
                    <Circle className="w-4 h-4" />
                    Snapshot
                  </ToolbarButton>
                </div>
              </div>
            </div>

            {/* RIGHT: INFO — scrollable column only */}
            <div className="w-1/3">
              {/* 80px = top-20 of sticky left; match so the bottoms align visually */}
              <div className="h-[calc(100vh-80px)] overflow-y-auto pr-1">
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

                <AlertCard
                  className="mt-4"
                  tone="rose"
                  title="Cảnh báo"
                  message="Dữ liệu chưa khớp giữa mã QR và hệ thống. Vui lòng xác minh."
                />

                <div className="h-10" />
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

/* ===== Reusable Components ===== */
const SidebarButton = ({ icon, title }) => (
  <button
    className="w-10 h-10 rounded-xl grid place-items-center text-slate-500 hover:text-sky-700 hover:bg-sky-50"
    title={title}
  >
    {icon}
  </button>
);

const ToolbarButton = ({ children, onClick }) => (
  <button
    onClick={onClick}
    className="inline-flex items-center justify-center gap-2 h-10 px-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-[13px] font-medium"
  >
    {children}
  </button>
);

function AlertCard({ title, message, tone = "rose", className = "" }) {
  const tones = {
    rose: "border-rose-200 bg-rose-50 text-rose-800",
    amber: "border-amber-200 bg-amber-50 text-amber-800",
    sky: "border-sky-200 bg-sky-50 text-sky-800",
  };
  return (
    <div className={`rounded-2xl p-4 border ${tones[tone]} ${className}`}>
      <div className="font-semibold mb-1">{title}</div>
      <p className="text-[15px]">{message}</p>
      <div className="mt-3">
        <button className="text-[12px] px-3 py-1 rounded-lg border border-current/20 bg-white/80 hover:bg-white">
          Đã hiểu
        </button>
      </div>
    </div>
  );
}

function SimpleCard({ title, children, className = "" }) {
  return (
    <section
      className={`rounded-2xl bg-white border border-slate-200/70 shadow-sm overflow-hidden ${className}`}
    >
      {title ? (
        <header className="px-5 py-3 bg-gradient-to-r from-slate-50 to-white border-b border-slate-200/70">
          <h3 className="text-[14px] font-semibold text-slate-900 leading-tight">
            {title}
          </h3>
        </header>
      ) : null}
      <div className="p-5">{children}</div>
    </section>
  );
}

/* ===== Info Card (tối giản, 2 cột, zebra nhẹ) ===== */
function InfoCardMinimal({ product = {}, supplier = {} }) {
  return (
    <section className="rounded-2xl bg-white border border-slate-200/70 shadow-sm overflow-hidden">
      {/* Header */}
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

      {/* Body */}
      <div className="p-5 space-y-5">
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

/* ===== Atoms ===== */
const SectionLabel = ({ children }) => (
  <div className="flex items-center gap-2">
    <span className="h-4 w-1.5 rounded bg-sky-400/70" />
    <h4 className="text-[13px] font-semibold text-slate-700">{children}</h4>
  </div>
);

const Divider = () => <hr className="border-t border-slate-200/70" />;

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
