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
  Pause,
  Package,
  ClipboardList,
  Printer,
  CheckCircle2,
  Truck,
  Thermometer,
  Tag,
  DollarSign,
  Building2,
  Scale,
} from "lucide-react";

// ===== Supermarket Receiving (Nhập kho siêu thị) =====
// Layout: cột trái sticky (quy trình + khu quét + giá/nhãn + tác vụ), cột phải cuộn độc lập (PO/ĐVGH/NCC, QC, thống kê, danh sách hàng)

export default function SupermarketReceiving() {
  const [isReceiving, setIsReceiving] = useState(false);
  const [progress, setProgress] = useState(30); // % tiến độ
  const [mode, setMode] = useState("EACH"); // EACH | CASE | SSCC

  useEffect(() => {
    document.title = "Nhập kho siêu thị - WMS";
  }, []);

  return (
    <div className="bg-slate-50 text-slate-900 flex min-h-screen">
      {/* ===== SIDEBAR ===== */}
      <aside className="fixed inset-y-0 left-0 w-20 bg-white/95 border-r border-slate-200/70 flex flex-col items-center gap-3 p-3">
        <div className="mt-1 mb-1 text-center">
          <span className="inline-grid place-items-center w-14 h-14 rounded-xl bg-violet-50 text-violet-600 border border-violet-200/60">
            <span className="text-[10px] font-bold tracking-wide leading-none">
              WMS
            </span>
          </span>
          <div className="mt-1 text-[10px] font-semibold tracking-wide text-violet-700">
            Siêu thị
          </div>
        </div>

        <nav className="flex flex-col items-center gap-3 mt-3">
          <SidebarButton icon={<Home />} title="Trang chủ" />
          <SidebarButton icon={<Map />} title="Sơ đồ kệ" />
          <SidebarButton icon={<FileText />} title="PO/GRN" />
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
            <div className="flex-1 max-w-2xl mr-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Tìm phiếu nhập / PO / nhà cung cấp..."
                  className="w-full h-10 pl-9 pr-24 rounded-xl border border-slate-200 focus:ring-2 focus:ring-violet-200 focus:border-violet-300 bg-white"
                />
                <button
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-8 px-2 grid place-items-center rounded-lg border border-slate-200 hover:bg-slate-50"
                  title="Bộ lọc"
                >
                  <Filter className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="group inline-flex items-center gap-2 pl-1 pr-2 py-1.5 rounded-full bg-white text-slate-900 border border-slate-200 hover:bg-slate-50 cursor-pointer">
              <img
                src="https://i.pravatar.cc/40?img=8"
                alt="Avatar"
                className="w-8 h-8 rounded-full object-cover"
              />
              <div className="text-left leading-tight hidden sm:block">
                <div className="text-[13px] font-semibold">
                  Siêu thị A - Ca tối
                </div>
                <div className="text-[11px] text-slate-500 -mt-0.5">
                  Thủ kho
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
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-[12px] font-semibold bg-violet-50 text-violet-700 border border-violet-200">
                GRN #SM-2025-219
              </span>
              <span className="px-3 py-1 rounded-full text-[12px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                PO: SM-PO-77891
              </span>
              <span className="px-3 py-1 rounded-full text-[12px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                Có hàng tươi / cần lạnh
              </span>
            </div>
          </div>

          <div className="flex gap-6">
            {/* LEFT: STICKY (Stepper + Scan + Price/Label + Actions) */}
            <div className="w-2/3">
              <div className="sticky top-20 space-y-3">
                {/* Stepper */}
                <section className="rounded-2xl bg-white border border-slate-200/70 shadow-sm overflow-hidden">
                  <header className="px-5 py-3 bg-gradient-to-r from-slate-50 to-white border-b border-slate-200/70 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[13px] font-semibold text-slate-700">
                      <ClipboardList className="w-4 h-4" /> Quy trình nhập kho
                      siêu thị
                    </div>
                    <div className="text-[12px] text-slate-500">
                      Tiến độ: {progress}%
                    </div>
                  </header>
                  <div className="p-5">
                    <ol className="grid grid-cols-5 gap-3 text-[12px] font-medium text-slate-700">
                      <Step active>Tiếp nhận</Step>
                      <Step active={progress >= 20}>Kiểm đếm</Step>
                      <Step active={progress >= 40}>Kiểm định</Step>
                      <Step active={progress >= 60}>Giá/nhãn</Step>
                      <Step active={progress >= 85}>Lên kệ</Step>
                    </ol>
                    <div className="mt-3 h-2 rounded-full bg-slate-200 overflow-hidden">
                      <div
                        className="h-full bg-violet-500 transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                </section>

                {/* Scan Zone */}
                <section className="rounded-2xl overflow-hidden border border-slate-200/70 bg-white shadow-sm">
                  <header className="px-5 py-3 bg-gradient-to-r from-slate-50 to-white border-b border-slate-200/70 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[13px] font-semibold text-slate-700">
                      <QrCode className="w-4 h-4" /> Khu vực quét
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500">
                      <span className="hidden sm:inline">Chế độ:</span>
                      <ModeChip
                        label="EACH"
                        active={mode === "EACH"}
                        onClick={() => setMode("EACH")}
                      />
                      <ModeChip
                        label="CASE"
                        active={mode === "CASE"}
                        onClick={() => setMode("CASE")}
                      />
                      <ModeChip
                        label="SSCC"
                        active={mode === "SSCC"}
                        onClick={() => setMode("SSCC")}
                      />
                    </div>
                  </header>
                  <div className="p-3">
                    <ScanZone placeholder="Quét EAN/UPC/GS1 hoặc nhập mã..." />
                    {/* Catch-weight helper */}
                    <div className="mt-3 grid grid-cols-3 gap-3">
                      <div className="col-span-2 rounded-xl border border-slate-200 p-3 bg-slate-50">
                        <div className="text-[12px] text-slate-500 mb-1">
                          Cân nặng (Catch-weight, nếu có)
                        </div>
                        <div className="flex items-center gap-2">
                          <Scale className="w-4 h-4 text-slate-500" />
                          <input
                            className="h-9 flex-1 px-3 rounded-lg border border-slate-300 text-[13px]"
                            placeholder="Nhập trọng lượng (kg)"
                          />
                          <button className="h-9 px-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-[13px]">
                            Lưu
                          </button>
                        </div>
                      </div>
                      <div className="rounded-xl border border-slate-200 p-3 bg-slate-50">
                        <div className="text-[12px] text-slate-500 mb-1">
                          Đơn vị
                        </div>
                        <div className="text-sm font-semibold">
                          {mode === "EACH"
                            ? "Cái/Each"
                            : mode === "CASE"
                            ? "Thùng/Case"
                            : "Pallet/SSCC"}
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Price & Label quick check */}
                <section className="rounded-2xl overflow-hidden border border-slate-200/70 bg-white shadow-sm">
                  <header className="px-5 py-3 bg-gradient-to-r from-slate-50 to-white border-b border-slate-200/70 flex items-center gap-3 text-[13px] font-semibold text-slate-700">
                    <Tag className="w-4 h-4" /> Giá / Nhãn kệ nhanh
                  </header>
                  <div className="p-4 grid grid-cols-5 gap-3 text-[13px]">
                    <Field
                      label="Giá hiện hành"
                      icon={<DollarSign className="w-3.5 h-3.5" />}
                      value="35.000 đ"
                    />
                    <Field label="Giá PO" value="34.000 đ" />
                    <Field label="Khuyến mãi" value="-10%" />
                    <Field label="Hiệu lực KM" value="15–20/10/2025" />
                    <div className="flex items-end justify-end">
                      <button className="h-9 px-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-[13px]">
                        <Printer className="w-4 h-4 mr-1 inline" /> In nhãn kệ
                      </button>
                    </div>
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
                    <Printer className="w-4 h-4" /> In tem backroom
                  </ToolbarButton>
                  <ToolbarButton>
                    <Package className="w-4 h-4" /> Lập biên bản lệch
                  </ToolbarButton>
                  <ToolbarButton>
                    <CheckCircle2 className="w-4 h-4" /> Hoàn tất GRN
                  </ToolbarButton>
                </div>
              </div>
            </div>

            {/* RIGHT: SCROLLABLE INFO */}
            <div className="w-1/3">
              <div className="h-[calc(100vh-80px)] overflow-y-auto pr-1">
                <StorePOCard
                  store={{
                    name: "Siêu thị A (CN Thủ Đức)",
                    address: "12 Đường 9, Linh Trung, TP. Thủ Đức",
                    phone: "028 38 222 333",
                  }}
                  po={{
                    code: "SM-PO-77891",
                    date: "15/10/2025 21:10",
                    grn: "SM-2025-219",
                    dock: "Door S2",
                    note: "Hàng cần lạnh, ưu tiên dỡ",
                  }}
                  supplier={{
                    name: "GreenFarm Co., Ltd",
                    contact: "Nguyễn Văn A",
                    phone: "0908 123 456",
                  }}
                />

                <SimpleCard title="Thông số kiểm định" className="mt-4">
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <QCStat
                      label="Ambient"
                      value="23.5°C"
                      icon={<Thermometer className="w-4 h-4" />}
                    />
                    <QCStat
                      label="Chilled"
                      value="6.8°C"
                      icon={<Thermometer className="w-4 h-4" />}
                    />
                    <QCStat
                      label="Frozen"
                      value="-18.2°C"
                      icon={<Thermometer className="w-4 h-4" />}
                    />
                  </div>
                </SimpleCard>

                <SimpleCard title="Tiến độ" className="mt-4">
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <Stat label="Dòng hàng" value="12" />
                    <Stat label="Đã nhận" value="5" />
                    <Stat label="Còn thiếu" value="7" tone="amber" />
                  </div>
                </SimpleCard>

                <SimpleCard title="Danh sách nhận" className="mt-4">
                  <RetailItemsList
                    items={[
                      {
                        sku: "8931234567890",
                        name: "Cam sành 1kg",
                        ordered: 20,
                        received: 8,
                        uom: "each",
                        loc: "A-03-02",
                        price: 35000,
                        promo: "-10%",
                        exp: "25/11/2025",
                        cw: false,
                      },
                      {
                        sku: "8932222333344",
                        name: "Thịt bò vai",
                        ordered: 15,
                        received: 5,
                        uom: "kg",
                        loc: "M-01-01 (chilled)",
                        price: 269000,
                        promo: null,
                        exp: "18/10/2025",
                        cw: true,
                      },
                      {
                        sku: "8935555666677",
                        name: "Kem hộp 450ml",
                        ordered: 30,
                        received: 0,
                        uom: "each",
                        loc: "F-02-04 (frozen)",
                        price: 59000,
                        promo: "Mua 2 tặng 1",
                        exp: "12/12/2025",
                        cw: false,
                      },
                    ]}
                  />
                </SimpleCard>

                <SimpleCard title="Thông tin giao đến" className="mt-4">
                  <KVList
                    zebra
                    items={[
                      ["Đơn vị", "GreenFarm Logistics"],
                      ["Tài xế", "Nguyễn Văn T."],
                      [
                        "Xe/biển số",
                        "51H-223.68",
                        () => <Truck className="w-3.5 h-3.5 text-slate-400" />,
                      ],
                      ["Dock", "Door S2"],
                      ["Ghi chú", "Giao xong trước 22:00"],
                    ]}
                  />
                </SimpleCard>

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
    className="w-10 h-10 rounded-xl grid place-items-center text-slate-500 hover:text-violet-700 hover:bg-violet-50"
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

function Step({ active = true, children }) {
  return (
    <li className="flex items-center gap-2">
      <span
        className={`w-5 h-5 rounded-full grid place-items-center text-[11px] font-bold ${
          active ? "bg-violet-500 text-white" : "bg-slate-200 text-slate-600"
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

function ModeChip({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-2.5 py-1 rounded-full border text-[11px] ${
        active
          ? "bg-violet-600 text-white border-violet-600"
          : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
      }`}
    >
      {label}
    </button>
  );
}

function ScanZone({ placeholder = "Nhập/scan mã..." }) {
  return (
    <div className="aspect-video rounded-xl border border-dashed border-slate-300 bg-slate-50 grid place-items-center">
      <div className="text-center">
        <div className="text-slate-700 font-semibold flex items-center justify-center gap-2">
          <QrCode className="w-5 h-5" /> Sẵn sàng quét EAN/UPC/GS1
        </div>
        <p className="text-[12px] text-slate-500 mt-1">
          Kết nối camera thiết bị hoặc nhập mã thủ công
        </p>
        <div className="mt-3 flex items-center gap-2 justify-center">
          <input
            className="h-9 px-3 rounded-lg border border-slate-300 text-[13px] w-64"
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

function Field({ label, value, icon }) {
  return (
    <div className="rounded-xl border border-slate-200 p-3 bg-slate-50">
      <div className="text-[12px] text-slate-500 mb-1 flex items-center gap-1">
        {icon}
        {label}
      </div>
      <div className="text-sm font-semibold text-slate-800">{value}</div>
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

function StorePOCard({ store = {}, po = {}, supplier = {} }) {
  return (
    <section className="rounded-2xl bg-white border border-slate-200/70 shadow-sm overflow-hidden">
      <header className="px-5 py-3 bg-gradient-to-r from-slate-50 to-white border-b border-slate-200/70 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-[16px] font-semibold text-slate-900 leading-tight line-clamp-1">
            Phiếu nhập / PO
          </h3>
          <p className="mt-1 text-[12px] text-slate-500 flex flex-wrap items-center gap-x-2 gap-y-1">
            <span>Mã: {po.code || "—"}</span>
            <span className="opacity-50">•</span>
            <span>Ngày: {po.date || "—"}</span>
            <span className="opacity-50">•</span>
            <span>Dock: {po.dock || "—"}</span>
          </p>
        </div>
      </header>
      <div className="p-5 space-y-5">
        <SectionLabel>Siêu thị / Nhà cung cấp</SectionLabel>
        <KVList
          zebra
          items={[
            [
              "Siêu thị",
              store.name,
              () => <Building2 className="w-3.5 h-3.5 text-slate-400" />,
            ],
            [
              "Địa chỉ",
              store.address,
              () => <MapPin className="w-3.5 h-3.5 text-slate-400" />,
            ],
            [
              "Liên hệ siêu thị",
              store.phone,
              () => <Phone className="w-3.5 h-3.5 text-slate-400" />,
              {
                asLink: store.phone
                  ? `tel:${store.phone.replace(/\s+/g, "")}`
                  : null,
              },
            ],
            ["Nhà cung cấp", supplier.name],
            ["Liên hệ NCC", supplier.contact],
            [
              "SĐT NCC",
              supplier.phone,
              () => <Phone className="w-3.5 h-3.5 text-slate-400" />,
              {
                asLink: supplier.phone
                  ? `tel:${supplier.phone.replace(/\s+/g, "")}`
                  : null,
              },
            ],
            ["Ghi chú", po.note],
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
      <div className="text-2xl font-bold leading-none text-violet-700 mt-1 text-center">
        {value}
      </div>
    </div>
  );
}

function Stat({ label, value, tone }) {
  const toneCls = tone === "amber" ? "text-amber-700" : "text-violet-700";
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
                "grid grid-cols-[130px_1fr] items-start gap-3 px-3 py-2",
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
    <span className="h-4 w-1.5 rounded bg-violet-400/70" />
    <h4 className="text-[13px] font-semibold text-slate-700">{children}</h4>
  </div>
);

function RetailItemsList({ items = [] }) {
  return (
    <div className="rounded-xl overflow-hidden border border-slate-200">
      <div className="grid grid-cols-[1fr_auto_auto_auto_auto_auto] gap-3 px-3 py-2 bg-slate-50 text-[12px] font-semibold text-slate-600">
        <div>Sản phẩm</div>
        <div className="text-right">Đặt</div>
        <div className="text-right">Đã nhận</div>
        <div>ĐVT</div>
        <div>Vị trí</div>
        <div>Giá / KM</div>
      </div>
      <ul className="divide-y divide-slate-200 bg-white">
        {items.map((it, i) => (
          <li
            key={i}
            className={`grid grid-cols-[1fr_auto_auto_auto_auto_auto] gap-3 px-3 py-2 ${
              i % 2 === 1 ? "bg-slate-50/60" : "bg-white"
            }`}
          >
            <div className="min-w-0">
              <div className="text-[13px] font-medium text-slate-900 truncate">
                {it.name}
              </div>
              <div className="text-[11px] text-slate-500 truncate">
                EAN: {it.sku}{" "}
                {it.cw ? (
                  <span className="ml-1 px-1.5 py-0.5 rounded bg-violet-100 text-violet-700">
                    CW
                  </span>
                ) : null}
              </div>
              <div className="text-[11px] text-slate-500 truncate">
                HSD: {it.exp}
              </div>
            </div>
            <div className="text-right text-[13px] tabular-nums">
              {it.ordered}
            </div>
            <div className="text-right text-[13px] tabular-nums">
              {it.received}
            </div>
            <div className="text-[13px] uppercase">{it.uom}</div>
            <div className="text-[13px]">{it.loc}</div>
            <div className="text-[12px] text-slate-700">
              {Intl.NumberFormat("vi-VN").format(it.price)} đ
              {it.promo ? (
                <div className="text-emerald-700">{it.promo}</div>
              ) : null}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
