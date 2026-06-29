import { useState } from "react";
import { Toaster } from "react-hot-toast";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./context/AuthContext";
import Header from "./components/Header";
import CartSidebar, { CartSidebarDesktop } from "./components/CartSidebar";
import HomePage from "./pages/HomePage";
import CategoryPage from "./pages/CategoryPage";
import ProductPage from "./pages/ProductPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrdersPage from "./pages/OrdersPage";
import ProfilePage from "./pages/ProfilePage";
import SearchPage from "./pages/SearchPage";
import LoginPage from "./pages/LoginPage";
import { Home, Grid, Package, User } from "lucide-react";

// Pages that require the user to be logged in
const PROTECTED_PAGES = ["cart", "checkout", "orders", "profile"];

function AppContent() {
  const { isLoggedIn } = useAuth();

  const [currentPage, setCurrentPage] = useState("home");
  const [pageData,    setPageData]    = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = (page, data) => {
    // If user tries to reach a protected page while logged out, send to login
    if (PROTECTED_PAGES.includes(page) && !isLoggedIn) {
      setCurrentPage("login");
      setPageData(null);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    // If user is already logged in and tries to visit login, send home
    if (page === "login" && isLoggedIn) {
      setCurrentPage("home");
      setPageData(null);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    setCurrentPage(page);
    setPageData(data ?? null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSearch = (q) => {
    setSearchQuery(q);
    if (q.length > 0 && currentPage !== "search") {
      setCurrentPage("search");
    }
  };

  const showSidebar = !["cart", "checkout", "login"].includes(currentPage);

  if (currentPage === "login") {
    return <LoginPage onNavigate={navigate} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        onNavigate={navigate}
        currentPage={currentPage}
        searchQuery={searchQuery}
        onSearch={handleSearch}
      />

      <div className={`max-w-7xl mx-auto ${showSidebar ? "lg:flex" : ""}`}>
        <main className={`flex-1 min-w-0 ${currentPage !== "home" ? "px-0 sm:px-4 lg:px-6 py-0 lg:py-4" : ""}`}>
          {currentPage === "home"       && <HomePage onNavigate={navigate} />}
          {currentPage === "category"   && (
            <CategoryPage
              categoryId={typeof pageData === "string" ? pageData : ""}
              onNavigate={navigate}
            />
          )}
          {currentPage === "categories" && <CategoryPage categoryId="__all__" onNavigate={navigate} />}
          {currentPage === "product"    && pageData && <ProductPage product={pageData} onNavigate={navigate} />}
          {currentPage === "cart"       && <CartPage     onNavigate={navigate} />}
          {currentPage === "checkout"   && <CheckoutPage onNavigate={navigate} />}
          {currentPage === "orders"     && <OrdersPage   onNavigate={navigate} />}
          {currentPage === "profile"    && <ProfilePage  onNavigate={navigate} />}
          {currentPage === "search"     && <SearchPage   query={searchQuery} onNavigate={navigate} />}
        </main>

        {showSidebar && <CartSidebarDesktop onNavigate={navigate} />}
      </div>

      {!["cart", "checkout"].includes(currentPage) && (
        <CartSidebar onNavigate={navigate} />
      )}

      {/* Mobile Bottom Nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-40 safe-area-bottom">
        <div className="grid grid-cols-4 h-16">
          {[
            { page: "home",       icon: <Home    size={20} />, label: "Home"       },
            { page: "categories", icon: <Grid    size={20} />, label: "Categories" },
            { page: "orders",     icon: <Package size={20} />, label: "Orders"     },
            { page: "profile",    icon: <User    size={20} />, label: "Profile"    },
          ].map(item => (
            <button
              key={item.page}
              onClick={() => navigate(item.page)}
              className={`flex flex-col items-center justify-center gap-0.5 transition-all relative ${
                currentPage === item.page ? "text-green-600" : "text-gray-400 hover:text-gray-600"
              }`}
            >
              {item.icon}
              <span className="text-[10px] font-semibold">{item.label}</span>
              {currentPage === item.page && (
                <span className="absolute bottom-0 w-8 h-0.5 bg-green-600 rounded-full" />
              )}
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        {/* Global toast container — rendered once at the root so toasts appear above everything */}
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: { borderRadius: "12px", fontWeight: "600", fontSize: "14px" },
            success: { iconTheme: { primary: "#22c55e", secondary: "#fff" } },
            error:   { iconTheme: { primary: "#ef4444", secondary: "#fff" } },
          }}
        />
        <AppContent />
      </CartProvider>
    </AuthProvider>
  );
}
