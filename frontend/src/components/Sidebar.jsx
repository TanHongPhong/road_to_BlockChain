// src/components/Sidebar.jsx
import React from "react";
import { NavLink } from "react-router-dom";

export default function Sidebar(){
  const items = [
    { name: "Dashboard", to: "/" },
    { name: "Consumer", to: "/consumer" },
    { name: "Store", to: "/store" },
    { name: "Inventory", to: "/inventory" },
    { name: "Supplier", to: "/supplier" },
  ];
  return (
    <aside className="w-64 bg-white shadow-lg border-r border-gray-200 hidden md:block">
      <div className="p-4 font-bold text-xl text-blue-600">🛒 Supermarket</div>
      <nav className="flex flex-col gap-2 p-2">
        {items.map(i=>(
          <NavLink key={i.to} to={i.to} className={({isActive}) => `px-4 py-2 rounded ${isActive ? 'bg-blue-100 text-blue-600' : 'text-gray-700 hover:bg-gray-100'}`}>
            {i.name}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
