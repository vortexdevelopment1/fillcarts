import api from "../api.js";
import { getProductImage, CATEGORY_IMAGE_MAP, STORE_IMAGE_MAP } from "../utils/productImages.js";
import {
  Carrot, Apple, Milk, Croissant, Pill, UtensilsCrossed, PawPrint, Home,
  Sparkles, Smartphone
} from "lucide-react";

/**
 * Standard list of marketplace categories
 */
export const CATEGORIES = [
  {
    id: "cat-grocery",
    key: "grocery",
    name: "Grocery",
    sub: "Atta, Dal, Oils & Rice",
    count: 420,
    icon: Carrot,
    isPopular: true,
    img: CATEGORY_IMAGE_MAP.grocery,
    aliases: ["grocery", "groceries", "ration", "kirana", "atta", "dal", "oil", "rice", "chawal", "aata", "sugar", "cheeni", "salt", "namak", "poha", "tea", "chai", "spices", "masala", "pulses", "grains", "staples"]
  },
  {
    id: "cat-fruits",
    key: "fruits",
    name: "Fruits & Vegetables",
    sub: "Fresh Daily Farm Produce",
    count: 180,
    icon: Apple,
    isPopular: true,
    img: CATEGORY_IMAGE_MAP.fruits,
    aliases: ["fruits", "vegetables", "veggies", "sabji", "subji", "phala", "fruit", "veg", "banana", "apple", "onion", "pyaaz", "tomato", "tamatar", "potato", "aalu", "grapes", "spinach", "palak", "carrot", "gajar"]
  },
  {
    id: "cat-dairy",
    key: "dairy",
    name: "Dairy",
    sub: "Milk, Paneer & Curd",
    count: 96,
    icon: Milk,
    isPopular: true,
    img: CATEGORY_IMAGE_MAP.dairy,
    aliases: ["dairy", "milk", "doodh", "paneer", "panir", "curd", "dahi", "butter", "makhan", "cheese", "ghee", "yogurt", "buttermilk", "chaas"]
  },
  {
    id: "cat-bakery",
    key: "bakery",
    name: "Bakery",
    sub: "Breads, Buns & Pastries",
    count: 74,
    icon: Croissant,
    isPopular: true,
    img: CATEGORY_IMAGE_MAP.bakery,
    aliases: ["bakery", "bread", "pav", "croissant", "muffin", "cake", "cupcake", "bun", "cookie", "biscuits", "toast", "rusk", "pastry"]
  },
  {
    id: "cat-pharmacy",
    key: "pharmacy",
    name: "Pharmacy",
    sub: "Medicines & Wellness",
    count: 260,
    icon: Pill,
    isPopular: false,
    img: CATEGORY_IMAGE_MAP.pharmacy,
    aliases: ["pharmacy", "medicine", "medicines", "dawa", "tablets", "syrup", "paracetamol", "sanitizer", "mask", "thermometer", "first aid", "health", "wellness"]
  },
  {
    id: "cat-food",
    key: "food",
    name: "Food",
    sub: "Local Kitchens & Snacks",
    count: 340,
    icon: UtensilsCrossed,
    isPopular: false,
    img: CATEGORY_IMAGE_MAP.food,
    aliases: ["food", "snack", "snacks", "nashta", "khana", "burger", "pizza", "biryani", "roll", "dosa", "thali", "chinese", "noodles", "chowmein", "cold coffee", "fast food"]
  },
  {
    id: "cat-pet",
    key: "pet",
    name: "Pet Care",
    sub: "Pet Food & Supplies",
    count: 58,
    icon: PawPrint,
    isPopular: false,
    img: CATEGORY_IMAGE_MAP.pet,
    aliases: ["pet", "pet care", "dog", "kutta", "cat", "billi", "pet food", "litter", "pedigree", "whiskas", "chew toy", "bird seed"]
  },
  {
    id: "cat-home",
    key: "home",
    name: "Home Essentials",
    sub: "Cleaning & Daily Needs",
    count: 132,
    icon: Home,
    isPopular: false,
    img: CATEGORY_IMAGE_MAP.home,
    aliases: ["home", "home essentials", "cleaning", "detergent", "surf", "soap", "dishwash", "phenyl", "broom", "trash bags", "tissue", "harpic", "lizol"]
  },
  {
    id: "cat-personal",
    key: "personal",
    name: "Personal Care",
    sub: "Skincare & Hygiene",
    count: 210,
    icon: Sparkles,
    isPopular: false,
    img: CATEGORY_IMAGE_MAP.personal,
    aliases: ["personal care", "shampoo", "facewash", "face wash", "toothpaste", "brush", "lotion", "cream", "deodorant", "perfume", "razor", "hair oil", "soap", "grooming"]
  },
  {
    id: "cat-electronics",
    key: "electronics",
    name: "Electronics",
    sub: "Cables, Chargers & Gadgets",
    count: 64,
    icon: Smartphone,
    isPopular: false,
    img: CATEGORY_IMAGE_MAP.electronics,
    aliases: ["electronics", "electronic", "gadgets", "charger", "cable", "usb cable", "earphones", "headphones", "power bank", "led bulb", "adapter", "extension", "phone stand"]
  }
];

/**
 * Standard list of verified local stores
 */
export const STORES = [
  {
    id: "store-fresh-mart",
    name: "Fresh Mart Supermarket",
    category: "Groceries & Dairy",
    rating: "4.8",
    reviews: "340+",
    distance: "1.2 km",
    deliveryTime: "20–30 min",
    img: STORE_IMAGE_MAP.freshMart,
    tag: "Popular Store"
  },
  {
    id: "store-daily-needs",
    name: "Daily Needs Express",
    category: "Daily Staples & Household",
    rating: "4.7",
    reviews: "520+",
    distance: "800 m",
    deliveryTime: "15–20 min",
    img: STORE_IMAGE_MAP.dailyNeeds,
    tag: "Fastest Delivery"
  },
  {
    id: "store-city-bakery",
    name: "City Artisan Bakery",
    category: "Fresh Breads & Pastries",
    rating: "4.9",
    reviews: "210+",
    distance: "1.5 km",
    deliveryTime: "25 min",
    img: STORE_IMAGE_MAP.cityBakery,
    tag: "Top Rated"
  },
  {
    id: "store-green-organics",
    name: "Green Leaf Farm Organics",
    category: "Fresh Fruits & Veggies",
    rating: "4.8",
    reviews: "180+",
    distance: "900 m",
    deliveryTime: "15–25 min",
    img: STORE_IMAGE_MAP.greenOrganics,
    tag: "100% Organic"
  }
];

/**
 * Normalizes a raw MongoDB/API product document for consistent UI consumption
 */
export function normalizeProduct(p) {
  if (!p) return null;
  const id = p.productId || p._id || p.id || `prod-${Date.now()}`;
  const categoryKey = p.categoryKey || "grocery";
  const name = p.name || "Grocery Item";
  const price = Number(p.price || 0);
  const mrp = Number(p.mrp || (price > 0 ? Math.round(price * 1.2) : 0));
  const rating = Number(p.rating || 4.8).toFixed(1);
  const discountPercent = mrp > price && mrp > 0 ? Math.round(((mrp - price) / mrp) * 100) : 0;
  const off = discountPercent > 0 ? `${discountPercent}% OFF` : "Best Price";

  return {
    id,
    productId: p.productId || id,
    _id: p._id || id,
    name,
    categoryKey,
    categoryName: p.categoryName || categoryKey.charAt(0).toUpperCase() + categoryKey.slice(1),
    category: p.categoryName || categoryKey.charAt(0).toUpperCase() + categoryKey.slice(1),
    price,
    mrp,
    rating,
    store: p.store || "Fresh Mart",
    brand: p.store || "Fresh Mart",
    tags: Array.isArray(p.tags) ? p.tags : [],
    keywords: Array.isArray(p.keywords) ? p.keywords : [],
    unit: p.unit || "1 Unit",
    inStock: p.inStock !== false,
    countInStock: Number(p.countInStock ?? 50),
    description: p.description || `Fresh, authentic ${name} sourced directly from verified local neighborhood stores.`,
    desc: p.description || `Fresh, authentic ${name} sourced directly from verified local neighborhood stores.`,
    img: p.img || p.image || getProductImage(name, categoryKey),
    image: p.image || p.img || getProductImage(name, categoryKey),
    off,
    discountPercent,
    createdAt: p.createdAt,
    updatedAt: p.updatedAt
  };
}

/**
 * Product Service API integration
 */
export const productService = {
  /**
   * Fetch products with query params (category, search, store, tag, price, sort, pagination)
   */
  async getProducts(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      if (params.category && params.category !== "all") queryParams.append("category", params.category);
      if (params.categoryKey && params.categoryKey !== "all") queryParams.append("categoryKey", params.categoryKey);
      if (params.search) queryParams.append("search", params.search);
      if (params.q) queryParams.append("q", params.q);
      if (params.store && params.store !== "all") queryParams.append("store", params.store);
      if (params.tag) queryParams.append("tag", params.tag);
      if (params.minPrice) queryParams.append("minPrice", params.minPrice);
      if (params.maxPrice) queryParams.append("maxPrice", params.maxPrice);
      if (params.sortBy) queryParams.append("sortBy", params.sortBy);
      if (params.order) queryParams.append("order", params.order);
      if (params.page) queryParams.append("page", params.page);
      if (params.limit) queryParams.append("limit", params.limit);

      const queryString = queryParams.toString();
      const endpoint = `/products${queryString ? `?${queryString}` : ""}`;
      const response = await api.get(endpoint);

      const rawProducts = response.data?.data || response.data?.products || (Array.isArray(response.data) ? response.data : []);
      const normalizedList = rawProducts.map(normalizeProduct);

      return {
        success: true,
        count: normalizedList.length,
        total: response.data?.total ?? normalizedList.length,
        page: response.data?.page ?? 1,
        pages: response.data?.pages ?? 1,
        data: normalizedList
      };
    } catch (error) {
      console.error("productService.getProducts error:", error.message);
      return {
        success: false,
        count: 0,
        total: 0,
        page: 1,
        pages: 1,
        data: [],
        error: error.message
      };
    }
  },

  /**
   * Fetch single product by ID or productId
   */
  async getProductById(id) {
    if (!id) return null;
    try {
      const response = await api.get(`/products/${encodeURIComponent(id)}`);
      const rawProduct = response.data?.data || response.data;
      if (!rawProduct) return null;
      return normalizeProduct(rawProduct);
    } catch (error) {
      console.error(`productService.getProductById(${id}) error:`, error.message);
      return null;
    }
  },

  /**
   * Fetch today's best offer deals
   */
  async getOffers(limit = 6) {
    try {
      const res = await this.getProducts({ limit: 50 });
      if (!res.data || res.data.length === 0) return [];

      // Sort by highest discount percentage
      const sortedOffers = [...res.data]
        .filter((p) => p.mrp > p.price)
        .sort((a, b) => b.discountPercent - a.discountPercent);

      return sortedOffers.slice(0, limit);
    } catch (error) {
      console.error("productService.getOffers error:", error.message);
      return [];
    }
  },

  /**
   * Fetch related products for a given product
   */
  async getRelatedProducts(product, limit = 5) {
    if (!product) return [];
    try {
      const categoryKey = product.categoryKey || "grocery";
      const res = await this.getProducts({ category: categoryKey, limit: 12 });
      const currentId = String(product.id || product.productId || product._id);

      const filtered = res.data.filter((p) => String(p.id) !== currentId);
      if (filtered.length >= limit) {
        return filtered.slice(0, limit);
      }

      // If fewer than limit, fetch general products to fill
      const generalRes = await this.getProducts({ limit: 10 });
      const combined = [
        ...filtered,
        ...generalRes.data.filter((p) => String(p.id) !== currentId && !filtered.some((f) => String(f.id) === String(p.id)))
      ];

      return combined.slice(0, limit);
    } catch (error) {
      console.error("productService.getRelatedProducts error:", error.message);
      return [];
    }
  },

  /**
   * Generate quantity / unit size variants for product details page
   */
  getVariantsForProduct(product) {
    if (!product) return [];

    const nameLower = (product.name || "").toLowerCase();
    const catLower = (product.categoryKey || product.category || "").toLowerCase();
    const price = product.price || 99;
    const mrp = product.mrp || Math.round(price * 1.2);

    const calcOff = (p, m) => {
      if (m > p) {
        const pct = Math.round(((m - p) / m) * 100);
        return `${pct}% OFF`;
      }
      return "Best Value";
    };

    // Liquids & Dairy
    if (
      (catLower.includes("dairy") && (nameLower.includes("milk") || nameLower.includes("chaas") || nameLower.includes("buttermilk") || nameLower.includes("ghee"))) ||
      nameLower.includes("oil") || nameLower.includes("liquid") || nameLower.includes("cleaner") ||
      nameLower.includes("shampoo") || nameLower.includes("syrup") || nameLower.includes("facewash") ||
      nameLower.includes("sanitizer") || nameLower.includes("lotion") || nameLower.includes("1l")
    ) {
      return [
        { size: "500 ml", off: calcOff(Math.round(price * 0.55), Math.round(mrp * 0.55)), price: Math.round(price * 0.55), mrp: Math.round(mrp * 0.55) },
        { size: "1 L", off: calcOff(price, mrp), price: price, mrp: mrp },
        { size: "2 L", off: calcOff(Math.round(price * 1.9), Math.round(mrp * 1.9)), price: Math.round(price * 1.9), mrp: Math.round(mrp * 1.9) },
        { size: "5 L Can", off: calcOff(Math.round(price * 4.5), Math.round(mrp * 4.5)), price: Math.round(price * 4.5), mrp: Math.round(mrp * 4.5) }
      ];
    }

    // Heavy weight items (Atta, Rice, Sugar, Grains)
    if (nameLower.includes("5kg") || nameLower.includes("3kg") || nameLower.includes("rice") || nameLower.includes("atta") || nameLower.includes("dal")) {
      return [
        { size: "1 kg", off: calcOff(Math.round(price * 0.22), Math.round(mrp * 0.22)), price: Math.round(price * 0.22), mrp: Math.round(mrp * 0.22) },
        { size: "2 kg", off: calcOff(Math.round(price * 0.42), Math.round(mrp * 0.42)), price: Math.round(price * 0.42), mrp: Math.round(mrp * 0.42) },
        { size: "5 kg Bag", off: calcOff(price, mrp), price: price, mrp: mrp },
        { size: "10 kg Jumbo Pack", off: calcOff(Math.round(price * 1.9), Math.round(mrp * 1.9)), price: Math.round(price * 1.9), mrp: Math.round(mrp * 1.9) }
      ];
    }

    // Default weight / piece variants
    return [
      { size: "250 g / 1 pc", off: calcOff(Math.max(15, Math.round(price * 0.3)), Math.max(20, Math.round(mrp * 0.3))), price: Math.max(15, Math.round(price * 0.3)), mrp: Math.max(20, Math.round(mrp * 0.3)) },
      { size: "500 g / 2 pcs", off: calcOff(Math.max(30, Math.round(price * 0.55)), Math.max(35, Math.round(mrp * 0.55))), price: Math.max(30, Math.round(price * 0.55)), mrp: Math.max(35, Math.round(mrp * 0.55)) },
      { size: product.unit || "1 kg / Standard Pack", off: calcOff(price, mrp), price: price, mrp: mrp },
      { size: "Family Combo Pack", off: calcOff(Math.round(price * 1.85), Math.round(mrp * 1.85)), price: Math.round(price * 1.85), mrp: Math.round(mrp * 1.85) }
    ];
  }
};

export default productService;
