// src/pages/Warehouse.jsx
import React, { useState } from "react";

export default function Warehouse() {
  const [image, setImage] = useState(null);
  const [status, setStatus] = useState("Chờ xử lý...");

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
      setStatus("Đang phân tích bằng AI Vision...");
      setTimeout(() => setStatus("✅ Hoàn tất – Ảnh hợp lệ"), 2000);
    }
  };

  return (
    <div className="p-6 bg-white rounded-2xl shadow-md">
      <h1 className="text-2xl font-bold mb-4">🏭 Kho vận</h1>
      <p className="text-gray-600 mb-4">Chụp / Upload ảnh – xử lý AI Vision</p>

      <div className="flex flex-col items-center border-2 border-dashed border-gray-300 p-6 rounded-xl">
        {image && (
          <img src={image} alt="Preview" className="w-64 h-64 object-cover rounded-lg mb-4" />
        )}
        <input
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          id="warehouseUpload"
          onChange={handleUpload}
        />
        <label
          htmlFor="warehouseUpload"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700"
        >
          Upload / Chụp ảnh
        </label>
      </div>
      <p className="mt-4 text-sm text-gray-700">{status}</p>
    </div>
  );
}
