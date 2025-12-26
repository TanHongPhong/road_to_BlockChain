import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Sun, Moon, UserCog, Truck, Warehouse, Building2, ArrowRight } from "lucide-react";
import { useState } from "react";

export default function HomePage() {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [role, setRole] = useState("");

  const roles = [
    {
      id: "supplier",
      label: "Nhà Cung Cấp",
      desc: "Quản lý sản phẩm & nguồn hàng",
      icon: <Building2 className="w-8 h-8" />,
      color: "text-blue-500",
      bg: "bg-blue-100 dark:bg-blue-900/30",
      border: "hover:border-blue-500",
    },
    {
      id: "transport_company",
      label: "Công Ty Vận Tải",
      desc: "Điều phối vận chuyển & đội xe",
      icon: <Truck className="w-8 h-8" />,
      color: "text-purple-500",
      bg: "bg-purple-100 dark:bg-purple-900/30",
      border: "hover:border-purple-500",
    },
    {
      id: "warehouse",
      label: "Kho Hàng",
      desc: "Kiểm soát kho & lưu trữ",
      icon: <Warehouse className="w-8 h-8" />,
      color: "text-orange-500",
      bg: "bg-orange-100 dark:bg-orange-900/30",
      border: "hover:border-orange-500",
    },
    {
      id: "super_market",
      label: "Siêu Thị",
      desc: "Theo dõi bán lẻ & đơn hàng",
      icon: <Warehouse className="w-8 h-8" />,
      color: "text-green-500",
      bg: "bg-green-100 dark:bg-green-900/30",
      border: "hover:border-green-500",
    },
    {
      id: "user",
      label: "Người Dùng Cuối",
      desc: "Xem sản phẩm & đặt hàng",
      icon: <UserCog className="w-8 h-8" />,
      color: "text-pink-500",
      bg: "bg-pink-100 dark:bg-pink-900/30",
      border: "hover:border-pink-500",
    },
    {
      id: "driver",
      label: "Tài Xế",
      desc: "Cập nhật lộ trình giao hàng",
      icon: <Truck className="w-8 h-8" />,
      color: "text-yellow-500",
      bg: "bg-yellow-100 dark:bg-yellow-900/30",
      border: "hover:border-yellow-500",
    },
  ];

  const handleContinue = () => {
    if (!role) return alert("Vui lòng chọn vai trò!");
    localStorage.setItem("role", role);
    navigate("/dashboard");
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  return (
    <div className={`${darkMode ? "dark" : ""}`}>
      <div className="min-h-screen relative overflow-hidden flex items-center justify-center bg-[#f8fafc] dark:bg-[#0f172a] transition-colors duration-500">

        {/* Animated Background Mesh */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-[20%] -left-[10%] w-[70vw] h-[70vw] bg-purple-300/30 dark:bg-purple-900/20 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-screen animate-blob" />
          <div className="absolute top-[20%] -right-[10%] w-[60vw] h-[60vw] bg-yellow-300/30 dark:bg-yellow-900/20 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-screen animate-blob animation-delay-2000" />
          <div className="absolute -bottom-[20%] left-[20%] w-[60vw] h-[60vw] bg-pink-300/30 dark:bg-pink-900/20 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-screen animate-blob animation-delay-4000" />
        </div>

        {/* Theme Toggle */}
        <div className="absolute top-6 right-6 z-20">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-3 rounded-full bg-white/70 dark:bg-slate-800/70 backdrop-blur-md shadow-lg border border-white/20 hover:scale-110 transition-transform duration-200"
          >
            {darkMode ? (
              <Sun className="w-6 h-6 text-yellow-400 fill-current" />
            ) : (
              <Moon className="w-6 h-6 text-slate-600 fill-current" />
            )}
          </button>
        </div>

        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative z-10 w-full max-w-5xl mx-4"
        >
          <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/40 dark:border-white/10 p-8 md:p-12 overflow-hidden">

            {/* Header */}
            <div className="text-center mb-12">
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <span className="inline-block py-1 px-3 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300 text-sm font-semibold mb-4 tracking-wide uppercase">
                  Bảng Điều Khiển Logistics
                </span>
                <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 mb-4 drop-shadow-sm">
                  Quản Lý Chuỗi Cung Ứng
                </h1>
                <p className="text-slate-600 dark:text-slate-300 text-lg max-w-2xl mx-auto">
                  Vui lòng chọn vai trò để truy cập hệ thống một cách an toàn và hiệu quả.
                </p>
              </motion.div>
            </div>

            {/* Roles Grid */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
            >
              {roles.map((r) => (
                <motion.div
                  key={r.id}
                  variants={itemVariants}
                  whileHover={{ y: -5, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <button
                    onClick={() => setRole(r.id)}
                    className={`w-full group relative flex flex-col items-center p-6 rounded-2xl border-2 transition-all duration-300 ${role === r.id
                      ? `border-${r.color.split("-")[1]}-500 bg-white dark:bg-slate-800 shadow-xl ring-2 ring-offset-2 ring-indigo-500 dark:ring-offset-slate-900`
                      : "border-transparent bg-white/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 hover:shadow-lg"
                      } ${r.border}`}
                  >
                    <div
                      className={`p-4 rounded-full mb-4 transition-colors duration-300 ${r.bg} ${r.color}`}
                    >
                      {r.icon}
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">
                      {r.label}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 text-center">
                      {r.desc}
                    </p>

                    {role === r.id && (
                      <motion.div
                        layoutId="active-indicator"
                        className="absolute top-4 right-4 w-3 h-3 bg-indigo-500 rounded-full"
                      />
                    )}
                  </button>
                </motion.div>
              ))}
            </motion.div>

            {/* Continue Button */}
            <div className="flex justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleContinue}
                className={`flex items-center gap-3 px-10 py-4 rounded-xl text-lg font-bold text-white shadow-xl transition-all duration-300 ${role
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-indigo-500/30 cursor-pointer"
                  : "bg-slate-300 dark:bg-slate-700 cursor-not-allowed opacity-70"
                  }`}
              >
                Tiếp Tục Truy Cập
                <ArrowRight className={`w-5 h-5 ${role ? "animate-pulse" : ""}`} />
              </motion.button>
            </div>

          </div>

          {/* Footer */}
          <div className="text-center mt-6 text-slate-500 dark:text-slate-400 text-sm">
            &copy; 2025 BlockChain Logistics. Vận hành bởi Công nghệ Web 3.0.
          </div>
        </motion.div>
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
