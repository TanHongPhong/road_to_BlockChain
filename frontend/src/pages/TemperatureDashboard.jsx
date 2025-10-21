// src/pages/TemperatureDashboard.jsx
import React, { useEffect, useMemo, useState, useRef } from "react";
import ReactApexChart from "react-apexcharts";
import feather from "feather-icons";
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
import Topbar from "@/components/tracking/Topbar";

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
  { date: "14/10/2025 13:15", vehicle: "Truck #A123", route: "TP.HCM → Hà Nội", temperature: 4.5, change: "+0.2", trend: "up" },
  { date: "14/10/2025 12:30", vehicle: "Truck #E345", route: "Nha Trang → Quy Nhơn", temperature: 11.9, change: "-1.5", trend: "down" },
  { date: "14/10/2025 12:00", vehicle: "Truck #D012", route: "Cần Thơ → TP.HCM", temperature: 3.5, change: "+0.8", trend: "up" },
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
  const topbarRef = useRef(null);
  const [timeRange, setTimeRange] = useState("1h");
  const [search, setSearch] = useState("");

  const [vehicles] = useState(vehiclesSeed);
  const [temperatureHistory] = useState(temperatureHistorySeed);

  // IoT Data State
  const [espData, setEspData] = useState({ temperature: 0, humidity: 0, timestamp: Date.now() });
  const [chartData, setChartData] = useState([]);
  const [isConnected, setIsConnected] = useState(false);

  // IoT Connection Functions
  const fetchEspData = async () => {
    try {
      const response = await fetch(`${ESP_BASE}/api/sensor`);
      if (response.ok) {
        const data = await response.json();
        setEspData({
          temperature: data.temperature || 0,
          humidity: data.humidity || 0,
          timestamp: Date.now()
        });
        setIsConnected(true);
        
        // Update chart data
        setChartData(prev => {
          const newData = [...prev, {
            time: Date.now(),
            temperature: data.temperature || 0
          }];
          
          // Keep only recent data points based on time range
          const maxPoints = POINTS_BY_RANGE[timeRange] || 60;
          return newData.slice(-maxPoints);
        });
      } else {
        setIsConnected(false);
      }
    } catch (error) {
      console.error("ESP connection error:", error);
      setIsConnected(false);
    }
  };

  // Start IoT polling
  useEffect(() => {
    const interval = setInterval(fetchEspData, POLL_MS);
    fetchEspData(); // Initial fetch
    
    return () => clearInterval(interval);
  }, [timeRange]);

  // Sync CSS var for topbar height
  useEffect(() => {
    feather.replace();
    
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

  const filteredVehicles = useMemo(() => {
    if (!search) return vehicles;
    return vehicles.filter(
      (v) =>
        v.id.toLowerCase().includes(search.toLowerCase()) ||
        v.route.toLowerCase().includes(search.toLowerCase())
    );
  }, [vehicles, search]);

  const chartOptions = useMemo(() => ({
    chart: {
      type: "line",
      height: 350,
      toolbar: { show: false },
      animations: { enabled: false },
    },
    stroke: {
      curve: "smooth",
      width: 3,
      colors: ["#3B82F6"],
    },
    xaxis: {
      type: "datetime",
      labels: {
        formatter: (value) => fmtTime(new Date(value)),
      },
    },
    yaxis: {
      title: { text: "Nhiệt độ (°C)" },
      min: 0,
      max: 30,
    },
    tooltip: {
      x: { format: "HH:mm:ss" },
      y: { formatter: (value) => `${value}°C` },
    },
    colors: ["#3B82F6"],
    grid: {
      borderColor: "#E5E7EB",
      strokeDashArray: 4,
    },
  }), []);

  const chartSeries = useMemo(() => [
    {
      name: "Nhiệt độ",
      data: chartData.map(point => [point.time, point.temperature]),
    },
  ], [chartData]);

  return (
    <div className="bg-slate-50 text-slate-900 min-h-screen">
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
        <div className="p-5">
          {/* Header + KPI */}
          <header className="mb-5 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-slate-800">Giám sát nhiệt độ</h1>
                  <p className="text-slate-600 text-sm">Theo dõi nhiệt độ real-time từ IoT sensors</p>
                </div>
              </div>
            </div>

            {/* IoT Connection Status */}
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-sm text-slate-600">
                {isConnected ? 'Kết nối IoT' : 'Mất kết nối'}
              </span>
            </div>
          </header>

          {/* IoT Data Display */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="card p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Nhiệt độ hiện tại</p>
                  <p className="text-2xl font-bold text-blue-600">{espData.temperature.toFixed(1)}°C</p>
                </div>
                <Activity className="w-8 h-8 text-blue-500" />
              </div>
            </div>
            
            <div className="card p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Độ ẩm</p>
                  <p className="text-2xl font-bold text-green-600">{espData.humidity.toFixed(1)}%</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-500" />
              </div>
            </div>
            
            <div className="card p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Cập nhật cuối</p>
                  <p className="text-sm font-medium text-slate-800">{fmtTime(new Date(espData.timestamp))}</p>
                </div>
                <AlertCircle className="w-8 h-8 text-orange-500" />
              </div>
            </div>
          </div>

          {/* Chart */}
          <div className="card p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-800">Biểu đồ nhiệt độ</h2>
              <div className="flex gap-2">
                {ranges.map((range) => (
                  <button
                    key={range.value}
                    onClick={() => setTimeRange(range.value)}
                    className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                      timeRange === range.value
                        ? "bg-blue-500 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </div>
            <ReactApexChart
              options={chartOptions}
              series={chartSeries}
              type="line"
              height={350}
            />
          </div>

          {/* Vehicle List */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-slate-800">Danh sách xe</h2>
                <div className="relative">
                  <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm xe..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div className="space-y-3">
                {filteredVehicles.map((vehicle) => (
                  <div key={vehicle.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                        <Truck className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-800">{vehicle.id}</p>
                        <p className="text-sm text-slate-600">{vehicle.route}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        vehicle.status === 'running' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {vehicle.status === 'running' ? 'Đang chạy' : 'Tạm dừng'}
                      </span>
                      <span className="text-sm font-medium text-slate-800">{vehicle.temperature}°C</span>
                      <button className="p-1 hover:bg-slate-200 rounded">
                        <Eye className="w-4 h-4 text-slate-600" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card p-6">
              <h2 className="text-lg font-semibold text-slate-800 mb-4">Lịch sử nhiệt độ</h2>
              <div className="space-y-3">
                {temperatureHistory.map((record, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div>
                      <p className="font-medium text-slate-800">{record.vehicle}</p>
                      <p className="text-sm text-slate-600">{record.route}</p>
                      <p className="text-xs text-slate-500">{record.date}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-slate-800">{record.temperature}°C</span>
                      <div className={`flex items-center gap-1 text-xs ${
                        record.trend === 'up' ? 'text-red-600' : 'text-green-600'
                      }`}>
                        {record.trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        {record.change}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}