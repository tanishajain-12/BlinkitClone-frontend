import { createContext, useContext, useState, useEffect } from "react";
import toast from "react-hot-toast";
import { loginUser, registerUser } from "../api/authService.js";

const AuthContext = createContext(null);

const TOKEN_KEY = "blinkit_token";
const USER_KEY  = "blinkit_user";

export function AuthProvider({ children }) {
  // Restore session from localStorage so refresh doesn't log the user out
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem(USER_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [authLoading, setAuthLoading] = useState(false);

  // Keep localStorage in sync with state
  useEffect(() => {
    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_KEY);
      localStorage.removeItem(TOKEN_KEY);
    }
  }, [user]);

  // ── Login ──────────────────────────────────────────────────────────────────
  const login = async ({ email, password }) => {
    setAuthLoading(true);
    try {
      const { data } = await loginUser({ email, password });
      localStorage.setItem(TOKEN_KEY, data.token);
      setUser(data.user);
      toast.success(`Welcome back, ${data.user.name}! 👋`);
      return { success: true };
    } catch (err) {
      const message =
        err.response?.data?.message || "Login failed. Please try again.";
      toast.error(message);
      return { success: false, message };
    } finally {
      setAuthLoading(false);
    }
  };

  // ── Register ───────────────────────────────────────────────────────────────
  const register = async ({ name, email, password }) => {
    setAuthLoading(true);
    try {
      const { data } = await registerUser({ name, email, password });
      localStorage.setItem(TOKEN_KEY, data.token);
      setUser(data.user);
      toast.success(`Account created! Welcome, ${data.user.name}! 🎉`);
      return { success: true };
    } catch (err) {
      const message =
        err.response?.data?.message || "Registration failed. Please try again.";
      toast.error(message);
      return { success: false, message };
    } finally {
      setAuthLoading(false);
    }
  };

  // ── Logout ─────────────────────────────────────────────────────────────────
  const logout = () => {
    setUser(null); // useEffect cleans localStorage
    toast.success("Logged out successfully.");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        authLoading,
        login,
        register,
        logout,
        isLoggedIn: !!user,
        isAdmin:    user?.role === "admin",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
