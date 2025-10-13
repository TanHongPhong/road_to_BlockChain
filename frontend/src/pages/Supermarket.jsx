// src/pages/Supermarket.jsx
import React from "react";
import Warehouse from "./Warehouse";

export default function Supermarket() {
  return (
    <div className="p-6 bg-white rounded-2xl shadow-md">
      <h1 className="text-2xl font-bold mb-4">🏪 Siêu thị</h1>
      <p className="text-gray-600 mb-4">
        Giao diện tương tự kho vận – Nhận, kiểm và xuất hàng
      </p>
      <Warehouse />
    </div>
  );
}
