import React from "react";
import ChartCard from "../components/ChartCard";
import { dashboardStats } from "../data/mockData";
import { Bar, Pie } from "react-chartjs-2";
import "chart.js/auto";

export default function Dashboard() {
  const salesData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    datasets: [
      { label: "Sales ($)", data: dashboardStats.salesTrend, backgroundColor: "#60A5FA" },
    ],
  };
  const inventoryData = {
    labels: ["Good", "Low Quality", "Expired"],
    datasets: [
      { data: dashboardStats.inventoryQuality, backgroundColor: ["#34D399", "#FBBF24", "#F87171"] },
    ],
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <ChartCard title="Total Sales" value={`$${dashboardStats.totalSales}`} color="text-blue-600" />
      <ChartCard title="Low Quality Items" value={dashboardStats.lowQualityCount} color="text-yellow-600" />
      <ChartCard title="Total Consumers" value={dashboardStats.totalConsumers} color="text-green-600" />

      <div className="col-span-2 bg-white p-4 rounded-xl shadow">
        <h2 className="text-lg font-semibold mb-4">Sales Over Time</h2>
        <Bar data={salesData} />
      </div>

      <div className="bg-white p-4 rounded-xl shadow">
        <h2 className="text-lg font-semibold mb-4">Inventory Quality</h2>
        <Pie data={inventoryData} />
      </div>
    </div>
  );
}
