import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  Truck,
  Package,
  Warehouse,
  ClipboardList,
  ArrowLeftCircle,
  Menu,
  LogOut,
  Building2,
  Sun,
  Moon,
  ChevronRight,
  User,
  Settings,
} from "lucide-react";

/* ===================== DATA NHÚNG TRONG FILE ===================== */
const DASHBOARD_DATA = {
  title: "Hệ Thống SCM",
  pagesByRole: {
    supplier: [
      {
        name: "Quản lý hàng hóa",
        path: "/supplier-product-management",
        icon: "Building2",
        desc: "Quản lý kho hàng & chi tiết sản phẩm",
        color: "text-blue-500",
        bg: "bg-blue-500/10",
      },
      {
        name: "Camera giám sát",
        path: "/supplier-camera-monitoring",
        icon: "Home",
        desc: "Giám sát cơ sở qua camera",
        color: "text-purple-500",
        bg: "bg-purple-500/10",
      },
      {
        name: "Đơn hàng đã xuất kho",
        path: "/order-tracking-customer",
        icon: "ClipboardList",
        desc: "Theo dõi đơn hàng xuất kho",
        color: "text-green-500",
        bg: "bg-green-500/10",
      },
    ],
    transport_company: [
      {
        name: "Tổng quan",
        path: "/supplier",
        icon: "Truck",
        desc: "Tổng quan vận tải chính",
        color: "text-indigo-500",
        bg: "bg-indigo-500/10",
      },
      {
        name: "Theo dõi đội xe",
        path: "/vehicle-list",
        icon: "Truck",
        desc: "Quản lý trạng thái đội xe",
        color: "text-orange-500",
        bg: "bg-orange-500/10",
      },
      {
        name: "Theo dõi đơn hàng",
        path: "/order-tracking",
        icon: "ClipboardList",
        desc: "Theo dõi vận chuyển thời gian thực",
        color: "text-teal-500",
        bg: "bg-teal-500/10",
      },
    ],
    driver: [
      {
        name: "Quản lý xe",
        path: "/vehicle-list",
        icon: "Truck",
        desc: "Trạng thái xe của tôi",
        color: "text-yellow-500",
        bg: "bg-yellow-500/10",
      }
    ],
    warehouse: [
      {
        name: "Quản lý kho hàng",
        path: "/warehouse-in-out",
        icon: "Warehouse",
        desc: "Hoạt động kho chung",
        color: "text-red-500",
        bg: "bg-red-500/10",
      },
      {
        name: "Nhập kho",
        path: "/camera-warehouse-in",
        icon: "Warehouse",
        desc: "Xử lý hàng nhập kho",
        color: "text-pink-500",
        bg: "bg-pink-500/10",
      },
      {
        name: "Xuất kho",
        path: "/camera-warehouse-out",
        icon: "Warehouse",
        desc: "Xử lý hàng xuất kho",
        color: "text-cyan-500",
        bg: "bg-cyan-500/10",
      },
    ],
    super_market: [
      {
        name: "Quản lý siêu thị",
        path: "/warehouse-in-out",
        icon: "Warehouse",
        desc: "Kho hàng siêu thị",
        color: "text-emerald-500",
        bg: "bg-emerald-500/10",
      },
      {
        name: "Đưa hàng lên kệ",
        path: "/mobile-shelf-putaway",
        icon: "Warehouse",
        desc: "Bổ sung hàng lên kệ",
        color: "text-lime-500",
        bg: "bg-lime-500/10",
      },
      {
        name: "Nhập kho",
        path: "/supermarket-receiving",
        icon: "Warehouse",
        desc: "Nhận hàng từ vận chuyển",
        color: "text-sky-500",
        bg: "bg-sky-500/10",
      },
    ],
    user: [
      {
        name: "Thông tin sản phẩm",
        path: "/product-infomation",
        icon: "Home",
        desc: "Duyệt danh mục sản phẩm",
        color: "text-violet-500",
        bg: "bg-violet-500/10",
      },
      {
        name: "Quét QR",
        path: "/user-QR",
        icon: "Truck",
        desc: "Quét mã QR sản phẩm",
        color: "text-rose-500",
        bg: "bg-rose-500/10",
      },
    ],
  },
};
/* ================================================================= */

const ICON_MAP = { Home, Truck, Package, Warehouse, ClipboardList, Building2 };

export default function RoleDashboard() {
  const navigate = useNavigate();
  // KHỞI TẠO TRỰC TIẾP TỪ LOCALSTORAGE ĐỂ TRÁNH RENDER LẠI (FIX LỖI MẤT ITEM)
  const [role, setRole] = useState(() => localStorage.getItem("role") || "");
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    if (!role) {
      navigate("/");
    }
  }, [role, navigate]);

  const pages = useMemo(() => {
    return DASHBOARD_DATA.pagesByRole[role] || [];
  }, [role]);

  const renderIcon = (icon) => {
    if (!icon) return <Home className="w-6 h-6" />;
    if (typeof icon === "string") {
      const Cmp = ICON_MAP[icon] || Home;
      return <Cmp className="w-6 h-6" />;
    }
    if (typeof icon === "function") {
      const Cmp = icon;
      return <Cmp className="w-6 h-6" />;
    }
    return icon;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <div className={`${darkMode ? "dark" : ""}`}>
      <div className="flex h-screen overflow-hidden bg-[#f8fafc] dark:bg-[#0f172a] transition-colors duration-500 relative">

        {/* Animated Background Mesh (Shared with Home) */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute -top-[20%] -left-[10%] w-[60vw] h-[60vw] bg-purple-300/20 dark:bg-purple-900/10 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-screen animate-blob" />
          <div className="absolute top-[30%] -right-[10%] w-[50vw] h-[50vw] bg-blue-300/20 dark:bg-blue-900/10 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-screen animate-blob animation-delay-2000" />
          <div className="absolute -bottom-[20%] left-[20%] w-[50vw] h-[50vw] bg-pink-300/20 dark:bg-pink-900/10 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-screen animate-blob animation-delay-4000" />
        </div>

        {/* Sidebar */}
        <motion.aside
          initial={{ x: -100 }}
          animate={{ x: 0 }}
          className={`${sidebarOpen ? "w-72" : "w-24"
            } relative z-20 m-4 rounded-3xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/20 shadow-2xl transition-all duration-300 flex flex-col`}
        >
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100/10 dark:border-gray-700/50">
            <div className={`flex items-center gap-3 overflow-hidden transition-all duration-300 ${sidebarOpen ? "w-auto opacity-100" : "w-0 opacity-0"}`}>
              <div className="p-2 bg-indigo-600 rounded-lg">
                <Package className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 whitespace-nowrap">
                {DASHBOARD_DATA.title}
              </h1>
            </div>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <Menu className="w-6 h-6 text-gray-600 dark:text-gray-300" />
            </button>
          </div>

          {/* User Profile Summary */}
          <div className={`p-6 transition-all duration-300 ${!sidebarOpen && "items-center flex flex-col"}`}>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg shadow-lg ring-2 ring-white dark:ring-slate-800">
                {role ? role.charAt(0).toUpperCase() : "U"}
              </div>
              {sidebarOpen && (
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Xin chào,</p>
                  <p className="font-bold text-gray-800 dark:text-gray-100 capitalize">{role || "Khách"}</p>
                </div>
              )}
            </div>
          </div>

          {/* Navigation Items */}
          <div className="flex-1 overflow-y-auto px-4 space-y-2 custom-scrollbar">
            {pages.length === 0 ? (
              sidebarOpen && <div className="text-center text-gray-400 mt-10">Chưa có trang nào</div>
            ) : (
              pages.map((item, i) => (
                <button
                  key={i}
                  onClick={() => item.path && navigate(item.path)}
                  disabled={!item.path}
                  className={`w-full group relative flex items-center gap-4 p-3 rounded-xl transition-all duration-200 overflow-hidden
                    ${!item.path ? "opacity-50 cursor-not-allowed" : "hover:bg-white/50 dark:hover:bg-white/5 hover:shadow-md cursor-pointer"}
                   `}
                >
                  <div className={`p-2 rounded-lg transition-colors duration-300 ${item.color || "text-gray-500"} ${item.bg || "bg-gray-100 dark:bg-gray-800"}`}>
                    {renderIcon(item.icon)}
                  </div>

                  {sidebarOpen && (
                    <div className="flex-1 text-left">
                      <span className="font-semibold text-gray-700 dark:text-gray-200 block">{item.name}</span>
                    </div>
                  )}

                  {sidebarOpen && item.path && (
                    <ChevronRight className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-1" />
                  )}
                </button>
              ))
            )}
          </div>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-gray-100/10 dark:border-gray-700/50 space-y-2">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all text-gray-600 dark:text-gray-300"
            >
              {darkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5" />}
              {sidebarOpen && <span>{darkMode ? "Chế độ sáng" : "Chế độ tối"}</span>}
            </button>

            <button
              onClick={() => {
                localStorage.removeItem("role");
                navigate("/");
              }}
              className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 transition-all"
            >
              <LogOut className="w-5 h-5" />
              {sidebarOpen && <span>Đăng xuất</span>}
            </button>
          </div>
        </motion.aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto relative z-10 p-4 md:p-8">
          <header className="flex justify-between items-center mb-8">
            <div>
              <motion.h2
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl font-bold text-slate-800 dark:text-white"
              >
                Tổng Quan
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="text-slate-500 dark:text-slate-400"
              >
                Quản lý các hoạt động chuỗi cung ứng của bạn một cách hiệu quả.
              </motion.p>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/")}
              className="hidden md:flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
            >
              <ArrowLeftCircle className="w-4 h-4" />
              Đổi Vai Trò
            </motion.button>
          </header>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {pages.map((item, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                onClick={() => item.path && navigate(item.path)}
                className="group cursor-pointer"
              >
                <div className="h-full bg-white/60 dark:bg-slate-800/60 backdrop-blur-md rounded-2xl p-6 border border-white/40 dark:border-white/5 shadow-lg hover:shadow-xl hover:border-indigo-500/30 dark:hover:border-indigo-400/30 transition-all duration-300">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-xl ${item.bg || 'bg-gray-100'} ${item.color || 'text-gray-600'} group-hover:scale-110 transition-transform duration-300`}>
                      {renderIcon(item.icon)}
                    </div>
                    <div className="p-2 rounded-full bg-gray-50 dark:bg-slate-700 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ArrowLeftCircle className="w-4 h-4 text-gray-400 rotate-180" />
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {item.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                    {item.desc || "Truy cập module này để quản lý công việc."}
                  </p>
                </div>
              </motion.div>
            ))}

            {/* Placeholder for 'Add Widget' or Empty State */}
            <motion.div
              variants={itemVariants}
              className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl p-6 flex flex-col items-center justify-center text-center opacity-50 hover:opacity-100 transition-opacity cursor-not-allowed"
            >
              <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-slate-800 flex items-center justify-center mb-3">
                <div className="text-2xl text-gray-400">+</div>
              </div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Thêm lối tắt (Sắp ra mắt)</p>
            </motion.div>

          </motion.div>
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
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(156, 163, 175, 0.5);
          border-radius: 2px;
        }
      `}</style>
    </div>
  );
}
