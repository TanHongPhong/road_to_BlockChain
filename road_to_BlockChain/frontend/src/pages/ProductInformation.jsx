import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Star,
  BadgeCheck,
  ShieldCheck,
  Thermometer,
  Package,
  Clock,
  MapPin,
  Phone,
  Building2,
  CheckCircle2,
  AlertCircle,
  Info,
  Mail,
  QrCode,
} from "lucide-react";
import TemperatureDiagramCard from "../components/mobile_user/TemperatureDiagramCard.jsx";

/** Small helpers */
const Dot = ({ className = "bg-emerald-500" }) => (
  <span className={`inline-block w-2 h-2 rounded-full ${className}`} />
);

const InfoRow = ({ icon: Icon, label, value, hint }) => (
  <div className="flex items-start gap-2">
    <Icon className="w-4 h-4 mt-[2px] text-slate-500 shrink-0" />
    <div className="text-[12px] md:text-[13px] text-slate-600 leading-relaxed">
      <span className="text-slate-500">{label}: </span>
      <span className="font-medium text-slate-700">{value}</span>
      {hint ? <span className="text-slate-500"> — {hint}</span> : null}
    </div>
  </div>
);

const StatChip = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2">
    <Icon className="w-4 h-4 text-slate-600" />
    <div className="text-[12px] leading-tight">
      <div className="text-slate-500">{label}</div>
      <div className="font-semibold text-slate-800">{value}</div>
    </div>
  </div>
);

export default function ProductInformationMobile() {
  const navigate = useNavigate();
  const [showTempDiagram, setShowTempDiagram] = useState(false);

  return (
    <div className="bg-[#f4f7ff] font-inter text-[#0f172a] min-h-[100dvh]">
      {/* NAV — tối giản cho mobile */}
      <header className="px-3 py-3 sticky top-0 z-40 bg-[#f4f7ff]/80 backdrop-blur-sm border-b border-[#e6e9f0]">
        <div className="flex items-center justify-between">
          <div
            className="w-9 h-9 rounded-xl grid place-items-center text-white font-extrabold shadow-[0_6px_16px_rgba(90,124,250,.45)]"
            style={{ background: "linear-gradient(135deg, #7c8dff, #5b7cfa)" }}
          >
            L
          </div>

          {/* User */}
          <div className="ml-auto flex items-center gap-2 bg-white border border-[#e6e9f0] rounded-xl px-2.5 py-1.5 shadow-[0_8px_22px_rgba(2,6,23,.06)]">
            <img
              className="w-8 h-8 rounded-full object-cover"
              src="https://cdn-media.sforum.vn/storage/app/media/Van%20Pham/5/5b/anh-ac-quy-anime-10.jpg"
              alt="User avatar"
            />
            <strong className="text-sm">TriDzai</strong>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="px-3 pb-5">
        {/* Tiêu đề + segmented nhỏ gọn */}
        <div className="pt-3">
          <div className="text-[11px] tracking-wide text-slate-500 font-semibold">
            1000+ buys
          </div>
          <div className="mt-1 flex items-center justify-between">
            <h1 className="text-[22px] leading-tight font-bold -tracking-[.02em]">
              Shipping information
            </h1>

            {/* Nút SCAN QR (đổi từ nút filter theo yêu cầu) */}
            <button
              onClick={() => navigate("/qr-scanner-mobile")}
              className="w-14 h-14 grid place-items-center rounded-xl bg-white border border-[#e6e9f0] shadow-[0_8px_22px_rgba(2,6,23,.06)]"
              type="button"
              title="Quét QR"
            >
              <QrCode className="w-9 h-9 text-slate-700" />
            </button>
          </div>

          <div className="mt-2 bg-slate-100 rounded-full p-1 inline-flex items-center gap-1">
            <span
              className="px-3 py-1.5 rounded-full text-[11px] font-semibold text-white"
              style={{ background: "linear-gradient(90deg, #5b7cfa, #7b8cff)" }}
            >
              Asked AI
            </span>
            <button
              onClick={() => setShowTempDiagram(true)}
              className="px-3 py-1.5 rounded-full text-[11px] font-semibold text-slate-700 bg-white border border-[#e6e9f0]"
              type="button"
            >
              Temperature diagram
            </button>
          </div>
          {showTempDiagram && (
            <TemperatureDiagramCard onClose={() => setShowTempDiagram(false)} />
          )}
        </div>

        {/* SUPPLIER */}
        <article className="mt-3 bg-white border border-[#e6e9f0] rounded-[16px] shadow-[0_8px_22px_rgba(2,6,23,.06)] p-3">
          <div className="grid grid-cols-[auto_1fr] gap-3 items-start">
            {/* CỘT TRÁI: Tên + Ảnh */}
            <div className="w-[200px]">
              <h3 className="font-semibold text-[14px] leading-tight mb-2 line-clamp-2">
                Supplier — GreenFarm Co.
              </h3>
              <img
                className="w-[190px] h-[160px] rounded-xl object-cover"
                src="https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=480&auto=format&fit=crop"
                alt="Supplier (fresh produce)"
                loading="lazy"
              />
              <InfoRow icon={Mail} label="Email" value="contact@greenfarm.co" />
              <InfoRow
                icon={MapPin}
                label="Khu vực"
                value="HCM, Đà Nẵng, Hà Nội"
              />
            </div>

            {/* CỘT PHẢI: Thông tin */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <BadgeCheck
                    className="w-4 h-4 text-emerald-600"
                    title="Verified"
                  />
                  <ShieldCheck
                    className="w-4 h-4 text-indigo-600"
                    title="GAP certified"
                  />
                </div>
                <div className="flex items-center gap-1 text-amber-500">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="text-xs text-slate-700">4.8</span>
                </div>
              </div>

              <div className="mt-3 text-slate-600 text-[12px]">
                Nhà cung cấp rau củ chuẩn GAP, chuyên tuyến TP.HCM → miền Bắc,
                hỗ trợ kiểm soát nhiệt độ. Lorem ipsum dolor sit amet
                consectetur, adipisicing elit. Lorem, ipsum dolor sit amet
                consectetur adipisicing elit.
              </div>
            </div>
          </div>
        </article>

        {/* WAREHOUSE */}
        <article className="mt-3 bg-white border border-[#e6e9f0] rounded-[16px] shadow-[0_8px_22px_rgba(2,6,23,.06)] p-3">
          <div className="grid grid-cols-[auto_1fr] gap-3 items-start">
            {/* CỘT TRÁI: Tên + Ảnh + Info ngắn */}
            <div className="w-[200px]">
              <h3 className="font-semibold text-[14px] leading-tight mb-2 line-clamp-2">
                Warehouse — Thủ Đức
              </h3>
              <img
                className="w-[190px] h-[160px] rounded-xl object-cover"
                src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=900&auto=format&fit=crop"
                alt="Warehouse interior"
                loading="lazy"
              />
            </div>

            {/* CỘT PHẢI: Thông tin chi tiết */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Dot />
                  <span className="text-[12px] text-slate-500">Active</span>
                  <span className="ml-2 text-[12px] text-slate-500">
                    ID: WH-001
                  </span>
                </div>
              </div>

              <div className="mt-3 text-slate-600 text-[12px]">
                Kho lạnh đa vùng, hỗ trợ cross-dock và kiểm soát nhiệt độ theo
                zone để bảo toàn chất lượng hàng tươi.
              </div>
              <InfoRow
                icon={MapPin}
                label="Address"
                value="123 Logistics Ave"
              />
              <InfoRow
                icon={Thermometer}
                label="Temp Range"
                value="2–8°C"
                hint="Multi-zone"
              />
            </div>
          </div>
        </article>

        {/* SUPER MARKET — giống bố cục Supplier: tiêu đề trên ảnh (trái), thông tin bên phải */}
        <article className="mt-3 bg-white border border-[#e6e9f0] rounded-[16px] shadow-[0_8px_22px_rgba(2,6,23,.06)] p-3">
          <div className="grid grid-cols-[auto_1fr] gap-3 items-start">
            {/* CỘT TRÁI: Tên + Ảnh + Info ngắn */}
            <div className="w-[200px]">
              <h3 className="font-semibold text-[14px] leading-tight mb-2 line-clamp-2">
                Super market
              </h3>
              <img
                className="w-[190px] h-[160px] rounded-xl object-cover"
                src="https://media.istockphoto.com/id/1497187093/vi/anh/nhi%E1%BB%81u-lo%E1%BA%A1i-s%E1%BA%A3n-ph%E1%BA%A9m-tr%C3%AAn-c%C3%A1c-l%E1%BB%91i-%C4%91i-v%C3%A0-k%E1%BB%87-kh%C3%A1c-nhau-t%E1%BA%A1i-si%C3%AAu-th%E1%BB%8B.jpg?s=612x612&w=0&k=20&c=GXfFe80mgRhkBlo5GBT7NJjW37_z9pOWobsw3DNU8SU="
                alt="Supermarket produce"
                loading="lazy"
              />
            </div>

            {/* CỘT PHẢI: Thông tin chi tiết */}
            <div className="min-w-0">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-1 text-amber-500">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="text-xs text-slate-700">4.8</span>
                </div>
                <div className="flex items-center gap-1 text-[12px] text-slate-600">
                  <Info className="w-4 h-4" />
                </div>
              </div>

              <div className="mt-3 text-slate-600 text-[12px]">
                Nhận hàng theo khung giờ ưu tiên, yêu cầu kiểm soát nhiệt độ và
                quét QR tại cổng nhập để tăng tốc thủ tục.
              </div>
              <InfoRow
                icon={MapPin}
                label="Area"
                value="TP.HCM — Q.1, Q.2, Thủ Đức"
              />
              <InfoRow icon={Clock} label="Open" value="7:30–21:30" />
            </div>
          </div>
        </article>

        {/* MAP — chỉ hiển thị bản đồ, bỏ thẻ nổi */}
        <section className="mt-3 relative h-[28dvh] rounded-[16px] overflow-hidden border border-[#e6e9f0] shadow-[0_8px_22px_rgba(2,6,23,.06)]">
          <iframe
            title="Map - Thu Duc Warehouse"
            className="w-full h-full"
            // OpenStreetMap embed with marker tại Thủ Đức (TP.HCM)
            src="https://www.openstreetmap.org/export/embed.html?bbox=106.70%2C10.80%2C106.84%2C10.92&layer=mapnik&marker=10.852%2C106.772"
            style={{ border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </section>
      </main>
    </div>
  );
}
