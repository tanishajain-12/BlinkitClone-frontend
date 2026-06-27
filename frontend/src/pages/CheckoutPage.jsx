import { useState } from "react";
import { ChevronLeft, MapPin, CreditCard, Wallet, Smartphone, CheckCircle, Clock, Plus } from "lucide-react";
import { useCart } from "../context/CartContext";

export default function CheckoutPage({ onNavigate }) {
  const { items, total, count, clearCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [upiId, setUpiId] = useState("");
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [loading, setLoading] = useState(false);

  const platformFee = 3;
  const grandTotal = total + platformFee;

  const handlePlaceOrder = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOrderPlaced(true);
      clearCart();
    }, 2000);
  };

  if (orderPlaced) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 gap-5 animate-fade-in">
        <div className="relative">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle size={50} className="text-green-500" />
          </div>
          <div className="absolute -top-1 -right-1 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce">
            <span className="text-sm">🎉</span>
          </div>
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-black text-gray-900">Order Placed!</h2>
          <p className="text-gray-500">Your order has been placed successfully.</p>
          <div className="bg-green-50 border border-green-100 rounded-2xl px-6 py-3 flex items-center gap-2 justify-center">
            <Clock size={16} className="text-green-600" />
            <span className="text-green-800 font-bold">Arriving in 10 minutes</span>
          </div>
        </div>
        <div className="flex flex-col gap-3 w-full max-w-xs">
          <button
            onClick={() => onNavigate("orders")}
            className="w-full bg-green-500 text-white py-3 rounded-2xl font-bold hover:bg-green-600 transition-colors"
          >
            Track Order
          </button>
          <button
            onClick={() => onNavigate("home")}
            className="w-full bg-gray-100 text-gray-700 py-3 rounded-2xl font-bold hover:bg-gray-200 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  const paymentOptions = [
    { id: "upi", label: "UPI", icon: <Smartphone size={18} />, desc: "Pay via any UPI app" },
    { id: "card", label: "Credit / Debit Card", icon: <CreditCard size={18} />, desc: "Visa, Mastercard, RuPay" },
    { id: "wallet", label: "Wallets", icon: <Wallet size={18} />, desc: "Paytm, PhonePe, Amazon Pay" },
    { id: "cod", label: "Cash on Delivery", icon: <span className="font-bold text-sm">₹</span>, desc: "Pay when delivered" },
  ];

  return (
    <div className="pb-24 lg:pb-8 px-4 lg:px-0 pt-4">
      <div className="flex items-center gap-3 mb-5">
        <button onClick={() => onNavigate("cart")} className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors">
          <ChevronLeft size={18} />
        </button>
        <h1 className="font-black text-xl text-gray-900">Checkout</h1>
      </div>

      <div className="lg:grid lg:grid-cols-3 lg:gap-6">
        <div className="lg:col-span-2 space-y-4">
          {/* Delivery Address */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-gray-900 flex items-center gap-2">
                <MapPin size={18} className="text-green-600" />
                Delivery Address
              </h2>
              <button className="text-green-600 text-sm font-semibold">Change</button>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 border-l-4 border-green-500">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs bg-green-100 text-green-700 font-bold px-2 py-0.5 rounded-full">HOME</span>
              </div>
              <p className="font-semibold text-gray-800 text-sm">John Doe</p>
              <p className="text-sm text-gray-500 mt-1">Flat 302, Tower B, Green Park Society<br />Sector 21, Gurugram, Haryana - 122001</p>
              <p className="text-sm text-gray-500 mt-1">+91 98765 43210</p>
            </div>
            <button className="mt-3 flex items-center gap-2 text-sm text-green-600 font-semibold hover:gap-3 transition-all">
              <Plus size={14} /> Add New Address
            </button>
          </div>

          {/* Delivery Slot */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <h2 className="font-bold text-gray-900 flex items-center gap-2 mb-4">
              <Clock size={18} className="text-green-600" />
              Delivery Time
            </h2>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "Express", time: "10 minutes", icon: "⚡", active: true },
                { label: "Schedule", time: "Choose a slot", icon: "📅", active: false },
              ].map(slot => (
                <button
                  key={slot.label}
                  className={`p-3 rounded-xl border text-left transition-all ${slot.active ? "border-green-500 bg-green-50" : "border-gray-200 hover:border-gray-300"}`}
                >
                  <div className="text-xl mb-1">{slot.icon}</div>
                  <p className={`text-sm font-bold ${slot.active ? "text-green-800" : "text-gray-800"}`}>{slot.label}</p>
                  <p className={`text-xs ${slot.active ? "text-green-600" : "text-gray-500"}`}>{slot.time}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Payment */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <h2 className="font-bold text-gray-900 flex items-center gap-2 mb-4">
              <CreditCard size={18} className="text-green-600" />
              Payment Method
            </h2>
            <div className="space-y-2">
              {paymentOptions.map(method => (
                <button
                  key={method.id}
                  onClick={() => setPaymentMethod(method.id)}
                  className={`w-full p-3 rounded-xl border flex items-center gap-3 transition-all ${paymentMethod === method.id ? "border-green-500 bg-green-50" : "border-gray-200 hover:border-gray-300"}`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${paymentMethod === method.id ? "bg-green-500 text-white" : "bg-gray-100 text-gray-600"}`}>
                    {method.icon}
                  </div>
                  <div className="text-left flex-1">
                    <p className={`text-sm font-bold ${paymentMethod === method.id ? "text-green-800" : "text-gray-800"}`}>{method.label}</p>
                    <p className="text-xs text-gray-500">{method.desc}</p>
                  </div>
                  <div className={`w-4 h-4 rounded-full border-2 transition-all ${paymentMethod === method.id ? "border-green-500 bg-green-500" : "border-gray-300"}`} />
                </button>
              ))}

              {paymentMethod === "upi" && (
                <div className="mt-2">
                  <input
                    type="text"
                    placeholder="Enter UPI ID (e.g. name@paytm)"
                    value={upiId}
                    onChange={e => setUpiId(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div>
          <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3 lg:sticky lg:top-24">
            <h3 className="font-bold text-gray-900">Order Summary ({count} items)</h3>
            <div className="max-h-40 overflow-y-auto space-y-2">
              {items.map(item => (
                <div key={item.id} className="flex items-center gap-2 text-sm">
                  <img src={item.image} alt={item.name} className="w-8 h-8 rounded-lg object-cover bg-gray-100" />
                  <span className="flex-1 text-gray-700 truncate">{item.name} ×{item.quantity}</span>
                  <span className="font-semibold shrink-0">₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-100 pt-3 space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Items total</span>
                <span className="font-semibold text-gray-800">₹{total}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery fee</span>
                <span className="text-green-600 font-bold">FREE</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Platform fee</span>
                <span className="font-semibold text-gray-800">₹{platformFee}</span>
              </div>
              <div className="flex justify-between font-black text-gray-900 border-t border-gray-100 pt-2">
                <span>To Pay</span>
                <span>₹{grandTotal}</span>
              </div>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={loading}
              className="w-full bg-green-500 text-white py-4 rounded-2xl font-black text-base hover:bg-green-600 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-green-200"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Placing Order...
                </>
              ) : (
                <>Place Order · ₹{grandTotal}</>
              )}
            </button>
            <p className="text-xs text-center text-gray-400">By placing your order, you agree to our Terms of Service</p>
          </div>
        </div>
      </div>
    </div>
  );
}
