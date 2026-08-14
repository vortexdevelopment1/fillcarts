import { CATEGORY_IMAGE_MAP, STORE_IMAGE_MAP, getProductImage } from "./productImages";

export const CATEGORIES = [
  {
    id: "cat-grocery",
    key: "grocery",
    name: "Grocery",
    sub: "Atta, Dal, Oils & Rice",
    count: 420,
    isPopular: true,
    img: CATEGORY_IMAGE_MAP.grocery,
    aliases: [
      "grocery", "groceries", "ration", "kirana", "atta", "dal", "oil", "rice",
      "chawal", "aata", "sugar", "cheeni", "salt", "namak", "poha", "tea", "chai",
      "spices", "masala", "pulses", "grains", "staples", "grosery", "grocry"
    ]
  },
  {
    id: "cat-fruits",
    key: "fruits",
    name: "Fruits & Vegetables",
    sub: "Fresh Daily Farm Produce",
    count: 180,
    isPopular: true,
    img: CATEGORY_IMAGE_MAP.fruits,
    aliases: [
      "fruits", "vegetables", "veggies", "sabji", "subji", "phala", "fruit", "veg",
      "banana", "apple", "onion", "pyaaz", "tomato", "tamatar", "potato", "aalu",
      "alo", "grapes", "spinach", "palak", "carrot", "gajar", "fresh produce",
      "vegitables", "fruts", "vagetables", "vegitable", "tomamto"
    ]
  },
  {
    id: "cat-dairy",
    key: "dairy",
    name: "Dairy",
    sub: "Milk, Paneer & Curd",
    count: 96,
    isPopular: true,
    img: CATEGORY_IMAGE_MAP.dairy,
    aliases: [
      "dairy", "milk", "doodh", "paneer", "panir", "curd", "dahi", "butter", "makhan",
      "cheese", "ghee", "yogurt", "buttermilk", "chaas", "khoya", "dary", "milck"
    ]
  },
  {
    id: "cat-bakery",
    key: "bakery",
    name: "Bakery",
    sub: "Breads, Buns & Pastries",
    count: 74,
    isPopular: true,
    img: CATEGORY_IMAGE_MAP.bakery,
    aliases: [
      "bakery", "bread", "pav", "croissant", "muffin", "cake", "cupcake", "bun",
      "cookie", "biscuits", "toast", "rusk", "pastry", "bakry", "bakt", "biscuit"
    ]
  },
  {
    id: "cat-pharmacy",
    key: "pharmacy",
    name: "Pharmacy",
    sub: "Medicines & Wellness",
    count: 260,
    isPopular: false,
    img: CATEGORY_IMAGE_MAP.pharmacy,
    aliases: [
      "pharmacy", "medicine", "medicines", "dawa", "dawaya", "tablets", "syrup",
      "paracetamol", "sanitizer", "mask", "thermometer", "first aid", "health",
      "wellness", "farmacy", "medcine", "pharma"
    ]
  },
  {
    id: "cat-food",
    key: "food",
    name: "Food",
    sub: "Local Kitchens & Snacks",
    count: 340,
    isPopular: false,
    img: CATEGORY_IMAGE_MAP.food,
    aliases: [
      "food", "snack", "snacks", "nashta", "khana", "burger", "pizza", "biryani",
      "roll", "dosa", "thali", "chinese", "noodles", "chowmein", "cold coffee",
      "fast food", "restaurant", "foode", "piza"
    ]
  },
  {
    id: "cat-pet",
    key: "pet",
    name: "Pet Care",
    sub: "Pet Food & Supplies",
    count: 58,
    isPopular: false,
    img: CATEGORY_IMAGE_MAP.pet,
    aliases: [
      "pet", "pet care", "dog", "kutta", "cat", "billi", "pet food", "litter",
      "pedigree", "whiskas", "chew toy", "bird seed", "puppy", "pete"
    ]
  },
  {
    id: "cat-home",
    key: "home",
    name: "Home Essentials",
    sub: "Cleaning & Daily Needs",
    count: 132,
    isPopular: false,
    img: CATEGORY_IMAGE_MAP.home,
    aliases: [
      "home", "home essentials", "cleaning", "detergent", "surf", "soap",
      "dishwash", "phenyl", "broom", "trash bags", "tissue", "harpic", "lizol",
      "household", "hom"
    ]
  },
  {
    id: "cat-personal",
    key: "personal",
    name: "Personal Care",
    sub: "Skincare & Hygiene",
    count: 210,
    isPopular: false,
    img: CATEGORY_IMAGE_MAP.personal,
    aliases: [
      "personal care", "shampoo", "facewash", "face wash", "toothpaste", "brush",
      "lotion", "cream", "deodorant", "perfume", "razor", "hair oil", "soap",
      "grooming", "skin care"
    ]
  },
  {
    id: "cat-electronics",
    key: "electronics",
    name: "Electronics",
    sub: "Cables, Chargers & Gadgets",
    count: 64,
    isPopular: false,
    img: CATEGORY_IMAGE_MAP.electronics,
    aliases: [
      "electronics", "electronic", "gadgets", "charger", "cable", "usb cable",
      "earphones", "headphones", "power bank", "led bulb", "adapter", "extension",
      "phone stand", "elctronics", "electromics", "gadget", "iphne", "mobile"
    ]
  }
];

export const PRODUCTS = [
  // Grocery
  { id: "grocery-0", name: "Fortune Royal Basmati Rice 5kg", categoryKey: "grocery", categoryName: "Grocery", price: 349, mrp: 420, rating: 4.8, store: "Fresh Mart", tags: ["bestseller", "staple"], keywords: ["rice", "basmati", "chawal", "rce", "basmat"] },
  { id: "grocery-1", name: "Tata Sampann Toor Dal 1kg", categoryKey: "grocery", categoryName: "Grocery", price: 159, mrp: 185, rating: 4.7, store: "Daily Needs Express", tags: ["protein"], keywords: ["dal", "toor", "arhar", "pulses"] },
  { id: "grocery-2", name: "Fortune Refined Sunflower Oil 1L", categoryKey: "grocery", categoryName: "Grocery", price: 135, mrp: 160, rating: 4.6, store: "Fresh Mart", tags: ["oil"], keywords: ["oil", "tel", "cooking oil", "sunflower"] },
  { id: "grocery-3", name: "Madhur Pure Sugar 1kg", categoryKey: "grocery", categoryName: "Grocery", price: 48, mrp: 55, rating: 4.5, store: "Daily Needs Express", tags: ["sweet"], keywords: ["sugar", "cheeni", "shakkar", "sugr"] },
  { id: "grocery-4", name: "Aashirvaad Shuddh Chakki Atta 5kg", categoryKey: "grocery", categoryName: "Grocery", price: 235, mrp: 270, rating: 4.9, store: "Fresh Mart", tags: ["bestseller"], keywords: ["atta", "aata", "wheat", "flour", "chapti"] },
  { id: "grocery-5", name: "Tata Salt Vacuum Evaporated 1kg", categoryKey: "grocery", categoryName: "Grocery", price: 28, mrp: 30, rating: 4.8, store: "Daily Needs Express", tags: ["essential"], keywords: ["salt", "namak", "tata salt"] },
  { id: "grocery-6", name: "Red Label Strong Tea Leaves 250g", categoryKey: "grocery", categoryName: "Grocery", price: 140, mrp: 160, rating: 4.7, store: "Fresh Mart", tags: ["chai"], keywords: ["tea", "chai", "chaipatti", "red label"] },
  { id: "grocery-7", name: "Thick Poha Flattened Rice 500g", categoryKey: "grocery", categoryName: "Grocery", price: 42, mrp: 52, rating: 4.6, store: "Daily Needs Express", tags: ["breakfast"], keywords: ["poha", "pohe", "chiwda", "chira"] },

  // Fruits & Vegetables
  { id: "fruits-0", name: "Farm Fresh Bananas (Robusta) 1 dozen", categoryKey: "fruits", categoryName: "Fruits & Vegetables", price: 58, mrp: 70, rating: 4.8, store: "Green Leaf Organics", tags: ["fresh", "fruit"], keywords: ["banana", "bananas", "kela", "bnana", "bana"] },
  { id: "fruits-1", name: "Crispy Red Washington Apples 1kg", categoryKey: "fruits", categoryName: "Fruits & Vegetables", price: 189, mrp: 220, rating: 4.9, store: "Green Leaf Organics", tags: ["fresh", "imported"], keywords: ["apple", "apples", "seb", "aple", "apple"] },
  { id: "fruits-2", name: "Fresh Red Onions 1kg", categoryKey: "fruits", categoryName: "Fruits & Vegetables", price: 32, mrp: 45, rating: 4.5, store: "Fresh Mart", tags: ["veggie"], keywords: ["onion", "onions", "pyaaz", "pyaj", "onin"] },
  { id: "fruits-3", name: "Ripe Local Tomatoes 1kg", categoryKey: "fruits", categoryName: "Fruits & Vegetables", price: 28, mrp: 40, rating: 4.6, store: "Green Leaf Organics", tags: ["veggie"], keywords: ["tomato", "tomatoes", "tamatar", "tomamto", "tomto", "tomat", "tomatos", "tamator"] },
  { id: "fruits-4", name: "Organic Potatoes (Aalu) 1kg", categoryKey: "fruits", categoryName: "Fruits & Vegetables", price: 26, mrp: 35, rating: 4.7, store: "Fresh Mart", tags: ["veggie"], keywords: ["potato", "potatoes", "aalu", "alo", "patato", "potatos"] },
  { id: "fruits-5", name: "Seedless Green Grapes 500g", categoryKey: "fruits", categoryName: "Fruits & Vegetables", price: 95, mrp: 120, rating: 4.8, store: "Green Leaf Organics", tags: ["fruit"], keywords: ["grapes", "angoor", "grape"] },
  { id: "fruits-6", name: "Fresh Green Spinach Bunch (Palak)", categoryKey: "fruits", categoryName: "Fruits & Vegetables", price: 24, mrp: 30, rating: 4.6, store: "Green Leaf Organics", tags: ["leafy"], keywords: ["spinach", "palak", "green veggie"] },
  { id: "fruits-7", name: "Crunchy Carrots (Gajar) 500g", categoryKey: "fruits", categoryName: "Fruits & Vegetables", price: 38, mrp: 50, rating: 4.7, store: "Fresh Mart", tags: ["veggie"], keywords: ["carrot", "carrots", "gajar", "gajr"] },

  // Dairy
  { id: "dairy-0", name: "Amul Taaza Toned Fresh Milk 1L", categoryKey: "dairy", categoryName: "Dairy", price: 54, mrp: 56, rating: 4.9, store: "Fresh Mart", tags: ["daily"], keywords: ["milk", "doodh", "dudh", "milck", "amul milk"] },
  { id: "dairy-1", name: "Mother Dairy Fresh Curd (Dahi) 400g", categoryKey: "dairy", categoryName: "Dairy", price: 35, mrp: 40, rating: 4.8, store: "Daily Needs Express", tags: ["curd"], keywords: ["curd", "dahi", "yoghurt", "yogurt", "crd"] },
  { id: "dairy-2", name: "Amul Fresh Soft Paneer 200g", categoryKey: "dairy", categoryName: "Dairy", price: 92, mrp: 105, rating: 4.9, store: "Fresh Mart", tags: ["protein"], keywords: ["paneer", "panir", "pner", "cottage cheese"] },
  { id: "dairy-3", name: "Amul Salted Butter 100g", categoryKey: "dairy", categoryName: "Dairy", price: 58, mrp: 62, rating: 4.9, store: "Daily Needs Express", tags: ["butter"], keywords: ["butter", "makhan", "amul butter"] },
  { id: "dairy-4", name: "Processed Cheese Slices 200g (10 Slices)", categoryKey: "dairy", categoryName: "Dairy", price: 145, mrp: 165, rating: 4.7, store: "Fresh Mart", tags: ["cheese"], keywords: ["cheese", "chese", "cheese slice"] },
  { id: "dairy-5", name: "Pure Cow Desi Ghee 500ml", categoryKey: "dairy", categoryName: "Dairy", price: 385, mrp: 430, rating: 4.9, store: "Fresh Mart", tags: ["ghee"], keywords: ["ghee", "ghi", "desi ghee", "cow ghee"] },
  { id: "dairy-6", name: "Spiced Masala Buttermilk (Chaas) 200ml", categoryKey: "dairy", categoryName: "Dairy", price: 15, mrp: 18, rating: 4.6, store: "Daily Needs Express", tags: ["drink"], keywords: ["buttermilk", "chaas", "chach", "masala chaas"] },

  // Bakery
  { id: "bakery-0", name: "English Oven 100% Brown Bread 400g", categoryKey: "bakery", categoryName: "Bakery", price: 45, mrp: 50, rating: 4.8, store: "City Artisan Bakery", tags: ["healthy"], keywords: ["bread", "bred", "brown bread", "pav"] },
  { id: "bakery-1", name: "Fresh Flaky Butter Croissant (2 pcs)", categoryKey: "bakery", categoryName: "Bakery", price: 99, mrp: 120, rating: 4.9, store: "City Artisan Bakery", tags: ["artisan"], keywords: ["croissant", "crosant", "bakery"] },
  { id: "bakery-2", name: "Rich Double Chocolate Chip Muffin", categoryKey: "bakery", categoryName: "Bakery", price: 65, mrp: 80, rating: 4.7, store: "City Artisan Bakery", tags: ["sweet"], keywords: ["muffin", "moffin", "cake", "cupcake"] },
  { id: "bakery-3", name: "Multigrain Seeded Health Bread", categoryKey: "bakery", categoryName: "Bakery", price: 55, mrp: 65, rating: 4.8, store: "City Artisan Bakery", tags: ["healthy"], keywords: ["bread", "multigrain bread"] },
  { id: "bakery-4", name: "Soft Milk Bun Pack (4 pcs)", categoryKey: "bakery", categoryName: "Bakery", price: 35, mrp: 40, rating: 4.6, store: "City Artisan Bakery", tags: ["pav"], keywords: ["bun", "pav", "buns", "burger bun"] },
  { id: "bakery-5", name: "Handcrafted Butter Cookies 200g", categoryKey: "bakery", categoryName: "Bakery", price: 120, mrp: 150, rating: 4.8, store: "City Artisan Bakery", tags: ["cookies"], keywords: ["cookie", "cookies", "biscuit", "biscuits"] },

  // Pharmacy
  { id: "pharmacy-0", name: "Dolo 650 Paracetamol Tablets (Strip of 15)", categoryKey: "pharmacy", categoryName: "Pharmacy", price: 32, mrp: 35, rating: 4.9, store: "City Care Meds", tags: ["fever"], keywords: ["dolo", "paracetamol", "fever", "tablet", "medicine", "dawa"] },
  { id: "pharmacy-1", name: "Limcee Vitamin C Chewable Tablets 500mg", categoryKey: "pharmacy", categoryName: "Pharmacy", price: 25, mrp: 28, rating: 4.8, store: "City Care Meds", tags: ["immunity"], keywords: ["limcee", "vitamin c", "vitamin", "tablets"] },
  { id: "pharmacy-2", name: "Dettol Instant Hand Sanitizer 200ml", categoryKey: "pharmacy", categoryName: "Pharmacy", price: 95, mrp: 110, rating: 4.7, store: "City Care Meds", tags: ["hygiene"], keywords: ["sanitizer", "hand sanitizer", "dettol"] },
  { id: "pharmacy-3", name: "Fast Read Infrared Digital Thermometer", categoryKey: "pharmacy", categoryName: "Pharmacy", price: 499, mrp: 750, rating: 4.6, store: "City Care Meds", tags: ["device"], keywords: ["thermometer", "fever meter", "digital thermometer"] },
  { id: "pharmacy-4", name: "3-Ply Protective Face Masks (Pack of 10)", categoryKey: "pharmacy", categoryName: "Pharmacy", price: 69, mrp: 100, rating: 4.7, store: "City Care Meds", tags: ["mask"], keywords: ["mask", "masks", "face mask"] },

  // Food
  { id: "food-0", name: "Classic Crispy Veg Burger", categoryKey: "food", categoryName: "Food", price: 89, mrp: 120, rating: 4.7, store: "Local Kitchens Express", tags: ["fastfood"], keywords: ["burger", "bourger", "veg burger"] },
  { id: "food-1", name: "Paneer Tikka Roll", categoryKey: "food", categoryName: "Food", price: 119, mrp: 150, rating: 4.8, store: "Local Kitchens Express", tags: ["snack"], keywords: ["roll", "paneer roll", "kathi roll"] },
  { id: "food-2", name: "Cheesy Margherita Pizza 8 inch", categoryKey: "food", categoryName: "Food", price: 199, mrp: 250, rating: 4.9, store: "Local Kitchens Express", tags: ["pizza"], keywords: ["pizza", "piza", "pzza", "cheesy pizza"] },
  { id: "food-3", name: "Hyderabadi Veg Dum Biryani", categoryKey: "food", categoryName: "Food", price: 179, mrp: 220, rating: 4.8, store: "Local Kitchens Express", tags: ["biryani"], keywords: ["biryani", "biriyani", "biryani rice"] },
  { id: "food-4", name: "Crispy Butter Masala Dosa", categoryKey: "food", categoryName: "Food", price: 99, mrp: 130, rating: 4.9, store: "Local Kitchens Express", tags: ["southindian"], keywords: ["dosa", "dosai", "masala dosa"] },

  // Pet Care
  { id: "pet-0", name: "Pedigree Adult Chicken & Vegetables 3kg", categoryKey: "pet", categoryName: "Pet Care", price: 649, mrp: 720, rating: 4.8, store: "Pet Planet", tags: ["dog"], keywords: ["dog food", "pedigree", "kutta food", "dog"] },
  { id: "pet-1", name: "Whiskas Ocean Fish Dry Cat Food 1.2kg", categoryKey: "pet", categoryName: "Pet Care", price: 399, mrp: 450, rating: 4.7, store: "Pet Planet", tags: ["cat"], keywords: ["cat food", "whiskas", "billi food", "cat"] },
  { id: "pet-2", name: "Clumping Odor Control Cat Litter 5kg", categoryKey: "pet", categoryName: "Pet Care", price: 349, mrp: 420, rating: 4.6, store: "Pet Planet", tags: ["hygiene"], keywords: ["cat litter", "litter", "pet litter"] },

  // Home Essentials
  { id: "home-0", name: "Vim Lemon Dishwash Gel 500ml", categoryKey: "home", categoryName: "Home Essentials", price: 105, mrp: 120, rating: 4.8, store: "Daily Needs Express", tags: ["cleaning"], keywords: ["vim", "dishwash", "bartan soap", "liquid soap"] },
  { id: "home-1", name: "Lizol Disinfectant Floor Cleaner 1L", categoryKey: "home", categoryName: "Home Essentials", price: 185, mrp: 210, rating: 4.9, store: "Fresh Mart", tags: ["floor"], keywords: ["lizol", "floor cleaner", "pocha"] },
  { id: "home-2", name: "Surf Excel Easy Wash Liquid 1L", categoryKey: "home", categoryName: "Home Essentials", price: 215, mrp: 245, rating: 4.9, store: "Fresh Mart", tags: ["laundry"], keywords: ["surf", "surf excel", "detergent", "kapde soap"] },

  // Personal Care
  { id: "personal-0", name: "Himalaya Purifying Neem Face Wash 100ml", categoryKey: "personal", categoryName: "Personal Care", price: 125, mrp: 140, rating: 4.8, store: "Daily Needs Express", tags: ["skincare"], keywords: ["facewash", "face wash", "himalaya", "neem"] },
  { id: "personal-1", name: "Dove Intense Repair Shampoo 340ml", categoryKey: "personal", categoryName: "Personal Care", price: 285, mrp: 340, rating: 4.9, store: "Fresh Mart", tags: ["haircare"], keywords: ["shampoo", "sampoo", "dove", "hair wash"] },
  { id: "personal-2", name: "Colgate Strong Teeth Toothpaste 150g", categoryKey: "personal", categoryName: "Personal Care", price: 92, mrp: 105, rating: 4.8, store: "Daily Needs Express", tags: ["dental"], keywords: ["toothpaste", "paste", "colgate", "brush"] },

  // Electronics
  { id: "electronics-0", name: "Fast Charging Type-C USB Cable 1m", categoryKey: "electronics", categoryName: "Electronics", price: 149, mrp: 299, rating: 4.6, store: "Tech Hub Express", tags: ["cable"], keywords: ["cable", "usb", "type c", "charger cable", "iphne"] },
  { id: "electronics-1", name: "In-Ear Bass Wired Earphones 3.5mm", categoryKey: "electronics", categoryName: "Electronics", price: 249, mrp: 499, rating: 4.5, store: "Tech Hub Express", tags: ["audio"], keywords: ["earphones", "headphone", "earphone", "handsfree"] },
  { id: "electronics-2", name: "10000mAh Fast Power Bank Dual USB", categoryKey: "electronics", categoryName: "Electronics", price: 899, mrp: 1499, rating: 4.8, store: "Tech Hub Express", tags: ["power"], keywords: ["powerbank", "power bank", "battery"] },
  { id: "electronics-3", name: "Philips 9W Cool Day White LED Bulb", categoryKey: "electronics", categoryName: "Electronics", price: 99, mrp: 140, rating: 4.8, store: "Tech Hub Express", tags: ["lighting"], keywords: ["bulb", "led", "light bulb", "philips"] }
].map((item) => ({
  ...item,
  img: getProductImage(item.name, item.categoryKey)
}));

export const STORES = [
  { id: "store-fresh-mart", name: "Fresh Mart Supermarket", category: "Groceries & Dairy", rating: "4.8", distance: "1.2 km", deliveryTime: "20 min", img: STORE_IMAGE_MAP.freshMart },
  { id: "store-daily-needs", name: "Daily Needs Express", category: "Staples & Household", rating: "4.7", distance: "800 m", deliveryTime: "15 min", img: STORE_IMAGE_MAP.dailyNeeds },
  { id: "store-city-bakery", name: "City Artisan Bakery", category: "Fresh Breads & Pastries", rating: "4.9", distance: "1.5 km", deliveryTime: "25 min", img: STORE_IMAGE_MAP.cityBakery },
  { id: "store-green-organics", name: "Green Leaf Farm Organics", category: "Fruits & Vegetables", rating: "4.8", distance: "900 m", deliveryTime: "15 min", img: STORE_IMAGE_MAP.greenOrganics }
];
