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
  Pause,
  Package,
  ClipboardList,
  Printer,
  CheckCircle2,
  Truck,
  Thermometer,
} from "lucide-react";

import Sidebar from "../components/tracking/Sidebar.jsx";
import Topbar from "../components/tracking/Topbar.jsx";

// ===== Inbound Receiving (Nhập kho) =====
// Layout: cột trái sticky (quy trình + khu quét + tác vụ), cột phải cuộn độc lập (ASN/PO, NCC, danh sách, thống kê)

export default function CameraWarehouseIn() {
  const [isReceiving, setIsReceiving] = useState(false);
  const [progress, setProgress] = useState(30); // % tiến độ nhận hàng (demo)
  const topbarRef = useRef(null);

  useEffect(() => {
    document.title = "Nhập kho - Quản lý trái cây";
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
                Nhập kho
              </h1>
              <p className="text-slate-500 mt-1">
                Quản lý quy trình nhập hàng vào kho. 📦
              </p>
            </div>
          </header>

          {/* Title Row */}
          <div className="mt-6 mb-4 flex items-center justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-[12px] font-semibold bg-sky-50 text-sky-700 border border-sky-200">
                Phiếu nhập #GRN-2025-045
              </span>
              <span className="px-3 py-1 rounded-full text-[12px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                PO: PO-12345
              </span>
              <span className="px-3 py-1 rounded-full text-[12px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                Kiểm định bắt buộc
              </span>
            </div>
          </div>

          <div className="flex gap-6">
            {/* LEFT: STICKY (Stepper + Scan + Actions) */}
            <div className="w-2/3">
              <div className="sticky top-20 space-y-3">
                {/* Stepper */}
                <section className="rounded-2xl bg-white border border-slate-200/70 shadow-sm overflow-hidden">
                  <header className="px-5 py-3 bg-gradient-to-r from-slate-50 to-white border-b border-slate-200/70 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[13px] font-semibold text-slate-700">
                      <ClipboardList className="w-4 h-4" /> Quy trình nhập kho
                    </div>
                    <div className="text-[12px] text-slate-500">
                      Tiến độ: {progress}%
                    </div>
                  </header>
                  <div className="p-5">
                    <ol className="grid grid-cols-3 gap-4 text-[12px] font-medium text-slate-700">
                      <Step active>Tiếp nhận</Step>
                      <Step active={progress >= 40}>Kiểm định</Step>
                      <Step active={progress >= 90}>Nhập kho</Step>
                    </ol>
                    <div className="mt-3 h-2 rounded-full bg-slate-200 overflow-hidden">
                      <div
                        className="h-full bg-sky-500 transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                </section>

                {/* Scan Zone */}
                <section className="rounded-2xl overflow-hidden border border-slate-200/70 bg-white shadow-sm">
                  <header className="px-5 py-3 bg-gradient-to-r from-slate-50 to-white border-b border-slate-200/70 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[13px] font-semibold text-slate-700">
                      <QrCode className="w-4 h-4" /> Khu vực quét / nhận hàng
                    </div>
                    <span className="text-[11px] text-slate-500">
                      QR + mã vạch • LPN/Thùng/Tem lô
                    </span>
                  </header>
                  <div className="p-3">
                    <ScanZone placeholder="Nhập/scan mã LPN, PO, SKU..." />
                  </div>
                </section>

                {/* Actions */}
                <div className="grid grid-cols-4 gap-3">
                  <ToolbarButton onClick={() => setIsReceiving((v) => !v)}>
                    {isReceiving ? (
                      <>
                        <Pause className="w-4 h-4" /> Tạm dừng nhận
                      </>
                    ) : (
                      <>
                        <ClipboardList className="w-4 h-4" /> Bắt đầu nhận
                      </>
                    )}
                  </ToolbarButton>
                  <ToolbarButton>
                    <Printer className="w-4 h-4" /> In tem kệ
                  </ToolbarButton>
                  <ToolbarButton>
                    <Package className="w-4 h-4" /> Tạo biên bản
                  </ToolbarButton>
                  <ToolbarButton>
                    <CheckCircle2 className="w-4 h-4" /> Xác nhận nhập
                  </ToolbarButton>
                </div>
              </div>
            </div>

            {/* RIGHT: SCROLLABLE INFO */}
            <div className="w-1/3">
              <div className="h-[calc(100vh-80px)] overflow-y-auto pr-1">
                <ASNCard
                  asn={{
                    code: "GRN-2025-045",
                    date: "15/10/2025 21:05",
                    dock: "Door 02",
                    note: "Hàng cần giữ mát",
                  }}
                  supplier={{
                    name: "GreenFarm Co., Ltd",
                    contact: "Nguyễn Văn A",
                    address: "Tân Phước, Tiền Giang",
                    phone: "0908 123 456",
                  }}
                />

                <SimpleCard title="Tiến độ nhận hàng" className="mt-4">
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <Stat label="Dòng hàng" value="7" />
                    <Stat label="Đã nhận" value="3" />
                    <Stat label="Còn thiếu" value="4" tone="amber" />
                  </div>
                </SimpleCard>

                <SimpleCard title="Danh sách nhận" className="mt-4">
                  <InboundItemsList
                    items={[
                      {
                        sku: "CAM-TG-01",
                        name: "Cam Sành Tiền Giang 1kg",
                        ordered: 10,
                        received: 6,
                        lot: "LOT2310",
                        exp: "25/11/2025",
                        binSug: "A1-05",
                      },
                      {
                        sku: "BTH-XL-02",
                        name: "Bưởi da xanh 2kg",
                        ordered: 5,
                        received: 0,
                        lot: "LOT2311",
                        exp: "30/11/2025",
                        binSug: "B2-08",
                      },
                      {
                        sku: "TT-HC-05",
                        name: "Thanh long ruột đỏ 1kg",
                        ordered: 6,
                        received: 3,
                        lot: "LOT2312",
                        exp: "28/11/2025",
                        binSug: "C1-04",
                      },
                    ]}
                  />
                </SimpleCard>

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

function Step({ active = true, children }) {
  return (
    <li className="flex items-center gap-2">
      <span
        className={`w-5 h-5 rounded-full grid place-items-center text-[11px] font-bold ${
          active ? "bg-sky-500 text-white" : "bg-slate-200 text-slate-600"
        }`}
      >
        {active ? "✓" : ""}
      </span>
      <span
        className={`truncate ${active ? "text-slate-900" : "text-slate-400"}`}
      >
        {children}
      </span>
    </li>
  );
}

function ScanZone({ placeholder = "Nhập/scan mã..." }) {
  return (
    <div className="aspect-video rounded-xl border border-dashed border-slate-300 bg-slate-50 grid place-items-center">
      <div className="text-center">
        <div className="text-slate-700 font-semibold flex items-center justify-center gap-2">
          <QrCode className="w-5 h-5" /> Sẵn sàng quét QR / barcode
        </div>
        <p className="text-[12px] text-slate-500 mt-1">
          Kết nối camera thiết bị hoặc nhập mã thủ công
        </p>
        <div className="mt-3 flex items-center gap-2 justify-center">
          <input
            className="h-9 px-3 rounded-lg border border-slate-300 text-[13px]"
            placeholder={placeholder}
          />
          <button className="h-9 px-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-[13px]">
            Xác nhận
          </button>
        </div>
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

function ASNCard({ asn = {}, supplier = {} }) {
  return (
    <section className="rounded-2xl bg-white border border-slate-200/70 shadow-sm overflow-hidden">
      <header className="px-5 py-3 bg-gradient-to-r from-slate-50 to-white border-b border-slate-200/70 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-[16px] font-semibold text-slate-900 leading-tight line-clamp-1">
            Phiếu nhập / PO
          </h3>
          <p className="mt-1 text-[12px] text-slate-500 flex flex-wrap items-center gap-x-2 gap-y-1">
            <span>Mã: {asn.code || "—"}</span>
            <span className="opacity-50">•</span>
            <span>Ngày: {asn.date || "—"}</span>
            <span className="opacity-50">•</span>
            <span>Dock: {asn.dock || "—"}</span>
          </p>
        </div>
      </header>
      <div className="p-5 space-y-5">
        <SectionLabel>Nhà cung cấp</SectionLabel>
        <KVList
          zebra
          items={[
            ["Tên", supplier.name],
            ["Người liên hệ", supplier.contact],
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
            ["Ghi chú", asn.note],
          ]}
        />
      </div>
    </section>
  );
}

function QCStat({ label, value, icon }) {
  return (
    <div className="rounded-xl border border-slate-200 p-3 bg-slate-50">
      <div className="flex items-center justify-center gap-2 text-slate-700 text-sm font-medium">
        {icon}
        {label}
      </div>
      <div className="text-2xl font-bold leading-none text-sky-700 mt-1 text-center">
        {value}
      </div>
    </div>
  );
}

function Stat({ label, value, tone }) {
  const toneCls = tone === "amber" ? "text-amber-700" : "text-sky-700";
  return (
    <div className="rounded-xl border border-slate-200 p-3 bg-slate-50">
      <div className={`text-2xl font-bold leading-none ${toneCls}`}>
        {value}
      </div>
      <div className="text-[12px] text-slate-500 mt-1">{label}</div>
    </div>
  );
}

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

const SectionLabel = ({ children }) => (
  <div className="flex items-center gap-2">
    <span className="h-4 w-1.5 rounded bg-sky-400/70" />
    <h4 className="text-[13px] font-semibold text-slate-700">{children}</h4>
  </div>
);

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

function InboundItemsList({ items = [] }) {
  return (
    <div className="rounded-xl overflow-hidden border border-slate-200">
      <div className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-3 px-3 py-2 bg-slate-50 text-[12px] font-semibold text-slate-600">
        <div>Sản phẩm</div>
        <div className="text-right">Đặt</div>
        <div className="text-right">Đã nhận</div>
        <div>Vị trí đề xuất</div>
        <div>Lô/HSD</div>
      </div>
      <ul className="divide-y divide-slate-200 bg-white">
        {items.map((it, i) => (
          <li
            key={i}
            className={`grid grid-cols-[1fr_auto_auto_auto_auto] gap-3 px-3 py-2 ${
              i % 2 === 1 ? "bg-slate-50/60" : "bg-white"
            }`}
          >
            <div className="min-w-0">
              <div className="text-[13px] font-medium text-slate-900 truncate">
                {it.name}
              </div>
              <div className="text-[11px] text-slate-500 truncate">
                SKU: {it.sku}
              </div>
            </div>
            <div className="text-right text-[13px] tabular-nums">
              {it.ordered}
            </div>
            <div className="text-right text-[13px] tabular-nums">
              {it.received}
            </div>
            <div className="text-[13px]">{it.binSug}</div>
            <div className="text-[12px] text-slate-600">
              {it.lot} • {it.exp}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
