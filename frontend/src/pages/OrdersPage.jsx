import { Package, Clock, CheckCircle, Truck, MapPin, ChevronRight } from "lucide-react";

const mockOrders = [
  {
    id: "BL2024031501",
    date: "Today, 2:30 PM",
    status: "delivered",
    total: 342,
    items: [
      { name: "Fresh Tomatoes", qty: 2, price: 35, image: "https://images.pexels.com/photos/533280/pexels-photo-533280.jpeg?auto=compress&cs=tinysrgb&w=100" },
      { name: "Amul Butter", qty: 1, price: 55, image: "https://images.pexels.com/photos/531334/pexels-photo-531334.jpeg?auto=compress&cs=tinysrgb&w=100" },
      { name: "Eggs - Farm Fresh", qty: 1, price: 89, image: "https://images.pexels.com/photos/162712/egg-white-food-protein-162712.jpeg?auto=compress&cs=tinysrgb&w=100" },
    ],
    deliveryTime: "8 mins",
    address: "Home - Sector 21, Gurugram"
  },
  {
    id: "BL2024031401",
    date: "Yesterday, 10:15 AM",
    status: "delivered",
    total: 567,
    items: [
      { name: "Lay's Classic Salted", qty: 3, price: 20, image: "https://images.pexels.com/photos/1893556/pexels-photo-1893556.jpeg?auto=compress&cs=tinysrgb&w=100" },
      { name: "Coca-Cola", qty: 2, price: 45, image: "https://images.pexels.com/photos/3727250/pexels-photo-3727250.jpeg?auto=compress&cs=tinysrgb&w=100" },
      { name: "Nescafe Classic", qty: 1, price: 149, image: "https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg?auto=compress&cs=tinysrgb&w=100" },
    ],
    deliveryTime: "11 mins",
    address: "Home - Sector 21, Gurugram"
  },
  {
    id: "BL2024031201",
    date: "15 Mar, 8:00 PM",
    status: "delivered",
    total: 812,
    items: [
      { name: "Aashirvaad Atta", qty: 1, price: 289, image: "https://images.pexels.com/photos/4110251/pexels-photo-4110251.jpeg?auto=compress&cs=tinysrgb&w=100" },
      { name: "Apples - Shimla", qty: 2, price: 149, image: "https://images.pexels.com/photos/1510392/pexels-photo-1510392.jpeg?auto=compress&cs=tinysrgb&w=100" },
    ],
    deliveryTime: "9 mins",
    address: "Home - Sector 21, Gurugram"
  },
];

const statusConfig = {
  delivered: { label: "Delivered", color: "text-green-600 bg-green-50 border-green-100", icon: <CheckCircle size={14} /> },
  out_for_delivery: { label: "Out for Delivery", color: "text-blue-600 bg-blue-50 border-blue-100", icon: <Truck size={14} /> },
  processing: { label: "Processing", color: "text-yellow-600 bg-yellow-50 border-yellow-100", icon: <Clock size={14} /> },
};

export default function OrdersPage({ onNavigate }) {
  return (
    <div className="pb-24 lg:pb-8 px-4 lg:px-0 pt-4">
      <h1 className="font-black text-2xl text-gray-900 mb-6">My Orders</h1>

      {mockOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
            <Package size={36} className="text-gray-400" />
          </div>
          <p className="font-bold text-gray-700">No orders yet</p>
          <p className="text-sm text-gray-400">Your order history will appear here</p>
          <button onClick={() => onNavigate("home")} className="bg-green-500 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-green-600 transition-colors">
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {mockOrders.map(order => {
            const status = statusConfig[order.status] || statusConfig.delivered;
            return (
              <div key={order.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between p-4 border-b border-gray-50">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-gray-400">#{order.id}</span>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full border flex items-center gap-1 ${status.color}`}>
                        {status.icon}
                        {status.label}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-0.5">{order.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-gray-900">₹{order.total}</p>
                    <p className="text-xs text-gray-400">{order.deliveryTime} delivery</p>
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    {order.items.map((item, i) => (
                      <img key={i} src={item.image} alt={item.name} className="w-10 h-10 rounded-lg object-cover bg-gray-100" />
                    ))}
                    <div className="text-sm text-gray-600 ml-1">
                      <p className="font-semibold">{order.items[0].name} {order.items.length > 1 ? `+${order.items.length - 1} more` : ""}</p>
                      <div className="flex items-center gap-1 text-xs text-gray-400">
                        <MapPin size={11} />
                        <span>{order.address}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => onNavigate("home")}
                      className="flex-1 bg-green-500 text-white py-2.5 rounded-xl font-bold text-sm hover:bg-green-600 transition-colors"
                    >
                      Reorder
                    </button>
                    <button className="flex items-center gap-1 text-sm text-gray-600 border border-gray-200 px-4 py-2.5 rounded-xl font-semibold hover:bg-gray-50 transition-colors">
                      Details <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
