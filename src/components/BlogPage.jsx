import React, { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import {
  BookOpen, Calendar, Clock, User, ArrowRight, Search, ChevronRight,
  Tag, Share2, Sparkles, X, CheckCircle2, Store, Navigation, Bike, Repeat, ShoppingBasket, Send
} from "lucide-react";

const blogCategories = ["All", "Hyperlocal Tech", "Kirana Digitization", "Fleet & Safety", "Subscriptions & Daily Needs", "Produce Freshness"];

// Curated High-Res Unsplash Images Mapped to Article Headings
const BLOG_TOPIC_IMAGES = {
  1: "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=800&auto=format&fit=crop&q=80", // Kirana store & fresh groceries
  2: "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=800&auto=format&fit=crop&q=80", // Map & dispatch tech
  3: "https://images.unsplash.com/photo-1587560699334-bea93391dcef?w=800&auto=format&fit=crop&q=80", // Delivery rider
  4: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=800&auto=format&fit=crop&q=80", // Milk & bread
  5: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=800&auto=format&fit=crop&q=80", // Leafy greens & farm produce
  6: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&auto=format&fit=crop&q=80"  // Pharmacy medicines
};

const hyperlocalBlogPosts = [
  {
    id: 1,
    title: "Why Local Kiranas Beat Megastores on Freshness in Hyperlocal Delivery",
    category: "Kirana Digitization",
    readTime: "5 min read",
    date: "Aug 5, 2026",
    author: "Priya Sharma",
    authorRole: "Head of Merchant Growth",
    img: BLOG_TOPIC_IMAGES[1],
    featured: true,
    excerpt: "Centralized dark stores hold stock for days. Local Kirana stores turn over inventory daily. Here is why FillCarts partners with neighbourhood shops.",
    content: `When mega quick-commerce apps build 5,000 sq.ft dark-store warehouses, they incur heavy real estate overheads and store perishables for multiple days.

FillCarts takes a different approach: **Empowering the existing network of 12+ million Kirana stores, daily milk booths, and local fruit vendors across India.**

### Key Advantages of Hyperlocal Kiranas

1. **Daily Stock Rotation:** Local vendors replenish milk, paneer, and green vegetables every morning from local mandis.
2. **Proximity Under 1 KM:** Riders pick up orders within 3 minutes of customer checkout.
3. **Hyper-Regional Variety:** From specific local atta brands to regional spices, local shops carry what neighbours actually buy.

By connecting shopkeepers to our low-latency POS merchant app, we turn every local shop into a high-speed quick-commerce node.`
  },
  {
    id: 2,
    title: "Inside the Tech: How H3 Geospatial Grids Power 15-Minute Rider Dispatch",
    category: "Hyperlocal Tech",
    readTime: "7 min read",
    date: "Aug 1, 2026",
    author: "Ankit Verma",
    authorRole: "Principal Systems Architect",
    img: BLOG_TOPIC_IMAGES[2],
    excerpt: "A technical look at Uber H3 spatial indexing, WebSocket store alerts, and real-time route optimization for dense urban traffic.",
    content: `Delivering groceries in 15 minutes in congested Indian cities requires sub-second decision making.

When a customer taps 'Order Now', FillCarts executes three parallel algorithms:

- **H3 Hexagonal Spatial Indexing:** We map cities into Resolution-9 hexagonal cells (approx 100m diameter).
- **Sub-100ms Store Inventory Query:** Redis memory caches confirm item availability at nearby stores.
- **Rider Proximity & Traffic Estimation:** Real-time GPS telemetry evaluates rider velocity and signal delays to dispatch the optimal delivery partner.`
  },
  {
    id: 3,
    title: "100% Medical Cover & Daily Payouts: Rethinking Delivery Fleet Welfare",
    category: "Fleet & Safety",
    readTime: "5 min read",
    date: "Jul 24, 2026",
    author: "Rajesh Kumar",
    authorRole: "Rider Experience Lead",
    img: BLOG_TOPIC_IMAGES[3],
    excerpt: "Speed should never compromise safety. Here is how we enforce strict speed limits, daily payouts, and full medical coverage.",
    content: `Our delivery partners are the backbone of hyperlocal commerce.

### Our Fleet Commitments

- **No Penalty for Traffic Delays:** We never penalize riders if an order takes longer due to weather or traffic.
- **Instant Daily Payouts:** Riders can transfer earnings directly to their bank account at the end of every shift.
- **Comprehensive Insurance:** Full accident coverage, hospitalization benefit, and family health cover from Day 1.`
  },
  {
    id: 4,
    title: "The Economics of Morning Milk & Daily Bread Subscriptions",
    category: "Subscriptions & Daily Needs",
    readTime: "6 min read",
    date: "Jul 18, 2026",
    author: "Meera Deshmukh",
    authorRole: "Product Lead - Subscriptions",
    img: BLOG_TOPIC_IMAGES[4],
    excerpt: "How automated 7 AM milk deliveries create predictable revenue for local dairies and zero-friction mornings for households.",
    content: `Daily milk, curd, and fresh bread represent the highest-frequency purchases in Indian households.

By allowing users to set flexible subscriptions (e.g. 1L Milk Daily, 500g Curd on Mon/Thu), local dairy vendors can predict exact morning demand 24 hours in advance, eliminating unsold stock wastage.`
  },
  {
    id: 5,
    title: "Farm-to-Plate in 3 Hours: Preserving Nutrients in Leafy Greens",
    category: "Produce Freshness",
    readTime: "4 min read",
    date: "Jul 10, 2026",
    author: "Dr. Kavita Reddy",
    authorRole: "Quality & Supply Chain Advisor",
    img: BLOG_TOPIC_IMAGES[5],
    excerpt: "How direct mandi-to-kirana sourcing cuts supply chain links and delivers crisper spinach, tomatoes, and herbs.",
    content: `Traditional supply chains pass vegetables through 4-5 middlemen over 48 hours. FillCarts hyperlocal vendors source directly from local farmers and wholesale mandis at 4 AM, delivering to customers by 7 AM.`
  },
  {
    id: 6,
    title: "How Pharmacy Quick-Commerce Saves Lives in Late-Night Emergencies",
    category: "Kirana Digitization",
    readTime: "5 min read",
    date: "Jun 28, 2026",
    author: "Siddharth Mehta",
    authorRole: "Category Head - Pharmacy",
    img: BLOG_TOPIC_IMAGES[6],
    excerpt: "Partnering with verified 24/7 neighbourhood chemists to deliver essential OTC medicines and first-aid late at night.",
    content: `When a child develops a fever at 2 AM, waiting until morning is not an option. By onboarding licensed neighbourhood chemists with 24/7 delivery permissions, FillCarts ensures critical medicines reach homes within 15 minutes.`
  }
];

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const featuredArticle = hyperlocalBlogPosts.find((b) => b.featured) || hyperlocalBlogPosts[0];

  const filteredPosts = hyperlocalBlogPosts.filter((post) => {
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
    const matchesQuery =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setSubscribed(true);
    }
  };

  return (
    <div className="bg-[#FFFCF5] min-h-screen text-[#17231A] flex flex-col font-sans" style={{ fontFamily: "'Manrope', 'Inter', sans-serif" }}>
      {/* Shared Common Navbar */}
      <Navbar searchPlaceholder="Search FillCarts blog articles & insights..." />

      {/* Breadcrumb */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-2.5 text-xs text-slate-500 font-semibold flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Link to="/" className="hover:text-[#16A34A] transition-colors">Home</Link>
            <ChevronRight size={12} />
            <span className="text-[#166534] font-bold">FillCarts Blog & Insights</span>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs font-extrabold text-[#166534] bg-[#ECFDF3] border border-emerald-200 px-3 py-1 rounded-full">
            <BookOpen size={14} className="text-[#16A34A]" /> Hyperlocal Stories & Tech
          </div>
        </div>
      </div>

      {/* 1. HERO SECTION */}
      <section className="bg-white border-b border-slate-100 py-10 px-4 sm:px-6 relative">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-[#F59E0B] bg-amber-50 px-3.5 py-1.5 rounded-full border border-amber-200/80 mb-2">
              <BookOpen size={13} /> FillCarts Insights & Tech
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-[#17231A] leading-tight mb-2">
              Stories from the <span className="text-[#16A34A]">Neighbourhood</span>
            </h1>
            <p className="text-xs md:text-sm text-slate-600 font-medium max-w-xl leading-relaxed">
              Explore how we digitize local kiranas, optimize geospatial dispatch algorithms, and support rider welfare across India.
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative w-full sm:w-80 shrink-0">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Search articles, topics or authors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-[#FFFCF5] border border-slate-200 text-xs font-semibold rounded-full pl-9 pr-4 py-2.5 w-full focus:outline-none focus:border-[#16A34A]"
            />
          </div>
        </div>
      </section>

      {/* MAIN BODY */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-12 flex-1 w-full text-left">

        {/* FEATURED HERO ARTICLE */}
        {featuredArticle && !searchQuery && selectedCategory === "All" && (
          <section className="bg-white border border-emerald-100 rounded-3xl overflow-hidden shadow-md group hover:border-[#16A34A] transition-all">
            <div className="grid md:grid-cols-12 items-center">
              <div className="md:col-span-7 p-6 sm:p-10 space-y-4">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    ⭐ FEATURED STORY
                  </span>
                  <span className="text-[10px] font-black uppercase text-[#166534] bg-[#ECFDF3] px-2.5 py-0.5 rounded-full border border-emerald-200">
                    {featuredArticle.category}
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#17231A] group-hover:text-[#166534] transition-colors leading-snug">
                  {featuredArticle.title}
                </h2>

                <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
                  {featuredArticle.excerpt}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100 flex-wrap gap-3">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                    <span className="font-bold text-[#17231A]">{featuredArticle.author}</span>
                    <span>•</span>
                    <span>{featuredArticle.date}</span>
                    <span>•</span>
                    <span>{featuredArticle.readTime}</span>
                  </div>

                  <button
                    onClick={() => setSelectedArticle(featuredArticle)}
                    className="bg-[#16A34A] hover:bg-[#15803D] text-white font-extrabold px-5 py-2.5 rounded-xl text-xs shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Read Article</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>

              {/* Featured Article Image */}
              <div className="md:col-span-5 aspect-4/3 md:aspect-square relative overflow-hidden bg-slate-100">
                <img
                  src={featuredArticle.img}
                  alt={featuredArticle.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          </section>
        )}

        {/* CATEGORY FILTER CHIPS */}
        <div className="bg-white border border-emerald-100 rounded-2xl p-4 shadow-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-black text-slate-400 uppercase text-[10px] mr-1">Category:</span>
            {blogCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-extrabold transition-all border cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-[#16A34A] text-white border-[#16A34A] shadow-xs"
                    : "bg-[#FFFCF5] border-slate-200 text-slate-700 hover:bg-[#ECFDF3] hover:border-emerald-300"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* ARTICLES GRID */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-extrabold text-[#17231A]">
              Latest Articles {selectedCategory !== "All" && `in ${selectedCategory}`}
            </h3>
            <span className="text-xs font-semibold text-slate-400">Showing {filteredPosts.length} articles</span>
          </div>

          {filteredPosts.length === 0 ? (
            <div className="bg-white border border-emerald-100 rounded-3xl p-12 text-center max-w-md mx-auto shadow-xs">
              <BookOpen size={36} className="text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-extrabold text-[#17231A]">No articles found</h3>
              <p className="text-xs text-slate-500 mb-4 font-medium">Try searching for a different keyword or category.</p>
              <button
                onClick={() => { setSelectedCategory("All"); setSearchQuery(""); }}
                className="bg-[#16A34A] text-white font-extrabold text-xs px-5 py-2.5 rounded-full shadow-sm cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map((post) => (
                <div
                  key={post.id}
                  className="bg-white border border-emerald-100 hover:border-[#16A34A] rounded-3xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    {/* Article Heading-Matched Image */}
                    <div className="aspect-16/10 relative overflow-hidden bg-slate-100">
                      <img
                        src={post.img}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute top-3 left-3 bg-[#ECFDF3] border border-emerald-200 text-[#166534] px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase shadow-xs">
                        {post.category}
                      </div>
                    </div>

                    <div className="p-5 space-y-3">
                      <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-400">
                        <Calendar size={12} /> {post.date}
                        <span>•</span>
                        <Clock size={12} /> {post.readTime}
                      </div>

                      <h4 className="font-extrabold text-base text-[#17231A] group-hover:text-[#166534] transition-colors leading-snug line-clamp-2">
                        {post.title}
                      </h4>

                      <p className="text-xs text-slate-500 font-medium leading-relaxed line-clamp-3">
                        {post.excerpt}
                      </p>
                    </div>
                  </div>

                  <div className="p-5 pt-0 border-t border-slate-100 flex items-center justify-between mt-3">
                    <span className="text-xs font-bold text-slate-700 truncate">{post.author}</span>

                    <button
                      onClick={() => setSelectedArticle(post)}
                      className="text-xs font-extrabold text-[#16A34A] hover:text-[#15803D] flex items-center gap-1 group-hover:translate-x-1 transition-transform cursor-pointer"
                    >
                      <span>Read Story</span>
                      <ArrowRight size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* NEWSLETTER SUBSCRIPTION CARD */}
        <section className="bg-[#ECFDF3] border-2 border-emerald-300 rounded-3xl p-6 sm:p-10 shadow-md">
          <div className="max-w-2xl mx-auto text-center space-y-4">
            <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-[#166534] bg-white px-3 py-1 rounded-full border border-emerald-200/80">
              <Sparkles size={13} /> Stay Updated
            </span>

            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#17231A]">
              Subscribe to FillCarts Tech & Local Dispatch Digest
            </h3>

            <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
              Get the latest articles on kirana digitization, geospatial routing algorithms, and fleet welfare directly in your inbox.
            </p>

            {subscribed ? (
              <div className="bg-white border border-emerald-200 rounded-2xl p-4 text-xs font-bold text-[#166534] inline-flex items-center gap-2">
                <CheckCircle2 size={16} className="text-[#16A34A]" /> You are subscribed! Check your inbox for upcoming digests.
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row items-center justify-center gap-2 max-w-md mx-auto">
                <input
                  required
                  type="email"
                  placeholder="Enter your email address..."
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="bg-white border border-slate-200 text-xs font-semibold rounded-xl px-4 py-3 w-full focus:outline-none focus:border-[#16A34A]"
                />
                <button
                  type="submit"
                  className="w-full sm:w-auto bg-[#16A34A] hover:bg-[#15803D] text-white font-extrabold text-xs px-6 py-3 rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
                >
                  <span>Subscribe</span>
                  <Send size={14} />
                </button>
              </form>
            )}
          </div>
        </section>
      </main>

      {/* FULL ARTICLE MODAL READER */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-emerald-100 rounded-3xl max-w-3xl w-full p-6 sm:p-10 space-y-6 shadow-2xl relative my-8 text-left max-h-[90vh] overflow-y-auto">
            
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-black uppercase text-[#166534] bg-[#ECFDF3] px-2.5 py-0.5 rounded-full border border-emerald-200 inline-block mb-2">
                  {selectedArticle.category} • {selectedArticle.readTime}
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#17231A] leading-tight">
                  {selectedArticle.title}
                </h2>
                <div className="flex items-center gap-3 text-xs text-slate-500 font-semibold mt-2">
                  <span>By <strong>{selectedArticle.author}</strong> ({selectedArticle.authorRole})</span>
                  <span>•</span>
                  <span>{selectedArticle.date}</span>
                </div>
              </div>

              <button
                onClick={() => setSelectedArticle(null)}
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer shrink-0"
              >
                <X size={18} />
              </button>
            </div>

            {/* Article Image */}
            <div className="aspect-16/9 rounded-2xl overflow-hidden bg-slate-100 shadow-xs">
              <img
                src={selectedArticle.img}
                alt={selectedArticle.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Content Body */}
            <div className="prose prose-slate max-w-none text-xs sm:text-sm leading-relaxed space-y-4 font-medium text-slate-700">
              {selectedArticle.content.split('\n\n').map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>

            {/* Modal Footer */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({ title: selectedArticle.title, url: window.location.href });
                  } else {
                    alert("Article link copied to clipboard!");
                  }
                }}
                className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-full transition-colors cursor-pointer"
              >
                <Share2 size={14} /> Share Story
              </button>

              <button
                onClick={() => setSelectedArticle(null)}
                className="bg-[#16A34A] hover:bg-[#15803D] text-white font-extrabold text-xs px-6 py-2.5 rounded-xl shadow-md cursor-pointer"
              >
                Close Article
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Shared Footer */}
      <Footer />
    </div>
  );
}
