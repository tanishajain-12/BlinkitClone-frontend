import { useState, useEffect } from "react";
import { ChevronRight, Zap, RefreshCw } from "lucide-react";
import { categories, banners } from "../data/products";  // UI-only static data kept
import { getProducts } from "../api/productService.js";
import ProductCard from "../components/ProductCard";

// ─── Skeleton loader for product grid ────────────────────────────────────────
function ProductSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
      <div className="bg-gray-200" style={{ paddingBottom: "100%" }} />
      <div className="p-3 space-y-2">
        <div className="h-3 bg-gray-200 rounded w-1/2" />
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-200 rounded w-1/3" />
      </div>
    </div>
  );
}

export default function HomePage({ onNavigate }) {
  const [activeBanner,    setActiveBanner]    = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [products,        setProducts]        = useState([]);
  const [loading,         setLoading]         = useState(true);
  const [error,           setError]           = useState("");

  // ── Fetch all products from the backend ─────────────────────────────────
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError("");
      try {
        const { data } = await getProducts({ limit: 20, sort: "price_asc" });
        setProducts(data.data || []);
      } catch {
        setError("Could not load products. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // ── Banner auto-rotation ─────────────────────────────────────────────────
  useEffect(() => {
    const timer = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setActiveBanner(prev => (prev + 1) % banners.length);
        setIsTransitioning(false);
      }, 300);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  // Featured = first 8, deals = products with stock > 0 (no mrp in backend, just show all)
  const featuredProducts = products.slice(0, 8);
  const popularProducts  = products.slice(0, 10);

  const renderGrid = (items) => {
    if (loading) {
      return (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {Array.from({ length: 5 }).map((_, i) => <ProductSkeleton key={i} />)}
        </div>
      );
    }
    if (error) {
      return (
        <div className="flex flex-col items-center gap-3 py-10">
          <p className="text-sm text-red-500 font-semibold">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 text-sm text-green-600 font-semibold hover:underline"
          >
            <RefreshCw size={14} /> Retry
          </button>
        </div>
      );
    }
    if (items.length === 0) {
      return <p className="text-sm text-gray-400 text-center py-8">No products available right now.</p>;
    }
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
        {items.map(product => (
          <ProductCard key={product.id} product={product} onProductClick={p => onNavigate("product", p)} />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-8 pb-24 lg:pb-8">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl mx-4 mt-4 lg:mx-0 lg:mt-0 lg:rounded-none">
        <div className={`relative h-48 sm:h-64 transition-opacity duration-300 ${isTransitioning ? "opacity-0" : "opacity-100"}`}>
          <img
            src={banners[activeBanner].image}
            alt={banners[activeBanner].title}
            className="w-full h-full object-cover"
          />
          <div className={`absolute inset-0 bg-gradient-to-r ${banners[activeBanner].color} opacity-75`} />
          <div className="absolute inset-0 flex items-center px-8 sm:px-12">
            <div className="text-white space-y-2">
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 w-fit">
                <Zap size={12} className="text-yellow-300" />
                <span className="text-xs font-semibold">10-Minute Delivery</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black leading-tight">{banners[activeBanner].title}</h2>
              <p className="text-sm sm:text-base opacity-90">{banners[activeBanner].subtitle}</p>
              <button
                onClick={() => onNavigate("category", banners[activeBanner].category)}
                className="mt-3 bg-white text-gray-900 font-bold px-5 py-2 rounded-xl text-sm hover:bg-yellow-400 transition-colors"
              >
                {banners[activeBanner].cta}
              </button>
            </div>
          </div>
        </div>
        <div className="absolute bottom-3 right-4 flex gap-1.5">
          {banners.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveBanner(i)}
              className={`rounded-full transition-all ${i === activeBanner ? "w-6 h-2 bg-white" : "w-2 h-2 bg-white/50"}`}
            />
          ))}
        </div>
      </div>

      {/* Delivery Promise Bar */}
      <div className="mx-4 lg:mx-0 grid grid-cols-3 gap-3">
        {[
          { icon: "⚡", title: "10 Min", sub: "Delivery" },
          { icon: "🌿", title: "Fresh", sub: "Products" },
          { icon: "💳", title: "Best", sub: "Prices" },
        ].map(item => (
          <div key={item.title} className="bg-green-50 border border-green-100 rounded-xl p-3 flex items-center gap-2">
            <span className="text-lg">{item.icon}</span>
            <div>
              <p className="font-bold text-green-800 text-sm">{item.title}</p>
              <p className="text-xs text-green-600">{item.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Categories — static UI data, no API needed */}
      <section className="px-4 lg:px-0">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-black text-gray-900">Shop by Category</h2>
          <button onClick={() => onNavigate("categories")} className="text-green-600 text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all">
            See all <ChevronRight size={15} />
          </button>
        </div>
        <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-6 gap-3">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => onNavigate("category", cat.id)}
              className="flex flex-col items-center gap-1.5 group"
            >
              <div className={`w-full aspect-square rounded-2xl overflow-hidden ${cat.color} relative`}>
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <span className="text-[11px] sm:text-xs text-gray-700 font-semibold text-center leading-tight line-clamp-2">{cat.name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Featured Products — from backend */}
      <section className="px-4 lg:px-0">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-black text-gray-900">Best Deals 🔥</h2>
            <p className="text-xs text-gray-500 mt-0.5">Save more on these products</p>
          </div>
          <button onClick={() => onNavigate("categories")} className="text-green-600 text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all">
            See all <ChevronRight size={15} />
          </button>
        </div>
        {renderGrid(featuredProducts)}
      </section>

      {/* Popular Products — from backend */}
      <section className="px-4 lg:px-0">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-black text-gray-900">Popular Right Now</h2>
            <p className="text-xs text-gray-500 mt-0.5">Trending in your area</p>
          </div>
        </div>
        {renderGrid(popularProducts)}
      </section>

      {/* Why Blinkit */}
      <section className="px-4 lg:px-0 bg-gray-900 rounded-2xl mx-4 lg:mx-0 p-6 lg:p-8">
        <h2 className="text-xl font-black text-white mb-6 text-center">Why choose blinkit?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: "⚡", title: "Fastest Delivery", desc: "Get your groceries in under 10 minutes, guaranteed." },
            { icon: "🛒", title: "5000+ Products", desc: "Everything from fresh produce to daily essentials." },
            { icon: "💯", title: "Quality Promise", desc: "100% freshness guarantee or your money back." },
          ].map(item => (
            <div key={item.title} className="text-center space-y-2">
              <div className="text-3xl">{item.icon}</div>
              <h3 className="text-white font-bold">{item.title}</h3>
              <p className="text-gray-400 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
