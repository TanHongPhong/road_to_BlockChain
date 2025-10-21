import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Sun, 
  Moon, 
  UserCog, 
  Truck, 
  Warehouse, 
  Building2,
  Store,
  User,
  Package,
  ClipboardList,
  Camera,
  ArrowRight,
  Shield,
  Zap
} from "lucide-react";
import { useState } from "react";

export default function HomePage() {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [role, setRole] = useState("");

  const roles = [
    {
      id: "supplier",
      label: "Nhà cung cấp",
      description: "Quản lý sản phẩm và đơn hàng",
      icon: <Building2 className="w-8 h-8" />,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      borderColor: "border-blue-200 dark:border-blue-700",
    },
    {
      id: "transport_company",
      label: "Công ty vận chuyển",
      description: "Theo dõi và quản lý vận chuyển",
      icon: <Truck className="w-8 h-8" />,
      color: "from-blue-600 to-blue-700",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      borderColor: "border-blue-200 dark:border-blue-700",
    },
    {
      id: "warehouse",
      label: "Kho hàng",
      description: "Quản lý nhập xuất kho",
      icon: <Warehouse className="w-8 h-8" />,
      color: "from-blue-500 to-blue-700",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      borderColor: "border-blue-200 dark:border-blue-700",
    },
    {
      id: "super_market",
      label: "Siêu thị",
      description: "Quản lý bán lẻ và kho",
      icon: <Store className="w-8 h-8" />,
      color: "from-blue-600 to-blue-800",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      borderColor: "border-blue-200 dark:border-blue-700",
    },
    { 
      id: "user", 
      label: "Người dùng", 
      description: "Tra cứu thông tin sản phẩm",
      icon: <User className="w-8 h-8" />,
      color: "from-blue-500 to-blue-800",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      borderColor: "border-blue-200 dark:border-blue-700",
    },
    { 
      id: "driver", 
      label: "Tài xế", 
      description: "Quản lý phương tiện cá nhân",
      icon: <Truck className="w-8 h-8" />,
      color: "from-blue-600 to-blue-900",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      borderColor: "border-blue-200 dark:border-blue-700",
    },
  ];

  const handleContinue = () => {
    if (!role) return alert("Vui lòng chọn vai trò!");
    localStorage.setItem("role", role);
    navigate("/dashboard");
  };

  return (
    <div className={`${darkMode ? "dark" : ""} transition-colors duration-500`}>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-slate-900 dark:via-blue-900/10 dark:to-slate-800">
        {/* Dark Mode Toggle */}
        <div className="absolute top-6 right-6">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setDarkMode(!darkMode)}
            className="p-3 rounded-xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm shadow-lg border border-blue-200/50 dark:border-blue-700/50"
          >
            {darkMode ? (
              <Sun className="w-6 h-6 text-yellow-500" />
            ) : (
              <Moon className="w-6 h-6 text-blue-600" />
            )}
          </motion.button>
        </div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-4xl w-full mx-4"
        >
          {/* Header */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-6"
            >
              <div className="inline-flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white shadow-lg">
                  <Shield className="w-6 h-6" />
                </div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                  Gemadept Logistics
                </h1>
              </div>
              <p className="text-xl text-blue-600 dark:text-blue-400 font-medium">
                Hệ thống Quản lý Chuỗi Cung Ứng Thông minh
              </p>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-lg text-blue-500 dark:text-blue-400 mb-8"
            >
              Vui lòng chọn vai trò để truy cập hệ thống
            </motion.p>
          </div>

          {/* Role Selection Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
          >
            {roles.map((r, index) => (
              <motion.button
                key={r.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.8 + index * 0.1 }}
                whileHover={{ 
                  scale: 1.05, 
                  y: -5,
                  transition: { duration: 0.2 }
                }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setRole(r.id)}
                className={`group relative overflow-hidden rounded-2xl p-6 transition-all duration-300 border-2 ${
                  role === r.id
                    ? `${r.borderColor} ${r.bgColor} shadow-xl`
                    : "border-blue-200/50 dark:border-blue-700/50 bg-white/90 dark:bg-slate-800/90 hover:border-blue-300 dark:hover:border-blue-600 shadow-lg hover:shadow-xl"
                } backdrop-blur-sm`}
              >
                {/* Gradient Background */}
                {role === r.id && (
                  <div className={`absolute inset-0 bg-gradient-to-br ${r.color} opacity-10`} />
                )}
                
                <div className="relative">
                  <div className={`inline-flex p-4 rounded-2xl mb-4 ${
                    role === r.id 
                      ? `bg-gradient-to-r ${r.color} text-white shadow-lg` 
                      : "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                  }`}>
                    {r.icon}
                  </div>
                  
                  <h3 className={`text-lg font-bold mb-2 ${
                    role === r.id 
                      ? "text-blue-700 dark:text-blue-300" 
                      : "text-slate-800 dark:text-slate-200"
                  }`}>
                    {r.label}
                  </h3>
                  
                  <p className={`text-sm ${
                    role === r.id 
                      ? "text-blue-600 dark:text-blue-400" 
                      : "text-slate-600 dark:text-slate-400"
                  }`}>
                    {r.description}
                  </p>

                  {/* Arrow indicator */}
                  {role === r.id && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="absolute top-4 right-4"
                    >
                      <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white">
                        <ArrowRight className="w-3 h-3" />
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.button>
            ))}
          </motion.div>

          {/* Continue Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="text-center"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleContinue}
              disabled={!role}
              className={`w-full max-w-md py-4 px-8 rounded-2xl font-semibold text-lg transition-all duration-300 shadow-lg ${
                role
                  ? "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-xl hover:shadow-2xl"
                  : "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
              }`}
            >
              <div className="flex items-center justify-center gap-3">
                <span>Tiếp tục</span>
                <ArrowRight className="w-5 h-5" />
              </div>
            </motion.button>
          </motion.div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.4 }}
            className="text-center mt-12"
          >
            <div className="text-blue-500 dark:text-blue-400 text-sm">
              © 2025 Gemadept Logistics - Hệ thống quản lý kho hàng thông minh
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}