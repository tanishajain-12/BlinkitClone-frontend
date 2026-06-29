import api from "./axios.js";

export const placeOrder   = ()   => api.post("/orders");
export const getOrders    = ()   => api.get("/orders");
export const getOrderById = (id) => api.get(`/orders/${id}`);
