import { useState } from "react";
import { ChevronLeft, SlidersHorizontal, ChevronDown } from "lucide-react";
import { products, categories } from "../data/products";
import ProductCard from "../components/ProductCard";

const sortOptions = ["Relevance", "Price: Low to High", "Price: High to Low", "Discount", "Rating"];

export default function CategoryPage({ categoryId, onNavigate }) {
  const [sort, setSort] = useState("Relevance");
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [showSortMenu, setShowSortMenu] = useState(false);

  const category = categories.find(c => c.id === categoryId);
  const allCategoryProducts = products.filter(p => p.category === categoryId);
  const subcategories = [...new Set(allCategoryProducts.map(p => p.subcategory))];
  const [activeSubcat, setActiveSubcat] = useState(null);

  let filtered = activeSubcat
    ? allCategoryProducts.filter(p => p.subcategory === activeSubcat)
    : allCategoryProducts;

  filtered = filtered.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

  if (sort === "Price: Low to High") filtered = [...filtered].sort((a, b) => a.price - b.price);
  else if (sort === "Price: High to Low") filtered = [...filtered].sort((a, b) => b.price - a.price);
  else if (sort === "Discount") filtered = [...filtered].sort((a, b) => (b.mrp - b.price) - (a.mrp - a.price));
  else if (sort === "Rating") filtered = [...filtered].sort((a, b) => b.rating - a.rating);

  if (categoryId === "__all__") {
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
                  <p className="text-xs text-gray-400 text-center mt-0.5">
                    {products.filter(p => p.category === cat.id).length} products
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-24 lg:pb-8">
      {/* Header */}
      <div className="sticky top-16 z-30 bg-white border-b border-gray-100 px-4 lg:px-0 py-3">
        <div className="flex items-center gap-3 mb-3">
          <button onClick={() => onNavigate("home")} className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors">
            <ChevronLeft size={18} />
          </button>
          <div>
            <h1 className="font-black text-lg text-gray-900">{category?.name || "Category"}</h1>
            <p className="text-xs text-gray-500">{filtered.length} products</p>
          </div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
          <button
            onClick={() => setActiveSubcat(null)}
            className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${!activeSubcat ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
          >
            All
          </button>
          {subcategories.map(sc => (
            <button
              key={sc}
              onClick={() => setActiveSubcat(sc === activeSubcat ? null : sc)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${activeSubcat === sc ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
            >
              {sc}
            </button>
          ))}
        </div>
      </div>

      {/* Sort & Filter Bar */}
      <div className="flex items-center gap-2 px-4 lg:px-0 py-3 bg-white border-b border-gray-50">
        <div className="relative">
          <button
            onClick={() => setShowSortMenu(!showSortMenu)}
            className="flex items-center gap-1.5 text-sm text-gray-700 bg-gray-100 px-3 py-1.5 rounded-lg hover:bg-gray-200 transition-colors font-medium"
          >
            Sort: {sort} <ChevronDown size={13} />
          </button>
          {showSortMenu && (
            <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-40 min-w-[180px]">
              {sortOptions.map(opt => (
                <button
                  key={opt}
                  onClick={() => { setSort(opt); setShowSortMenu(false); }}
                  className={`block w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 ${sort === opt ? "text-green-600 font-semibold" : "text-gray-700"}`}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-1.5 text-sm text-gray-700 bg-gray-100 px-3 py-1.5 rounded-lg hover:bg-gray-200 transition-colors font-medium ml-auto"
        >
          <SlidersHorizontal size={14} />
          Filters
        </button>
      </div>

      {showFilters && (
        <div className="bg-white border-b border-gray-100 px-4 lg:px-0 py-4">
          <h3 className="text-sm font-bold text-gray-800 mb-3">Price Range</h3>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">₹{priceRange[0]}</span>
            <input
              type="range"
              min={0}
              max={1000}
              value={priceRange[1]}
              onChange={e => setPriceRange([priceRange[0], parseInt(e.target.value)])}
              className="flex-1 accent-green-500"
            />
            <span className="text-sm text-gray-500">₹{priceRange[1]}</span>
          </div>
        </div>
      )}

      <div className="px-4 lg:px-0 pt-4">
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <span className="text-5xl">🛒</span>
            <p className="mt-3 font-semibold text-gray-700">No products found</p>
            <p className="text-sm text-gray-400 mt-1">Try adjusting your filters</p>
            <button onClick={() => { setActiveSubcat(null); setPriceRange([0, 1000]); }} className="mt-4 bg-green-500 text-white px-5 py-2 rounded-xl font-semibold text-sm">
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {filtered.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onProductClick={p => onNavigate("product", p)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
