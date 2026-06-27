import { User, MapPin, Package, Heart, CreditCard, Bell, HelpCircle, LogOut, ChevronRight, Edit2, Star } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function ProfilePage({ onNavigate }) {
  const { user, logout } = useAuth();

  const menuSections = [
    {
      title: "My Account",
      items: [
        { icon: <Package size={18} />, label: "My Orders", count: "3", page: "orders" },
        { icon: <MapPin size={18} />, label: "Saved Addresses", count: "2" },
        { icon: <Heart size={18} />, label: "Wishlist", count: "7" },
        { icon: <CreditCard size={18} />, label: "Payment Methods" },
      ]
    },
    {
      title: "Offers & Savings",
      items: [
        { icon: <span className="text-base font-bold">%</span>, label: "Coupons & Offers" },
        { icon: <Star size={18} />, label: "Blinkit Credits", count: "₹50" },
      ]
    },
    {
      title: "Support",
      items: [
        { icon: <Bell size={18} />, label: "Notifications" },
        { icon: <HelpCircle size={18} />, label: "Help & Support" },
      ]
    }
  ];

  const handleLogout = () => {
    logout();
    onNavigate("home");
  };

  return (
    <div className="pb-24 lg:pb-8 px-4 lg:px-0 pt-4">
      {/* Profile Header */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-6 mb-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-yellow-400/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="relative flex items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-400 flex items-center justify-center shadow-lg">
              <User size={28} className="text-white" />
            </div>
            <button className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-50 transition-colors">
              <Edit2 size={11} className="text-gray-700" />
            </button>
          </div>
          <div>
            <h2 className="text-white font-black text-lg">{user?.name || "Guest User"}</h2>
            <p className="text-gray-400 text-sm">+91 98765 43210</p>
            <p className="text-gray-400 text-xs">{user?.email || ""}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mt-5">
          {[
            { label: "Orders", value: "12" },
            { label: "Saved", value: "₹850" },
            { label: "Points", value: "240" },
          ].map(stat => (
            <div key={stat.label} className="bg-white/10 rounded-xl p-3 text-center">
              <p className="text-white font-black text-lg">{stat.value}</p>
              <p className="text-gray-400 text-xs">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Blinkit Pass */}
      <div className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-2xl p-4 mb-6 flex items-center gap-4">
        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
          <span className="text-2xl">⚡</span>
        </div>
        <div className="flex-1">
          <p className="font-black text-gray-900">Blinkit Pass</p>
          <p className="text-sm text-gray-800 opacity-80">Free delivery on every order</p>
        </div>
        <button className="bg-gray-900 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-gray-800 transition-colors shrink-0">
          Activate
        </button>
      </div>

      {/* Menu Sections */}
      {menuSections.map(section => (
        <div key={section.title} className="mb-4">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-1">{section.title}</h3>
          <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-50">
            {section.items.map(item => (
              <button
                key={item.label}
                onClick={() => item.page && onNavigate(item.page)}
                className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 transition-colors first:rounded-t-2xl last:rounded-b-2xl"
              >
                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600">
                  {item.icon}
                </div>
                <span className="flex-1 text-left text-sm font-semibold text-gray-800">{item.label}</span>
                {item.count && (
                  <span className="text-xs bg-green-100 text-green-700 font-bold px-2 py-0.5 rounded-full">{item.count}</span>
                )}
                <ChevronRight size={16} className="text-gray-400" />
              </button>
            ))}
          </div>
        </div>
      ))}

      {/* Logout */}
      <div className="bg-white rounded-2xl border border-gray-100 mb-6">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-red-50 transition-colors rounded-2xl group"
        >
          <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
            <LogOut size={16} className="text-red-500" />
          </div>
          <span className="text-sm font-semibold text-red-500">Log Out</span>
        </button>
      </div>

      <p className="text-center text-xs text-gray-400">Version 2.4.1 · blinkit</p>
    </div>
  );
}
