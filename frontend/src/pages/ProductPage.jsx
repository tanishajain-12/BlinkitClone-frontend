import { useState } from "react";
import { ChevronLeft, Star, Clock, Shield, RefreshCw, Plus, Minus, Heart } from "lucide-react";
import { products } from "../data/products";
import { useCart } from "../context/CartContext";
import ProductCard from "../components/ProductCard";

export default function ProductPage({ product, onNavigate }) {
  const { items, addToCart, updateQuantity } = useCart();
  const [wishlist, setWishlist] = useState(false);
  const cartItem = items.find(i => i.id === product.id);
  const discount = Math.round(((product.mrp - product.price) / product.mrp) * 100);
  const similar = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 5);

  return (
    <div className="pb-24 lg:pb-8">
      <div className="sticky top-16 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 lg:px-0 py-3 flex items-center gap-3">
        <button onClick={() => onNavigate("category", product.category)} className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors">
          <ChevronLeft size={18} />
        </button>
        <span className="font-semibold text-gray-800 text-sm truncate">{product.name}</span>
        <button
          onClick={() => setWishlist(!wishlist)}
          className={`ml-auto w-8 h-8 flex items-center justify-center rounded-lg transition-all ${wishlist ? "bg-red-100 text-red-500" : "bg-gray-100 text-gray-500"}`}
        >
          <Heart size={16} fill={wishlist ? "currentColor" : "none"} />
        </button>
      </div>

      <div className="lg:grid lg:grid-cols-2 lg:gap-8 px-4 lg:px-0 pt-4">
        <div>
          <div className="relative aspect-square bg-gray-50 rounded-2xl overflow-hidden">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            {product.badge && (
              <span className="absolute top-4 left-4 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full uppercase">
                {product.badge}
              </span>
            )}
            {discount > 0 && (
              <span className="absolute top-4 right-4 bg-green-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                {discount}% OFF
              </span>
            )}
          </div>
        </div>

        <div className="mt-4 lg:mt-0 space-y-4">
          <div>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{product.subcategory}</p>
            <h1 className="text-2xl font-black text-gray-900 mt-1">{product.name}</h1>
            <p className="text-gray-500 mt-1">{product.unit}</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-green-500 text-white px-2.5 py-1 rounded-lg">
              <Star size={13} fill="white" />
              <span className="text-sm font-bold">{product.rating}</span>
            </div>
            <span className="text-sm text-gray-500">{product.reviews.toLocaleString()} reviews</span>
          </div>

          <div className="flex items-center gap-2 bg-green-50 border border-green-100 rounded-xl px-4 py-3">
            <Clock size={16} className="text-green-600" />
            <div>
              <p className="text-sm font-bold text-green-800">Delivery in {product.deliveryTime}</p>
              <p className="text-xs text-green-600">Express delivery available</p>
            </div>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-black text-gray-900">₹{product.price}</span>
            {product.mrp > product.price && (
              <>
                <span className="text-lg text-gray-400 line-through">₹{product.mrp}</span>
                <span className="text-green-600 font-bold text-sm">Save ₹{product.mrp - product.price}</span>
              </>
            )}
          </div>

          {cartItem ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 bg-green-500 rounded-2xl px-4 py-3">
                <button onClick={() => updateQuantity(product.id, cartItem.quantity - 1)} className="text-white hover:opacity-70 transition-opacity">
                  <Minus size={18} />
                </button>
                <span className="text-white font-black text-lg w-8 text-center">{cartItem.quantity}</span>
                <button onClick={() => addToCart(product)} className="text-white hover:opacity-70 transition-opacity">
                  <Plus size={18} />
                </button>
              </div>
              <span className="text-gray-500 text-sm">₹{product.price * cartItem.quantity} total</span>
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

          <div>
            <h3 className="font-bold text-gray-900 mb-2">About this product</h3>
            <p className="text-gray-600 text-sm leading-relaxed">{product.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: <Shield size={16} />, title: "100% Safe", desc: "Quality checked" },
              { icon: <RefreshCw size={16} />, title: "Easy Returns", desc: "7-day policy" },
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

      {similar.length > 0 && (
        <div className="px-4 lg:px-0 mt-8">
          <h2 className="text-lg font-black text-gray-900 mb-4">Similar Products</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {similar.map(p => (
              <ProductCard key={p.id} product={p} onProductClick={prod => onNavigate("product", prod)} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
