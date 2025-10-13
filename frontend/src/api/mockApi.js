// src/api/mockApi.js
// Simple mock API using localStorage and promises to simulate latency.

const LATENCY = 300;

const seed = () => {
  if (!localStorage.getItem("sm_users")) {
    const users = [
      { id: 1, username: "admin", password: "admin", role: "admin", name: "Admin" },
      { id: 2, username: "store1", password: "store1", role: "staff", storeId: 1, name: "Nhân viên cửa hàng A" },
      { id: 3, username: "consumer1", password: "consumer1", role: "consumer", name: "Nguyễn Quỳnh Anh" },
    ];
    const consumers = [
      { id: 1, name: "Nguyễn Quỳnh Anh", email: "quynhanh@example.com", phone: "0901234567" },
      { id: 2, name: "Lê Văn A", email: "leva@example.com", phone: "0912345678" },
    ];
    const stores = [
      { id: 1, name: "Cửa hàng A", address: "Hà Nội", open_time: "08:00", close_time: "21:00" },
      { id: 2, name: "Cửa hàng B", address: "HCM", open_time: "08:30", close_time: "22:00" },
    ];
    const inventory = [
      { id: 1, product: "Sữa Vinamilk 1L", batch: "B001", quantity: 120, quality: "good", storeId: 1, img: "" },
      { id: 2, product: "Bánh Quy", batch: "B002", quantity: 20, quality: "low", storeId: 1, img: "" },
      { id: 3, product: "Nước khoáng", batch: "B003", quantity: 300, quality: "good", storeId: 2, img: "" },
    ];
    const suppliers = [
      { id: 1, name: "Công ty ABC", contact: "0123456789", products: ["Sữa", "Nước"] },
    ];
    const sales = [
      { id: 1, storeId: 1, inventoryId: 1, qty: 5, price: 20000, time: Date.now() - 1000 * 60 * 60 * 24 },
      { id: 2, storeId: 1, inventoryId: 2, qty: 2, price: 15000, time: Date.now() - 1000 * 60 * 60 * 12 },
    ];

    localStorage.setItem("sm_users", JSON.stringify(users));
    localStorage.setItem("sm_consumers", JSON.stringify(consumers));
    localStorage.setItem("sm_stores", JSON.stringify(stores));
    localStorage.setItem("sm_inventory", JSON.stringify(inventory));
    localStorage.setItem("sm_suppliers", JSON.stringify(suppliers));
    localStorage.setItem("sm_sales", JSON.stringify(sales));
  }
};

seed();

const wait = (ms = LATENCY) => new Promise((res) => setTimeout(res, ms));

const read = (key) => JSON.parse(localStorage.getItem(key) || "[]");
const write = (key, value) => localStorage.setItem(key, JSON.stringify(value));

export const auth = {
  login: async (username, password) => {
    await wait();
    const users = read("sm_users");
    const found = users.find((u) => u.username === username && u.password === password);
    if (!found) throw new Error("Invalid credentials");
    // In real app return token - here return user object
    return { ...found };
  },
  getProfile: async (id) => {
    await wait();
    const users = read("sm_users");
    return users.find((u) => u.id === id);
  },
};

export const consumersApi = {
  list: async () => { await wait(); return read("sm_consumers"); },
  create: async (c) => { await wait(); const arr = read("sm_consumers"); const newItem = { id: Date.now(), ...c }; arr.push(newItem); write("sm_consumers", arr); return newItem; },
  update: async (id, payload) => { await wait(); const arr = read("sm_consumers"); const idx = arr.findIndex((x) => x.id === id); if (idx===-1) throw new Error("Not found"); arr[idx] = { ...arr[idx], ...payload }; write("sm_consumers", arr); return arr[idx]; },
  remove: async (id) => { await wait(); let arr = read("sm_consumers"); arr = arr.filter((x) => x.id !== id); write("sm_consumers", arr); return true; },
};

export const storesApi = {
  list: async () => { await wait(); return read("sm_stores"); },
  create: async (s) => { await wait(); const arr = read("sm_stores"); const newItem = { id: Date.now(), ...s }; arr.push(newItem); write("sm_stores", arr); return newItem; },
  update: async (id, payload) => { await wait(); const arr = read("sm_stores"); const idx = arr.findIndex((x) => x.id === id); if (idx===-1) throw new Error("Not found"); arr[idx] = { ...arr[idx], ...payload }; write("sm_stores", arr); return arr[idx]; },
  remove: async (id) => { await wait(); let arr = read("sm_stores"); arr = arr.filter((x) => x.id !== id); write("sm_stores", arr); return true; },
};

export const inventoryApi = {
  list: async () => { await wait(); return read("sm_inventory"); },
  create: async (p) => { await wait(); const arr = read("sm_inventory"); const newItem = { id: Date.now(), ...p }; arr.push(newItem); write("sm_inventory", arr); return newItem; },
  update: async (id, payload) => { await wait(); const arr = read("sm_inventory"); const idx = arr.findIndex(x => x.id === id); if (idx===-1) throw new Error("Not found"); arr[idx] = {...arr[idx], ...payload}; write("sm_inventory", arr); return arr[idx]; },
  remove: async (id) => { await wait(); let arr = read("sm_inventory"); arr = arr.filter(x => x.id !== id); write("sm_inventory", arr); return true; },
};

export const suppliersApi = {
  list: async () => { await wait(); return read("sm_suppliers"); },
  create: async (s) => { await wait(); const arr = read("sm_suppliers"); const newItem = { id: Date.now(), ...s }; arr.push(newItem); write("sm_suppliers", arr); return newItem; },
  update: async (id, payload) => { await wait(); const arr = read("sm_suppliers"); const idx = arr.findIndex(x => x.id === id); if (idx===-1) throw new Error("Not found"); arr[idx] = {...arr[idx], ...payload}; write("sm_suppliers", arr); return arr[idx]; },
  remove: async (id) => { await wait(); let arr = read("sm_suppliers"); arr = arr.filter(x => x.id !== id); write("sm_suppliers", arr); return true; },
};

export const statsApi = {
  summary: async () => {
    await wait();
    const sales = read("sm_sales");
    const inventory = read("sm_inventory");
    const consumers = read("sm_consumers");
    const totalSales = sales.reduce((s, r) => s + r.price * r.qty, 0);
    const lowQualityCount = inventory.filter(i => i.quality !== "good").length;
    return {
      totalSales,
      lowQualityCount,
      consumerCount: consumers.length,
      salesByDay: sales.slice(-7).map(s => ({ time: s.time, amount: s.price * s.qty })),
      inventoryQuality: inventory.reduce((acc, cur) => {
        acc[cur.quality] = (acc[cur.quality] || 0) + cur.quantity; return acc;
      }, {}),
    };
  }
};
