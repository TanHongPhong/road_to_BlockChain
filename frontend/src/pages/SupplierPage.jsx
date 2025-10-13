import React, { useState } from "react";

export default function SupplierPage() {
  const [suppliers, setSuppliers] = useState([
    { id: 1, name: "ABC Foods", contact: "abc@example.com", location: "Hồ Chí Minh" },
    { id: 2, name: "Fresh Farm", contact: "farm@example.com", location: "Đà Lạt" },
  ]);
  const [newSupplier, setNewSupplier] = useState({ name: "", contact: "", location: "" });

  const addSupplier = () => {
    if (!newSupplier.name) return;
    setSuppliers([...suppliers, { id: Date.now(), ...newSupplier }]);
    setNewSupplier({ name: "", contact: "", location: "" });
  };

  const deleteSupplier = (id) => setSuppliers(suppliers.filter((s) => s.id !== id));

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-4 text-blue-600">Suppliers</h1>

      <div className="flex gap-2 mb-4">
        <input
          className="border p-2 rounded w-1/4"
          placeholder="Name"
          value={newSupplier.name}
          onChange={(e) => setNewSupplier({ ...newSupplier, name: e.target.value })}
        />
        <input
          className="border p-2 rounded w-1/4"
          placeholder="Contact"
          value={newSupplier.contact}
          onChange={(e) => setNewSupplier({ ...newSupplier, contact: e.target.value })}
        />
        <input
          className="border p-2 rounded w-1/4"
          placeholder="Location"
          value={newSupplier.location}
          onChange={(e) => setNewSupplier({ ...newSupplier, location: e.target.value })}
        />
        <button
          onClick={addSupplier}
          className="bg-blue-500 text-white px-4 rounded hover:bg-blue-600"
        >
          Add
        </button>
      </div>

      <table className="w-full border">
        <thead>
          <tr className="bg-blue-50">
            <th className="border p-2">ID</th>
            <th className="border p-2">Name</th>
            <th className="border p-2">Contact</th>
            <th className="border p-2">Location</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {suppliers.map((s) => (
            <tr key={s.id}>
              <td className="border p-2">{s.id}</td>
              <td className="border p-2">{s.name}</td>
              <td className="border p-2">{s.contact}</td>
              <td className="border p-2">{s.location}</td>
              <td className="border p-2">
                <button
                  onClick={() => deleteSupplier(s.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
