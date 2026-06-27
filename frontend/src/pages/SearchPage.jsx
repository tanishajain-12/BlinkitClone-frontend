import { Search } from "lucide-react";
import { products } from "../data/products";
import ProductCard from "../components/ProductCard";

export default function SearchPage({ query, onNavigate }) {
  const results = query.trim()
    ? products.filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.subcategory.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const popular = ["Milk", "Eggs", "Bread", "Onion", "Tomato", "Chips", "Maggi", "Coffee", "Butter", "Apple"];

  return (
    <div className="pb-24 lg:pb-8 px-4 lg:px-0 pt-4">
      {!query.trim() ? (
        <div>
          <h2 className="font-black text-lg text-gray-900 mb-4">Popular Searches</h2>
          <div className="flex flex-wrap gap-2">
            {popular.map(term => (
              <button
                key={term}
                className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-full text-sm font-semibold transition-colors"
              >
                <Search size={13} className="text-gray-500" />
                {term}
              </button>
            ))}
          </div>

          <div className="mt-8">
            <h2 className="font-black text-lg text-gray-900 mb-4">Trending Now 🔥</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {products.slice(0, 6).map(p => (
                <ProductCard key={p.id} product={p} onProductClick={prod => onNavigate("product", prod)} />
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <p className="text-sm text-gray-500">
              {results.length > 0 ? (
                <><span className="font-bold text-gray-900">{results.length} result{results.length !== 1 ? "s" : ""}</span> for "{query}"</>
              ) : (
                <>No results for "<span className="font-bold">{query}</span>"</>
              )}
            </p>
          </div>

          {results.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-4">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                <Search size={32} className="text-gray-400" />
              </div>
              <div className="text-center">
                <p className="font-bold text-gray-800">No products found</p>
                <p className="text-sm text-gray-400 mt-1">Try searching for something else</p>
              </div>
              <div className="flex flex-wrap gap-2 justify-center">
                {popular.slice(0, 5).map(term => (
                  <button
                    key={term}
                    className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full text-sm font-semibold hover:bg-gray-200 transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {results.map(p => (
                <ProductCard key={p.id} product={p} onProductClick={prod => onNavigate("product", prod)} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
