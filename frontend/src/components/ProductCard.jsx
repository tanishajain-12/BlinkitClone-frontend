import { useState } from "react";
import { useCart } from "../context/CartContext";
import { Plus, Minus } from "lucide-react";

export default function ProductCard({ product, onProductClick }) {
  const { items, addToCart, updateQuantity } = useCart();
  const [imgLoaded, setImgLoaded] = useState(false);
  const cartItem = items.find(i => i.id === product.id);
  const discount = Math.round(((product.mrp - product.price) / product.mrp) * 100);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 hover:shadow-lg transition-all duration-200 overflow-hidden group flex flex-col">
      <div
        className="relative overflow-hidden bg-gray-50 cursor-pointer"
        style={{ paddingBottom: "100%" }}
        onClick={() => onProductClick?.(product)}
      >
        <div className={`absolute inset-0 bg-gray-200 animate-pulse transition-opacity duration-300 ${imgLoaded ? "opacity-0" : "opacity-100"}`} />
        <img
          src={product.image}
          alt={product.name}
          className={`absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ${imgLoaded ? "opacity-100" : "opacity-0"}`}
          onLoad={() => setImgLoaded(true)}
        />
        {product.badge && (
          <span className="absolute top-2 left-2 bg-yellow-400 text-yellow-900 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
            {product.badge}
          </span>
        )}
        {discount > 0 && (
          <span className="absolute top-2 right-2 bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
            {discount}% OFF
          </span>
        )}
      </div>

      <div className="p-3 flex flex-col gap-1 flex-1">
        <div className="flex items-center gap-1 text-xs text-gray-400">
          <span className="w-2 h-2 bg-yellow-400 rounded-full inline-block" />
          <span>{product.deliveryTime}</span>
        </div>
        <h3
          className="text-sm font-semibold text-gray-800 cursor-pointer hover:text-green-600 transition-colors line-clamp-2 leading-tight"
          onClick={() => onProductClick?.(product)}
        >
          {product.name}
        </h3>
        <p className="text-xs text-gray-500">{product.unit}</p>

        <div className="flex items-center justify-between mt-auto pt-2">
          <div>
            <span className="text-sm font-bold text-gray-900">₹{product.price}</span>
            {product.mrp > product.price && (
              <span className="text-xs text-gray-400 line-through ml-1">₹{product.mrp}</span>
            )}
          </div>

          {cartItem ? (
            <div className="flex items-center gap-1 bg-green-500 rounded-lg overflow-hidden">
              <button
                className="w-7 h-7 flex items-center justify-center text-white hover:bg-green-600 transition-colors"
                onClick={() => updateQuantity(product.id, cartItem.quantity - 1)}
              >
                <Minus size={13} />
              </button>
              <span className="text-white text-sm font-bold w-5 text-center">{cartItem.quantity}</span>
              <button
                className="w-7 h-7 flex items-center justify-center text-white hover:bg-green-600 transition-colors"
                onClick={() => addToCart(product)}
              >
                <Plus size={13} />
              </button>
            </div>
          ) : (
            <button
              className="w-8 h-8 flex items-center justify-center bg-green-50 border border-green-200 text-green-600 rounded-lg hover:bg-green-500 hover:text-white hover:border-green-500 transition-all duration-200 font-bold"
              onClick={() => addToCart(product)}
            >
              <Plus size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
