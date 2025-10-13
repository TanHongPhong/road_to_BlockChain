// src/pages/Consumer/ConsumerPage.jsx
import React, { useEffect, useState } from "react";
import { consumersApi } from "../api/mockApi";


export default function ConsumerPage() {
  const [consumers, setConsumers] = useState([]);
  const [newConsumer, setNewConsumer] = useState({ name: "", email: "", phone: "" });
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const data = await consumersApi.list();
    setConsumers(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleAdd = async () => {
    if (!newConsumer.name) return;
    await consumersApi.create(newConsumer);
    setNewConsumer({ name: "", email: "", phone: "" });
    load();
  };

  const handleDelete = async (id) => {
    if (!confirm("Xác nhận xóa?")) return;
    await consumersApi.remove(id);
    load();
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-4 text-blue-600">Consumers</h1>

      <div className="flex gap-2 mb-4">
        <input placeholder="Name" value={newConsumer.name} onChange={e=>setNewConsumer({...newConsumer, name:e.target.value})} className="border p-2 rounded w-1/3" />
        <input placeholder="Email" value={newConsumer.email} onChange={e=>setNewConsumer({...newConsumer, email:e.target.value})} className="border p-2 rounded w-1/3" />
        <input placeholder="Phone" value={newConsumer.phone} onChange={e=>setNewConsumer({...newConsumer, phone:e.target.value})} className="border p-2 rounded w-1/3" />
        <button onClick={handleAdd} className="bg-blue-500 text-white px-4 rounded">Add</button>
      </div>

      {loading ? <div>Loading...</div> : (
      <table className="w-full border">
        <thead>
          <tr className="bg-blue-50">
            <th className="border p-2">ID</th>
            <th className="border p-2">Name</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Phone</th>
            <th className="border p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {consumers.map(c => (
            <tr key={c.id}>
              <td className="border p-2">{c.id}</td>
              <td className="border p-2">{c.name}</td>
              <td className="border p-2">{c.email}</td>
              <td className="border p-2">{c.phone}</td>
              <td className="border p-2">
                <button onClick={()=>handleDelete(c.id)} className="text-red-600">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      )}
    </div>
  );
}
