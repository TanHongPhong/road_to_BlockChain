// src/pages/NhietDoDoAm.jsx
import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
import {
  Activity,
  Search as SearchIcon,
  Truck,
  Eye,
  FileText,
} from "lucide-react";

// GHÉP SHELL
import Sidebar from "@/components/tracking/Sidebar";
import Topbar from "@/components/Topbar";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

/* ====== CẤU HÌNH ESP (để trống, sẽ liên kết sau) ====== */
const ESP_BASE = "http://192.168.1.234";
const POLL_MS = 2000;
const MAX_POINTS = 300;

/* ====== RSL/TTE CONFIG ====== */
const OUTPUT_EVERY_MS = 4 * 60 * 1000; // 4 phút
const WINDOW_MS = 4 * 60 * 1000; // lấy trung bình 4 phút gần nhất
const BASE_SHELF_DAYS = 90;
const T_REF = 4;
const Q10 = 2.0;
const INITIAL_USED_DAYS = 3; // giả định đã tiêu hao 3 ngày trước khi theo dõi

/* ====== MOCK DATA ====== */
const vehiclesSeed = [
  { id: "Truck #A123", route: "TP.HCM → Hà Nội", status: "running" },
  { id: "Truck #B456", route: "Đà Nẵng → Huế", status: "running" },
  { id: "Truck #C789", route: "Hà Nội → Hải Phòng", status: "paused" },
];

/* ====== HELPERS ====== */
function fmtTime(d = new Date()) {
  return d.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function clamp(n, a, b) {
  return Math.min(b, Math.max(a, n));
}

function q10Rate(T) {
  return Math.pow(Q10, (T - T_REF) / 10);
}

/* ====== CHART OPTIONS ====== */
const commonOptions = {
  animation: false,
  responsive: true,
  maintainAspectRatio: false,
  interaction: { mode: "index", intersect: false },
  plugins: {
    legend: { display: false },
    tooltip: {
      enabled: true,
      backgroundColor: "rgba(255, 255, 255, 0.95)",
      titleColor: "#1f2937",
      bodyColor: "#1f2937",
      borderColor: "#e5e7eb",
      borderWidth: 1,
      padding: 12,
      displayColors: true,
    },
  },
  scales: {
    x: {
      ticks: { color: "#9ca3af", font: { size: 11 } },
      grid: { color: "#e5e7eb", drawBorder: false },
    },
    y: {
      ticks: { color: "#9ca3af", font: { size: 11 } },
      grid: { color: "#e5e7eb", drawBorder: false },
    },
  },
};

const tempChartOptions = {
  ...commonOptions,
  plugins: {
    ...commonOptions.plugins,
    tooltip: {
      ...commonOptions.plugins.tooltip,
      callbacks: {
        label: (ctx) => `Nhiệt độ: ${Number(ctx.parsed.y).toFixed(2)}°C`,
      },
    },
  },
  scales: {
    ...commonOptions.scales,
    y: {
      ...commonOptions.scales.y,
      suggestedMin: 0,
      suggestedMax: 40,
      ticks: {
        ...commonOptions.scales.y.ticks,
        callback: (v) => `${Number(v).toFixed(1)}°C`,
      },
    },
  },
};

const humChartOptions = {
  ...commonOptions,
  plugins: {
    ...commonOptions.plugins,
    tooltip: {
      ...commonOptions.plugins.tooltip,
      callbacks: {
        label: (ctx) => `Độ ẩm: ${Number(ctx.parsed.y).toFixed(2)}%`,
      },
    },
  },
  scales: {
    ...commonOptions.scales,
    y: {
      ...commonOptions.scales.y,
      suggestedMin: 0,
      suggestedMax: 100,
      ticks: {
        ...commonOptions.scales.y.ticks,
        callback: (v) => `${Number(v).toFixed(0)}%`,
      },
    },
  },
};

/* ====== PAGE COMPONENT ====== */
export default function NhietDoDoAm() {
  const [search, setSearch] = useState("");
  const [vehicles] = useState(vehiclesSeed);

  // Temperature data
  const [tempData, setTempData] = useState({ labels: [], values: [] });
  const [tempStatus, setTempStatus] = useState("");

  // Humidity data
  const [humData, setHumData] = useState({ labels: [], values: [] });
  const [humStatus, setHumStatus] = useState("");

  // RSL/TTE state
  const [fc, setFc] = useState(
    Math.min(1, Math.max(0, INITIAL_USED_DAYS / BASE_SHELF_DAYS))
  );
  const [rsl, setRsl] = useState("—%");
  const [tte, setTte] = useState("— ngày");
  const [rslUpdated, setRslUpdated] = useState("Cập nhật: —");
  const lastPollTsRef = useRef(null);
  const lastOutputTsRef = useRef(0);
  const tempWindowRef = useRef([]);

  // Push window helper for RSL/TTE
  const pushWindow = useCallback((ts, t) => {
    tempWindowRef.current.push({ ts, t });
    const cutoff = ts - WINDOW_MS;
    while (
      tempWindowRef.current.length &&
      tempWindowRef.current[0].ts < cutoff
    ) {
      tempWindowRef.current.shift();
    }
  }, []);

  // Calculate average temp window
  const avgTempWindow = useCallback(() => {
    const window = tempWindowRef.current;
    if (!window.length) return null;
    let s = 0;
    for (const p of window) s += p.t;
    return s / window.length;
  }, []);

  // Update RSL/TTE UI
  const updateRslTteUI = useCallback(
    (currentFc, force = false) => {
      const now = Date.now();
      if (!force && now - lastOutputTsRef.current < OUTPUT_EVERY_MS) return;

      const tAvg = avgTempWindow();
      if (!Number.isFinite(tAvg)) return;

      const r = q10Rate(tAvg);
      const rslVal = clamp((1 - currentFc) * 100, 0, 100);
      const tteDays = clamp(
        ((1 - currentFc) * BASE_SHELF_DAYS) / r,
        0,
        BASE_SHELF_DAYS
      );

      setRsl(`${rslVal.toFixed(2)}%`);
      setTte(`${tteDays.toFixed(2)} ngày`);
      setRslUpdated(`Cập nhật: ${fmtTime()}`);

      lastOutputTsRef.current = now;
    },
    [avgTempWindow]
  );

  // Poll device
  useEffect(() => {
    let isMounted = true;

    const pollDevice = async () => {
      try {
        // TODO: Thay đổi endpoint khi liên kết ESP8266
        const r = await fetch(`${ESP_BASE}/api/now`, { cache: "no-store" });
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        const j = await r.json();

        const t = Number(j.t); // nhiệt độ
        const h = Number(j.h); // độ ẩm

        const now = Date.now();
        const label = new Date(now).toLocaleTimeString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        });

        // Temperature
        if (!Number.isNaN(t) && isMounted) {
          setTempData((prev) => {
            const newLabels = [...prev.labels, label];
            const newValues = [...prev.values, t];
            if (newLabels.length > MAX_POINTS) {
              newLabels.shift();
              newValues.shift();
            }
            return { labels: newLabels, values: newValues };
          });
          setTempStatus(
            `${new Date().toLocaleTimeString()} | t=${t.toFixed(1)}°C`
          );

          // RSL/TTE logic
          pushWindow(now, t);

          // Cộng dồn hao hụt theo thời gian
          if (lastPollTsRef.current != null) {
            const dtSec = (now - lastPollTsRef.current) / 1000;
            const rInstant = q10Rate(t);
            const add = (dtSec / (BASE_SHELF_DAYS * 86400)) * rInstant;
            setFc((prevFc) => {
              const newFc = clamp(prevFc + add, 0, 1);
              // Update RSL/TTE with new fc
              updateRslTteUI(newFc, lastOutputTsRef.current === 0);
              return newFc;
            });
          } else {
            // First poll - update UI immediately
            updateRslTteUI(fc, true);
          }
          lastPollTsRef.current = now;
        } else if (isMounted) {
          setTempStatus("Dữ liệu nhiệt độ không hợp lệ");
        }

        // Humidity
        if (!Number.isNaN(h) && isMounted) {
          setHumData((prev) => {
            const newLabels = [...prev.labels, label];
            const newValues = [...prev.values, h];
            if (newLabels.length > MAX_POINTS) {
              newLabels.shift();
              newValues.shift();
            }
            return { labels: newLabels, values: newValues };
          });
          setHumStatus(
            `${new Date().toLocaleTimeString()} | h=${h.toFixed(1)}%`
          );
        } else if (isMounted) {
          setHumStatus("Dữ liệu độ ẩm không hợp lệ");
        }
      } catch (e) {
        console.warn(e);
        if (isMounted) {
          setTempStatus("Không lấy được dữ liệu");
          setHumStatus("Không lấy được dữ liệu");
        }
      }
    };

    pollDevice();
    const intervalId = setInterval(pollDevice, POLL_MS);

    // Periodic RSL/TTE refresh
    const rslIntervalId = setInterval(() => {
      setFc((currentFc) => {
        updateRslTteUI(currentFc, false);
        return currentFc;
      });
    }, OUTPUT_EVERY_MS);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
      clearInterval(rslIntervalId);
    };
  }, [fc, pushWindow, updateRslTteUI]);

  // KPIs
  const tempKpis = useMemo(() => {
    if (!tempData.values.length) {
      return { current: "—°C", avg: "—°C", minMax: "—°C / —°C" };
    }
    const cur = tempData.values[tempData.values.length - 1];
    const avg =
      tempData.values.reduce((s, v) => s + v, 0) / tempData.values.length;
    const min = Math.min(...tempData.values);
    const max = Math.max(...tempData.values);
    return {
      current: `${cur.toFixed(1)}°C`,
      avg: `${avg.toFixed(1)}°C`,
      minMax: `${min.toFixed(1)}°C / ${max.toFixed(1)}°C`,
    };
  }, [tempData.values]);

  const currentHum = useMemo(() => {
    if (!humData.values.length) return "—%";
    return `${humData.values[humData.values.length - 1].toFixed(1)}%`;
  }, [humData.values]);

  // Filtered vehicles
  const filteredVehicles = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return vehicles;
    return vehicles.filter(
      (v) =>
        v.id.toLowerCase().includes(q) || v.route.toLowerCase().includes(q)
    );
  }, [vehicles, search]);

  // Chart data
  const tempChartData = useMemo(
    () => ({
      labels: tempData.labels,
      datasets: [
        {
          label: "Nhiệt độ (°C)",
          data: tempData.values,
          borderColor: "#ef4444",
          backgroundColor: "rgba(239, 68, 68, 0.15)",
          borderWidth: 2.5,
          pointRadius: 0,
          pointHoverRadius: 0,
          fill: true,
          tension: 0.4,
        },
      ],
    }),
    [tempData]
  );

  const humChartData = useMemo(
    () => ({
      labels: humData.labels,
      datasets: [
        {
          label: "Độ ẩm (%)",
          data: humData.values,
          borderColor: "#0ea5e9",
          backgroundColor: "rgba(14, 165, 233, 0.15)",
          borderWidth: 2.5,
          pointRadius: 0,
          pointHoverRadius: 0,
          fill: true,
          tension: 0.4,
        },
      ],
    }),
    [humData]
  );

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
      `}</style>

      <Sidebar />

      <div className="ml-[var(--sidebar-w)] min-h-dvh flex flex-col">
        <Topbar />

        <div className="flex-1 min-h-0">
          <div className="p-5">
            {/* Header + KPI */}
            <header className="mb-5 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Activity className="h-6 w-6 text-blue-600" />
                <h1 className="text-2xl font-bold text-gray-900">
                  Giám sát nhiệt độ & độ ẩm
                </h1>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex flex-wrap items-center gap-3 px-4 py-2 bg-white rounded-lg border border-gray-200 shadow-sm">
                  <div>
                    <div className="text-xs text-gray-500">
                      Nhiệt độ hiện tại
                    </div>
                    <div className="text-gray-900 font-semibold">
                      {tempKpis.current}
                    </div>
                  </div>
                  <div className="h-8 w-px bg-gray-200" />
                  <div>
                    <div className="text-xs text-gray-500">Trung bình</div>
                    <div className="text-gray-900 font-semibold">
                      {tempKpis.avg}
                    </div>
                  </div>
                  <div className="h-8 w-px bg-gray-200" />
                  <div>
                    <div className="text-xs text-gray-500">Min/Max</div>
                    <div className="text-gray-900 font-semibold">
                      {tempKpis.minMax}
                    </div>
                  </div>

                  {/* KPI độ ẩm */}
                  <div className="h-8 w-px bg-gray-200" />
                  <div>
                    <div className="text-xs text-gray-500">Độ ẩm hiện tại</div>
                    <div className="text-gray-900 font-semibold">
                      {currentHum}
                    </div>
                  </div>

                  {/* KPI RSL */}
                  <div className="h-8 w-px bg-gray-200" />
                  <div>
                    <div className="text-xs text-gray-500">
                      % hạn sử dụng còn lại (RSL)
                    </div>
                    <div className="text-gray-900 font-semibold">{rsl}</div>
                    <div className="text-[11px] text-gray-500">{rslUpdated}</div>
                  </div>

                  {/* KPI TTE */}
                  <div className="h-8 w-px bg-gray-200" />
                  <div>
                    <div className="text-xs text-gray-500">
                      TTE (ngày còn lại)
                    </div>
                    <div className="text-gray-900 font-semibold">{tte}</div>
                  </div>
                </div>

                <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg px-6 h-10 flex items-center gap-2">
                  <FileText className="h-4 w-4" /> Báo cáo
                </button>
              </div>
            </header>

            {/* 2 cột: trái list – phải chart */}
            <main className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-5 min-h-0">
              {/* LEFT: Vehicles List */}
              <div className="flex flex-col gap-5 min-h-0">
                <div
                  className="sticky"
                  style={{ top: "calc(var(--topbar-h) + 16px)" }}
                >
                  <div className="max-h-[calc(100dvh-var(--topbar-h)-2rem)] overflow-y-auto pr-1">
                    <div className="bg-white border border-slate-200 rounded-2xl p-3 relative">
                      <div className="sticky top-0 z-10 -m-3 p-3 bg-white/95 backdrop-blur rounded-t-2xl border-b border-slate-200">
                        <div className="flex items-center justify-between gap-3">
                          <h3 className="font-semibold tracking-tight">
                            ORDER SEARCH
                          </h3>
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
                                <span className="font-semibold text-slate-800">
                                  ShipID-0123
                                </span>
                                <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-blue-100 text-[#1E66FF] ring-1 ring-blue-200/70">
                                  ARRIVING
                                </span>
                              </div>
                              <div className="text-[11px] text-slate-500 leading-snug">
                                <div>DL04MP7045</div>
                                <div className="whitespace-nowrap">
                                  Tải trọng tối đa 6.5 tấn
                                </div>
                              </div>
                            </div>
                          </div>
                          <button className="shrink-0 w-8 h-8 rounded-full grid place-items-center bg-[#1E66FF] text-white ring-1 ring-blue-500/30 hover:brightness-105">
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </article>

                      {/* Danh sách động */}
                      <div id="vehicle-list" className="mt-3 space-y-3">
                        {filteredVehicles.map((v) => (
                          <article
                            key={v.id}
                            className="mt-3 rounded-xl border border-blue-200 bg-blue-50/40 p-3"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-2 flex-1 min-w-0 overflow-hidden">
                                <span className="inline-grid place-items-center w-8 h-8 rounded-lg bg-blue-100 text-[#1E66FF]">
                                  <Truck className="w-4 h-4" />
                                </span>
                                <div className="text-sm min-w-0">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className="font-semibold text-slate-800 truncate">
                                      {v.id}
                                    </span>
                                    <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-blue-100 text-[#1E66FF] ring-1 ring-blue-200/70">
                                      {v.status === "paused"
                                        ? "PAUSED"
                                        : "ARRIVING"}
                                    </span>
                                  </div>
                                  <div className="text-[11px] text-slate-500 leading-snug">
                                    <div className="truncate">{v.route}</div>
                                    <div className="whitespace-nowrap">
                                      Tải trọng tối đa 6.5 tấn
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <button className="shrink-0 w-8 h-8 rounded-full grid place-items-center bg-[#1E66FF] text-white ring-1 ring-blue-500/30 hover:brightness-105">
                                <Eye className="w-4 h-4" />
                              </button>
                            </div>
                          </article>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT: Charts + History + Alerts */}
              <div className="flex flex-col h-[calc(100dvh-140px)] min-h-0 overflow-hidden">
                <div className="flex flex-col gap-5 overflow-y-auto pr-2 -mr-2 custom-scrollbar flex-1 min-h-0 h-full">
                  {/* CHART TEMP */}
                  <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                    <div className="mb-4 flex items-center justify-between">
                      <div>
                        <h3 className="font-bold text-gray-900 mb-1">
                          Nhiệt độ khu vực
                        </h3>
                        <div className="text-sm text-gray-500">
                          Biểu đồ nhiệt độ theo thời gian
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">{tempStatus}</div>
                    </div>
                    <div style={{ height: "320px" }}>
                      <Line data={tempChartData} options={tempChartOptions} />
                    </div>
                  </div>

                  {/* CHART HUM */}
                  <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                    <div className="mb-4 flex items-center justify-between">
                      <div>
                        <h3 className="font-bold text-gray-900 mb-1">
                          Độ ẩm khu vực
                        </h3>
                        <div className="text-sm text-gray-500">
                          Biểu đồ độ ẩm theo thời gian
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">{humStatus}</div>
                    </div>
                    <div style={{ height: "320px" }}>
                      <Line data={humChartData} options={humChartOptions} />
                    </div>
                  </div>

                  {/* History & Alerts */}
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-5">
                    <div className="md:col-span-3 p-4 bg-white border border-gray-200 rounded-lg shadow-sm min-w-0">
                      <h3 className="font-bold text-gray-900 mb-4">
                        Lịch sử thay đổi nhiệt độ
                      </h3>
                      <div className="space-y-3">
                        <div className="grid grid-cols-[140px_130px_1fr_90px_90px] gap-3 pb-2 border-b border-gray-200 text-sm font-semibold text-gray-600">
                          <div>Thời gian</div>
                          <div>Mã xe</div>
                          <div>Tuyến đường</div>
                          <div>Nhiệt độ</div>
                          <div>Biến động</div>
                        </div>
                        <div id="history-list">
                          {/* History data would be rendered here */}
                        </div>
                      </div>
                    </div>
                    <div className="md:col-span-2 p-4 bg-white border border-gray-200 rounded-lg shadow-sm min-w-0">
                      <h3 className="font-bold text-gray-900 mb-4">
                        Cảnh báo nhiệt độ
                      </h3>
                      <div id="alert-list" className="space-y-3">
                        {/* Alert data would be rendered here */}
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
