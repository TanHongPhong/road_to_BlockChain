import React, { useEffect, useState, useRef } from "react";
import feather from "feather-icons";
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
import Sidebar from "../components/tracking/Sidebar.jsx";
import Topbar from "../components/tracking/Topbar.jsx";

export default function CameraMonitoring() {
  const [isRecording, setIsRecording] = useState(false);
  const topbarRef = useRef(null);

  useEffect(() => {
    document.title = "Giám sát Camera - Quản lý trái cây";
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

  return (
    <div className="text-slate-800">
      {/* Global styles */}
      <style>{`
        :root{ --sidebar-w:80px; }
        html,body{height:100%}
        body{ background: linear-gradient(180deg,#f8fafc 0%, #eef2f7 60%, #eef2f7 100%); font-family: Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial; scrollbar-gutter: stable both-edges; }
        .card{ background:#fff; border:1px solid rgb(226 232 240); border-radius:1rem; box-shadow:0 10px 28px rgba(2,6,23,.08) }
        .card, article, button{ transition:all .18s ease; }
        .card:hover{ transform:translateY(-1px); box-shadow:0 16px 40px rgba(2,6,23,.12) }
        .nice-scroll{ scrollbar-width:thin; scrollbar-color:#cbd5e1 #f1f5f9 }
        .nice-scroll::-webkit-scrollbar{ width:10px }
        .nice-scroll::-webkit-scrollbar-track{ background:#f1f5f9; border-radius:9999px }
        .nice-scroll::-webkit-scrollbar-thumb{ background:#c7d2fe; border-radius:9999px; border:3px solid #f8fafc }
        .pro-table tbody tr:nth-child(even){ background:#f8fafc }
        .pro-table tbody tr:hover{ background:#eff6ff }
        .mini-map{ pointer-events:none; }
        .mini-map .leaflet-control-attribution{ display:none; }
        .container-padding { padding-top: clamp(8px, calc(var(--topbar-h,64px) - 56px), 18px); }
        .mini-map{
          position: relative;       /* tạo stacking context */
          z-index: 0;               /* khóa z-index con nằm trong context này */
          overflow: hidden;         /* clip tile theo border-radius */
          pointer-events: none;     /* như bạn đang dùng để disable tương tác */
          border-radius: 0.5rem;    /* backup cho trường hợp thiếu rounded trên div */
        }

        /* Ép các pane của Leaflet không "vượt" z-index ra ngoài */ 
        .mini-map .leaflet-pane,
        .mini-map .leaflet-tile-pane,
        .mini-map .leaflet-overlay-pane,
        .mini-map .leaflet-shadow-pane,
        .mini-map .leaflet-marker-pane,
        .mini-map .leaflet-tooltip-pane,
        .mini-map .leaflet-popup-pane {
          z-index: 0 !important;
        }

        /* Tránh nền trắng của container Leaflet gây "mảng" đè */
        .mini-map .leaflet-container {
          background: transparent !important;
        }
      `}</style>

      <Sidebar />
      <Topbar ref={topbarRef} />

      <main
        id="main"
        className="container-padding"
        style={{
          marginLeft: "var(--sidebar-w)",
          paddingTop: "var(--topbar-h, 64px)",
        }}
      >
        <div className="max-w-[120rem] mx-auto p-4 md:p-6 pt-3">
          <header className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">
                Giám sát Camera
              </h1>
              <p className="text-slate-500 mt-1">
                Theo dõi và quản lý camera giám sát kho hàng. 📹
              </p>
            </div>
          </header>

          {/* Title Row */}
          <div className="mt-6 mb-4 flex items-center justify-between">
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
        </div>
      </main>
    </div>
  );
}

/* ===== Reusable Components ===== */
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
