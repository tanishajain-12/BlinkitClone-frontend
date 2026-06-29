import { ShoppingCart, Trash2, Tag, Clock, ArrowRight, RefreshCw, Loader2 } from "lucide-react";
import { useCart } from "../context/CartContext";

const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:5000";

function resolveImage(img) {
  if (!img) return "https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg?auto=compress&cs=tinysrgb&w=200";
  if (img.startsWith("http")) return img;
  return `${BASE_URL}${img}`;
}

export default function CartPage({ onNavigate }) {
  const {
    items,
    total,
    count,
    cartLoading,
    updateQuantity,
    removeFromCart,
    clearCart,
    fetchCart,
  } = useCart();

  const platformFee = 3;
  const grandTotal  = parseFloat((total + platformFee).toFixed(2));

  // ── Loading state ──────────────────────────────────────────────────────────
  if (cartLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 size={36} className="text-green-500 animate-spin" />
        <p className="text-gray-500 font-medium">Loading your cart…</p>
      </div>
    );
  }

  // ── Empty cart ─────────────────────────────────────────────────────────────
  if (count === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 gap-5">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
          <ShoppingCart size={40} className="text-gray-400" />
        </div>
        <div className="text-center">
          <h2 className="text-xl font-black text-gray-900">Your cart is empty</h2>
          <p className="text-gray-500 mt-1 text-sm">Add items to start a new order</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => onNavigate("home")}
            className="bg-green-500 text-white px-8 py-3 rounded-2xl font-bold hover:bg-green-600 transition-colors"
          >
            Start Shopping
          </button>
          <button
            onClick={fetchCart}
            className="flex items-center gap-2 bg-gray-100 text-gray-600 px-4 py-3 rounded-2xl font-semibold hover:bg-gray-200 transition-colors text-sm"
          >
            <RefreshCw size={14} /> Refresh
          </button>
        </div>
      </div>
    );
  }

  // ── Cart with items ────────────────────────────────────────────────────────
  return (
    <div className="pb-24 lg:pb-8 px-4 lg:px-0 pt-4">
      {/* Delivery promise banner */}
      <div className="bg-green-50 border border-green-100 rounded-2xl p-4 flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
          <Clock size={20} className="text-white" />
        </div>
        <div>
          <p className="font-bold text-green-800">Delivery in 10 minutes</p>
          <p className="text-sm text-green-600">Shipment of {count} item{count !== 1 ? "s" : ""}</p>
        </div>
      </div>

      <div className="lg:grid lg:grid-cols-3 lg:gap-6">
        {/* Cart items list */}
        <div className="lg:col-span-2 space-y-1">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-black text-lg text-gray-900">
              {count} Item{count !== 1 ? "s" : ""} in Cart
            </h2>
            <button
              onClick={clearCart}
              className="text-xs text-red-400 hover:text-red-600 font-semibold transition-colors"
            >
              Clear All
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-50">
            {items.map(item => (
              <div key={item.itemId} className="flex items-center gap-3 p-4">
                <img
                  src={resolveImage(item.image)}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded-xl bg-gray-100 cursor-pointer hover:opacity-80 transition-opacity shrink-0"
                  onClick={() => onNavigate("product", { id: item.id, name: item.name })}
                  onError={e => { e.target.src = "https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg?auto=compress&cs=tinysrgb&w=200"; }}
                />
                <div className="flex-1 min-w-0">
                  <h3
                    className="font-semibold text-gray-900 text-sm leading-tight cursor-pointer hover:text-green-600 transition-colors"
                    onClick={() => onNavigate("product", { id: item.id, name: item.name })}
                  >
                    {item.name}
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">{item.category}</p>
                  <span className="text-sm font-bold text-gray-900 mt-1 block">₹{item.price}</span>
                </div>

                <div className="flex flex-col items-end gap-2">
                  {/* Remove button */}
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                    aria-label="Remove item"
                  >
                    <Trash2 size={15} />
                  </button>

                  {/* Quantity control — uses product id */}
                  <div className="flex items-center gap-1.5 bg-green-500 rounded-lg overflow-hidden">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-7 h-7 flex items-center justify-center text-white hover:bg-green-600 transition-colors font-bold text-sm"
                    >
                      −
                    </button>
                    <span className="text-white font-bold text-sm w-5 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      disabled={item.quantity >= item.stock}
                      className="w-7 h-7 flex items-center justify-center text-white hover:bg-green-600 transition-colors font-bold text-sm disabled:opacity-40"
                    >
                      +
                    </button>
                  </div>

                  <span className="text-sm font-bold text-gray-800">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Coupon placeholder */}
          <div className="bg-white rounded-2xl border border-gray-100 p-4 mt-3">
            <div className="flex items-center gap-3">
              <Tag size={18} className="text-green-600" />
              <span className="text-sm font-semibold text-gray-700 flex-1">Apply Coupon</span>
              <button className="text-green-600 text-sm font-bold">Apply</button>
            </div>
          </div>
        </div>

        {/* Bill summary */}
        <div className="mt-4 lg:mt-0">
          <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3">
            <h3 className="font-bold text-gray-900">Bill Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Items total</span>
                <span className="font-semibold text-gray-800">₹{total}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery fee</span>
                <div className="flex items-center gap-2">
                  <span className="text-gray-400 line-through text-xs">₹25</span>
                  <span className="text-green-600 font-bold">FREE</span>
                </div>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Platform fee</span>
                <span className="font-semibold text-gray-800">₹{platformFee}</span>
              </div>
            </div>
            <div className="border-t border-gray-100 pt-3 flex justify-between font-black text-gray-900">
              <span>Grand Total</span>
              <span>₹{grandTotal}</span>
            </div>
          </div>

          <button
            onClick={() => onNavigate("checkout")}
            className="w-full mt-4 bg-green-500 text-white py-4 rounded-2xl font-black text-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-green-200"
          >
            Proceed to Checkout
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
