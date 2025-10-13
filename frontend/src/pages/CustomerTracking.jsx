// src/pages/CustomerTracking.jsx
import React from "react";

export default function CustomerTracking() {
  const steps = [
    { label: "Đã xác nhận", done: true },
    { label: "Đang vận chuyển", done: true },
    { label: "Đã giao hàng", done: false },
  ];

  return (
    <div className="p-6 bg-white rounded-2xl shadow-md">
      <h1 className="text-2xl font-bold mb-6">📦 Theo dõi đơn hàng</h1>
      <div className="flex items-center justify-between">
        {steps.map((step, i) => (
          <div key={i} className="flex flex-col items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                step.done ? "bg-green-500 text-white" : "bg-gray-300 text-gray-700"
              }`}
            >
              {i + 1}
            </div>
            <p className="mt-2 text-sm">{step.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
