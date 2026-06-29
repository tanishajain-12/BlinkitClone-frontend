import { useState, useEffect } from "react";
import { ChevronLeft, Loader2, RefreshCw, AlertCircle, Package, Clock, CheckCircle, Truck, XCircle } from "lucide-react";
import { getOrderById } from "../api/orderService.js";
import { useAuth }      from "../context/AuthContext";

const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:5000";
function resolveImage(img) {
  if (!img) return "https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg?auto=compress&cs=tinysrgb&w=200";
  if (img.startsWith("http")) return img;
  return `${BASE_URL}${img}`;
}

const STATUS_CONFIG = {
  Pending:   { label: "Pending",   color: "text-yellow-700 bg-yellow-50 border-yellow-200", icon: <Clock      size={14} />, step: 0 },
  Confirmed: { label: "Confirmed", color: "text-blue-700   bg-blue-50   border-blue-200",   icon: <CheckCircle size={14} />, step: 1 },
  Shipped:   { label: "Shipped",   color: "text-indigo-700 bg-indigo-50 border-indigo-200", icon: <Truck      size={14} />, step: 2 },
  Delivered: { label: "Delivered", color: "text-green-700  bg-green-50  border-green-200",  icon: <CheckCircle size={14} />, step: 3 },
  Cancelled: { label: "Cancelled", color: "text-red-600    bg-red-50    border-red-200",    icon: <XCircle    size={14} />, step: -1 },
};

const STEPS = ["Pending", "Confirmed", "Shipped", "Delivered"];

function formatDate(iso) {
  return new Date(iso).toLocaleString("en-IN", {
    day: "numeric", month: "long", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

export default function OrderDetailPage({ order: previewOrder, onNavigate }) {
  const { isLoggedIn } = useAuth();

  const [order,   setOrder]   = useState(previewOrder || null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");

  if (!isLoggedIn) { onNavigate("login"); return null; }

  const orderId = previewOrder?.id;

  const fetchOrder = async () => {
    if (!orderId) return;
    setLoading(true);
    setError("");
    try {
      const { data } = await getOrderById(orderId);
      setOrder(data.data);
    } catch (err) {
      if (err.response?.status === 403) {
        setError("Access denied. You cannot view this order.");
      } else if (err.response?.status === 404) {
        setError("Order not found.");
      } else {
        setError("Could not load order details. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrder(); }, [orderId]);

  const cfg   = STATUS_CONFIG[order?.status] || STATUS_CONFIG.Pending;
  const items = order?.OrderItems || [];
  const total = order ? parseFloat(order.totalAmount) : 0;

  // ── Loading ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="pb-24 lg:pb-8">
        <div className="sticky top-16 z-30 bg-white border-b border-gray-100 px-4 lg:px-0 py-3 flex items-center gap-3">
          <button onClick={() => onNavigate("orders")} className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100">
            <ChevronLeft size={18} />
          </button>
          <span className="font-bold text-gray-700">Order Details</span>
        </div>
        <div className="flex items-center justify-center min-h-[50vh] gap-3">
          <Loader2 size={28} className="text-green-500 animate-spin" />
          <p className="text-gray-500 font-medium">Loading order…</p>
        </div>
      </div>
    );
  }

  // ── Error ──────────────────────────────────────────────────────────────────
  if (error || !order) {
    return (
      <div className="pb-24 lg:pb-8">
        <div className="sticky top-16 z-30 bg-white border-b border-gray-100 px-4 lg:px-0 py-3 flex items-center gap-3">
          <button onClick={() => onNavigate("orders")} className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100">
            <ChevronLeft size={18} />
          </button>
          <span className="font-bold text-gray-700">Order Details</span>
        </div>
        <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4 px-4">
          <AlertCircle size={36} className="text-red-400" />
          <p className="text-red-500 font-semibold text-center">{error || "Order not found."}</p>
          <div className="flex gap-3">
            <button onClick={fetchOrder} className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-xl font-bold text-sm">
              <RefreshCw size={13} /> Retry
            </button>
            <button onClick={() => onNavigate("orders")} className="bg-gray-100 text-gray-700 px-4 py-2 rounded-xl font-bold text-sm">
              My Orders
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Order detail view ──────────────────────────────────────────────────────
  const isCancelled = order.status === "Cancelled";
  const currentStep = cfg.step;

  return (
    <div className="pb-24 lg:pb-8">
      {/* Sticky header */}
      <div className="sticky top-16 z-30 bg-white border-b border-gray-100 px-4 lg:px-0 py-3 flex items-center gap-3">
        <button
          onClick={() => onNavigate("orders")}
          className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
        >
          <ChevronLeft size={18} />
        </button>
        <div>
          <span className="font-bold text-gray-800">Order #{order.id}</span>
          <p className="text-xs text-gray-400">{formatDate(order.createdAt)}</p>
        </div>
        <span className={`ml-auto inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full border ${cfg.color}`}>
          {cfg.icon} {cfg.label}
        </span>
      </div>

      <div className="px-4 lg:px-0 pt-5 space-y-4">
        {/* Progress tracker */}
        {!isCancelled && (
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <h3 className="font-bold text-gray-900 mb-4">Order Progress</h3>
            <div className="flex items-center justify-between relative">
              {/* Track line */}
              <div className="absolute left-0 right-0 top-4 h-1 bg-gray-200 rounded-full -z-0" />
              <div
                className="absolute left-0 top-4 h-1 bg-green-500 rounded-full -z-0 transition-all duration-500"
                style={{ width: `${(currentStep / (STEPS.length - 1)) * 100}%` }}
              />
              {STEPS.map((step, i) => (
                <div key={step} className="flex flex-col items-center gap-1 z-10">
                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-colors ${
                    i <= currentStep
                      ? "bg-green-500 border-green-500 text-white"
                      : "bg-white border-gray-300 text-gray-400"
                  }`}>
                    {i < currentStep ? "✓" : i + 1}
                  </div>
                  <span className={`text-[10px] font-semibold text-center leading-tight ${i <= currentStep ? "text-green-700" : "text-gray-400"}`}>
                    {step}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {isCancelled && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center gap-3">
            <XCircle size={20} className="text-red-500 shrink-0" />
            <p className="text-red-700 font-semibold text-sm">This order was cancelled.</p>
          </div>
        )}

        {/* Ordered items */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-50">
            <h3 className="font-bold text-gray-900">
              Items Ordered ({items.length})
            </h3>
          </div>
          {items.length === 0 ? (
            <div className="flex items-center gap-3 p-5 text-gray-400">
              <Package size={20} />
              <span className="text-sm">No items found.</span>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {items.map(oi => (
                <div key={oi.id} className="flex items-center gap-3 p-4">
                  <img
                    src={resolveImage(oi.Product?.image)}
                    alt={oi.Product?.name}
                    className="w-14 h-14 object-cover rounded-xl bg-gray-100 shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => oi.Product && onNavigate("product", { id: oi.Product.id, name: oi.Product.name })}
                    onError={e => { e.target.src = "https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg?auto=compress&cs=tinysrgb&w=200"; }}
                  />
                  <div className="flex-1 min-w-0">
                    <p
                      className="font-semibold text-gray-900 text-sm leading-tight cursor-pointer hover:text-green-600 transition-colors"
                      onClick={() => oi.Product && onNavigate("product", { id: oi.Product.id, name: oi.Product.name })}
                    >
                      {oi.Product?.name || "Product"}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">{oi.Product?.category}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      ₹{parseFloat(oi.price).toFixed(2)} × {oi.quantity}
                    </p>
                  </div>
                  <p className="font-bold text-gray-900 shrink-0">
                    ₹{(parseFloat(oi.price) * oi.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bill summary */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-2">
          <h3 className="font-bold text-gray-900 mb-3">Bill Summary</h3>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Items total</span>
            <span className="font-semibold text-gray-800">₹{total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Delivery fee</span>
            <span className="text-green-600 font-bold">FREE</span>
          </div>
          <div className="flex justify-between font-black text-gray-900 border-t border-gray-100 pt-2 mt-1">
            <span>Order Total</span>
            <span>₹{total.toFixed(2)}</span>
          </div>
        </div>

        {/* Back button */}
        <button
          onClick={() => onNavigate("orders")}
          className="w-full bg-gray-100 text-gray-700 py-3 rounded-2xl font-bold hover:bg-gray-200 transition-colors"
        >
          ← Back to Orders
        </button>
      </div>
    </div>
  );
}
