// File: src/pages/WarehouseInOut.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import feather from "feather-icons";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";

export default function WarehouseInOut() {
  // ===== Mock data =====
  const DATA = useMemo(
    () => [
      {
        id: "DL04MP7045",
        type: "in",
        status: "Đang vận chuyển",
        customer: "Đặng Huy Tuấn",
        from: "Lào tồn",
        to: "TP.HCM",
        weight: 250,
        unit: "KG",
        pallets: 8,
        docks: "D1",
        carrier: "GMD-TRK-21",
        eta: "12/12/2025",
        temp: "Thường",
      },
      {
        id: "DL04MP7046",
        type: "out",
        status: "Đã xuất kho",
        customer: "Thái Lý Lộc",
        from: "Bình Định",
        to: "Hà Nội",
        weight: 2000,
        unit: "KG",
        pallets: 12,
        docks: "D3",
        carrier: "GMD-TRK-07",
        eta: "01/12/2025",
        temp: "Mát",
      },
      {
        id: "DL04MP7054",
        type: "in",
        status: "Lưu kho",
        customer: "Tân Hồng Phong",
        from: "Vũng Tàu",
        to: "Đồng Nai",
        weight: 540,
        unit: "KG",
        pallets: 10,
        docks: "D2",
        carrier: "GMD-TRK-12",
        eta: "12/07/2025",
        temp: "Mát",
      },
      {
        id: "DL04MP7525",
        type: "in",
        status: "Đang vận chuyển",
        customer: "Ngô Trọng Nhân",
        from: "Đồng Nai",
        to: "Nha Trang",
        weight: 938,
        unit: "KG",
        pallets: 15,
        docks: "D5",
        carrier: "GMD-TRK-33",
        eta: "20/07/2025",
        temp: "Lạnh",
      },
      {
        id: "DL04MP9845",
        type: "out",
        status: "Đang vận chuyển",
        customer: "Lê Quang Trường",
        from: "Khánh Hoà",
        to: "TP.HCM",
        weight: 12000,
        unit: "KG",
        pallets: 25,
        docks: "D4",
        carrier: "GMD-TRK-08",
        eta: "12/01/2025",
        temp: "Thường",
      },
      {
        id: "DL04MP7875",
        type: "in",
        status: "Lưu kho",
        customer: "Thái Lý Lộc",
        from: "Cà Mau",
        to: "Hà Nội",
        weight: 250,
        unit: "KG",
        pallets: 6,
        docks: "D2",
        carrier: "GMD-TRK-02",
        eta: "22/06/2025",
        temp: "Thường",
      },
      {
        id: "DL04MP7995",
        type: "out",
        status: "Lưu kho",
        customer: "Ngô Trọng Nhân",
        from: "Bến Tre",
        to: "Cà Mau",
        weight: 370,
        unit: "KG",
        pallets: 9,
        docks: "D6",
        carrier: "GMD-TRK-19",
        eta: "19/01/2025",
        temp: "Mát",
      },
      {
        id: "DL04MP4545",
        type: "in",
        status: "Đang vận chuyển",
        customer: "Đặng Huy Tuấn",
        from: "Vũng Tàu",
        to: "Vĩnh Long",
        weight: 920,
        unit: "KG",
        pallets: 14,
        docks: "D1",
        carrier: "GMD-TRK-17",
        eta: "17/08/2025",
        temp: "Thường",
      },
    ],
    []
  );

  // ===== UI state =====
  const [tab, setTab] = useState("all"); // 'all' | 'in' | 'out' | 'hold'
  const [dock, setDock] = useState("Tất cả");
  const [temp, setTemp] = useState("Tất cả");

  const baseRows = useMemo(
    () => (tab === "all" ? DATA : DATA.filter((d) => d.type === tab)),
    [DATA, tab]
  );
  const filteredRows = useMemo(
    () =>
      baseRows.filter(
        (d) =>
          (dock === "Tất cả" || d.docks === dock) &&
          (temp === "Tất cả" || d.temp === temp)
      ),
    [baseRows, dock, temp]
  );

  // Feather icons refresh
  useEffect(() => {
    feather.replace({ width: 21, height: 21 });
  }, [tab, dock, temp, filteredRows.length]);

  // KPI values (mock)
  const inboundToday = 34;
  const outboundToday = 29;
  const inTransit = baseRows.filter(
    (d) => d.status === "Đang vận chuyển"
  ).length;
  const alerts = 2;
  const capacityUsed = 72;

  // Export CSV
  const handleExport = () => {
    const rows = filteredRows;
    const header = [
      "Mã đơn",
      "Loại",
      "Trạng thái",
      "Khách hàng",
      "Điểm đi",
      "Điểm đến",
      "Pallets",
      "Khối lượng",
      "Door",
      "Xe/Container",
      "Ngày",
    ];
    const lines = [header.join(",")].concat(
      rows.map((o) =>
        [
          o.id,
          o.type,
          o.status,
          o.customer,
          o.from,
          o.to,
          o.pallets,
          `${o.weight} ${o.unit}`,
          o.docks,
          o.carrier,
          o.eta,
        ]
          .map((x) => `"${String(x).replace(/"/g, '""')}"`)
          .join(",")
      )
    );
    const blob = new Blob([lines.join("\n")], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "warehouse_in_out.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-slate-50 text-slate-900 min-h-screen">
      <Sidebar />

      <main className="ml-20">
        {/* ===== HEADER ===== */}
        <Topbar />

        {/* ===== CONTENT ===== */}
        <section className="p-6 md:p-8 space-y-6">
          {/* Title & Controls */}
          <div className="flex flex-col xl:flex-row xl:items-end xl:justify-between gap-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
                Quản lý nhập / xuất kho
              </h2>
              <p className="text-slate-600">
                Theo dõi real-time, KPI & công suất kho.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-2" id="tabs">
                <button
                  onClick={() => setTab("all")}
                  className={`tab-btn h-10 px-3 rounded-xl text-sm border ${
                    tab === "all"
                      ? "bg-slate-900 text-white border-slate-900"
                      : "bg-white border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  Tất cả
                </button>
                <button
                  onClick={() => setTab("in")}
                  className={`tab-btn h-10 px-3 rounded-xl text-sm border ${
                    tab === "in"
                      ? "bg-slate-900 text-white border-slate-900"
                      : "bg-white border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  Nhập kho
                </button>
                <button
                  onClick={() => setTab("out")}
                  className={`tab-btn h-10 px-3 rounded-xl text-sm border ${
                    tab === "out"
                      ? "bg-slate-900 text-white border-slate-900"
                      : "bg-white border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  Xuất kho
                </button>
                <button
                  onClick={() => setTab("hold")}
                  className={`tab-btn h-10 px-3 rounded-xl text-sm border ${
                    tab === "hold"
                      ? "bg-slate-900 text-white border-slate-900"
                      : "bg-white border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  Đang giữ tạm
                </button>
              </div>

              <select
                value={dock}
                onChange={(e) => setDock(e.target.value)}
                className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm"
              >
                {["Tất cả", "D1", "D2", "D3", "D4", "D5", "D6"].map((d) => (
                  <option key={d}>{d}</option>
                ))}
              </select>

              <select
                value={temp}
                onChange={(e) => setTemp(e.target.value)}
                className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm"
              >
                {["Tất cả", "Thường", "Mát", "Lạnh"].map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>

              <button
                onClick={() => feather.replace({ width: 21, height: 21 })}
                className="h-10 px-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-sm flex items-center gap-2"
              >
                <i data-feather="refresh-cw" className="w-4 h-4" />
                <span>Tải lại</span>
              </button>
            </div>
          </div>

          {/* KPI Row */}
          <div className="grid md:grid-cols-5 gap-3" id="kpiRow">
            <Stat
              icon="package"
              label="Đã nhập hôm nay"
              value={inboundToday}
              tone="in"
            />
            <Stat
              icon="truck"
              label="Đã xuất hôm nay"
              value={outboundToday}
              tone="out"
            />
            <Stat
              icon="truck"
              label="Đang vận chuyển"
              value={inTransit}
              tone="neutral"
            />
            <Stat
              icon="alert-triangle"
              label="Cảnh báo"
              value={alerts}
              sub="Thiếu chứng từ: 1 • Lệch khối lượng: 1"
              tone="alert"
            />
            <div className="rounded-2xl p-4 border border-slate-200 bg-white">
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <i data-feather="activity" className="w-4 h-4" />
                Công suất kho
              </div>
              <div className="mt-2">
                <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-600"
                    style={{ width: `${capacityUsed}%` }}
                  />
                </div>
              </div>
              <div className="text-[12px] text-slate-500 mt-1">
                {capacityUsed}% sử dụng • 1.450/2.000 pallets
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            {/* Left 2/3 */}
            <section className="w-full space-y-4">
              {/* Data Table */}
              <div className="rounded-2xl bg-white border border-slate-200 shadow-soft overflow-hidden">
                <div className="px-5 md:px-6 py-4 bg-gradient-to-r from-[#8CC2FF] via-[#6AA8FF] to-[#2A60FF] text-white flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-8 h-8 rounded-xl bg-white/20 grid place-items-center">
                      <i data-feather="package" className="w-[18px] h-[18px]" />
                    </div>
                    <div>
                      <div className="opacity-90">Kho trung tâm</div>
                      <div className="font-semibold">Gemadept Logistics</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="h-9 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm flex items-center gap-2">
                      <i data-feather="upload" className="w-4 h-4" /> Import
                    </button>
                    <button
                      onClick={handleExport}
                      className="h-9 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm flex items-center gap-2"
                    >
                      <i data-feather="download" className="w-4 h-4" /> Export
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto thin-scrollbar">
                  <table className="min-w-full text-sm">
                    <thead className="bg-slate-50 text-slate-600">
                      <tr>
                        {[
                          "MÃ ĐƠN",
                          "LOẠI",
                          "TRẠNG THÁI",
                          "KHÁCH HÀNG",
                          "ĐIỂM ĐI",
                          "ĐIỂM ĐẾN",
                          "PALLETS",
                          "KHỐI LƯỢNG",
                          "DOOR",
                          "XE/CONTAINER",
                          "NGÀY",
                        ].map((h) => (
                          <th
                            key={h}
                            className="text-left text-[11px] tracking-wider font-semibold uppercase px-5 py-3"
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredRows.length ? (
                        filteredRows.map((o) => (
                          <tr key={o.id} className="hover:bg-slate-50/70">
                            <td className="px-5 py-3 align-middle font-medium text-slate-900">
                              <span className="inline-block max-w-[140px] truncate align-middle">
                                {o.id}
                              </span>
                            </td>
                            <td className="px-5 py-3 align-middle">
                              <span
                                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs ring-1 ${
                                  o.type === "in"
                                    ? "bg-blue-50 text-blue-700 ring-blue-200"
                                    : "bg-indigo-50 text-indigo-700 ring-indigo-200"
                                }`}
                              >
                                {o.type === "in" ? "Nhập" : "Xuất"}
                              </span>
                            </td>
                            <td className="px-5 py-3 align-middle">
                              <StatusBadge status={o.status} />
                            </td>
                            <td className="px-5 py-3 align-middle">
                              {o.customer}
                            </td>
                            <td className="px-5 py-3 align-middle">{o.from}</td>
                            <td className="px-5 py-3 align-middle">{o.to}</td>
                            <td className="px-5 py-3 align-middle">
                              {o.pallets}
                            </td>
                            <td className="px-5 py-3 align-middle">
                              {o.weight.toLocaleString()} {o.unit}
                            </td>
                            <td className="px-5 py-3 align-middle">
                              {o.docks}
                            </td>
                            <td className="px-5 py-3 align-middle">
                              {o.carrier}
                            </td>
                            <td className="px-5 py-3 align-middle text-right pr-5 text-slate-600">
                              {o.eta}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan={11}
                            className="px-5 py-6 text-center text-slate-500"
                          >
                            Không có bản ghi phù hợp.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            {/* Right  */}
            <aside className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {/* Inventory snapshot */}
              <div className="rounded-2xl p-5 border border-slate-200 bg-white">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <i data-feather="box" className="w-4 h-4" /> Tồn kho nhanh
                </div>
                <div className="mt-3 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Kệ thường</span>
                    <span className="font-medium">1.120 pallets</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Kho mát</span>
                    <span className="font-medium">210 pallets</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Kho lạnh</span>
                    <span className="font-medium">120 pallets</span>
                  </div>
                </div>
                <div className="mt-3">
                  <div className="text-xs text-slate-600 mb-1">
                    Tỷ lệ lấp đầy
                  </div>
                  <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-indigo-600"
                      style={{ width: "72%" }}
                    />
                  </div>
                </div>
              </div>

              {/* Staff */}
              <div className="rounded-2xl p-5 border border-slate-200 bg-white">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <i data-feather="users" className="w-4 h-4" /> Nhân sự ca hôm
                  nay
                </div>
                <ul className="mt-3 space-y-2 text-sm">
                  <li className="flex justify-between">
                    <span>Ca sáng</span>
                    <span className="text-slate-700">
                      12 NV (2 QC, 1 Supervisor)
                    </span>
                  </li>
                  <li className="flex justify-between">
                    <span>Ca chiều</span>
                    <span className="text-slate-700">
                      10 NV (1 QC, 1 Supervisor)
                    </span>
                  </li>
                </ul>
              </div>
            </aside>
          </div>
        </section>

        <footer className="text-center text-slate-400 text-xs mt-4 mb-6">
          © 2025 Gemadept – Trang quản lý nhập / xuất kho.
        </footer>
      </main>
    </div>
  );
}

/* =============== Subcomponents =============== */
function Stat({ icon, label, value, sub, tone = "neutral" }) {
  const toneMap = {
    neutral: "bg-slate-50",
    in: "bg-blue-50",
    out: "bg-indigo-50",
    alert: "bg-rose-50",
  };
  return (
    <div className={`rounded-2xl p-4 border border-slate-200 ${toneMap[tone]}`}>
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <i data-feather={icon} className="w-4 h-4" />
        {label}
      </div>
      <div className="mt-1 text-2xl font-bold tracking-tight">{value}</div>
      {sub ? (
        <div className="text-[12px] text-slate-500 mt-1">{sub}</div>
      ) : null}
    </div>
  );
}

function StatusBadge({ status }) {
  const map = {
    "Đã xuất kho": "bg-red-50 text-red-600 ring-red-200",
    "Lưu kho": "bg-emerald-50 text-emerald-600 ring-emerald-200",
    "Đang vận chuyển": "bg-blue-50 text-blue-600 ring-blue-200",
  };
  const cls = map[status] || "bg-slate-50 text-slate-700 ring-slate-200";
  return (
    <span
      className={`inline-flex items-center justify-center rounded-lg px-2.5 py-1 text-xs font-medium ring-1 min-w-[112px] ${cls}`}
    >
      {status}
    </span>
  );
}
