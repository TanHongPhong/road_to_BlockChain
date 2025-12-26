import React, { useEffect, useState } from "react";
import {
  QrCode,
  CheckCircle2,
  MapPin,
  Tag,
  Hash,
  Minus,
  Plus,
  Package,
  Layers3,
  Camera as CameraIcon,
} from "lucide-react";

// MOBILE — Shelf Putaway (Đưa hàng lên kệ)
// - Không topbar, không sidebar
// - Một cột, thân thiện cảm ứng, nút lớn, sticky action bar phía dưới
// - Quy trình: Quét hàng → Quét kệ → Chọn SL → Xác nhận lên kệ

export default function MobileShelfPutaway() {
  const [mode, setMode] = useState("PRODUCT"); // PRODUCT | SHELF
  const [qty, setQty] = useState(3);
  const [scannedProduct, setScannedProduct] = useState({
    name: "Cam Sành Tiền Giang 1kg",
    sku: "8931234567890",
    lot: "LOT2310",
    exp: "25/11/2025",
    uom: "each",
    backroom: "BR-A1-05",
  });
  const [shelf, setShelf] = useState({
    code: "A-03-02",
    zone: "Produce (Fresh)",
  });
  const [events, setEvents] = useState([
    { ts: "21:02", text: "Đã lên kệ 3 each tại A-02-01" },
    { ts: "20:55", text: "Đã lên kệ 2 each tại A-01-04" },
  ]);

  useEffect(() => {
    document.title = "Lên kệ (Mobile)";
  }, []);

  const inc = () => setQty((q) => Math.min(9999, q + 1));
  const dec = () => setQty((q) => Math.max(0, q - 1));

  const confirmPutaway = () => {
    if (!scannedProduct || !shelf || qty <= 0) return;
    setEvents((e) => [
      {
        ts: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        text: `Lên kệ ${qty} ${scannedProduct.uom} tại ${shelf.code}`,
      },
      ...e,
    ]);
    // reset SL (demo)
    setQty(0);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Container max width for mobile */}
      <div className="mx-auto max-w-md px-4 pt-4 pb-28">
        {/* Title (inline, không topbar) */}
        <h1 className="text-lg font-semibold tracking-tight">
          Đưa hàng lên kệ
        </h1>
        <p className="text-[12px] text-slate-500">
          Quét mã hàng và nhãn kệ để thực hiện putaway
        </p>

        {/* Segmented control */}
        <div className="mt-3 grid grid-cols-2 p-1 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <button
            onClick={() => setMode("PRODUCT")}
            className={`h-10 rounded-xl text-sm font-medium ${
              mode === "PRODUCT" ? "bg-slate-900 text-white" : "text-slate-600"
            }`}
          >
            Quét hàng
          </button>
          <button
            onClick={() => setMode("SHELF")}
            className={`h-10 rounded-xl text-sm font-medium ${
              mode === "SHELF" ? "bg-slate-900 text-white" : "text-slate-600"
            }`}
          >
            Quét kệ
          </button>
        </div>

        {/* Scan Zone */}
        <section className="mt-4 rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-sm">
          <header className="px-4 py-3 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
            <div className="flex items-center gap-2 text-[13px] font-semibold text-slate-700">
              <QrCode className="w-4 h-4" />{" "}
              {mode === "PRODUCT" ? "Khu vực quét hàng" : "Khu vực quét kệ"}
            </div>
            <button className="flex items-center gap-2 text-[12px] px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white">
              <CameraIcon className="w-4 h-4" /> Mở camera
            </button>
          </header>
          <div className="p-4">
            <div className="aspect-[3/4] rounded-xl border border-dashed border-slate-300 bg-slate-50 grid place-items-center">
              <div className="text-center">
                <div className="text-slate-700 font-semibold flex items-center justify-center gap-2">
                  <QrCode className="w-5 h-5" />{" "}
                  {mode === "PRODUCT"
                    ? "Quét EAN/UPC/GS1 của HÀNG"
                    : "Quét nhãn vị trí KỆ"}
                </div>
                <p className="text-[12px] text-slate-500 mt-1">
                  Hoặc nhập tay bên dưới
                </p>
                <div className="mt-3 flex items-center gap-2 justify-center">
                  <input
                    className="h-11 w-56 px-3 rounded-lg border border-slate-300 text-[13px]"
                    placeholder={
                      mode === "PRODUCT" ? "Nhập mã hàng..." : "Nhập mã kệ..."
                    }
                  />
                  <button className="h-11 px-3 rounded-lg border border-slate-200 bg-white text-[13px]">
                    OK
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Product Card */}
        <section className="mt-4 rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-sm">
          <header className="px-4 py-3 border-b border-slate-200 bg-slate-50 text-[13px] font-semibold text-slate-700 flex items-center gap-2">
            <Package className="w-4 h-4" /> Thông tin hàng
          </header>
          <div className="p-4 space-y-3">
            <Row label="Tên hàng" value={scannedProduct?.name} />
            <Row
              label="EAN/UPC"
              value={scannedProduct?.sku}
              icon={<Hash className="w-3.5 h-3.5 text-slate-400" />}
            />
            <Row label="Lô" value={scannedProduct?.lot} />
            <Row label="HSD" value={scannedProduct?.exp} />
            <Row
              label="Kho sau"
              value={scannedProduct?.backroom}
              icon={<Layers3 className="w-3.5 h-3.5 text-slate-400" />}
            />
          </div>
        </section>

        {/* Shelf Card */}
        <section className="mt-4 rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-sm">
          <header className="px-4 py-3 border-b border-slate-200 bg-slate-50 text-[13px] font-semibold text-slate-700 flex items-center gap-2">
            <MapPin className="w-4 h-4" /> Vị trí kệ
          </header>
          <div className="p-4 space-y-3">
            <Row
              label="Mã kệ"
              value={shelf?.code}
              icon={<MapPin className="w-3.5 h-3.5 text-slate-400" />}
            />
            <Row label="Khu vực" value={shelf?.zone} />
            <div className="pt-1">
              <div className="text-[12px] text-slate-500 mb-1">
                Số lượng lên kệ
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={dec}
                  className="w-12 h-12 grid place-items-center rounded-xl border border-slate-200 bg-white"
                >
                  <Minus className="w-5 h-5" />
                </button>
                <input
                  type="number"
                  value={qty}
                  onChange={(e) => setQty(Number(e.target.value || 0))}
                  className="w-24 h-12 text-center rounded-xl border border-slate-200 bg-white text-lg font-semibold"
                />
                <button
                  onClick={inc}
                  className="w-12 h-12 grid place-items-center rounded-xl border border-slate-200 bg-white"
                >
                  <Plus className="w-5 h-5" />
                </button>
                <span className="text-[12px] text-slate-500 ml-1">
                  ĐVT: {scannedProduct?.uom}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Recent events */}
        <section className="mt-4 rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-sm">
          <header className="px-4 py-3 border-b border-slate-200 bg-slate-50 text-[13px] font-semibold text-slate-700 flex items-center gap-2">
            <Tag className="w-4 h-4" /> Nhật ký gần đây
          </header>
          <ul className="divide-y divide-slate-200">
            {events.map((e, i) => (
              <li
                key={i}
                className="px-4 py-3 text-[13px] flex items-center gap-3"
              >
                <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[11px]">
                  {e.ts}
                </span>
                <span className="text-slate-800">{e.text}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* Sticky bottom action bar */}
      <div className="fixed bottom-0 inset-x-0">
        <div className="mx-auto max-w-md px-4 pb-4">
          <div className="rounded-2xl border border-slate-200 bg-white/95 backdrop-blur shadow-lg">
            <div className="p-3 flex items-center justify-between gap-2">
              <div className="text-[12px] text-slate-600">
                {scannedProduct?.name ? (
                  <>
                    <div className="font-medium text-slate-800 truncate max-w-[220px]">
                      {scannedProduct.name}
                    </div>
                    <div className="-mt-0.5">
                      SL lên kệ: <b>{qty}</b> • Kệ: <b>{shelf?.code}</b>
                    </div>
                  </>
                ) : (
                  <div>Chưa có dữ liệu quét</div>
                )}
              </div>
              <button
                onClick={confirmPutaway}
                className="h-11 px-4 rounded-xl bg-emerald-600 text-white text-[13px] font-semibold inline-flex items-center gap-2 disabled:opacity-60"
                disabled={!scannedProduct || !shelf || qty <= 0}
              >
                <CheckCircle2 className="w-4 h-4" /> Xác nhận lên kệ
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ===== Small UI pieces ===== */
function Row({ label, value, icon }) {
  if (value == null || value === "") return null;
  return (
    <div className="grid grid-cols-[110px_1fr] items-start gap-3">
      <div className="text-[12px] text-slate-500">{label}</div>
      <div className="text-[14px] text-slate-900 flex items-center gap-2 break-words min-w-0">
        {icon ? <span className="mt-0.5">{icon}</span> : null}
        <span className="min-w-0">{value}</span>
      </div>
    </div>
  );
}
