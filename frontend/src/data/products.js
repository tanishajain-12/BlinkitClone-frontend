export const categories = [
  { id: "vegetables-fruits", name: "Vegetables & Fruits", icon: "🥦", color: "bg-green-50", image: "https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg?auto=compress&cs=tinysrgb&w=200" },
  { id: "dairy-breakfast", name: "Dairy & Breakfast", icon: "🥛", color: "bg-yellow-50", image: "https://images.pexels.com/photos/248412/pexels-photo-248412.jpeg?auto=compress&cs=tinysrgb&w=200" },
  { id: "munchies", name: "Munchies", icon: "🍿", color: "bg-orange-50", image: "https://images.pexels.com/photos/1893556/pexels-photo-1893556.jpeg?auto=compress&cs=tinysrgb&w=200" },
  { id: "cold-drinks", name: "Cold Drinks & Juices", icon: "🥤", color: "bg-blue-50", image: "https://images.pexels.com/photos/3727250/pexels-photo-3727250.jpeg?auto=compress&cs=tinysrgb&w=200" },
  { id: "instant-food", name: "Instant & Frozen Food", icon: "🍜", color: "bg-red-50", image: "https://images.pexels.com/photos/2347311/pexels-photo-2347311.jpeg?auto=compress&cs=tinysrgb&w=200" },
  { id: "tea-coffee", name: "Tea, Coffee & More", icon: "☕", color: "bg-amber-50", image: "https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg?auto=compress&cs=tinysrgb&w=200" },
  { id: "bakery", name: "Bakery & Biscuits", icon: "🍞", color: "bg-pink-50", image: "https://images.pexels.com/photos/1775043/pexels-photo-1775043.jpeg?auto=compress&cs=tinysrgb&w=200" },
  { id: "sweet-tooth", name: "Sweet Tooth", icon: "🍫", color: "bg-rose-50", image: "https://images.pexels.com/photos/918327/pexels-photo-918327.jpeg?auto=compress&cs=tinysrgb&w=200" },
  { id: "atta-rice", name: "Atta, Rice & Dal", icon: "🌾", color: "bg-lime-50", image: "https://images.pexels.com/photos/4110251/pexels-photo-4110251.jpeg?auto=compress&cs=tinysrgb&w=200" },
  { id: "personal-care", name: "Personal Care", icon: "🧴", color: "bg-teal-50", image: "https://images.pexels.com/photos/3735657/pexels-photo-3735657.jpeg?auto=compress&cs=tinysrgb&w=200" },
  { id: "cleaning", name: "Cleaning Essentials", icon: "🧹", color: "bg-cyan-50", image: "https://images.pexels.com/photos/4239037/pexels-photo-4239037.jpeg?auto=compress&cs=tinysrgb&w=200" },
  { id: "baby-care", name: "Baby Care", icon: "👶", color: "bg-purple-50", image: "https://images.pexels.com/photos/35537/child-children-girl-happy.jpg?auto=compress&cs=tinysrgb&w=200" },
];

export const products = [
  {
    id: 1, name: "Fresh Tomatoes", category: "vegetables-fruits", subcategory: "Vegetables",
    price: 35, mrp: 45, unit: "500g", deliveryTime: "10 mins",
    image: "https://images.pexels.com/photos/533280/pexels-photo-533280.jpeg?auto=compress&cs=tinysrgb&w=400",
    badge: "BESTSELLER", inStock: true, rating: 4.3, reviews: 1240,
    description: "Fresh, ripe tomatoes sourced directly from farms. Perfect for curries, salads, and everyday cooking."
  },
  {
    id: 2, name: "Baby Spinach", category: "vegetables-fruits", subcategory: "Vegetables",
    price: 49, mrp: 60, unit: "200g", deliveryTime: "10 mins",
    image: "https://images.pexels.com/photos/2325843/pexels-photo-2325843.jpeg?auto=compress&cs=tinysrgb&w=400",
    badge: "FRESH", inStock: true, rating: 4.5, reviews: 890,
    description: "Tender baby spinach leaves, washed and ready to eat. Rich in iron and vitamins."
  },
  {
    id: 3, name: "Bananas", category: "vegetables-fruits", subcategory: "Fruits",
    price: 55, mrp: 65, unit: "6 pcs", deliveryTime: "10 mins",
    image: "https://images.pexels.com/photos/1093038/pexels-photo-1093038.jpeg?auto=compress&cs=tinysrgb&w=400",
    inStock: true, rating: 4.2, reviews: 2100,
    description: "Perfectly ripened bananas. A great source of potassium and natural energy."
  },
  {
    id: 4, name: "Onions", category: "vegetables-fruits", subcategory: "Vegetables",
    price: 39, mrp: 50, unit: "1 kg", deliveryTime: "10 mins",
    image: "https://images.pexels.com/photos/4110251/pexels-photo-4110251.jpeg?auto=compress&cs=tinysrgb&w=400",
    inStock: true, rating: 4.4, reviews: 3200,
    description: "Fresh red onions, a kitchen staple for all your cooking needs."
  },
  {
    id: 5, name: "Apples - Shimla", category: "vegetables-fruits", subcategory: "Fruits",
    price: 149, mrp: 179, unit: "4 pcs", deliveryTime: "10 mins",
    image: "https://images.pexels.com/photos/1510392/pexels-photo-1510392.jpeg?auto=compress&cs=tinysrgb&w=400",
    badge: "PREMIUM", inStock: true, rating: 4.6, reviews: 1870,
    description: "Sweet and crisp Shimla apples. Handpicked from the orchards of Himachal Pradesh."
  },
  {
    id: 6, name: "Potatoes", category: "vegetables-fruits", subcategory: "Vegetables",
    price: 45, mrp: 55, unit: "1 kg", deliveryTime: "10 mins",
    image: "https://images.pexels.com/photos/144248/potatoes-vegetables-erdfrucht-bio-144248.jpeg?auto=compress&cs=tinysrgb&w=400",
    inStock: true, rating: 4.1, reviews: 4200,
    description: "Farm-fresh potatoes. Versatile and perfect for all your recipes."
  },
  {
    id: 7, name: "Amul Taaza Milk", category: "dairy-breakfast", subcategory: "Milk",
    price: 28, mrp: 28, unit: "500 ml", deliveryTime: "10 mins",
    image: "https://images.pexels.com/photos/248412/pexels-photo-248412.jpeg?auto=compress&cs=tinysrgb&w=400",
    badge: "DAILY ESSENTIAL", inStock: true, rating: 4.7, reviews: 5600,
    description: "Amul Taaza Toned Milk. Pasteurized, homogenized milk for your daily needs."
  },
  {
    id: 8, name: "Greek Yogurt", category: "dairy-breakfast", subcategory: "Curd & Yogurt",
    price: 99, mrp: 120, unit: "400g", deliveryTime: "10 mins",
    image: "https://images.pexels.com/photos/1435735/pexels-photo-1435735.jpeg?auto=compress&cs=tinysrgb&w=400",
    badge: "HIGH PROTEIN", inStock: true, rating: 4.5, reviews: 980,
    description: "Thick and creamy Greek yogurt, rich in protein. Perfect for breakfast or snacking."
  },
  {
    id: 9, name: "Eggs - Farm Fresh", category: "dairy-breakfast", subcategory: "Eggs",
    price: 89, mrp: 99, unit: "12 pcs", deliveryTime: "10 mins",
    image: "https://images.pexels.com/photos/162712/egg-white-food-protein-162712.jpeg?auto=compress&cs=tinysrgb&w=400",
    inStock: true, rating: 4.6, reviews: 3400,
    description: "Farm-fresh white eggs. Protein-rich and perfect for your morning breakfast."
  },
  {
    id: 10, name: "Amul Butter", category: "dairy-breakfast", subcategory: "Butter & More",
    price: 55, mrp: 60, unit: "100g", deliveryTime: "10 mins",
    image: "https://images.pexels.com/photos/531334/pexels-photo-531334.jpeg?auto=compress&cs=tinysrgb&w=400",
    badge: "BESTSELLER", inStock: true, rating: 4.8, reviews: 6700,
    description: "Amul Pasteurised Butter. The iconic taste of India's most loved butter brand."
  },
  {
    id: 11, name: "Lay's Classic Salted", category: "munchies", subcategory: "Chips & Crisps",
    price: 20, mrp: 20, unit: "73g", deliveryTime: "10 mins",
    image: "https://images.pexels.com/photos/1893556/pexels-photo-1893556.jpeg?auto=compress&cs=tinysrgb&w=400",
    badge: "BESTSELLER", inStock: true, rating: 4.4, reviews: 8900,
    description: "Lay's classic salted potato chips. The irresistible crunch you love."
  },
  {
    id: 12, name: "Kurkure Masala Munch", category: "munchies", subcategory: "Namkeen & Bhujia",
    price: 20, mrp: 20, unit: "90g", deliveryTime: "10 mins",
    image: "https://images.pexels.com/photos/2228553/pexels-photo-2228553.jpeg?auto=compress&cs=tinysrgb&w=400",
    inStock: true, rating: 4.3, reviews: 5400,
    description: "Kurkure Masala Munch - the classic Indian snack with a fiery masala twist."
  },
  {
    id: 13, name: "Maggi Masala Noodles", category: "instant-food", subcategory: "Noodles",
    price: 14, mrp: 14, unit: "70g", deliveryTime: "10 mins",
    image: "https://images.pexels.com/photos/2347311/pexels-photo-2347311.jpeg?auto=compress&cs=tinysrgb&w=400",
    badge: "FAMILY FAVOURITE", inStock: true, rating: 4.6, reviews: 12400,
    description: "2-Minute Maggi Masala Noodles. A quick meal that's loved by millions."
  },
  {
    id: 14, name: "Nutella", category: "sweet-tooth", subcategory: "Spreads",
    price: 179, mrp: 205, unit: "200g", deliveryTime: "10 mins",
    image: "https://images.pexels.com/photos/918327/pexels-photo-918327.jpeg?auto=compress&cs=tinysrgb&w=400",
    badge: "LOVED", inStock: true, rating: 4.7, reviews: 7800,
    description: "Ferrero Nutella chocolate hazelnut spread. A delicious start to every morning."
  },
  {
    id: 15, name: "Coca-Cola", category: "cold-drinks", subcategory: "Carbonated Drinks",
    price: 45, mrp: 50, unit: "750 ml", deliveryTime: "10 mins",
    image: "https://images.pexels.com/photos/3727250/pexels-photo-3727250.jpeg?auto=compress&cs=tinysrgb&w=400",
    badge: "REFRESHING", inStock: true, rating: 4.5, reviews: 9800,
    description: "The original Coca-Cola. Experience the classic taste that refreshes."
  },
  {
    id: 16, name: "Nescafe Classic", category: "tea-coffee", subcategory: "Coffee",
    price: 149, mrp: 175, unit: "50g", deliveryTime: "10 mins",
    image: "https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg?auto=compress&cs=tinysrgb&w=400",
    badge: "BESTSELLER", inStock: true, rating: 4.6, reviews: 4300,
    description: "Nescafe Classic Instant Coffee. Wake up to the bold and rich taste of real coffee."
  },
  {
    id: 17, name: "Britannia Good Day", category: "bakery", subcategory: "Biscuits",
    price: 30, mrp: 35, unit: "150g", deliveryTime: "10 mins",
    image: "https://images.pexels.com/photos/1775043/pexels-photo-1775043.jpeg?auto=compress&cs=tinysrgb&w=400",
    inStock: true, rating: 4.4, reviews: 3200,
    description: "Britannia Good Day Butter Cookies. Rich buttery flavour in every bite."
  },
  {
    id: 18, name: "Dove Body Wash", category: "personal-care", subcategory: "Body Wash",
    price: 199, mrp: 235, unit: "190 ml", deliveryTime: "10 mins",
    image: "https://images.pexels.com/photos/3735657/pexels-photo-3735657.jpeg?auto=compress&cs=tinysrgb&w=400",
    badge: "NEW", inStock: true, rating: 4.5, reviews: 2100,
    description: "Dove Deeply Nourishing Body Wash. Leaves skin feeling soft and smooth."
  },
  {
    id: 19, name: "Aashirvaad Atta", category: "atta-rice", subcategory: "Atta & Flour",
    price: 289, mrp: 325, unit: "5 kg", deliveryTime: "10 mins",
    image: "https://images.pexels.com/photos/4110251/pexels-photo-4110251.jpeg?auto=compress&cs=tinysrgb&w=400",
    badge: "VALUE PACK", inStock: true, rating: 4.7, reviews: 5600,
    description: "Aashirvaad Superior MP Atta. Made from 100% whole wheat for wholesome rotis."
  },
  {
    id: 20, name: "Pampers Baby Diapers", category: "baby-care", subcategory: "Diapers",
    price: 349, mrp: 420, unit: "20 pcs", deliveryTime: "10 mins",
    image: "https://images.pexels.com/photos/35537/child-children-girl-happy.jpg?auto=compress&cs=tinysrgb&w=400",
    badge: "TRUSTED", inStock: true, rating: 4.6, reviews: 3400,
    description: "Pampers Active Baby Diapers. Up to 12 hours of dryness protection for your baby."
  },
];

export const banners = [
  {
    id: 1,
    title: "Fresh Vegetables",
    subtitle: "Farm to doorstep in 10 minutes",
    cta: "Order Now",
    image: "https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg?auto=compress&cs=tinysrgb&w=1200",
    color: "from-green-600 to-green-400",
    category: "vegetables-fruits"
  },
  {
    id: 2,
    title: "Daily Dairy",
    subtitle: "Fresh milk & dairy products every morning",
    cta: "Shop Dairy",
    image: "https://images.pexels.com/photos/248412/pexels-photo-248412.jpeg?auto=compress&cs=tinysrgb&w=1200",
    color: "from-yellow-500 to-amber-400",
    category: "dairy-breakfast"
  },
  {
    id: 3,
    title: "Midnight Cravings?",
    subtitle: "Snacks delivered in 10 mins, anytime",
    cta: "Grab Snacks",
    image: "https://images.pexels.com/photos/1893556/pexels-photo-1893556.jpeg?auto=compress&cs=tinysrgb&w=1200",
    color: "from-orange-600 to-red-500",
    category: "munchies"
  }
];
