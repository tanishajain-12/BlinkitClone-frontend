import { ShoppingCart, Package, Clock } from "lucide-react";
import { useCart } from "../context/CartContext";

export default function CartSidebar({ onNavigate }) {
  const { items, total, count } = useCart();

  if (count === 0) return null;

  return (
    <div
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 lg:hidden cursor-pointer"
      onClick={() => onNavigate("cart")}
    >
      <div className="bg-green-500 text-white rounded-2xl px-5 py-3 shadow-2xl flex items-center gap-3 min-w-[280px] hover:bg-green-600 transition-colors">
        <div className="w-8 h-8 bg-green-400 rounded-xl flex items-center justify-center">
          <ShoppingCart size={16} />
        </div>
        <div className="flex-1">
          <p className="text-sm font-bold">{count} item{count !== 1 ? "s" : ""} added</p>
          <p className="text-xs text-green-100">View cart</p>
        </div>
        <div className="text-right">
          <p className="font-bold">₹{total}</p>
          <p className="text-xs text-green-100">Total</p>
        </div>
      </div>
    </div>
  );
}

export function CartSidebarDesktop({ onNavigate }) {
  const { items, total, count, updateQuantity } = useCart();

  return (
    <div className="hidden lg:flex flex-col w-80 bg-white border-l border-gray-100 sticky top-16 h-[calc(100vh-4rem)] overflow-hidden">
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
            <ShoppingCart size={16} className="text-green-600" />
          </div>
          <h2 className="font-bold text-gray-800">My Cart</h2>
          {count > 0 && <span className="ml-auto text-sm text-gray-500">{count} items</span>}
        </div>
      </div>

      {count === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-3 p-6 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
            <Package size={28} className="text-gray-400" />
          </div>
          <p className="font-semibold text-gray-700">Your cart is empty</p>
          <p className="text-sm text-gray-400">Add items to get started</p>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-2 bg-green-50 px-4 py-2.5 border-b border-green-100">
            <Clock size={14} className="text-green-600" />
            <span className="text-xs font-semibold text-green-700">Delivery in 10 minutes</span>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {items.map(item => (
              <div key={item.itemId} className="flex items-center gap-3">
                <img
                  src={item.image?.startsWith("http") ? item.image : `${import.meta.env.VITE_BASE_URL || "http://localhost:5000"}${item.image || ""}`}
                  alt={item.name}
                  className="w-12 h-12 object-cover rounded-lg bg-gray-100"
                  onError={e => { e.target.src = "https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg?auto=compress&cs=tinysrgb&w=100"; }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">{item.name}</p>
                  <p className="text-xs text-gray-400">{item.category}</p>
                  <p className="text-sm font-bold text-gray-800">₹{(item.price * item.quantity).toFixed(2)}</p>
                </div>
                <div className="flex items-center gap-1 bg-green-500 rounded-lg overflow-hidden">
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-6 h-6 flex items-center justify-center text-white hover:bg-green-600 text-xs font-bold">−</button>
                  <span className="text-white text-xs font-bold w-4 text-center">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-6 h-6 flex items-center justify-center text-white hover:bg-green-600 text-xs font-bold">+</button>
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-gray-100 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-semibold">₹{total}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Delivery fee</span>
              <span className="text-green-600 font-semibold">FREE</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span>₹{total}</span>
            </div>
            <button
              onClick={() => onNavigate("checkout")}
              className="w-full bg-green-500 text-white py-3 rounded-xl font-bold hover:bg-green-600 transition-colors"
            >
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
}
