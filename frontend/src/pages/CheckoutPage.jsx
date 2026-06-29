import { useState } from "react";
import {
  ChevronLeft, MapPin, CreditCard, Wallet, Smartphone,
  CheckCircle, Clock, Plus, Loader2, AlertCircle,
} from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { placeOrder } from "../api/orderService.js";
import toast from "react-hot-toast";

const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:5000";
function resolveImage(img) {
  if (!img) return "https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg?auto=compress&cs=tinysrgb&w=100";
  if (img.startsWith("http")) return img;
  return `${BASE_URL}${img}`;
}

const PAYMENT_OPTIONS = [
  { id: "upi",    label: "UPI",                  icon: <Smartphone size={18} />, desc: "Pay via any UPI app"         },
  { id: "card",   label: "Credit / Debit Card",  icon: <CreditCard size={18} />, desc: "Visa, Mastercard, RuPay"    },
  { id: "wallet", label: "Wallets",              icon: <Wallet size={18} />,     desc: "Paytm, PhonePe, Amazon Pay" },
  { id: "cod",    label: "Cash on Delivery",     icon: <span className="font-bold text-sm">₹</span>, desc: "Pay when delivered" },
];

export default function CheckoutPage({ onNavigate }) {
  const { items, total, count, fetchCart } = useCart();
  const { isLoggedIn }                     = useAuth();

  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [upiId,         setUpiId]         = useState("");
  const [loading,       setLoading]       = useState(false);
  const [error,         setError]         = useState("");
  const [placedOrder,   setPlacedOrder]   = useState(null); // holds the order object on success

  const platformFee = 3;
  const grandTotal  = parseFloat((total + platformFee).toFixed(2));

  // Redirect unauthenticated users immediately
  if (!isLoggedIn) {
    onNavigate("login");
    return null;
  }

  // ── Order success screen ───────────────────────────────────────────────────
  if (placedOrder) {
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
          <p className="text-gray-500">Your order has been confirmed successfully.</p>
          <p className="text-xs text-gray-400 font-mono">Order #{placedOrder.id}</p>
          <div className="bg-green-50 border border-green-100 rounded-2xl px-6 py-3 flex items-center gap-2 justify-center">
            <Clock size={16} className="text-green-600" />
            <span className="text-green-800 font-bold">Arriving in 10 minutes</span>
          </div>
          <p className="text-sm font-semibold text-gray-700">
            Total paid: ₹{parseFloat(placedOrder.totalAmount).toFixed(2)}
          </p>
        </div>

        <div className="flex flex-col gap-3 w-full max-w-xs">
          <button
            onClick={() => onNavigate("orders")}
            className="w-full bg-green-500 text-white py-3 rounded-2xl font-bold hover:bg-green-600 transition-colors"
          >
            View My Orders
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

  // ── Place order handler ────────────────────────────────────────────────────
  const handlePlaceOrder = async () => {
    if (loading) return; // prevent double-submit
    if (count === 0) {
      toast.error("Your cart is empty.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const { data } = await placeOrder();      // POST /api/orders — uses cart server-side
      setPlacedOrder(data.data);                 // store the created order for the success screen
      await fetchCart();                          // refresh cart — backend already cleared it
      toast.success("Order placed successfully! 🎉");
    } catch (err) {
      const msg = err.response?.data?.message || "Could not place order. Please try again.";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // ── Checkout form ──────────────────────────────────────────────────────────
  return (
    <div className="pb-24 lg:pb-8 px-4 lg:px-0 pt-4">
      <div className="flex items-center gap-3 mb-5">
        <button
          onClick={() => onNavigate("cart")}
          className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
        >
          <ChevronLeft size={18} />
        </button>
        <h1 className="font-black text-xl text-gray-900">Checkout</h1>
      </div>

      <div className="lg:grid lg:grid-cols-3 lg:gap-6">
        <div className="lg:col-span-2 space-y-4">
          {/* Delivery Address — static placeholder (address management is out of scope) */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-gray-900 flex items-center gap-2">
                <MapPin size={18} className="text-green-600" />
                Delivery Address
              </h2>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 border-l-4 border-green-500">
              <span className="text-xs bg-green-100 text-green-700 font-bold px-2 py-0.5 rounded-full">HOME</span>
              <p className="font-semibold text-gray-800 text-sm mt-2">Default Address</p>
              <p className="text-sm text-gray-500 mt-1">Address management coming soon.</p>
            </div>
            <button className="mt-3 flex items-center gap-2 text-sm text-green-600 font-semibold">
              <Plus size={14} /> Add New Address
            </button>
          </div>

          {/* Delivery time */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <h2 className="font-bold text-gray-900 flex items-center gap-2 mb-4">
              <Clock size={18} className="text-green-600" />
              Delivery Time
            </h2>
            <div className="border border-green-500 bg-green-50 rounded-xl p-3 flex items-center gap-3">
              <span className="text-xl">⚡</span>
              <div>
                <p className="text-sm font-bold text-green-800">Express Delivery</p>
                <p className="text-xs text-green-600">Arriving in approximately 10 minutes</p>
              </div>
            </div>
          </div>

          {/* Payment method */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <h2 className="font-bold text-gray-900 flex items-center gap-2 mb-4">
              <CreditCard size={18} className="text-green-600" />
              Payment Method
            </h2>
            <div className="space-y-2">
              {PAYMENT_OPTIONS.map(method => (
                <button
                  key={method.id}
                  type="button"
                  onClick={() => setPaymentMethod(method.id)}
                  className={`w-full p-3 rounded-xl border flex items-center gap-3 transition-all ${
                    paymentMethod === method.id
                      ? "border-green-500 bg-green-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    paymentMethod === method.id ? "bg-green-500 text-white" : "bg-gray-100 text-gray-600"
                  }`}>
                    {method.icon}
                  </div>
                  <div className="text-left flex-1">
                    <p className={`text-sm font-bold ${paymentMethod === method.id ? "text-green-800" : "text-gray-800"}`}>
                      {method.label}
                    </p>
                    <p className="text-xs text-gray-500">{method.desc}</p>
                  </div>
                  <div className={`w-4 h-4 rounded-full border-2 transition-all ${
                    paymentMethod === method.id ? "border-green-500 bg-green-500" : "border-gray-300"
                  }`} />
                </button>
              ))}

              {paymentMethod === "upi" && (
                <input
                  type="text"
                  placeholder="Enter UPI ID (e.g. name@paytm)"
                  value={upiId}
                  onChange={e => setUpiId(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm mt-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              )}
            </div>
          </div>
        </div>

        {/* Order summary + place order */}
        <div>
          <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3 lg:sticky lg:top-24">
            <h3 className="font-bold text-gray-900">Order Summary ({count} item{count !== 1 ? "s" : ""})</h3>

            {/* Mini item list */}
            <div className="max-h-44 overflow-y-auto space-y-2">
              {items.map(item => (
                <div key={item.itemId} className="flex items-center gap-2 text-sm">
                  <img
                    src={resolveImage(item.image)}
                    alt={item.name}
                    className="w-8 h-8 rounded-lg object-cover bg-gray-100 shrink-0"
                    onError={e => { e.target.src = "https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg?auto=compress&cs=tinysrgb&w=100"; }}
                  />
                  <span className="flex-1 text-gray-700 truncate">{item.name} ×{item.quantity}</span>
                  <span className="font-semibold shrink-0">₹{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            {/* Bill breakdown */}
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

            {/* Inline error */}
            {error && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-100 text-red-600 text-sm px-3 py-2.5 rounded-xl">
                <AlertCircle size={14} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Place order button */}
            <button
              type="button"
              onClick={handlePlaceOrder}
              disabled={loading || count === 0}
              className="w-full bg-green-500 text-white py-4 rounded-2xl font-black text-base hover:bg-green-600 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-green-200"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Placing Order…
                </>
              ) : (
                <>Place Order · ₹{grandTotal}</>
              )}
            </button>
            <p className="text-xs text-center text-gray-400">
              By placing your order, you agree to our Terms of Service
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
