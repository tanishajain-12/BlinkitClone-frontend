import api from "./axios.js";

export const getCart        = ()                       => api.get("/cart");
export const addToCart      = (productId, quantity)    => api.post("/cart/add", { productId, quantity });
export const updateCartItem = (itemId, quantity)       => api.put(`/cart/update/${itemId}`, { quantity });
export const removeCartItem = (itemId)                 => api.delete(`/cart/remove/${itemId}`);
export const clearCart      = ()                       => api.delete("/cart/clear");
