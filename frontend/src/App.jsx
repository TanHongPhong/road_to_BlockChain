import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";
import Supplier from "./pages/SupplierPage";
import DriverPOD from "./pages/DriverPOD";
import DriverTempChart from "./pages/DriverTempChart";
import TransportDashboard from "./pages/TransportDashboard";
import Warehouse from "./pages/Warehouse";
import Supermarket from "./pages/Supermarket";
import CustomerTracking from "./pages/CustomerTracking";
import CustomerPOD from "./pages/CustomerPOD";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import ConsumerPage from "./pages/ConsumerPage";
import StorePage from "./pages/StorePage";
import InventoryPage from "./pages/InventoryPage";

function App() {
  return (
    <BrowserRouter>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/supplier" element={<Supplier />} />
              <Route path="/driver-pod" element={<DriverPOD />} />
              <Route path="/driver-temp" element={<DriverTempChart />} />
              <Route path="/transport" element={<TransportDashboard />} />
              <Route path="/warehouse" element={<Warehouse />} />
              <Route path="/supermarket" element={<Supermarket />} />
              <Route path="/customer" element={<CustomerTracking />} />
              <Route path="/customer-pod" element={<CustomerPOD />} />
              <Route path="/login" element={<Login />} />
              <Route path="/consumer" element={<ConsumerPage />} />
              <Route path="/store" element={<StorePage />} />
              <Route path="/inventory" element={<InventoryPage />} />

            </Routes>
    </BrowserRouter>

  );
}

export default App;
