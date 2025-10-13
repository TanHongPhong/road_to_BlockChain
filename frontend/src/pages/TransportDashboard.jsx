// src/pages/TransportDashboard.jsx
import React from "react";

export default function TransportDashboard() {
  return (
    <div className="p-6 bg-white rounded-2xl shadow-md">
      <h1 className="text-2xl font-bold mb-6">🚛 Điều phối vận tải</h1>
      <p className="text-gray-600 mb-4">Tổng quan luồng vận chuyển (Map Placeholder)</p>

      <div className="border rounded-xl overflow-hidden shadow">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg"
          alt="Map Placeholder"
          className="w-full h-96 object-cover"
        />
      </div>
    </div>
  );
}
