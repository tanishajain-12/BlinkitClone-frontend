import { createContext, useContext, useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import {
  getCart      as apiGetCart,
  addToCart    as apiAddToCart,
  updateCartItem,
  removeCartItem,
  clearCart    as apiClearCart,
} from "../api/cartService.js";
import { useAuth } from "./AuthContext.js";

const CartContext = createContext(null);

/**
 * Normalises a backend CartItem into the flat shape the UI already expects:
 *
 *  Backend CartItem:
 *    { id, cartId, productId, quantity, Product: { id, name, price, image, ... } }
 *
 *  Normalised item (what components see):
 *    { itemId, id (= productId), name, price, image, category, quantity, stock, isAvailable }
 *
 * The distinction between `itemId` (cart row) and `id` (product) is important:
 *   - update/remove  → use itemId  (backend route: /cart/update/:itemId)
 *   - display / cart lookup by product  → use id (productId)
 */
const normalise = (cartItem) => ({
  itemId:      cartItem.id,                            // cart row id — for update/remove
  id:          cartItem.Product?.id ?? cartItem.productId, // product id  — for lookups
  name:        cartItem.Product?.name        ?? "",
  price:       parseFloat(cartItem.Product?.price ?? 0),
  image:       cartItem.Product?.image       ?? null,
  category:    cartItem.Product?.category    ?? "",
  stock:       cartItem.Product?.stock       ?? 0,
  isAvailable: cartItem.Product?.isAvailable ?? true,
  quantity:    cartItem.quantity,
});

export function CartProvider({ children }) {
  const { isLoggedIn } = useAuth();

  const [items,        setItems]        = useState([]);
  const [cartLoading,  setCartLoading]  = useState(false);
  const [actionLoading, setActionLoading] = useState(false); // per-button loading

  // ── Helper: load cart from backend ────────────────────────────────────────
  const fetchCart = useCallback(async () => {
    if (!isLoggedIn) { setItems([]); return; }
    setCartLoading(true);
    try {
      const { data } = await apiGetCart();
      setItems((data.data?.items || []).map(normalise));
    } catch {
      // Silently ignore — cart will just show empty
    } finally {
      setCartLoading(false);
    }
  }, [isLoggedIn]);

  // Fetch cart whenever auth state changes (login / logout / page refresh)
  useEffect(() => { fetchCart(); }, [fetchCart]);

  // ── Add to cart ────────────────────────────────────────────────────────────
  const addToCart = async (product) => {
    if (!isLoggedIn) return { needsLogin: true };

    setActionLoading(true);
    try {
      const { data } = await apiAddToCart(product.id, 1);
      setItems((data.data?.items || []).map(normalise));
      toast.success(`${product.name} added to cart`);
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || "Could not add to cart.";
      toast.error(msg);
      return { success: false };
    } finally {
      setActionLoading(false);
    }
  };

  // ── Update quantity ────────────────────────────────────────────────────────
  // Called with (productId, newQty). We find the cartItem by productId to get itemId.
  const updateQuantity = async (productId, newQty) => {
    const item = items.find(i => i.id === productId);
    if (!item) return;

    // If new quantity is 0 or less, remove the item
    if (newQty <= 0) {
      return removeFromCart(productId);
    }

    // Optimistic update — snap UI immediately, roll back on error
    setItems(prev =>
      prev.map(i => i.id === productId ? { ...i, quantity: newQty } : i)
    );

    try {
      const { data } = await updateCartItem(item.itemId, newQty);
      setItems((data.data?.items || []).map(normalise));
    } catch (err) {
      // Roll back optimistic change
      setItems(prev =>
        prev.map(i => i.id === productId ? { ...i, quantity: item.quantity } : i)
      );
      const msg = err.response?.data?.message || "Could not update quantity.";
      toast.error(msg);
    }
  };

  // ── Remove from cart ───────────────────────────────────────────────────────
  const removeFromCart = async (productId) => {
    const item = items.find(i => i.id === productId);
    if (!item) return;

    // Optimistic removal
    setItems(prev => prev.filter(i => i.id !== productId));

    try {
      const { data } = await removeCartItem(item.itemId);
      setItems((data.data?.items || []).map(normalise));
    } catch (err) {
      // Roll back
      setItems(prev => [...prev, item]);
      const msg = err.response?.data?.message || "Could not remove item.";
      toast.error(msg);
    }
  };

  // ── Clear cart ─────────────────────────────────────────────────────────────
  const clearCart = async () => {
    setItems([]);
    try {
      await apiClearCart();
    } catch {
      // Re-fetch to restore actual state if clear failed
      fetchCart();
    }
  };

  // ── Derived values — always computed from server-backed items ─────────────
  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const count = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        total:        parseFloat(total.toFixed(2)),
        count,
        cartLoading,
        actionLoading,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
