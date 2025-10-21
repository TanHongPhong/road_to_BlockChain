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
  Truck,
  Package,
  ClipboardList,
  Printer,
  CheckCircle2,
} from "lucide-react";

import Sidebar from "../components/tracking/Sidebar.jsx";
import Topbar from "../components/tracking/Topbar.jsx";

// NOTE: Trang này đã được chuyển thành trang "Xuất kho" (Outbound Dispatch)
// Giữ nguyên cấu trúc layout: Cột trái sticky, cột phải cuộn độc lập

export default function CameraWarehouseOut() {
  const [isPicking, setIsPicking] = useState(false);
  const [progress, setProgress] = useState(62); // % tiến độ soạn hàng (demo)
  const topbarRef = useRef(null);

  useEffect(() => {
    document.title = "Xuất kho - Quản lý trái cây";
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
                Xuất kho
              </h1>
              <p className="text-slate-500 mt-1">
                Quản lý quy trình xuất hàng từ kho. 🚚
              </p>
            </div>
          </header>

          {/* Title Row */}
          <div className="mt-6 mb-4 flex items-center justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-[12px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                Phiếu xuất #DO-2025-001
              </span>
              <span className="px-3 py-1 rounded-full text-[12px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                SO: SO-33421
              </span>
              <span className="px-3 py-1 rounded-full text-[12px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                Ưu tiên cao
              </span>
            </div>
          </div>

          <div className="flex gap-6">
            {/* LEFT: STICKY PANEL (Scan + Stepper + Actions) */}
            <div className="w-2/3">
              <div className="sticky top-20 space-y-3">
                {/* Stepper + Progress */}
                <section className="rounded-2xl bg-white border border-slate-200/70 shadow-sm overflow-hidden">
                  <header className="px-5 py-3 bg-gradient-to-r from-slate-50 to-white border-b border-slate-200/70 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[13px] font-semibold text-slate-700">
                      <ClipboardList className="w-4 h-4" /> Quy trình xuất kho
                    </div>
                    <div className="text-[12px] text-slate-500">
                      Tiến độ: {progress}%
                    </div>
                  </header>
                  <div className="p-5">
                    <ol className="grid grid-cols-3 gap-4 text-[12px] font-medium text-slate-700">
                      <Step active>Soạn hàng</Step>
                      <Step active={progress >= 50}>Đóng gói</Step>
                      <Step active={progress >= 90}>Xuất kho</Step>
                    </ol>
                    <div className="mt-3 h-2 rounded-full bg-slate-200 overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                </section>

                {/* Scan Zone (thay cho Camera) */}
                <section className="rounded-2xl overflow-hidden border border-slate-200/70 bg-white shadow-sm">
                  <header className="px-5 py-3 bg-gradient-to-r from-slate-50 to-white border-b border-slate-200/70 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[13px] font-semibold text-slate-700">
                      <QrCode className="w-4 h-4" /> Khu vực quét / soạn
                    </div>
                    <span className="text-[11px] text-slate-500">
                      Hỗ trợ QR & mã vạch
                    </span>
                  </header>
                  <div className="p-3">
                    <ScanZone />
                  </div>
                </section>

                {/* Action Bar */}
                <div className="grid grid-cols-4 gap-3">
                  <ToolbarButton onClick={() => setIsPicking((v) => !v)}>
                    {isPicking ? (
                      <>
                        <Pause className="w-4 h-4" /> Tạm dừng soạn
                      </>
                    ) : (
                      <>
                        <ClipboardList className="w-4 h-4" /> Bắt đầu soạn
                      </>
                    )}
                  </ToolbarButton>
                  <ToolbarButton>
                    <Printer className="w-4 h-4" /> In phiếu
                  </ToolbarButton>
                  <ToolbarButton>
                    <Package className="w-4 h-4" /> Đóng gói
                  </ToolbarButton>
                  <ToolbarButton>
                    <CheckCircle2 className="w-4 h-4" /> Xác nhận xuất
                  </ToolbarButton>
                </div>
              </div>
            </div>

            {/* RIGHT: SCROLLABLE INFO */}
            <div className="w-1/3">
              <div className="h-[calc(100vh-80px)] overflow-y-auto pr-1">
                <OrderCard
                  order={{
                    code: "SO-33421",
                    channel: "Online",
                    priority: "Cao",
                    date: "15/10/2025 20:30",
                    note: "Giao sáng mai, yêu cầu giữ mát.",
                  }}
                  customer={{
                    name: "Công ty FreshMart",
                    contact: "Lê Minh H.",
                    address: "12 Đường 9, P. Linh Trung, TP. Thủ Đức, TP.HCM",
                    phone: "0938 888 222",
                  }}
                />

                {/* Picking stats */}
                <SimpleCard title="Tiến độ soạn hàng" className="mt-4">
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <Stat label="Dòng hàng" value="8" />
                    <Stat label="Đã nhặt" value="5" />
                    <Stat label="Còn thiếu" value="3" tone="amber" />
                  </div>
                </SimpleCard>

                {/* Items list */}
                <SimpleCard title="Danh sách hàng" className="mt-4">
                  <ItemsList
                    items={[
                      {
                        sku: "CAM-TG-01",
                        name: "Cam Sành Tiền Giang 1kg",
                        qty: 6,
                        picked: 4,
                        bin: "A1-03",
                        lot: "LOT2310",
                        exp: "25/11/2025",
                      },
                      {
                        sku: "BTH-XL-02",
                        name: "Bưởi da xanh 2kg",
                        qty: 3,
                        picked: 1,
                        bin: "B2-10",
                        lot: "LOT2311",
                        exp: "30/11/2025",
                      },
                      {
                        sku: "TT-HC-05",
                        name: "Thanh long ruột đỏ 1kg",
                        qty: 2,
                        picked: 0,
                        bin: "C1-07",
                        lot: "LOT2312",
                        exp: "28/11/2025",
                      },
                    ]}
                  />
                </SimpleCard>

                {/* Shipment */}
                <SimpleCard title="Thông tin vận chuyển" className="mt-4">
                  <KVList
                    zebra
                    items={[
                      ["Hình thức", "Giao thường (4h)"],
                      ["Đơn vị", "Nội bộ"],
                      ["Tài xế", "Nguyễn Văn T."],
                      [
                        "Biển số",
                        "51H-223.68",
                        () => <Truck className="w-3.5 h-3.5 text-slate-400" />,
                      ],
                      ["Ghi chú", "Ưu tiên tuyến QL1A, tránh kẹt."],
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

/* Stepper item */
function Step({ active = true, children }) {
  return (
    <li className="flex items-center gap-2">
      <span
        className={`w-5 h-5 rounded-full grid place-items-center text-[11px] font-bold ${
          active ? "bg-emerald-500 text-white" : "bg-slate-200 text-slate-600"
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

/* Scan Zone placeholder */
function ScanZone() {
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
            placeholder="Nhập/scan mã..."
          />
          <button className="h-9 px-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-[13px]">
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
}

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

/* ===== Order Card (thông tin phiếu + khách) ===== */
function OrderCard({ order = {}, customer = {} }) {
  return (
    <section className="rounded-2xl bg-white border border-slate-200/70 shadow-sm overflow-hidden">
      <header className="px-5 py-3 bg-gradient-to-r from-slate-50 to-white border-b border-slate-200/70 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-[16px] font-semibold text-slate-900 leading-tight line-clamp-1">
            Phiếu xuất / Đơn hàng
          </h3>
          <p className="mt-1 text-[12px] text-slate-500 flex flex-wrap items-center gap-x-2 gap-y-1">
            <span>Mã: {order.code || "—"}</span>
            <span className="opacity-50">•</span>
            <span>Kênh: {order.channel || "—"}</span>
            <span className="opacity-50">•</span>
            <span>Ngày: {order.date || "—"}</span>
          </p>
        </div>
        <div className="shrink-0 flex flex-wrap gap-2 justify-end">
          {order.priority ? (
            <Pill tone="amber">Ưu tiên: {order.priority}</Pill>
          ) : null}
        </div>
      </header>

      <div className="p-5 space-y-5">
        <SectionLabel>Khách hàng / giao nhận</SectionLabel>
        <KVList
          zebra
          items={[
            ["Tên", customer.name],
            ["Người liên hệ", customer.contact],
            [
              "Địa chỉ",
              customer.address,
              () => <MapPin className="w-3.5 h-3.5 text-slate-400" />,
            ],
            [
              "SĐT",
              customer.phone,
              () => <Phone className="w-3.5 h-3.5 text-slate-400" />,
              { asLink: customer.phone ? `tel:${customer.phone}` : null },
            ],
            ["Ghi chú", order.note],
          ]}
        />
      </div>
    </section>
  );
}

/* ===== Stats ===== */
function Stat({ label, value, tone }) {
  const toneCls = tone === "amber" ? "text-amber-700" : "text-emerald-700";
  return (
    <div className="rounded-xl border border-slate-200 p-3 bg-slate-50">
      <div className={`text-2xl font-bold leading-none ${toneCls}`}>
        {value}
      </div>
      <div className="text-[12px] text-slate-500 mt-1">{label}</div>
    </div>
  );
}

/* ===== Items List (nhẹ, dễ quét mắt) ===== */
function ItemsList({ items = [] }) {
  return (
    <div className="rounded-xl overflow-hidden border border-slate-200">
      <div className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-3 px-3 py-2 bg-slate-50 text-[12px] font-semibold text-slate-600">
        <div>Sản phẩm</div>
        <div className="text-right">Cần</div>
        <div className="text-right">Đã nhặt</div>
        <div>Vị trí</div>
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
            <div className="text-right text-[13px] tabular-nums">{it.qty}</div>
            <div className="text-right text-[13px] tabular-nums">
              {it.picked}
            </div>
            <div className="text-[13px]">{it.bin}</div>
            <div className="text-[12px] text-slate-600">
              {it.lot} • {it.exp}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ===== Info atoms ===== */
const SectionLabel = ({ children }) => (
  <div className="flex items-center gap-2">
    <span className="h-4 w-1.5 rounded bg-emerald-400/70" />
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
