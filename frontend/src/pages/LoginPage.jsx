import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Eye, EyeOff, Zap, X } from "lucide-react";

export default function LoginPage({ onNavigate }) {
  const { login } = useAuth();
  const [mode, setMode] = useState("login"); // "login" | "signup"
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!form.email || !form.password) {
      setError("Please fill in all fields.");
      return;
    }
    if (mode === "signup" && !form.name) {
      setError("Please enter your name.");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      login({
        name: mode === "signup" ? form.name : form.email.split("@")[0],
        email: form.email,
      });
      setLoading(false);
      onNavigate("home");
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          {/* Top banner */}
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 px-8 py-8 relative overflow-hidden">
            <div className="absolute -top-8 -right-8 w-32 h-32 bg-yellow-400/20 rounded-full" />
            <div className="absolute bottom-0 left-0 w-20 h-20 bg-green-500/10 rounded-full translate-y-1/2 -translate-x-1/2" />
            <div className="relative">
              <button
                onClick={() => onNavigate("home")}
                className="flex items-center gap-1.5 mb-5"
              >
                <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center">
                  <span className="text-gray-900 font-black text-lg leading-none">b</span>
                </div>
                <span className="text-white font-black text-xl">blinkit</span>
              </button>
              <h1 className="text-2xl font-black text-white">
                {mode === "login" ? "Welcome back!" : "Create account"}
              </h1>
              <p className="text-gray-400 text-sm mt-1 flex items-center gap-1.5">
                <Zap size={13} className="text-yellow-400" />
                Groceries delivered in 10 minutes
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="px-8 py-6">
            {/* Toggle */}
            <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
              {["login", "signup"].map(m => (
                <button
                  key={m}
                  onClick={() => { setMode(m); setError(""); }}
                  className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${mode === m ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                >
                  {m === "login" ? "Log In" : "Sign Up"}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === "signup" && (
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Min. 6 characters"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 pr-11 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-100 text-red-600 text-sm px-3 py-2.5 rounded-xl">
                  <X size={14} className="shrink-0" />
                  {error}
                </div>
              )}

              {mode === "login" && (
                <div className="text-right">
                  <button type="button" className="text-xs text-green-600 font-semibold hover:underline">
                    Forgot password?
                  </button>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-500 text-white py-3.5 rounded-xl font-black text-base hover:bg-green-600 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-green-200 mt-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    {mode === "login" ? "Logging in..." : "Creating account..."}
                  </>
                ) : (
                  mode === "login" ? "Log In" : "Create Account"
                )}
              </button>
            </form>

            <p className="text-xs text-gray-400 text-center mt-5 leading-relaxed">
              By continuing, you agree to blinkit's{" "}
              <button className="text-gray-600 font-semibold hover:underline">Terms of Service</button>
              {" & "}
              <button className="text-gray-600 font-semibold hover:underline">Privacy Policy</button>
            </p>
          </div>
        </div>

        <button
          onClick={() => onNavigate("home")}
          className="mt-4 w-full text-center text-sm text-gray-500 hover:text-gray-700 transition-colors font-medium"
        >
          Continue browsing without login
        </button>
      </div>
    </div>
  );
}
