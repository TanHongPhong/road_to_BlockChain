import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [role, setRole] = useState("staff");
  const [form, setForm] = useState({ email: "", password: "" });

  const handleLogin = (e) => {
    e.preventDefault();

    // Giả lập API đăng nhập
    if (form.email && form.password) {
      if (role === "staff") {
        localStorage.setItem("role", "staff");
        navigate("/");
      } else {
        localStorage.setItem("role", "consumer");
        navigate("/consumer");
      }
    } else {
      alert("Please enter email and password!");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-blue-600 text-center mb-4">🛒 Supermarket Login</h1>
        <form onSubmit={handleLogin} className="flex flex-col gap-3">
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="border p-2 rounded"
          />
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="border p-2 rounded"
          />

          <div className="flex justify-between items-center mt-2">
            <label className="text-sm text-gray-600">Role:</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="border rounded p-1"
            >
              <option value="staff">Staff</option>
              <option value="consumer">Consumer</option>
            </select>
          </div>

          <button
            type="submit"
            className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600 mt-4"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
