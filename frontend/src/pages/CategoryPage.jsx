import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, SlidersHorizontal, ChevronDown, RefreshCw } from "lucide-react";
import { categories } from "../data/products";  // UI metadata (icons, colours) kept
import { getProducts } from "../api/productService.js";
import ProductCard from "../components/ProductCard";

const SORT_OPTIONS = [
  { label: "Newest First",       value: ""            },
  { label: "Price: Low to High", value: "price_asc"   },
  { label: "Price: High to Low", value: "price_desc"  },
];

// ─── Skeleton ─────────────────────────────────────────────────────────────────
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

// ─── All Categories view ──────────────────────────────────────────────────────
function AllCategoriesView({ onNavigate }) {
  return (
    <div className="pb-24 lg:pb-8">
      <div className="sticky top-16 z-30 bg-white border-b border-gray-100 px-4 lg:px-0 py-3">
        <h1 className="font-black text-lg text-gray-900">All Categories</h1>
      </div>
      <div className="px-4 lg:px-0 pt-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => onNavigate("category", cat.id)}
              className="bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-md transition-shadow group"
            >
              <div className="relative h-32 overflow-hidden">
                <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                <div className={`absolute inset-0 ${cat.color} opacity-50`} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl">{cat.icon}</span>
                </div>
              </div>
              <div className="p-3">
                <p className="font-bold text-gray-800 text-sm text-center">{cat.name}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Single Category view ─────────────────────────────────────────────────────
export default function CategoryPage({ categoryId, onNavigate }) {
  if (categoryId === "__all__") return <AllCategoriesView onNavigate={onNavigate} />;

  const category = categories.find(c => c.id === categoryId);

  // The backend uses free-text category names, not slug IDs.
  // Map from frontend slug → backend category string for the API query.
  // If the slug isn't in this map, we fall back to the display name.
  const CATEGORY_MAP = {
    "vegetables-fruits": "Vegetables",
    "dairy-breakfast":   "Dairy",
    "munchies":          "Snacks",
    "cold-drinks":       "Beverages",
    "instant-food":      "Instant Food",
    "tea-coffee":        "Tea & Coffee",
    "bakery":            "Bakery",
    "sweet-tooth":       "Sweets",
    "atta-rice":         "Staples",
    "personal-care":     "Personal Care",
    "cleaning":          "Cleaning",
    "baby-care":         "Baby Care",
  };
  const apiCategory = CATEGORY_MAP[categoryId] || category?.name || categoryId;

  const [products,      setProducts]      = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [error,         setError]         = useState("");
  const [sort,          setSort]          = useState("");
  const [showSortMenu,  setShowSortMenu]  = useState(false);
  const [showFilters,   setShowFilters]   = useState(false);
  const [maxPrice,      setMaxPrice]      = useState(1000);
  const [page,          setPage]          = useState(1);
  const [totalPages,    setTotalPages]    = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  const fetchProducts = useCallback(async (resetPage = false) => {
    const currentPage = resetPage ? 1 : page;
    if (resetPage) setPage(1);

    setLoading(true);
    setError("");
    try {
      const params = {
        category: apiCategory,
        sort:     sort || undefined,
        maxPrice: maxPrice < 1000 ? maxPrice : undefined,
        page:     currentPage,
        limit:    20,
      };
      const { data } = await getProducts(params);
      setProducts(data.data || []);
      setTotalPages(data.totalPages || 1);
      setTotalProducts(data.totalProducts || 0);
    } catch {
      setError("Could not load products. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [apiCategory, sort, maxPrice, page]);

  // Refetch when sort or price filter changes (reset to page 1)
  useEffect(() => { fetchProducts(true); }, [apiCategory, sort, maxPrice]);

  // Refetch when page changes (keep filters)
  useEffect(() => { fetchProducts(false); }, [page]);

  const clearFilters = () => {
    setSort("");
    setMaxPrice(1000);
    setPage(1);
  };

  return (
    <div className="pb-24 lg:pb-8">
      {/* Sticky header */}
      <div className="sticky top-16 z-30 bg-white border-b border-gray-100 px-4 lg:px-0 py-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate("home")}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <ChevronLeft size={18} />
          </button>
          <div>
            <h1 className="font-black text-lg text-gray-900">{category?.name || categoryId}</h1>
            <p className="text-xs text-gray-500">
              {loading ? "Loading…" : `${totalProducts} product${totalProducts !== 1 ? "s" : ""}`}
            </p>
          </div>
        </div>
      </div>

      {/* Sort & Filter bar */}
      <div className="flex items-center gap-2 px-4 lg:px-0 py-3 bg-white border-b border-gray-50">
        {/* Sort dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowSortMenu(v => !v)}
            className="flex items-center gap-1.5 text-sm text-gray-700 bg-gray-100 px-3 py-1.5 rounded-lg hover:bg-gray-200 transition-colors font-medium"
          >
            Sort: {SORT_OPTIONS.find(o => o.value === sort)?.label} <ChevronDown size={13} />
          </button>
          {showSortMenu && (
            <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-40 min-w-[190px]">
              {SORT_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => { setSort(opt.value); setShowSortMenu(false); }}
                  className={`block w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors ${sort === opt.value ? "text-green-600 font-semibold" : "text-gray-700"}`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={() => setShowFilters(v => !v)}
          className="flex items-center gap-1.5 text-sm text-gray-700 bg-gray-100 px-3 py-1.5 rounded-lg hover:bg-gray-200 transition-colors font-medium ml-auto"
        >
          <SlidersHorizontal size={14} />
          Filters
        </button>
      </div>

      {/* Price filter */}
      {showFilters && (
        <div className="bg-white border-b border-gray-100 px-4 lg:px-0 py-4">
          <h3 className="text-sm font-bold text-gray-800 mb-3">Max Price: ₹{maxPrice}</h3>
          <input
            type="range"
            min={50}
            max={1000}
            step={50}
            value={maxPrice}
            onChange={e => setMaxPrice(Number(e.target.value))}
            className="w-full accent-green-500"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>₹50</span><span>₹1000</span>
          </div>
        </div>
      )}

      {/* Products grid */}
      <div className="px-4 lg:px-0 pt-4">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {Array.from({ length: 10 }).map((_, i) => <ProductSkeleton key={i} />)}
          </div>
        ) : error ? (
          <div className="flex flex-col items-center gap-3 py-16">
            <p className="text-sm text-red-500 font-semibold">{error}</p>
            <button onClick={() => fetchProducts(true)} className="flex items-center gap-2 text-sm text-green-600 font-semibold">
              <RefreshCw size={14} /> Retry
            </button>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16">
            <span className="text-5xl">🛒</span>
            <p className="mt-3 font-semibold text-gray-700">No products found</p>
            <p className="text-sm text-gray-400 mt-1">Try adjusting your filters</p>
            <button
              onClick={clearFilters}
              className="mt-4 bg-green-500 text-white px-5 py-2 rounded-xl font-semibold text-sm hover:bg-green-600 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {products.map(product => (
                <ProductCard key={product.id} product={product} onProductClick={p => onNavigate("product", p)} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage(p => p - 1)}
                  className="px-4 py-2 text-sm font-semibold rounded-xl bg-gray-100 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  ← Prev
                </button>
                <span className="text-sm text-gray-600 font-medium">
                  Page {page} of {totalPages}
                </span>
                <button
                  disabled={page >= totalPages}
                  onClick={() => setPage(p => p + 1)}
                  className="px-4 py-2 text-sm font-semibold rounded-xl bg-gray-100 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
