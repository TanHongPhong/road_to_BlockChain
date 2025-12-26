/**
 * fast_track_db.js
 * A simple mock database using localStorage to simulate backend operations
 * for the Supplier-Transport integration demo.
 */

const DB_KEY = "scm_fast_track_orders";

export const FastTrackDB = {
    // Get all orders
    getOrders: () => {
        try {
            const data = localStorage.getItem(DB_KEY);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            console.error("DB Read Error", e);
            return [];
        }
    },

    // Create a new shipping order from a product
    createOrder: (product) => {
        const orders = FastTrackDB.getOrders();

        const newOrder = {
            orderCode: `ORD-${Date.now().toString().slice(-6)}`,
            time: new Date().toLocaleString("vi-VN"), // Format: HH:mm DD/MM/YYYY
            from: "Kho A - " + product.supplier,
            to: "Đang chờ điều phối", // Default destination
            initials: product.name.slice(0, 2).toUpperCase(),
            name: product.name,
            avatarTone: ["indigo", "green", "red", "purple", "blue", "orange", "teal"][Math.floor(Math.random() * 7)],
            latA: 10.762622, // Default coords (HCM)
            lngA: 106.660172,
            latB: null, // No destination yet
            lngB: null,
            isNew: true, // Flag to highlight in UI
            status: "Active", // Active, Pending, Delivered, Cancelled
            productDetails: { ...product }
        };

        const updatedOrders = [newOrder, ...orders];
        localStorage.setItem(DB_KEY, JSON.stringify(updatedOrders));
        return newOrder;
    },

    // Update order status (optional for future use)
    updateStatus: (orderCode, status) => {
        const orders = FastTrackDB.getOrders();
        const updated = orders.map(o =>
            o.orderCode === orderCode ? { ...o, status } : o
        );
        localStorage.setItem(DB_KEY, JSON.stringify(updated));
    },

    // Clear all data (for testing)
    clear: () => {
        localStorage.removeItem(DB_KEY);
    }
};
