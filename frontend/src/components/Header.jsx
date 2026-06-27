import { useState } from "react";
import { Search, MapPin, ShoppingCart, ChevronDown, X, Menu, LogIn, LogOut, User } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

export default function Header({ onNavigate, currentPage, searchQuery, onSearch }) {
  const { count, total } = useCart();
  const { isLoggedIn, user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleAuthClick = () => {
    if (isLoggedIn) {
      logout();
    } else {
      onNavigate("login");
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 h-16">
          {/* Logo */}
          <button
            onClick={() => onNavigate("home")}
            className="flex items-center gap-1.5 shrink-0"
          >
            <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center">
              <span className="text-gray-900 font-black text-lg leading-none">b</span>
            </div>
            <span className="text-gray-900 font-black text-xl hidden sm:block">blinkit</span>
          </button>

          {/* Delivery Address */}
          <button className="hidden md:flex items-center gap-1 text-sm shrink-0 hover:opacity-70 transition-opacity">
            <MapPin size={15} className="text-yellow-500" />
            <div className="text-left">
              <div className="flex items-center gap-1">
                <span className="font-bold text-gray-900 text-[13px]">Home</span>
                <ChevronDown size={13} className="text-gray-500" />
              </div>
              <p className="text-[11px] text-gray-500 leading-none">Delivery in 10 mins</p>
            </div>
          </button>

          {/* Search */}
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder='Search "milk"'
              value={searchQuery}
              onChange={e => { onSearch(e.target.value); if (e.target.value.length > 0) onNavigate("search"); }}
              className="w-full bg-gray-100 rounded-xl pl-9 pr-9 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all"
            />
            {searchQuery && (
              <button onClick={() => onSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <X size={15} />
              </button>
            )}
          </div>

          {/* Cart Button */}
          <button
            onClick={() => onNavigate("cart")}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl font-semibold text-sm transition-all ${count > 0 ? "bg-green-500 text-white shadow-md hover:bg-green-600" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
          >
            <ShoppingCart size={17} />
            {count > 0 ? (
              <div className="flex items-center gap-2">
                <span className="hidden sm:block">{count} item{count !== 1 ? "s" : ""}</span>
                <span className="hidden sm:block">•</span>
                <span className="hidden sm:block">₹{total}</span>
                <span className="sm:hidden">{count}</span>
              </div>
            ) : (
              <span className="hidden sm:block">Cart</span>
            )}
          </button>

          {/* Login / Logout Button */}
          <button
            onClick={handleAuthClick}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl font-semibold text-sm transition-all shrink-0 ${
              isLoggedIn
                ? "bg-red-50 text-red-600 hover:bg-red-100 border border-red-100"
                : "bg-green-500 text-white hover:bg-green-600 shadow-sm"
            }`}
            title={isLoggedIn ? `Logged in as ${user?.name}` : "Log in to your account"}
          >
            {isLoggedIn ? (
              <>
                <LogOut size={15} />
                <span className="hidden sm:block">Logout</span>
              </>
            ) : (
              <>
                <LogIn size={15} />
                <span className="hidden sm:block">Login</span>
              </>
            )}
          </button>

          {/* Profile (only show when logged in) */}
          {isLoggedIn && (
            <button
              onClick={() => onNavigate("profile")}
              className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${currentPage === "profile" ? "bg-yellow-400 text-gray-900" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
              title={user?.name}
            >
              <User size={17} />
            </button>
          )}

          {/* Mobile menu */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center text-gray-600"
          >
            <Menu size={17} />
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden pb-3 border-t border-gray-100 pt-3 space-y-2">
            <button className="flex items-center gap-2 text-sm text-gray-700 w-full py-2">
              <MapPin size={15} className="text-yellow-500" />
              <span>Home · Delivery in 10 mins</span>
            </button>
            {isLoggedIn && (
              <p className="text-xs text-gray-500 px-1">Logged in as <span className="font-semibold text-gray-700">{user?.name}</span></p>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
