import { useState, useEffect } from "react";
import { ChevronLeft, Shield, RefreshCw, Plus, Minus, Heart, Package, AlertCircle } from "lucide-react";
import { getProductById, getProducts } from "../api/productService.js";
import { useCart } from "../context/CartContext";
import ProductCard from "../components/ProductCard";

// ─── Constants ────────────────────────────────────────────────────────────────
const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:5000";
const FALLBACK  = "https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg?auto=compress&cs=tinysrgb&w=800";

function resolveImage(img) {
  if (!img) return FALLBACK;
  if (img.startsWith("http")) return img;
  return `${BASE_URL}${img}`;
}

// ─── Skeleton for the detail page while loading ───────────────────────────────
function DetailSkeleton() {
  return (
    <div className="lg:grid lg:grid-cols-2 lg:gap-8 px-4 lg:px-0 pt-4 animate-pulse">
      <div className="aspect-square bg-gray-200 rounded-2xl" />
      <div className="mt-4 lg:mt-0 space-y-4">
        <div className="h-4 bg-gray-200 rounded w-1/3" />
        <div className="h-7 bg-gray-200 rounded w-2/3" />
        <div className="h-4 bg-gray-200 rounded w-1/4" />
        <div className="h-12 bg-gray-200 rounded-xl" />
        <div className="h-10 bg-gray-200 rounded-xl" />
        <div className="h-16 bg-gray-200 rounded-xl" />
      </div>
    </div>
  );
}

// ─── ProductPage ──────────────────────────────────────────────────────────────
/**
 * Receives `product` from navigation as a lightweight preview object
 * (id + name at minimum). Immediately fetches the full detail from
 * GET /api/products/:id so we always display fresh, accurate data.
 */
export default function ProductPage({ product: previewProduct, onNavigate }) {
  const { items, addToCart, updateQuantity } = useCart();

  const [product,  setProduct]  = useState(previewProduct || null);
  const [similar,  setSimilar]  = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState("");
  const [wishlist, setWishlist] = useState(false);
  const [imgError, setImgError] = useState(false);

  const productId = previewProduct?.id;

  // ── Fetch full product detail ──────────────────────────────────────────────
  useEffect(() => {
    if (!productId) return;
    let cancelled = false;

    const fetchDetail = async () => {
      setLoading(true);
      setError("");
      try {
        const { data } = await getProductById(productId);
        if (!cancelled) setProduct(data.data);
      } catch {
        if (!cancelled) setError("Could not load product details. Please try again.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchDetail();
    return () => { cancelled = true; };
  }, [productId]);

  // ── Fetch similar products (same category, exclude current) ───────────────
  useEffect(() => {
    if (!product?.category) return;
    let cancelled = false;

    const fetchSimilar = async () => {
      try {
        const { data } = await getProducts({ category: product.category, limit: 6 });
        if (!cancelled) {
          setSimilar((data.data || []).filter(p => p.id !== product.id).slice(0, 5));
        }
      } catch {
        // Similar products failing silently is acceptable
      }
    };

    fetchSimilar();
    return () => { cancelled = true; };
  }, [product?.category, product?.id]);

  const cartItem = items.find(i => i.id === product?.id);
  const price    = product ? parseFloat(product.price) : 0;
  const imageSrc = imgError ? FALLBACK : resolveImage(product?.image);

  // ── Sticky header — shown even while loading ───────────────────────────────
  const StickyHeader = () => (
    <div className="sticky top-16 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 lg:px-0 py-3 flex items-center gap-3">
      <button
        onClick={() => onNavigate("home")}
        className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
      >
        <ChevronLeft size={18} />
      </button>
      <span className="font-semibold text-gray-800 text-sm truncate">
        {product?.name || "Product"}
      </span>
      <button
        onClick={() => setWishlist(v => !v)}
        className={`ml-auto w-8 h-8 flex items-center justify-center rounded-lg transition-all ${
          wishlist ? "bg-red-100 text-red-500" : "bg-gray-100 text-gray-500"
        }`}
      >
        <Heart size={16} fill={wishlist ? "currentColor" : "none"} />
      </button>
    </div>
  );

  // ── Loading state ──────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="pb-24 lg:pb-8">
        <StickyHeader />
        <DetailSkeleton />
      </div>
    );
  }

  // ── Error state ───────────────────────────────────────────────────────────
  if (error || !product) {
    return (
      <div className="pb-24 lg:pb-8">
        <StickyHeader />
        <div className="flex flex-col items-center justify-center py-24 gap-4 px-4">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center">
            <AlertCircle size={28} className="text-red-400" />
          </div>
          <p className="font-semibold text-gray-700">{error || "Product not found."}</p>
          <div className="flex gap-3">
            <button
              onClick={() => { setError(""); setLoading(true); getProductById(productId).then(({ data }) => { setProduct(data.data); setLoading(false); }).catch(() => { setError("Failed again."); setLoading(false); }); }}
              className="flex items-center gap-2 text-sm text-green-600 font-semibold bg-green-50 px-4 py-2 rounded-xl hover:bg-green-100 transition-colors"
            >
              <RefreshCw size={14} /> Retry
            </button>
            <button
              onClick={() => onNavigate("home")}
              className="text-sm text-gray-600 font-semibold bg-gray-100 px-4 py-2 rounded-xl hover:bg-gray-200 transition-colors"
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Full detail view ───────────────────────────────────────────────────────
  return (
    <div className="pb-24 lg:pb-8">
      <StickyHeader />

      <div className="lg:grid lg:grid-cols-2 lg:gap-8 px-4 lg:px-0 pt-4">
        {/* Image */}
        <div>
          <div className="relative aspect-square bg-gray-50 rounded-2xl overflow-hidden">
            <img
              src={imageSrc}
              alt={product.name}
              className="w-full h-full object-cover"
              onError={() => setImgError(true)}
            />
            {product.isAvailable === false && (
              <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                <span className="font-bold text-gray-600 bg-white px-4 py-2 rounded-full border text-sm">
                  Out of Stock
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Details */}
        <div className="mt-4 lg:mt-0 space-y-4">
          {/* Name & category */}
          <div>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
              {product.category}
            </p>
            <h1 className="text-2xl font-black text-gray-900 mt-1">{product.name}</h1>
            {/* Stock badge */}
            <div className="flex items-center gap-2 mt-2">
              <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ${
                product.stock > 10
                  ? "bg-green-50 text-green-700"
                  : product.stock > 0
                  ? "bg-yellow-50 text-yellow-700"
                  : "bg-red-50 text-red-600"
              }`}>
                <Package size={11} />
                {product.stock > 10
                  ? "In Stock"
                  : product.stock > 0
                  ? `Only ${product.stock} left`
                  : "Out of Stock"}
              </div>
            </div>
          </div>

          {/* Delivery promise */}
          <div className="flex items-center gap-2 bg-green-50 border border-green-100 rounded-xl px-4 py-3">
            <span className="text-lg">⚡</span>
            <div>
              <p className="text-sm font-bold text-green-800">Delivery in 10 minutes</p>
              <p className="text-xs text-green-600">Express delivery available</p>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-black text-gray-900">₹{price}</span>
          </div>

          {/* Add to cart / quantity control */}
          {product.isAvailable === false || product.stock === 0 ? (
            <button
              disabled
              className="w-full bg-gray-100 text-gray-400 py-4 rounded-2xl font-black text-lg cursor-not-allowed"
            >
              Out of Stock
            </button>
          ) : cartItem ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 bg-green-500 rounded-2xl px-4 py-3">
                <button
                  onClick={() => updateQuantity(product.id, cartItem.quantity - 1)}
                  className="text-white hover:opacity-70 transition-opacity"
                >
                  <Minus size={18} />
                </button>
                <span className="text-white font-black text-lg w-8 text-center">
                  {cartItem.quantity}
                </span>
                <button
                  onClick={() => addToCart(product)}
                  className="text-white hover:opacity-70 transition-opacity"
                >
                  <Plus size={18} />
                </button>
              </div>
              <span className="text-gray-500 text-sm">
                ₹{(price * cartItem.quantity).toFixed(2)} total
              </span>
            </div>
          ) : (
            <button
              onClick={() => addToCart(product)}
              className="w-full bg-green-500 text-white py-4 rounded-2xl font-black text-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-green-200"
            >
              <Plus size={20} />
              Add to Cart
            </button>
          )}

          {/* Description */}
          {product.description && (
            <div>
              <h3 className="font-bold text-gray-900 mb-2">About this product</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{product.description}</p>
            </div>
          )}

          {/* Trust badges */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: <Shield size={16} />,    title: "100% Safe",    desc: "Quality checked"  },
              { icon: <RefreshCw size={16} />, title: "Easy Returns", desc: "7-day policy"      },
            ].map(item => (
              <div key={item.title} className="bg-gray-50 rounded-xl p-3 flex items-center gap-2">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-green-600 shadow-sm">
                  {item.icon}
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-800">{item.title}</p>
                  <p className="text-xs text-gray-500">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Similar products */}
      {similar.length > 0 && (
        <div className="px-4 lg:px-0 mt-8">
          <h2 className="text-lg font-black text-gray-900 mb-4">Similar Products</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {similar.map(p => (
              <ProductCard
                key={p.id}
                product={p}
                onProductClick={prod => onNavigate("product", prod)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
