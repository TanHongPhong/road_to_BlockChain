// src/components/Footer.jsx
import React from "react";
export default function Footer(){
  return (
    <footer className="bg-white border-t p-3 text-center text-sm text-gray-500">
      © {new Date().getFullYear()} Supermarket System — Demo
    </footer>
  );
}
