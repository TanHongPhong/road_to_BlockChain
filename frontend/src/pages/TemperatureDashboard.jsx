// src/pages/TemperatureDashboard.jsx
import React, { useEffect, useMemo, useState } from "react";
import ReactApexChart from "react-apexcharts";
import {
  Activity,
  Search as SearchIcon,
  Truck,
  Eye,
  TrendingUp,
  TrendingDown,
  AlertCircle,
} from "lucide-react";

// GHÉP SHELL
import Sidebar from "@/components/tracking/Sidebar";
import Topbar from "@/components/Topbar";

/* ====== KẾT NỐI ESP (đổi IP tại đây nếu cần) ====== */
const ESP_BASE = "http://10.150.88.110";
const POLL_MS = 2000;

/* số điểm giữ trên biểu đồ theo mỗi khung thời gian (thuần JS) */
const POINTS_BY_RANGE = {
  "1h": 60,
  "6h": 72,
  "12h": 72,
  "24h": 96,
  "7d": 84,
};

/* Độ làm mượt đường biểu diễn cho hiển thị (0..1). 0.25 = mượt nhẹ */
const SMOOTH_ALPHA = 0.25;

/* ================== MOCK DATA (giữ nguyên UI) ================== */
const vehiclesSeed = [
  { id: "Truck #A123", route: "TP.HCM → Hà Nội", status: "running", temperature: 4.5 },
  { id: "Truck #B456", route: "Đà Nẵng → Huế", status: "running", temperature: 8.2 },
  { id: "Truck #C789", route: "Hà Nội → Hải Phòng", status: "paused",  temperature: 15.8 },
  { id: "Truck #D012", route: "Cần Thơ → TP.HCM", status: "running", temperature: 3.5 },
  { id: "Truck #E345", route: "Nha Trang → Quy Nhơn", status: "running", temperature: 11.9 },
];

const temperatureHistorySeed = [
  { date: "14/10/2025 14:30", vehicle: "Truck #C789", route: "Hà Nội → Hải Phòng", temperature: 15.8, change: "+2.3", trend: "up" },
  { date: "14/10/2025 13:45", vehicle: "Truck #B456", route: "Đà Nẵng → Huế", temperature: 8.2, change: "-0.8", trend: "down" },
  { date: "14/10/2025 12:20", vehicle: "Truck #E345", route: "Nha Trang → Quy Nhơn", temperature: 11.9, change: "+1.2", trend: "up" },
];

const alertsSeed = [
  { time: "14/10/2025 14:36", title: "Nhiệt độ vượt ngưỡng nguy hiểm", description: "Truck #C789 (Hà Nội → Hải Phòng) ghi nhận nhiệt độ 15.8°C.", severity: "high", vehicle: "Truck #C789" },
  { time: "14/10/2025 13:22", title: "Cảnh báo nhiệt độ", description: "Truck #E345 (Nha Trang → Quy Nhơn) có nhiệt độ tăng.", severity: "medium", vehicle: "Truck #E345" },
];

const ranges = [
  { label: "1 giờ", value: "1h" },
  { label: "6 giờ", value: "6h" },
  { label: "12 giờ", value: "12h" },
  { label: "24 giờ", value: "24h" },
  { label: "7 ngày", value: "7d" },
];

function fmtTime(d = new Date()) {
  return d.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

/* ================== PAGE ================== */
export default function TemperatureDashboard() {
  const [timeRange, setTimeRange] = useState("1h");
  const [search, setSearch] = useState("");

  const [vehicles] = useState(vehiclesSeed);
  const [temperatureHistory] = useState(temperatureHistorySeed);
  const [alerts] = useState(alertsSeed);

  // buffer dữ liệu realtime: mảng { x: timestamp, y: number } (dữ liệu thô)
  const [seriesData, setSeriesData] = useState([]);
  const [status, setStatus] = useState("");

  // khi đổi khung thời gian => cắt bớt buffer cho khớp số điểm mong muốn
  useEffect(() => {
    const maxPts = POINTS_BY_RANGE[timeRange] ?? 60;
    setSeriesData((prev) => (prev.length > maxPts ? prev.slice(prev.length - maxPts) : prev));
  }, [timeRange]);

  // poll ESP định kỳ
  useEffect(() => {
    let isMounted = true;
    const tick = async () => {
      try {
        const r = await fetch(`${ESP_BASE}/api/now`, { cache: "no-store" });
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        const j = await r.json();
        const t = Number(j.t);
        if (!Number.isNaN(t)) {
          const point = { x: Date.now(), y: t };
          setSeriesData((prev) => {
            const next = [...prev, point];
            const limit = POINTS_BY_RANGE[timeRange] ?? 60;
            if (next.length > limit) next.shift(); // đẩy line sang trái khi đủ điểm
            return next;
          });
          if (isMounted) setStatus(`OK @ ${fmtTime()} | t=${t.toFixed(1)}°C`);
        } else if (isMounted) {
          setStatus("Dữ liệu không hợp lệ");
        }
      } catch (e) {
        if (isMounted) setStatus("Không lấy được dữ liệu");
      }
    };
    // gọi ngay + interval
    tick();
    const id = setInterval(tick, POLL_MS);
    return () => { isMounted = false; clearInterval(id); };
  }, [timeRange]);

  // KPI tính trên dữ liệu thô (không làm mượt)
  const kpis = useMemo(() => {
    if (!seriesData.length) return { current: 0, avg: 0, min: 0, max: 0 };
    const arr = seriesData.map((p) => p.y);
    const current = arr[arr.length - 1];
    const avg = arr.reduce((s, v) => s + v, 0) / arr.length;
    const min = Math.min(...arr);
    const max = Math.max(...arr);
    return { current, avg, min, max };
  }, [seriesData]);

  // Dữ liệu hiển thị: làm mượt nhẹ bằng EMA để đường cong mềm (không “vuông góc”)
  const displaySeries = useMemo(() => {
    let last = null;
    return seriesData.map((p) => {
      const y = last == null ? p.y : last + SMOOTH_ALPHA * (p.y - last);
      last = y;
      return { x: p.x, y };
    });
  }, [seriesData]);

  // Chart (ApexCharts)
  const yMin = 20, yMax = 36;
  const series = useMemo(
    () => [{ name: "Nhiệt độ (°C)", data: displaySeries }],
    [displaySeries]
  );

  const options = useMemo(() => ({
    chart: {
      type: "area",
      height: 320,
      toolbar: { show: false },
      animations: { enabled: false },
      zoom: { enabled: false },
    },
    dataLabels: { enabled: false },
    stroke: {
      curve: "smooth",          // <— cong mềm
      lineCap: "round",         // <— bo đầu nét
      width: 2.5,
      colors: ["#ef4444"],
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 0,
        opacityFrom: 0.22,
        opacityTo: 0.02,
        stops: [0, 100],
        colorStops: [
          { offset: 0,   color: "#ef4444", opacity: 0.22 },
          { offset: 100, color: "#ef4444", opacity: 0.02 },
        ],
      },
      colors: ["#ef4444"],
    },
    markers: { size: 0, hover: { size: 3 } },
    xaxis: {
      type: "datetime",
      labels: { style: { colors: "#9CA3AF", fontSize: "12px" } },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      min: yMin,
      max: yMax,
      tickAmount: 8,
      labels: {
        style: { colors: "#9CA3AF", fontSize: "12px" },
        formatter: (val) => `${val.toFixed(1)}°C`,
      },
    },
    grid: { borderColor: "#E5E7EB", strokeDashArray: 4 },
    tooltip: {
      x: { format: "HH:mm:ss - dd/MM/yy" },
      y: { formatter: (value) => `${value.toFixed(2)}°C` },
      theme: "light",
    },
    legend: { show: false },
  }), []);

  // Vehicles filter
  const filteredVehicles = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return vehicles;
    return vehicles.filter(
      (v) => v.id.toLowerCase().includes(q) || v.route.toLowerCase().includes(q)
    );
  }, [vehicles, search]);

  return (
    <div
      className="min-h-dvh bg-gradient-to-b from-slate-50 to-slate-100 text-gray-800"
      style={{ "--sidebar-w": "80px", "--topbar-h": "64px" }}
    >
      <style>{`
        .custom-scrollbar::-webkit-scrollbar{ width:6px }
        .custom-scrollbar::-webkit-scrollbar-track{ background:#f1f1f1; border-radius:10px }
        .custom-scrollbar::-webkit-scrollbar-thumb{ background:#d1d5db; border-radius:10px }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover{ background:#9ca3af }
        .apexcharts-tooltip{ background:#fff; border:1px solid #e5e7eb; border-radius:8px; padding:8px 12px }
      `}</style>

      <Sidebar />

      <div className="ml-[var(--sidebar-w)] min-h-dvh flex flex-col">
        <Topbar />

        <div className="flex-1 min-h-0">
          <div className="p-5">
            {/* Header + KPI */}
            <header className="mb-5 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Activity className="h-6 w-6 text-blue-600" />
                  <h1 className="text-2xl font-bold text-gray-900">Giám sát nhiệt độ</h1>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3 px-4 py-2 bg-white rounded-lg border border-gray-200 shadow-sm">
                  <div>
                    <div className="text-xs text-gray-500">Nhiệt độ hiện tại</div>
                    <div className="text-gray-900 font-semibold">
                      {kpis.current.toFixed(1)}°C
                    </div>
                  </div>
                  <div className="h-8 w-px bg-gray-200" />
                  <div>
                    <div className="text-xs text-gray-500">Trung bình</div>
                    <div className="text-gray-900 font-semibold">
                      {kpis.avg.toFixed(1)}°C
                    </div>
                  </div>
                  <div className="h-8 w-px bg-gray-200" />
                  <div>
                    <div className="text-xs text-gray-500">Min/Max</div>
                    <div className="text-gray-900 font-semibold">
                      {kpis.min.toFixed(1)}°C / {kpis.max.toFixed(1)}°C
                    </div>
                  </div>
                </div>
              </div>
            </header>

            {/* 2 cột: trái list – phải chart */}
            <main className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-5 min-h-0">
              {/* LEFT: Vehicles List */}
              <div className="flex flex-col gap-5 min-h-0">
                <div className="sticky [top:calc(var(--topbar-h)+16px)]">
                  <div className="max-h-[calc(100dvh-var(--topbar-h)-2rem)] overflow-y-auto pr-1">
                    <div className="bg-white border border-slate-200 rounded-2xl p-3 relative">
                      <div className="sticky top-0 z-10 -m-3 p-3 bg-white/95 backdrop-blur rounded-t-2xl border-b border-slate-200">
                        <div className="flex items-center justify-between gap-3">
                          <h3 className="font-semibold tracking-tight">ORDER SEARCH</h3>
                          <div className="relative flex-1">
                            <input
                              value={search}
                              onChange={(e) => setSearch(e.target.value)}
                              className="h-9 w-full rounded-lg border border-slate-300 pl-8 pr-3 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-200"
                              placeholder="Tìm kiếm"
                            />
                            <SearchIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          </div>
                        </div>
                      </div>

                      {/* Featured item */}
                      <article className="mt-3 rounded-xl border border-blue-200 bg-blue-50/40 p-3">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 flex-1 min-w-0 overflow-hidden">
                            <span className="inline-grid place-items-center w-8 h-8 rounded-lg bg-blue-100 text-[#1E66FF]">
                              <Truck className="w-4 h-4" />
                            </span>
                            <div className="text-sm min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-semibold text-slate-800">ShipID-0123</span>
                                <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-blue-100 text-[#1E66FF] ring-1 ring-blue-200/70">ARRIVING</span>
                              </div>
                              <div className="text-[11px] text-slate-500 leading-snug">
                                <div>DL04MP7045</div>
                                <div className="whitespace-nowrap">Tải trọng tối đa 6.5 tấn</div>
                              </div>
                            </div>
                          </div>
                          <button title="Đang theo dõi" className="shrink-0 w-8 h-8 rounded-full grid place-items-center bg-[#1E66FF] text-white ring-1 ring-blue-500/30 hover:brightness-105">
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </article>

                      {/* Danh sách động */}
                      <div id="vehicle-list" className="mt-3 space-y-3">
                        {filteredVehicles.length === 0 ? (
                          <div className="text-center py-8 text-gray-500">
                            <Truck className="h-12 w-12 mx-auto mb-2 opacity-30" />
                            <p>Không tìm thấy xe nào</p>
                          </div>
                        ) : (
                          filteredVehicles.map((v) => {
                            const parts = (v.route || "").split("→").map((s) => s && s.trim());
                            const departure = parts[0];
                            const arrival = parts[1];
                            const statusMap = {
                              running: { text: "ARRIVING", cls: "bg-blue-100 text-[#1E66FF] ring-1 ring-blue-200/70" },
                              paused:  { text: "PAUSED",   cls: "bg-amber-100 text-amber-700 ring-1 ring-amber-200" },
                            };
                            const badge = statusMap[v.status] || statusMap.running;
                            return (
                              <article key={v.id} className="mt-3 rounded-xl border border-blue-200 bg-blue-50/40 p-3">
                                <div className="flex items-center justify-between gap-2">
                                  <div className="flex items-center gap-2 flex-1 min-w-0 overflow-hidden">
                                    <span className="inline-grid place-items-center w-8 h-8 rounded-lg bg-blue-100 text-[#1E66FF]">
                                      <Truck className="w-4 h-4" />
                                    </span>
                                    <div className="text-sm min-w-0">
                                      <div className="flex items-center gap-2 flex-wrap">
                                        <span className="font-semibold text-slate-800 truncate">{v.id}</span>
                                        <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${badge.cls}`}>{badge.text}</span>
                                      </div>
                                      <div className="text-[11px] text-slate-500 leading-snug">
                                        {departure && <div className="truncate">Departure: {departure}</div>}
                                        {arrival   && <div className="whitespace-nowrap">Arrival: {arrival}</div>}
                                      </div>
                                    </div>
                                  </div>
                                  <button title="Đang theo dõi" className="shrink-0 w-8 h-8 rounded-full grid place-items-center bg-[#1E66FF] text-white ring-1 ring-blue-500/30 hover:brightness-105">
                                    <Eye className="w-4 h-4" />
                                  </button>
                                </div>
                              </article>
                            );
                          })
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT: Chart + History + Alerts */}
              <div className="flex flex-col min-h-0 overflow-hidden">
                <div className="flex flex-col gap-5 overflow-y-auto pr-2 -mr-2 custom-scrollbar flex-1 min-h-0">
                  {/* Chart */}
                  <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                    <div className="mb-4 flex items-center justify-between">
                      <div>
                        <h3 className="font-bold text-gray-900 mb-1">Nhiệt độ khu vực</h3>
                        <div className="text-sm text-gray-500">Biểu đồ nhiệt độ theo thời gian</div>
                      </div>
                      <div className="text-xs text-gray-500">{status}</div>
                    </div>

                    <ReactApexChart options={options} series={series} type="area" height={320} />

                    <div className="flex items-center justify-center gap-2 mt-4 pt-4 border-t border-gray-200">
                      {ranges.map((r) => {
                        const active = timeRange === r.value;
                        return (
                          <button
                            key={r.value}
                            onClick={() => setTimeRange(r.value)}
                            className={`px-4 py-1.5 rounded-lg text-sm transition-colors ${
                              active ? "bg-blue-600 text-white font-semibold" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                          >
                            {r.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* History & Alerts */}
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-5">
                    {/* History (3/5) */}
                    <div className="md:col-span-3 p-4 bg-white border border-gray-200 rounded-lg shadow-sm min-w-0">
                      <h3 className="font-bold text-gray-900 mb-4">Lịch sử thay đổi nhiệt độ</h3>
                      <div className="space-y-3">
                        <div className="grid grid-cols-[140px_130px_1fr_90px_90px] gap-3 pb-2 border-b border-gray-200 text-sm font-semibold text-gray-600">
                          <div>Thời gian</div><div>Mã xe</div><div>Tuyến đường</div><div>Nhiệt độ</div><div>Biến động</div>
                        </div>
                        <div id="history-list">
                          {temperatureHistory.map((item, idx) => (
                            <div key={`${item.vehicle}-${idx}`} className="grid grid-cols-[140px_130px_1fr_90px_90px] gap-3 py-2 border-b border-gray-100 hover:bg-gray-50 -mx-4 px-4 rounded-lg transition-colors text-sm">
                              <div className="text-gray-600">{item.date}</div>
                              <div className="text-gray-800 font-medium flex items-center gap-1.5">
                                <Truck className="h-3.5 w-3.5 text-gray-500" /> {item.vehicle}
                              </div>
                              <div className="text-gray-600">{item.route}</div>
                              <div className="text-gray-800 font-medium">{item.temperature}°C</div>
                              <div className={`flex items-center gap-1 font-semibold ${item.trend === "up" ? "text-red-500" : "text-blue-500"}`}>
                                {item.trend === "up" ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                                <span>{item.change}°C</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Alerts (2/5) */}
                    <div className="md:col-span-2 p-4 bg-white border border-gray-200 rounded-lg shadow-sm min-w-0">
                      <h3 className="font-bold text-gray-900 mb-4">Cảnh báo nhiệt độ</h3>
                      <div id="alert-list" className="space-y-3">
                        {alerts.map((alert, idx) => {
                          const isHigh = alert.severity === "high";
                          const color = isHigh ? "#EF4444" : "#F59E0B";
                          const bgColor = isHigh ? "#FEF2F2" : "#FFF7ED";
                          return (
                            <div key={`${alert.vehicle}-${idx}`} className="p-3 rounded-lg border" style={{ borderColor: color, backgroundColor: bgColor }}>
                              <div className="flex items-start gap-3">
                                <div className="p-1.5 rounded-lg flex-shrink-0" style={{ backgroundColor: `${color}20` }}>
                                  <AlertCircle className="h-5 w-5" style={{ color }} />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1">
                                    <div className="text-xs text-gray-600">{alert.time}</div>
                                    <span className="text-xs text-white px-2 py-0.5 rounded-full flex items-center gap-1" style={{ backgroundColor: color }}>
                                      <Truck className="h-3 w-3" />
                                      {alert.vehicle}
                                    </span>
                                  </div>
                                  <div className="text-sm font-semibold text-gray-900 mb-1">{alert.title}</div>
                                  <div className="text-xs text-gray-600 leading-relaxed">{alert.description}</div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
