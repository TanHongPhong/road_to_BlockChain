// src/pages/DriverPOD.jsx
import React from "react";

export default function DriverPOD() {
  return (
    <div className="p-6 bg-white rounded-2xl shadow-md">
      <h1 className="text-2xl font-bold mb-6">🚚 POD (Proof of Delivery)</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <p className="text-gray-600 mb-2">Ảnh giao hàng:</p>
          <img
            src="https://via.placeholder.com/400x300"
            alt="Proof"
            className="rounded-xl border shadow-sm"
          />
        </div>
        <div>
          <p className="text-gray-600 mb-2">Chữ ký người nhận:</p>
          <img
            src="https://via.placeholder.com/400x150?text=Signature"
            alt="Signature"
            className="rounded-xl border shadow-sm"
          />
        </div>
      </div>
    </div>
  );
}
