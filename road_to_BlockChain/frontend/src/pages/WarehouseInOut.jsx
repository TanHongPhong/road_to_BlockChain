import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package,
  Truck,
  AlertTriangle,
  Activity,
  Search,
  Download,
  Upload,
  Filter,
  RefreshCw,
  Box,
  Users,
  ChevronDown,
  ArrowRight,
  Clock,
  CheckCircle2
} from "lucide-react";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";

/* ================== MOCK DATA ================== */
const MOCK_DATA = [
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
];

/* ================== HELPERS ================== */
function StatusBadge({ status }) {
  const styles = {
    "Đã xuất kho": "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200",
    "Lưu kho": "bg-indigo-100 text-indigo-700 ring-1 ring-indigo-200",
    "Đang vận chuyển": "bg-blue-100 text-blue-700 ring-1 ring-blue-200",
    default: "bg-slate-100 text-slate-700 ring-1 ring-slate-200",
  };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${styles[status] || styles.default}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${status === "Đã xuất kho" ? "bg-emerald-500" : status === "Lưu kho" ? "bg-indigo-500" : "bg-blue-500"}`} />
      {status}
    </span>
  );
}

function StatCard({ icon: Icon, label, value, sub, tone = "blue", delay = 0 }) {
  const colors = {
    blue: "from-blue-500/10 to-blue-500/5 border-blue-100 text-blue-600",
    indigo: "from-indigo-500/10 to-indigo-500/5 border-indigo-100 text-indigo-600",
    amber: "from-amber-500/10 to-amber-500/5 border-amber-100 text-amber-600",
    rose: "from-rose-500/10 to-rose-500/5 border-rose-100 text-rose-600",
    emerald: "from-emerald-500/10 to-emerald-500/5 border-emerald-100 text-emerald-600",
  };
  const iconColors = {
    blue: "bg-blue-500 text-white shadow-blue-500/30",
    indigo: "bg-indigo-500 text-white shadow-indigo-500/30",
    amber: "bg-amber-500 text-white shadow-amber-500/30",
    rose: "bg-rose-500 text-white shadow-rose-500/30",
    emerald: "bg-emerald-500 text-white shadow-emerald-500/30",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className={`relative overflow-hidden rounded-2xl p-5 border bg-gradient-to-br backdrop-blur-xl ${colors[tone]} hover:shadow-lg transition-all duration-300`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 mb-1">{label}</p>
          <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
          {sub && <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">{sub}</p>}
        </div>
        <div className={`p-3 rounded-xl shadow-lg ${iconColors[tone]}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </motion.div>
  );
}

/* ================== MAIN COMPONENT ================== */
export default function WarehouseInOut() {
  const [tab, setTab] = useState("all");
  const [dock, setDock] = useState("Tất cả");
  const [temp, setTemp] = useState("Tất cả");
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Mock filtering
  const filteredRows = useMemo(() => {
    return MOCK_DATA.filter(item => {
      const matchTab = tab === "all" || item.type === tab;
      const matchDock = dock === "Tất cả" || item.docks === dock;
      const matchTemp = temp === "Tất cả" || item.temp === temp;
      return matchTab && matchDock && matchTemp;
    });
  }, [tab, dock, temp]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 800);
  };

  const handleExport = () => {
    alert("Downloading CSV...");
  };

  return (
    <div className="min-h-screen relative bg-[#f8fafc] dark:bg-[#0f172a] text-slate-900 transition-colors duration-500 overflow-hidden font-sans">
      {/* Animated Background Mesh */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[10%] left-[10%] w-[40vw] h-[40vw] bg-blue-200/40 dark:bg-blue-900/20 rounded-full blur-[100px] animate-blob mix-blend-multiply dark:mix-blend-screen" />
        <div className="absolute top-[20%] right-[10%] w-[35vw] h-[35vw] bg-indigo-200/40 dark:bg-indigo-900/20 rounded-full blur-[100px] animate-blob animation-delay-2000 mix-blend-multiply dark:mix-blend-screen" />
        <div className="absolute -bottom-[10%] left-[30%] w-[45vw] h-[45vw] bg-purple-200/40 dark:bg-purple-900/20 rounded-full blur-[100px] animate-blob animation-delay-4000 mix-blend-multiply dark:mix-blend-screen" />
      </div>

      <Sidebar />
      <div className="ml-0 md:ml-20 transition-all duration-300">
        <Topbar />

        <main className="relative z-10 p-6 lg:p-10 max-w-[1600px] mx-auto space-y-8">

          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-1"
            >
              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-slate-300">
                Quản lý kho vận
              </h1>
              <p className="text-slate-500 dark:text-slate-400 flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-500" />
                Real-time tracking Dashboard
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3"
            >
              <button
                onClick={handleRefresh}
                className={`p-2.5 rounded-xl bg-white/60 dark:bg-slate-800/60 backdrop-blur border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow transition-all ${isRefreshing ? 'animate-spin' : ''}`}
              >
                <RefreshCw className="w-5 h-5 text-slate-600 dark:text-slate-300" />
              </button>
              <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold shadow-lg hover:shadow-xl hover:bg-slate-800 dark:hover:bg-slate-100 transition-all">
                <Upload className="w-4 h-4" /> Import Data
              </button>
            </motion.div>
          </div>

          {/* KPI Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            <StatCard icon={Package} label="Nhập kho hôm nay" value="34" sub="+12% so với hôm qua" tone="blue" delay={0.1} />
            <StatCard icon={Truck} label="Xuất kho hôm nay" value="29" sub="Đang vận chuyển: 2" tone="indigo" delay={0.2} />
            <StatCard icon={Clock} label="Đang giữ tạm" value="12" sub="Cần xử lý gấp: 3" tone="amber" delay={0.3} />
            <StatCard icon={AlertTriangle} label="Cảnh báo" value="2" sub="Thiếu chứng từ" tone="rose" delay={0.4} />
          </div>

          {/* Main Content Area */}
          <div className="grid grid-cols-12 gap-6 items-start">

            {/* Left Column: Data & Filters (8 cols) */}
            <div className="col-span-12 xl:col-span-9 space-y-6">

              {/* Filter Bar */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-wrap items-center gap-3 p-1.5 bg-white/60 dark:bg-slate-800/60 backdrop-blur-md border border-white/40 dark:border-white/10 rounded-2xl shadow-sm"
              >
                {['all', 'in', 'out', 'hold'].map((t) => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${tab === t
                        ? "text-white shadow-lg"
                        : "text-slate-600 dark:text-slate-300 hover:bg-white/50"
                      }`}
                  >
                    {tab === t && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl"
                      />
                    )}
                    <span className="relative z-10 capitalize">
                      {t === 'all' ? 'Tất cả' : t === 'in' ? 'Nhập kho' : t === 'out' ? 'Xuất kho' : 'Giữ tạm'}
                    </span>
                  </button>
                ))}

                <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-1" />

                <div className="flex items-center gap-2 px-2">
                  <Filter className="w-4 h-4 text-slate-400" />
                  <select
                    value={dock}
                    onChange={e => setDock(e.target.value)}
                    className="bg-transparent text-sm font-medium text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer"
                  >
                    {["Tất cả", "D1", "D2", "D3", "D4", "D5", "D6"].map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>

                <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-1" />

                <div className="relative flex-1 min-w-[200px]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm mã đơn, khách hàng..."
                    className="w-full pl-9 pr-4 py-2 bg-transparent text-sm focus:outline-none placeholder:text-slate-400"
                  />
                </div>
              </motion.div>

              {/* Data Table */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border border-white/40 dark:border-white/10 rounded-2xl shadow-lg overflow-hidden flex flex-col min-h-[500px]"
              >
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 text-xs uppercase tracking-wider text-slate-500 font-semibold">
                        <th className="px-6 py-4">Mã đơn</th>
                        <th className="px-6 py-4">Loại / Trạng thái</th>
                        <th className="px-6 py-4">Thông tin</th>
                        <th className="px-6 py-4">Chi tiết hàng</th>
                        <th className="px-6 py-4">Vận chuyển</th>
                        <th className="px-6 py-4 text-right">ETA</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                      {filteredRows.length > 0 ? (
                        filteredRows.map((item, idx) => (
                          <motion.tr
                            key={item.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 * idx }}
                            className="group hover:bg-blue-50/40 dark:hover:bg-slate-700/40 transition-colors"
                          >
                            <td className="px-6 py-4">
                              <span className="font-medium text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                                {item.id}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="space-y-1.5">
                                <StatusBadge status={item.status} />
                                <div className="text-xs text-slate-500 flex items-center gap-1">
                                  <span className={`w-1.5 h-1.5 rounded-full ${item.type === 'in' ? 'bg-emerald-400' : 'bg-orange-400'}`} />
                                  {item.type === 'in' ? 'Nhập kho' : 'Xuất kho'}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm font-medium text-slate-800 dark:text-slate-200">{item.customer}</div>
                              <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                                {item.from} <ArrowRight className="w-3 h-3" /> {item.to}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-slate-700 dark:text-slate-300">
                                {item.weight.toLocaleString()} {item.unit}
                              </div>
                              <div className="text-xs text-slate-500 mt-0.5">
                                {item.pallets} Pallets • {item.temp}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <Truck className="w-4 h-4 text-slate-400" />
                                <span className="text-sm">{item.carrier}</span>
                              </div>
                              <div className="text-xs text-slate-500 mt-0.5 pl-6">
                                Dock: <span className="font-semibold text-slate-700 dark:text-slate-300">{item.docks}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-right font-medium text-slate-600 dark:text-slate-400">
                              {item.eta}
                            </td>
                          </motion.tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="px-6 py-12 text-center text-slate-400 italic">
                            Không có dữ liệu phù hợp
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            </div>

            {/* Right Column: Widgets (4 cols) */}
            <div className="col-span-12 xl:col-span-3 space-y-6">

              {/* Inventory Widget */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
                className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border border-white/40 dark:border-white/10 rounded-2xl p-6 shadow-lg"
              >
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <Box className="w-5 h-5 text-indigo-500" />
                  Tồn kho nhanh
                </h3>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Tỷ lệ lấp đầy</span>
                      <span className="font-bold text-slate-800">72%</span>
                    </div>
                    <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "72%" }}
                        transition={{ duration: 1, delay: 1 }}
                        className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"
                      />
                    </div>
                    <p className="text-xs text-slate-400 text-right">1.450 / 2.000 slots</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="p-3 rounded-xl bg-orange-50 dark:bg-slate-700/50 border border-orange-100 dark:border-white/5">
                      <div className="text-xs text-slate-500 mb-1">Kho mát</div>
                      <div className="font-bold text-slate-800 dark:text-slate-200">210 Plt</div>
                    </div>
                    <div className="p-3 rounded-xl bg-cyan-50 dark:bg-slate-700/50 border border-cyan-100 dark:border-white/5">
                      <div className="text-xs text-slate-500 mb-1">Kho lạnh</div>
                      <div className="font-bold text-slate-800 dark:text-slate-200">120 Plt</div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Staff Widget */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
                className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-6 shadow-xl relative overflow-hidden"
              >
                <div className="relative z-10">
                  <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                    <Users className="w-5 h-5 text-emerald-400" />
                    Nhân sự ca
                  </h3>
                  <ul className="space-y-4">
                    <li className="flex justify-between items-center border-b border-white/10 pb-3">
                      <span className="text-sm opacity-80">Ca sáng (06:00 - 14:00)</span>
                      <span className="font-bold text-emerald-400">12 NV</span>
                    </li>
                    <li className="flex justify-between items-center border-b border-white/10 pb-3">
                      <span className="text-sm opacity-80">Ca chiều (14:00 - 22:00)</span>
                      <span className="font-bold text-blue-400">10 NV</span>
                    </li>
                  </ul>
                  <button className="w-full mt-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 transition-colors text-sm font-medium">
                    Xem lịch làm việc
                  </button>
                </div>

                {/* Decorative Circle */}
                <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-emerald-500/20 rounded-full blur-2xl" />
              </motion.div>

            </div>

          </div>

          <footer className="text-center text-slate-400 text-sm py-8">
            © 2025 Gemadept Logistics. Powered by <span className="font-semibold text-slate-600 dark:text-slate-300">SCM Team</span>.
          </footer>
        </main>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
