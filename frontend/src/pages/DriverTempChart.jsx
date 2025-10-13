// src/pages/DriverTempChart.jsx
import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

const data = [
  { time: "08:00", temperature: 22, humidity: 60 },
  { time: "10:00", temperature: 24, humidity: 55 },
  { time: "12:00", temperature: 27, humidity: 50 },
  { time: "14:00", temperature: 28, humidity: 48 },
  { time: "16:00", temperature: 26, humidity: 52 },
];

export default function DriverTempChart() {
  return (
    <div className="p-6 bg-white rounded-2xl shadow-md">
      <h1 className="text-2xl font-bold mb-4">🌡 Biểu đồ Nhiệt độ & Độ ẩm</h1>
      <LineChart width={700} height={300} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="time" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="temperature" stroke="#2563eb" name="Nhiệt độ (°C)" />
        <Line type="monotone" dataKey="humidity" stroke="#16a34a" name="Độ ẩm (%)" />
      </LineChart>
    </div>
  );
}
