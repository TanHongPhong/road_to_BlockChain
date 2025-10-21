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
  User,
  Settings,
  Bell,
  Search,
  TrendingUp,
  Activity,
  Clock,
  MapPin,
  Store,
  Camera,
  ArrowRight,
  Shield,
  Zap,
  BarChart3,
  FileText,
  QrCode,
} from "lucide-react";

/* ===================== DATA NHÚNG TRONG FILE ===================== */
const DASHBOARD_DATA = {
  title: "Dashboard",
  pagesByRole: {
    supplier: [
      {
        name: "Quản lý hàng hóa",
        path: "/supplier-product-management",
        icon: "Building2",
        description: "Quản lý thông tin sản phẩm và hàng hóa",
        color: "from-blue-500 to-blue-600",
        bgColor: "bg-blue-50 dark:bg-blue-900/20",
        iconColor: "text-blue-600 dark:text-blue-400",
      },
      {
        name: "Camera giám sát",
        path: "/supplier-camera-monitoring",
        icon: "Camera",
        description: "Theo dõi camera giám sát kho hàng",
        color: "from-blue-600 to-blue-700",
        bgColor: "bg-blue-50 dark:bg-blue-900/20",
        iconColor: "text-blue-600 dark:text-blue-400",
      },
      {
        name: "Đơn hàng đã xuất kho",
        path: "/order-tracking-customer",
        icon: "FileText",
        description: "Xem lịch sử đơn hàng đã xuất",
        color: "from-blue-500 to-blue-700",
        bgColor: "bg-blue-50 dark:bg-blue-900/20",
        iconColor: "text-blue-600 dark:text-blue-400",
      },
    ],
    transport_company: [
      { 
        name: "Dashboard", 
        path: "/supplier", 
        icon: "BarChart3",
        description: "Tổng quan hệ thống vận chuyển",
        color: "from-blue-500 to-blue-600",
        bgColor: "bg-blue-50 dark:bg-blue-900/20",
        iconColor: "text-blue-600 dark:text-blue-400",
      },
      { 
        name: "Theo dõi đội xe", 
        path: "/vehicle-list", 
        icon: "Truck",
        description: "Quản lý và theo dõi phương tiện",
        color: "from-blue-600 to-blue-700",
        bgColor: "bg-blue-50 dark:bg-blue-900/20",
        iconColor: "text-blue-600 dark:text-blue-400",
      },
      {
        name: "Theo dõi đơn hàng",
        path: "/order-tracking",
        icon: "MapPin",
        description: "Theo dõi trạng thái đơn hàng",
        color: "from-blue-500 to-blue-700",
        bgColor: "bg-blue-50 dark:bg-blue-900/20",
        iconColor: "text-blue-600 dark:text-blue-400",
      },
    ],
    driver: [
      { 
        name: "Quản lý xe", 
        path: "/vehicle-list", 
        icon: "Truck",
        description: "Thông tin và quản lý xe cá nhân",
        color: "from-blue-500 to-blue-600",
        bgColor: "bg-blue-50 dark:bg-blue-900/20",
        iconColor: "text-blue-600 dark:text-blue-400",
      }
    ],
    warehouse: [
      {
        name: "Quản lý kho hàng",
        path: "/warehouse-in-out",
        icon: "Warehouse",
        description: "Tổng quan hoạt động kho hàng",
        color: "from-blue-500 to-blue-600",
        bgColor: "bg-blue-50 dark:bg-blue-900/20",
        iconColor: "text-blue-600 dark:text-blue-400",
      },
      {
        name: "Nhập kho",
        path: "/camera-warehouse-in",
        icon: "Package",
        description: "Quản lý quy trình nhập kho",
        color: "from-blue-600 to-blue-700",
        bgColor: "bg-blue-50 dark:bg-blue-900/20",
        iconColor: "text-blue-600 dark:text-blue-400",
      },
      {
        name: "Xuất kho",
        path: "/camera-warehouse-out",
        icon: "Truck",
        description: "Quản lý quy trình xuất kho",
        color: "from-blue-500 to-blue-700",
        bgColor: "bg-blue-50 dark:bg-blue-900/20",
        iconColor: "text-blue-600 dark:text-blue-400",
      },
    ],
    super_market: [
      {
        name: "Nhập kho",
        path: "/supermarket-receiving",
        icon: "Package",
        description: "Quản lý nhập hàng siêu thị",
        color: "from-blue-500 to-blue-600",
        bgColor: "bg-blue-50 dark:bg-blue-900/20",
        iconColor: "text-blue-600 dark:text-blue-400",
      },
      {
        name: "Đưa hàng lên kệ",
        path: "/mobile-shelf-putaway",
        icon: "Store",
        description: "Sắp xếp hàng hóa lên kệ",
        color: "from-blue-600 to-blue-700",
        bgColor: "bg-blue-50 dark:bg-blue-900/20",
        iconColor: "text-blue-600 dark:text-blue-400",
      },
    ],
    user: [
      { 
        name: "Thông tin sản phẩm", 
        path: "/product-infomation", 
        icon: "FileText",
        description: "Xem thông tin chi tiết sản phẩm",
        color: "from-blue-500 to-blue-600",
        bgColor: "bg-blue-50 dark:bg-blue-900/20",
        iconColor: "text-blue-600 dark:text-blue-400",
      },
      { 
        name: "Quét QR", 
        path: "/user-QR", 
        icon: "QrCode",
        description: "Quét mã QR để tra cứu thông tin",
        color: "from-blue-600 to-blue-700",
        bgColor: "bg-blue-50 dark:bg-blue-900/20",
        iconColor: "text-blue-600 dark:text-blue-400",
      },
    ],
  },
};
/* ================================================================= */

const ICON_MAP = { 
  Home, 
  Truck, 
  Package, 
  Warehouse, 
  ClipboardList, 
  Building2, 
  Search, 
  Camera, 
  FileText, 
  BarChart3, 
  MapPin, 
  Store, 
  QrCode 
};

export default function RoleDashboard() {
  const navigate = useNavigate();
  const [role, setRole] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    if (!storedRole) navigate("/");
    else setRole(storedRole);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pages = useMemo(() => {
    const rolePages = DASHBOARD_DATA.pagesByRole[role] || [];
    if (!searchTerm) return rolePages;
    
    return rolePages.filter(page => 
      page.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      page.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [role, searchTerm]);

  const renderIcon = (icon) => {
    if (!icon) return <Home />;
    if (typeof icon === "string") {
      const Cmp = ICON_MAP[icon] || Home;
      return <Cmp />;
    }
    if (typeof icon === "function") {
      const Cmp = icon;
      return <Cmp />;
    }
    return icon;
  };

  const getRoleDisplayName = (role) => {
    const roleNames = {
      supplier: "Nhà cung cấp",
      transport_company: "Công ty vận chuyển",
      driver: "Tài xế",
      warehouse: "Kho hàng",
      super_market: "Siêu thị",
      user: "Người dùng"
    };
    return roleNames[role] || role;
  };

  return (
    <div className={`${darkMode ? "dark" : ""} transition-colors duration-500`}>
      <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-slate-900 dark:via-blue-900/10 dark:to-slate-800">
        {/* Sidebar */}
        <motion.aside
          initial={{ x: -300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={`${
            sidebarOpen ? "w-80" : "w-20"
          } bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl shadow-2xl border-r border-blue-200/50 dark:border-blue-700/50 transition-all duration-300 flex flex-col`}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-blue-200/50 dark:border-blue-700/50">
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: sidebarOpen ? 1 : 0 }}
              transition={{ duration: 0.3 }}
              className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent"
            >
              {DASHBOARD_DATA.title}
            </motion.h1>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-6">
            <div className="space-y-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate("/")}
                className="flex items-center gap-4 w-full p-4 rounded-xl bg-gradient-to-r from-blue-100 to-blue-200 dark:from-blue-800/30 dark:to-blue-700/30 hover:from-blue-200 hover:to-blue-300 dark:hover:from-blue-700/40 dark:hover:to-blue-600/40 transition-all duration-300 text-blue-700 dark:text-blue-300 shadow-md"
              >
                <ArrowLeftCircle className="w-6 h-6" />
                <AnimatePresence>
                  {sidebarOpen && (
                    <motion.span
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="font-medium"
                    >
                      Quay lại
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setDarkMode(!darkMode)}
                className="flex items-center gap-4 w-full p-4 rounded-xl bg-gradient-to-r from-blue-100 to-blue-200 dark:from-blue-800/30 dark:to-blue-700/30 hover:from-blue-200 hover:to-blue-300 dark:hover:from-blue-700/40 dark:hover:to-blue-600/40 transition-all duration-300 text-blue-700 dark:text-blue-300 shadow-md"
              >
                {darkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
                <AnimatePresence>
                  {sidebarOpen && (
                    <motion.span
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="font-medium"
                    >
                      {darkMode ? "Chế độ sáng" : "Chế độ tối"}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  localStorage.removeItem("role");
                  navigate("/");
                }}
                className="flex items-center gap-4 w-full p-4 rounded-xl bg-gradient-to-r from-blue-100 to-blue-200 dark:from-blue-800/30 dark:to-blue-700/30 hover:from-blue-200 hover:to-blue-300 dark:hover:from-blue-700/40 dark:hover:to-blue-600/40 transition-all duration-300 text-blue-700 dark:text-blue-300 shadow-md"
              >
                <LogOut className="w-6 h-6" />
                <AnimatePresence>
                  {sidebarOpen && (
                    <motion.span
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="font-medium"
                    >
                      Đăng xuất
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </nav>

          {/* User Info */}
          <div className="p-6 border-t border-blue-200/50 dark:border-blue-700/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold">
                <User className="w-5 h-5" />
              </div>
              <AnimatePresence>
                {sidebarOpen && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="flex-1"
                  >
                    <p className="font-semibold text-slate-800 dark:text-slate-200">
                      {getRoleDisplayName(role)}
                    </p>
                    <p className="text-sm text-blue-600 dark:text-blue-400">
                      {role.toUpperCase()}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.aside>

        {/* Main Content */}
        <main className="flex-1">
          <div className="p-8">
            {/* Header */}
            <motion.header
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-8"
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-2">
                    Chào mừng trở lại! 👋
                  </h1>
                  <p className="text-lg text-blue-600 dark:text-blue-400">
                    {getRoleDisplayName(role)} - Dưới đây là các chức năng dành cho bạn
                  </p>
                </div>

                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm chức năng..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full lg:w-80 pl-12 pr-4 py-3 rounded-xl border border-blue-200 dark:border-blue-700 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 shadow-lg"
                  />
                </div>
              </div>
            </motion.header>

            {/* Stats Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
            >
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm font-medium">Tổng chức năng</p>
                    <p className="text-3xl font-bold">{pages.length}</p>
                  </div>
                  <Activity className="w-8 h-8 text-blue-200" />
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 text-white shadow-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm font-medium">Vai trò</p>
                    <p className="text-3xl font-bold">{getRoleDisplayName(role)}</p>
                  </div>
                  <User className="w-8 h-8 text-blue-200" />
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-blue-700 to-blue-800 rounded-2xl p-6 text-white shadow-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm font-medium">Trạng thái</p>
                    <p className="text-3xl font-bold">Online</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-blue-200" />
                </div>
              </div>
            </motion.div>

            {/* Cards Grid */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              <AnimatePresence>
                {pages.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="col-span-full text-center py-16"
                  >
                    <div className="text-blue-500 dark:text-blue-400 text-xl">
                      {searchTerm ? (
                        <>
                          Không tìm thấy chức năng nào phù hợp với "{searchTerm}"
                        </>
                      ) : (
                        <>
                          Không có trang nào cho vai trò: <b>{getRoleDisplayName(role)}</b>
                        </>
                      )}
                    </div>
                  </motion.div>
                ) : (
                  pages.map((item, i) => (
                    <motion.div
                      key={item.path}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.4, delay: i * 0.1 }}
                      whileHover={{ 
                        scale: 1.05, 
                        y: -5,
                        transition: { duration: 0.2 }
                      }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => item.path && navigate(item.path)}
                      className="group cursor-pointer"
                    >
                      <div className={`relative overflow-hidden rounded-2xl ${item.bgColor} backdrop-blur-sm border border-blue-200/50 dark:border-blue-700/50 shadow-xl hover:shadow-2xl transition-all duration-300`}>
                        {/* Gradient Background */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                        
                        {/* Content */}
                        <div className="relative p-8">
                          <div className="flex items-start justify-between mb-6">
                            <div className={`p-4 rounded-2xl bg-gradient-to-r ${item.color} text-white shadow-lg`}>
                              {renderIcon(item.icon)}
                            </div>
                            <div className="text-right">
                              <div className="text-sm text-blue-500 dark:text-blue-400">
                                {item.path.split('/')[1]?.toUpperCase() || 'DASHBOARD'}
                              </div>
                            </div>
                          </div>
                          
                          <h3 className={`text-xl font-bold ${item.iconColor} mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300`}>
                            {item.name}
                          </h3>
                          
                          <p className="text-blue-600 dark:text-blue-400 text-sm leading-relaxed mb-6">
                            {item.description}
                          </p>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors duration-300">
                              Truy cập ngay →
                            </span>
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <ArrowLeftCircle className="w-4 h-4 rotate-180" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </motion.div>

            {/* Footer */}
            <motion.footer
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="mt-16 text-center"
            >
              <div className="text-blue-500 dark:text-blue-400 text-sm">
                © 2025 Gemadept Logistics - Hệ thống quản lý kho hàng thông minh
              </div>
            </motion.footer>
          </div>
        </main>
      </div>
    </div>
  );
}