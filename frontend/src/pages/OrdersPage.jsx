import { useState, useEffect } from "react";
import { Package, Clock, CheckCircle, Truck, XCircle, ChevronRight, RefreshCw, Loader2 } from "lucide-react";
import { getOrders } from "../api/orderService.js";
import { useAuth }   from "../context/AuthContext";

const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:5000";
function resolveImage(img) {
  if (!img) return "https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg?auto=compress&cs=tinysrgb&w=100";
  if (img.startsWith("http")) return img;
  return `${BASE_URL}${img}`;
}

// Maps backend status strings → display config
const STATUS_CONFIG = {
  Pending:   { label: "Pending",      color: "text-yellow-600 bg-yellow-50 border-yellow-200", icon: <Clock     size={13} /> },
  Confirmed: { label: "Confirmed",    color: "text-blue-600   bg-blue-50   border-blue-200",   icon: <CheckCircle size={13} /> },
  Shipped:   { label: "Shipped",      color: "text-indigo-600 bg-indigo-50 border-indigo-200", icon: <Truck     size={13} /> },
  Delivered: { label: "Delivered",    color: "text-green-600  bg-green-50  border-green-200",  icon: <CheckCircle size={13} /> },
  Cancelled: { label: "Cancelled",    color: "text-red-500    bg-red-50    border-red-200",    icon: <XCircle   size={13} /> },
};

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.Pending;
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full border ${cfg.color}`}>
      {cfg.icon} {cfg.label}
    </span>
  );
}

function formatDate(iso) {
  return new Date(iso).toLocaleString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

export default function OrdersPage({ onNavigate }) {
  const { isLoggedIn } = useAuth();

  const [orders,  setOrders]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");

  // Redirect if not logged in
  if (!isLoggedIn) {
    onNavigate("login");
    return null;
  }

  const fetchOrders = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await getOrders();
      setOrders(data.data || []);
    } catch {
      setError("Could not load your orders. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  // ── Loading ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] gap-3">
        <Loader2 size={28} className="text-green-500 animate-spin" />
        <p className="text-gray-500 font-medium">Loading your orders…</p>
      </div>
    );
  }

  // ── Error ──────────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 px-4">
        <Package size={40} className="text-red-300" />
        <p className="text-red-500 font-semibold text-center">{error}</p>
        <button
          onClick={fetchOrders}
          className="flex items-center gap-2 bg-green-500 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-green-600 transition-colors"
        >
          <RefreshCw size={14} /> Try Again
        </button>
      </div>
    );
  }

  // ── Empty state ────────────────────────────────────────────────────────────
  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 px-4">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
          <Package size={36} className="text-gray-400" />
        </div>
        <p className="font-bold text-gray-700">No orders yet</p>
        <p className="text-sm text-gray-400 text-center">
          Your order history will appear here once you place your first order.
        </p>
        <button
          onClick={() => onNavigate("home")}
          className="bg-green-500 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-green-600 transition-colors"
        >
          Start Shopping
        </button>
      </div>
    );
  }

  // ── Order list ─────────────────────────────────────────────────────────────
  return (
    <div className="pb-24 lg:pb-8 px-4 lg:px-0 pt-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-black text-2xl text-gray-900">My Orders</h1>
        <button onClick={fetchOrders} className="text-sm text-green-600 font-semibold flex items-center gap-1 hover:underline">
          <RefreshCw size={13} /> Refresh
        </button>
      </div>

      <div className="space-y-4">
        {orders.map(order => {
          const orderItems = order.OrderItems || [];
          const firstItem  = orderItems[0];
          const extraCount = orderItems.length - 1;

          return (
            <div
              key={order.id}
              className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Header row */}
              <div className="flex items-center justify-between p-4 border-b border-gray-50">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-mono text-gray-400">#{order.id}</span>
                    <StatusBadge status={order.status} />
                  </div>
                  <p className="text-sm text-gray-500 mt-0.5">{formatDate(order.createdAt)}</p>
                </div>
                <div className="text-right">
                  <p className="font-black text-gray-900">₹{parseFloat(order.totalAmount).toFixed(2)}</p>
                  <p className="text-xs text-gray-400">{orderItems.length} item{orderItems.length !== 1 ? "s" : ""}</p>
                </div>
              </div>

              {/* Product thumbnail strip */}
              <div className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  {orderItems.slice(0, 4).map(oi => (
                    <img
                      key={oi.id}
                      src={resolveImage(oi.Product?.image)}
                      alt={oi.Product?.name}
                      className="w-10 h-10 rounded-lg object-cover bg-gray-100 shrink-0"
                      onError={e => { e.target.src = "https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg?auto=compress&cs=tinysrgb&w=100"; }}
                    />
                  ))}
                  {firstItem && (
                    <div className="text-sm text-gray-600 ml-1 min-w-0">
                      <p className="font-semibold truncate">
                        {firstItem.Product?.name}
                        {extraCount > 0 && <span className="text-gray-400"> +{extraCount} more</span>}
                      </p>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <button
                  onClick={() => onNavigate("order-detail", order)}
                  className="w-full flex items-center justify-center gap-1 text-sm text-gray-600 border border-gray-200 px-4 py-2.5 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                >
                  View Details <ChevronRight size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
