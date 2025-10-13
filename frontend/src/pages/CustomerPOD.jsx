// src/pages/CustomerPOD.jsx
import React from "react";

export default function CustomerPOD() {
  return (
    <div className="p-6 bg-white rounded-2xl shadow-md">
      <h1 className="text-2xl font-bold mb-6">🧾 Thông tin giao hàng</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <img
            src="https://via.placeholder.com/400x300"
            alt="POD"
            className="rounded-xl border shadow-sm mb-4"
          />
          <p className="text-gray-700">Mã đơn hàng: <b>#123456</b></p>
          <p className="text-gray-700">Trạng thái: <span className="text-green-600">Đã giao</span></p>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">Thông tin sản phẩm</h2>
          <ul className="text-gray-700 space-y-1">
            <li>• Sản phẩm: Rau hữu cơ</li>
            <li>• Số lượng: 3kg</li>
            <li>• Giá: 90.000đ</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
