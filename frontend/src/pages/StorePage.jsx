// src/pages/StorePage.jsx
import React, { useEffect, useState } from "react";
import { storesApi } from "../../supermarket-system/src/api/mockApi"; // ✅ đường dẫn và biến đúng

export default function StorePage() {
  const [stores, setStores] = useState([]);
  const [form, setForm] = useState({ name: "", address: "", open_time: "08:00", close_time: "21:00" });

  const load = async () => {
    setStores(await storesApi.list());
  };

  useEffect(() => { load(); }, []);

  const create = async () => {
    if (!form.name) return;
    await storesApi.create(form);
    setForm({ name: "", address: "", open_time: "08:00", close_time: "21:00" });
    load();
  };

  const remove = async (id) => {
    if (!window.confirm("Xóa cửa hàng?")) return;
    await storesApi.remove(id);
    load();
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold text-blue-600 mb-4">Stores</h2>

      <div className="flex gap-2 mb-4">
        <input placeholder="Name" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} className="border p-2 rounded w-1/4"/>
        <input placeholder="Address" value={form.address} onChange={e=>setForm({...form, address:e.target.value})} className="border p-2 rounded w-1/3"/>
        <input type="time" value={form.open_time} onChange={e=>setForm({...form, open_time:e.target.value})} className="border p-2 rounded"/>
        <input type="time" value={form.close_time} onChange={e=>setForm({...form, close_time:e.target.value})} className="border p-2 rounded"/>
        <button onClick={create} className="bg-blue-500 text-white px-4 rounded">Add</button>
      </div>

      <table className="w-full border">
        <thead>
          <tr className="bg-blue-50">
            <th className="p-2 border">ID</th>
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Address</th>
            <th className="p-2 border">Hours</th>
            <th className="p-2 border">Action</th>
          </tr>
        </thead>
        <tbody>
          {stores.map(s => (
            <tr key={s.id}>
              <td className="border p-2">{s.id}</td>
              <td className="border p-2">{s.name}</td>
              <td className="border p-2">{s.address}</td>
              <td className="border p-2">{s.open_time} - {s.close_time}</td>
              <td className="border p-2">
                <button className="text-red-600" onClick={() => remove(s.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
