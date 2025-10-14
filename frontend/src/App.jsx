import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Pages
import HomePage from "./pages/HomePage.jsx";
import NotFound from "./pages/NotFound.jsx";
import WarehouseInOut from "./pages/WarehouseInOut.jsx";
import OrderTracking from "./pages/OrderTracking.jsx";
import Supplier from "./pages/Supplier.jsx";
import TemperatureDashboard from "./pages/TemperatureDashboard.jsx";
import CameraMonitoring from "./pages/CameraMonitoring.jsx";
import ProductManagement from "./pages/ProductManagement.jsx";
import RoleDashboard from "./pages/RoleDashboard.jsx";
import ProductInformation from "./pages/ProductInformation.jsx";
import QRScannerMobile from "./pages/QRScannerMobile.jsx";
import OrderTrackingCustomer from "./pages/OrderTrackingCustomer.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Canonical routes (dùng gạch-nối) */}
        <Route path="/" element={<HomePage />} />
        <Route path="/order-tracking" element={<OrderTracking />} />
        <Route path="/warehouse-in-out" element={<WarehouseInOut />} />
        <Route
          path="/supplier-camera-monitoring"
          element={<CameraMonitoring />}
        />
        <Route
          path="/supplier-product-management"
          element={<ProductManagement />}
        />
        <Route
          path="/temperature-dashboard"
          element={<TemperatureDashboard />}
        />
        <Route path="/supplier" element={<Supplier />} />
        <Route path="/user-qr" element={<QRScannerMobile />} />
        <Route path="/qr-scanner-mobile" element={<QRScannerMobile />} />
        <Route path="/dashboard" element={<RoleDashboard />} />
        <Route path="/product-infomation" element={<ProductInformation />} />
        <Route
          path="/order-tracking-customer"
          element={<OrderTrackingCustomer />}
        />
        {/* 404 cuối cùng */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
