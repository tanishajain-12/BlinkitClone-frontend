import { ShoppingCart, Trash2, Tag, Clock, ArrowRight } from "lucide-react";
import { useCart } from "../context/CartContext";

export default function CartPage({ onNavigate }) {
  const { items, total, count, updateQuantity, removeFromCart } = useCart();
  const platformFee = 3;
  const grandTotal = total + platformFee;

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
        <button
          onClick={() => onNavigate("home")}
          className="bg-green-500 text-white px-8 py-3 rounded-2xl font-bold hover:bg-green-600 transition-colors"
        >
          Start Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="pb-24 lg:pb-8 px-4 lg:px-0 pt-4">
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
        <div className="lg:col-span-2 space-y-1">
          <h2 className="font-black text-lg text-gray-900 mb-3">{count} Item{count !== 1 ? "s" : ""} in Cart</h2>

          <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-50">
            {items.map(item => (
              <div key={item.id} className="flex items-center gap-3 p-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded-xl bg-gray-100 cursor-pointer hover:opacity-80 transition-opacity shrink-0"
                  onClick={() => onNavigate("product", item)}
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 text-sm leading-tight cursor-pointer hover:text-green-600" onClick={() => onNavigate("product", item)}>
                    {item.name}
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">{item.unit}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm font-bold text-gray-900">₹{item.price}</span>
                    {item.mrp > item.price && (
                      <span className="text-xs text-gray-400 line-through">₹{item.mrp}</span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <button onClick={() => removeFromCart(item.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                    <Trash2 size={15} />
                  </button>
                  <div className="flex items-center gap-1.5 bg-green-500 rounded-lg overflow-hidden">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-7 h-7 flex items-center justify-center text-white hover:bg-green-600 transition-colors font-bold text-sm"
                    >−</button>
                    <span className="text-white font-bold text-sm w-5 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-7 h-7 flex items-center justify-center text-white hover:bg-green-600 transition-colors font-bold text-sm"
                    >+</button>
                  </div>
                  <span className="text-sm font-bold text-gray-800">₹{item.price * item.quantity}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-4 mt-3">
            <div className="flex items-center gap-3">
              <Tag size={18} className="text-green-600" />
              <span className="text-sm font-semibold text-gray-700 flex-1">Apply Coupon</span>
              <button className="text-green-600 text-sm font-bold">Apply</button>
            </div>
          </div>
        </div>

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
            <div className="bg-green-50 rounded-xl p-3 text-center">
              <p className="text-sm text-green-700 font-semibold">
                🎉 You save ₹{items.reduce((acc, i) => acc + (i.mrp - i.price) * i.quantity, 0) + 25} on this order!
              </p>
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
