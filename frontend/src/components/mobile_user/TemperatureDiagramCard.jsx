import React, { useMemo, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { X } from "lucide-react";

const ranges = [
  { label: "1 giờ", value: "1h" },
  { label: "6 giờ", value: "6h" },
  { label: "12 giờ", value: "12h" },
  { label: "24 giờ", value: "24h" },
  { label: "7 ngày", value: "7d" },
];

function generateTemperatureData(timeRange) {
  const now = new Date();
  const data = [];
  let points = 0;
  let interval = 0;

  switch (timeRange) {
    case "1h":
      points = 60;
      interval = 1;
      break;
    case "6h":
      points = 72;
      interval = 5;
      break;
    case "12h":
      points = 72;
      interval = 10;
      break;
    case "24h":
      points = 96;
      interval = 15;
      break;
    case "7d":
      points = 84;
      interval = 120;
      break;
    default:
      points = 96;
      interval = 15;
  }

  for (let i = points - 1; i >= 0; i--) {
    const time = new Date(now.getTime() - i * interval * 60000);
    const temp = 10 + Math.sin(i / 15) * 8 + Math.random() * 4;
    data.push({ time: time.getTime(), temperature: Number(temp.toFixed(1)) });
  }
  return data;
}

function getTemperatureStyle(temp) {
  if (temp < 5) return { color: "#3B82F6", status: "Tốt" };
  if (temp < 12) return { color: "#F59E0B", status: "Cảnh báo" };
  return { color: "#EF4444", status: "Nguy hiểm" };
}

export default function TemperatureDiagramCard({
  onClose,
  initialRange = "24h",
}) {
  const [timeRange, setTimeRange] = useState(initialRange);
  const yAxisMax = 25;

  const chartData = useMemo(
    () => generateTemperatureData(timeRange),
    [timeRange]
  );

  const series = useMemo(
    () => [
      {
        name: "Nhiệt độ",
        data: chartData.map((d) => ({ x: d.time, y: d.temperature })),
      },
    ],
    [chartData]
  );

  const options = useMemo(
    () => ({
      chart: {
        type: "area",
        height: 280,
        toolbar: { show: false },
        zoom: { enabled: false },
      },
      dataLabels: { enabled: false },
      stroke: { curve: "smooth", width: 2, colors: ["#6B7280"], opacity: 0.6 },
      fill: {
        type: "gradient",
        gradient: {
          shade: "light",
          type: "vertical",
          shadeIntensity: 0.1,
          inverseColors: false,
          opacityFrom: 0.4,
          opacityTo: 0.1,
          colorStops: [
            {
              offset: 100 - (12 / yAxisMax) * 100,
              color: "#EF4444",
              opacity: 0.4,
            },
            {
              offset: 100 - (5 / yAxisMax) * 100,
              color: "#F59E0B",
              opacity: 0.3,
            },
            { offset: 0, color: "#3B82F6", opacity: 0.2 },
          ],
        },
      },
      xaxis: {
        type: "datetime",
        labels: { style: { colors: "#9CA3AF", fontSize: "11px" } },
        axisBorder: { show: false },
        axisTicks: { show: false },
      },
      yaxis: {
        min: 0,
        max: yAxisMax,
        labels: {
          style: { colors: "#9CA3AF", fontSize: "11px" },
          formatter: (v) => `${v.toFixed(0)}°C`,
        },
      },
      grid: { borderColor: "#E5E7EB", strokeDashArray: 4 },
      tooltip: {
        x: { format: "HH:mm - dd/MM/yy" },
        y: {
          formatter: (v) =>
            `${v.toFixed(1)}°C (${getTemperatureStyle(v).status})`,
        },
      },
    }),
    [yAxisMax]
  );

  const currentTemp = chartData.length
    ? chartData[chartData.length - 1].temperature
    : 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center sm:items-center justify-center p-3"
      onClick={onClose}
    >
      {/* Nền xám mờ */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px]" />

      {/* Card nổi (bottom sheet trên mobile, center trên màn lớn) */}
      <section
        className="relative w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-xl p-3 pointer-events-auto
                   translate-y-0 sm:translate-y-0"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div>
            <h3 className="text-[15px] font-bold text-slate-900">
              Temperature diagram
            </h3>
            <div className="text-xs text-slate-500">
              Cập nhật ~ realtime • Hiện tại:{" "}
              <span className="font-semibold text-slate-800">
                {currentTemp.toFixed(1)}°C
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 grid place-items-center rounded-lg border border-slate-200 hover:bg-slate-50"
            aria-label="Đóng"
            type="button"
          >
            <X className="w-4 h-4 text-slate-600" />
          </button>
        </div>

        {/* Chart */}
        <ReactApexChart
          options={options}
          series={series}
          type="area"
          height={280}
        />

        {/* Range selector */}
        <div className="mt-3 pt-2 border-t border-slate-200">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            {ranges.map((r) => {
              const active = timeRange === r.value;
              return (
                <button
                  key={r.value}
                  onClick={() => setTimeRange(r.value)}
                  className={`px-3 py-1.5 rounded-full text-xs whitespace-nowrap ${
                    active
                      ? "bg-blue-600 text-white font-semibold"
                      : "bg-slate-100 text-slate-700"
                  }`}
                  type="button"
                >
                  {r.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
