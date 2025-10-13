// src/components/ChartCard.jsx
import React from "react";

export default function ChartCard({ title, value, color = "text-blue-600", children }) {
  return (
    <div className="bg-white rounded-xl shadow hover:shadow-md transition-all p-4">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-md font-semibold text-gray-700">{title}</h2>
      </div>
      <p className={`text-3xl font-bold ${color}`}>{value}</p>
      <div className="mt-4">{children}</div>
    </div>
  );
}
