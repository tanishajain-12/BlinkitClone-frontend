import { useState, useEffect, useRef } from "react";
import { Search, RefreshCw } from "lucide-react";
import { getProducts } from "../api/productService.js";
import ProductCard from "../components/ProductCard";

const POPULAR_TERMS = ["Milk", "Eggs", "Bread", "Onion", "Tomato", "Chips", "Maggi", "Coffee", "Butter", "Apple"];

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

export default function SearchPage({ query, onNavigate }) {
  const [results,  setResults]  = useState([]);
  const [trending, setTrending] = useState([]);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");
  const [total,    setTotal]    = useState(0);

  // Debounce ref — avoid firing on every keystroke
  const debounceRef = useRef(null);

  // ── Fetch trending products once on mount (shown when query is empty) ──────
  useEffect(() => {
    getProducts({ limit: 6 })
      .then(({ data }) => setTrending(data.data || []))
      .catch(() => {}); // silent — trending is non-critical
  }, []);

  // ── Debounced search whenever query changes ────────────────────────────────
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!query.trim()) {
      setResults([]);
      setTotal(0);
      setError("");
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      setError("");
      try {
        const { data } = await getProducts({ search: query.trim(), limit: 40 });
        setResults(data.data || []);
        setTotal(data.totalProducts || 0);
      } catch {
        setError("Search failed. Please try again.");
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 400); // 400 ms debounce

    return () => clearTimeout(debounceRef.current);
  }, [query]);

  // ── Empty query state — show popular searches + trending ──────────────────
  if (!query.trim()) {
    return (
      <div className="pb-24 lg:pb-8 px-4 lg:px-0 pt-4">
        <h2 className="font-black text-lg text-gray-900 mb-4">Popular Searches</h2>
        <div className="flex flex-wrap gap-2">
          {POPULAR_TERMS.map(term => (
            <button
              key={term}
              className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-full text-sm font-semibold transition-colors"
            >
              <Search size={13} className="text-gray-500" />
              {term}
            </button>
          ))}
        </div>

        {trending.length > 0 && (
          <div className="mt-8">
            <h2 className="font-black text-lg text-gray-900 mb-4">Trending Now 🔥</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {trending.map(p => (
                <ProductCard key={p.id} product={p} onProductClick={prod => onNavigate("product", prod)} />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // ── Active search state ────────────────────────────────────────────────────
  return (
    <div className="pb-24 lg:pb-8 px-4 lg:px-0 pt-4">
      {/* Result count */}
      <div className="flex items-center gap-2 mb-4 min-h-[24px]">
        {loading ? (
          <p className="text-sm text-gray-400">Searching…</p>
        ) : error ? (
          <p className="text-sm text-red-500 font-semibold">{error}</p>
        ) : (
          <p className="text-sm text-gray-500">
            {total > 0 ? (
              <><span className="font-bold text-gray-900">{total} result{total !== 1 ? "s" : ""}</span> for "{query}"</>
            ) : (
              <>No results for "<span className="font-bold">{query}</span>"</>
            )}
          </p>
        )}
      </div>

      {/* Loading skeletons */}
      {loading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {Array.from({ length: 8 }).map((_, i) => <ProductSkeleton key={i} />)}
        </div>
      )}

      {/* Error retry */}
      {!loading && error && (
        <div className="flex flex-col items-center gap-3 py-16">
          <button
            onClick={() => {
              setError("");
              setLoading(true);
              getProducts({ search: query.trim(), limit: 40 })
                .then(({ data }) => { setResults(data.data || []); setTotal(data.totalProducts || 0); })
                .catch(() => setError("Search failed. Please try again."))
                .finally(() => setLoading(false));
            }}
            className="flex items-center gap-2 text-sm text-green-600 font-semibold"
          >
            <RefreshCw size={14} /> Retry
          </button>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && results.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 gap-4">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
            <Search size={32} className="text-gray-400" />
          </div>
          <div className="text-center">
            <p className="font-bold text-gray-800">No products found</p>
            <p className="text-sm text-gray-400 mt-1">Try a different search term</p>
          </div>
          <div className="flex flex-wrap gap-2 justify-center">
            {POPULAR_TERMS.slice(0, 5).map(term => (
              <button
                key={term}
                className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full text-sm font-semibold hover:bg-gray-200 transition-colors"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Results grid */}
      {!loading && !error && results.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {results.map(p => (
            <ProductCard key={p.id} product={p} onProductClick={prod => onNavigate("product", prod)} />
          ))}
        </div>
      )}
    </div>
  );
}
