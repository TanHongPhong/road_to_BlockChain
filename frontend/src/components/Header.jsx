// src/components/Header.jsx
import React from "react";

export default function Header({ user, onLogout }) {
  return (
    <header className="bg-white border-b px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button className="text-gray-600 md:hidden">☰</button>
        <div className="text-xl font-bold text-blue-600">Supermarket Dashboard</div>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-sm text-gray-600">Light mode</div>
        {user ? (
          <div className="flex items-center gap-3">
            <div className="text-sm">
              <div className="font-medium">{user.name || user.username}</div>
              <div className="text-xs text-gray-500">{user.role}</div>
            </div>
            <button onClick={onLogout} className="px-3 py-1 bg-red-50 text-red-600 rounded">Logout</button>
          </div>
        ) : (
          <div className="text-sm text-gray-600">Not logged in</div>
        )}
      </div>
    </header>
  );
}
