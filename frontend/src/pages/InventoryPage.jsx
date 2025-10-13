// src/pages/Inventory/InventoryPage.jsx
import React, { useEffect, useState } from "react";
import { inventoryApi } from "../api/mockApi";


export default function InventoryPage(){
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ product: "", batch: "", quantity: 0, quality: "good", storeId: 1 });

  const load = async () => setItems(await inventoryApi.list());
  useEffect(()=>{ load(); }, []);

  const add = async () => {
    if (!form.product) return;
    await inventoryApi.create({...form, quantity: Number(form.quantity)});
    setForm({ product: "", batch: "", quantity: 0, quality: "good", storeId: 1 });
    load();
  };

  const remove = async (id) => { if(!confirm("Xóa item?")) return; await inventoryApi.remove(id); load(); };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold text-blue-600 mb-4">Inventory</h2>

      <div className="flex gap-2 mb-4">
        <input placeholder="Product" value={form.product} onChange={e=>setForm({...form, product:e.target.value})} className="border p-2 rounded w-1/4"/>
        <input placeholder="Batch" value={form.batch} onChange={e=>setForm({...form, batch:e.target.value})} className="border p-2 rounded w-1/6"/>
        <input type="number" placeholder="Qty" value={form.quantity} onChange={e=>setForm({...form, quantity:e.target.value})} className="border p-2 rounded w-1/6"/>
        <select value={form.quality} onChange={e=>setForm({...form, quality:e.target.value})} className="border p-2 rounded">
          <option value="good">Good</option>
          <option value="low">Low Quality</option>
          <option value="expired">Expired</option>
        </select>
        <button onClick={add} className="bg-blue-500 text-white px-4 rounded">Add</button>
      </div>

      <table className="w-full border">
        <thead><tr className="bg-blue-50"><th className="p-2 border">ID</th><th className="p-2 border">Product</th><th className="p-2 border">Batch</th><th className="p-2 border">Qty</th><th className="p-2 border">Quality</th><th className="p-2 border">Action</th></tr></thead>
        <tbody>
          {items.map(i=>(
            <tr key={i.id}>
              <td className="border p-2">{i.id}</td>
              <td className="border p-2 flex items-center gap-3">
                {i.img ? <img src={i.img} alt="" className="w-12 h-12 object-cover rounded" /> : <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center text-xs">No Img</div>}
                <div>{i.product}</div>
              </td>
              <td className="border p-2">{i.batch}</td>
              <td className="border p-2">{i.quantity}</td>
              <td className="border p-2">{i.quality}</td>
              <td className="border p-2"><button onClick={()=>remove(i.id)} className="text-red-600">Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
