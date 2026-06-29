import api from "./axios.js";

export const getDashboard       = ()           => api.get("/admin/dashboard");
export const getAdminOrders     = ()           => api.get("/admin/orders");
export const updateOrderStatus  = (id, status) => api.put(`/admin/orders/${id}/status`, { status });
