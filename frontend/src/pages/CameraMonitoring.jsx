import React from "react";
import { useEffect } from "react";
import { Camera, Info, Truck, AlertTriangle, Search, Filter, Plus, Bell, ChevronDown, Home, Map, FileText, User, Settings, Shield } from "lucide-react";

export default function CameraPage() {
  useEffect(() => {
    document.title = "Giám sát Camera - Quản lý trái cây";
  }, []);

  return (
    <div className="bg-slate-50 text-slate-900 flex min-h-screen font-[Inter]">
      {/* ===== SIDEBAR ===== */}
      <aside className="fixed inset-y-0 left-0 w-20 bg-white border-r border-slate-200 flex flex-col items-center gap-3 p-3 shadow-sm">
        <div className="mt-1 mb-1 text-center">
          <span className="inline-grid place-items-center w-14 h-14 rounded-xl bg-gradient-to-br from-sky-50 to-white text-sky-600 ring-1 ring-sky-200/60 shadow-sm">
            <Shield className="w-6 h-6" />
          </span>
          <div className="mt-1 text-[10px] font-semibold tracking-wide text-sky-700">LGBT</div>
        </div>

        <div className="flex flex-col items-center gap-4 mt-3">
          <SidebarButton icon={<Home />} title="Trang chủ" />
          <SidebarButton icon={<Map />} title="Theo dõi vị trí" />
          <SidebarButton icon={<FileText />} title="Lịch sử giao dịch" />
          <div className="relative">
            <SidebarButton icon={<Bell />} title="Thông báo" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
          </div>
          <SidebarButton icon={<User />} title="Người dùng" />
          <SidebarButton icon={<Settings />} title="Cài đặt" />
        </div>
      </aside>

      {/* ===== MAIN CONTENT ===== */}
      <main className="ml-20 flex-grow flex flex-col">
        {/* ===== HEADER ===== */}
        <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b bg-gradient-to-l from-blue-900 via-sky-200 to-white">
          <div className="flex items-center justify-between px-5 py-2.5">
            {/* Search */}
            <div className="flex-1 max-w-2xl mr-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm camera, khu vực..."
                  className="w-full h-10 pl-9 pr-24 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-200"
                />
                <button
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 grid place-items-center rounded-lg border border-slate-200 hover:bg-slate-50"
                  title="Filter"
                >
                  <Filter className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2">
              <IconButton icon={<Plus />} title="Thêm mới" />
              <IconButton icon={<Bell />} title="Thông báo" />
              <div className="group inline-flex items-center gap-2 pl-1 pr-2 py-1.5 rounded-full bg-white text-slate-900 ring-1 ring-slate-200 hover:bg-slate-50 cursor-pointer">
                <img
                  src="https://i.pravatar.cc/40?img=8"
                  alt="Avatar"
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div className="text-left leading-tight hidden sm:block">
                  <div className="text-[13px] font-semibold">Harsh Vani</div>
                  <div className="text-[11px] text-slate-500 -mt-0.5">Deportation Manager</div>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </div>
            </div>
          </div>
        </header>

        {/* ===== CAMERA + INFO ===== */}
        <section className="p-6 flex-grow flex flex-col">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-lg p-6 flex-grow flex flex-col">
            <div className="flex gap-6 flex-grow">
              {/* LEFT: CAMERA */}
              <div className="w-1/2 bg-[#1E1E1E] rounded-xl relative flex items-center justify-center shadow-inner">
                <button className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-lg transition">
                  <Camera className="w-6 h-6 text-white" />
                </button>
                <div className="text-center">
                  <Camera className="w-16 h-16 text-gray-500 mx-auto mb-3" />
                  <p className="text-gray-400">Camera Feed</p>
                </div>
              </div>

              {/* RIGHT: INFO SECTION */}
              <div className="w-1/2 flex flex-col gap-4">
                {/* Product Info */}
                <div className="flex-grow bg-slate-50 rounded-xl p-6 border border-blue-200 shadow-sm overflow-y-auto">
                  <h2 className="text-xl font-semibold text-blue-700 mb-4 flex items-center gap-2">
                    <Info className="w-5 h-5 text-blue-500" /> Thông tin sản phẩm
                  </h2>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-[15px] text-slate-800">
                    <InfoRow label="Tên sản phẩm" value="Cam Sành Tiền Giang" />
                    <InfoRow label="Loại" value="Trái cây tươi" />
                    <InfoRow label="Mã QR" value="QR-985123" />
                    <InfoRow label="Khối lượng" value="12.4 kg" />
                    <InfoRow label="Nhà cung cấp" value="Công ty TNHH GreenFarm" />
                    <InfoRow label="Ngày nhập" value="14/10/2025" />
                    <InfoRow label="Trạng thái" value="Đang chờ kiểm định" />
                    <InfoRow label="Ghi chú" value="Hàng tươi, chưa phân loại." />
                  </div>
                </div>

                {/* Supplier Info */}
                <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-5">
                  <h3 className="text-lg font-semibold text-sky-700 mb-3 flex items-center gap-2">
                    <Truck className="w-5 h-5 text-sky-500" /> Thông tin nhà cung cấp
                  </h3>
                  <div className="grid grid-cols-2 gap-y-2 text-[15px]">
                    <InfoRow label="Tên" value="GreenFarm Co., Ltd" />
                    <InfoRow label="Người phụ trách" value="Nguyễn Văn A" />
                    <InfoRow label="Địa chỉ" value="Tân Phước, Tiền Giang" />
                    <InfoRow label="SĐT" value="0908 123 456" />
                  </div>
                </div>

                {/* Alert */}
                <div className="bg-[#FFF2F2] border border-red-300 rounded-xl p-5 shadow-sm flex items-start gap-4">
                  <AlertTriangle className="w-8 h-8 text-red-500 mt-1" />
                  <div>
                    <h4 className="text-red-600 font-semibold text-lg">CẢNH BÁO</h4>
                    <p className="text-gray-700 text-[15px]">
                      Phát hiện dữ liệu chưa khớp giữa mã QR và thông tin hệ thống. Vui lòng xác minh để đảm bảo chính xác lô hàng.
                    </p>
                  </div>
                </div>
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
    className="w-10 h-10 rounded-xl grid place-items-center text-slate-400 hover:text-sky-600 hover:bg-sky-50"
    title={title}
  >
    {icon}
  </button>
);

const IconButton = ({ icon, title }) => (
  <button
    className="h-9 w-9 rounded-lg grid place-items-center ring-1 ring-sky-300 text-sky-700 bg-white hover:bg-sky-50"
    title={title}
  >
    {icon}
  </button>
);

const InfoRow = ({ label, value }) => (
  <p>
    <span className="font-medium text-gray-600">{label}:</span> {value}
  </p>
);
