import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
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
} from "lucide-react";

export default function RoleDashboard() {
  const navigate = useNavigate();
  const [role, setRole] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    if (!storedRole) navigate("/");
    else setRole(storedRole);
  }, []);

  const rolePages = {
    supplier: [
      { name: "Quản lý sản phẩm", path: "/supplier", icon: <Package /> },
      { name: "Theo dõi đơn hàng", path: "/order-tracking", icon: <ClipboardList /> },
      { name: "Camera giám sát", path: "/supplier-camera-monitoring", icon: <Home /> },
      { name: "Quản lý hàng hóa", path: "/supplier-product-management", icon: <Building2 /> },
    ],
    driver: [
      { name: "Danh sách xe vận chuyển", path: "/vehicle-list", icon: <Truck /> },
      { name: "Theo dõi đơn hàng", path: "/order-tracking", icon: <ClipboardList /> },
    //   { name: "Lịch sử thanh toán", path: "/payment-history", icon: <Package /> },
    ],
    warehouse: [
      { name: "Quản lý kho hàng", path: "/warehouse-in-out", icon: <Warehouse /> },
    //   { name: "QR Thanh toán", path: "/payment-qr", icon: <ClipboardList /> },
    ],
    admin: [
      { name: "Công ty vận tải", path: "/transport-companies", icon: <Truck /> },
      { name: "Danh sách phương tiện", path: "/vehicle-list", icon: <Home /> },
    //   { name: "Lịch sử thanh toán", path: "/payment-history", icon: <Package /> },
      { name: "Theo dõi khách hàng", path: "/order-tracking-customer", icon: <ClipboardList /> },
    ],
  };

  const pages = rolePages[role] || [];

  return (
    <div className={`${darkMode ? "dark" : ""} transition-colors duration-500`}>
      <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
        {/* Sidebar */}
        <motion.aside
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className={`${
            sidebarOpen ? "w-64" : "w-20"
          } bg-white dark:bg-gray-800 shadow-lg transition-all duration-300 flex flex-col`}
        >
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <h1
              className={`text-xl font-bold text-indigo-600 dark:text-indigo-400 transition-all duration-300 ${
                sidebarOpen ? "opacity-100" : "opacity-0 w-0"
              }`}
            >
              Dashboard
            </h1>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {pages.map((item, i) => (
              <motion.button
                key={i}
                whileHover={{ scale: 1.03 }}
                onClick={() => navigate(item.path)}
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900 text-gray-700 dark:text-gray-200 font-medium transition-all"
              >
                <span className="text-indigo-600 dark:text-indigo-400">{item.icon}</span>
                {sidebarOpen && <span>{item.name}</span>}
              </motion.button>
            ))}
          </div>

          <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex flex-col gap-2">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {darkMode ? <Sun className="w-5 h-5 text-yellow-300" /> : <Moon className="w-5 h-5 text-gray-400" />}
              {sidebarOpen && <span>Đổi giao diện</span>}
            </button>

            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <ArrowLeftCircle className="w-5 h-5 text-gray-400" />
              {sidebarOpen && <span>Chọn vai trò khác</span>}
            </button>

            <button
              onClick={() => {
                localStorage.removeItem("role");
                navigate("/");
              }}
              className="flex items-center gap-3 p-2 rounded-md hover:bg-red-100 dark:hover:bg-red-900"
            >
              <LogOut className="w-5 h-5 text-red-500" />
              {sidebarOpen && <span className="text-red-500">Đăng xuất</span>}
            </button>
          </div>
        </motion.aside>

        {/* Main content */}
        <main className="flex-1 p-8 overflow-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 h-full"
          >
            <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
              Xin chào, {role ? role.toUpperCase() : "Người dùng"}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {pages.map((item, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.03 }}
                  onClick={() => navigate(item.path)}
                  className="p-6 rounded-xl bg-indigo-500/10 hover:bg-indigo-600/20 dark:bg-indigo-800/30 dark:hover:bg-indigo-700/40 transition-all shadow-md cursor-pointer flex flex-col items-center justify-center"
                >
                  <div className="text-indigo-600 dark:text-indigo-400 mb-3">{item.icon}</div>
                  <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">{item.name}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
