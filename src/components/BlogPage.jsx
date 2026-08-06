import React, { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import {
  BookOpen, Calendar, Clock, User, ArrowRight, Search, ChevronRight,
  Tag, Share2, Sparkles, X, CheckCircle2, Store, Navigation, Bike, Repeat, ShoppingBasket
} from "lucide-react";

const blogCategories = ["All", "Hyperlocal Tech", "Kirana Digitization", "Fleet & Safety", "Subscriptions & Daily Needs", "Produce Freshness"];

const hyperlocalBlogPosts = [
  {
    id: 1,
    title: "Why Local Kiranas Beat Megastores on Freshness in Hyperlocal Delivery",
    category: "Kirana Digitization",
    readTime: "5 min read",
    date: "Aug 5, 2026",
    author: "Priya Sharma",
    authorRole: "Head of Merchant Growth",
    img: "blog-kirana-freshness",
    featured: true,
    excerpt: "Centralized dark stores hold stock for days. Local Kirana stores turn over inventory daily. Here is why FillCarts partners with neighbourhood shops.",
    content: `When mega quick-commerce apps build 5,000 sq.ft dark-store warehouses, they incur heavy real estate overheads and store perishables for multiple days.

FillCarts takes a different approach: **Empowering the existing network of 12+ million Kirana stores, daily milk booths, and local fruit vendors across India.**

### Key Advantages of Hyperlocal Kiranas

1. **Daily Stock Rotation:** Local vendors replenish milk, paneer, and green vegetables every morning from local mandis.
2. **Proximity Under 1 KM:** Riders pick up orders within 3 minutes of customer checkout.
3. **Hyper-Regional Variety:** From specific local atta brands to regional spices, local shops carry what neighbours actually buy.

By connecting shopkeepers to our low-latency POS merchant app, we turn every local shop into a high-speed quick-commerce node.`,
  },
  {
    id: 2,
    title: "Inside the Tech: How H3 Geospatial Grids Power 15-Minute Rider Dispatch",
    category: "Hyperlocal Tech",
    readTime: "7 min read",
    date: "Aug 1, 2026",
    author: "Ankit Verma",
    authorRole: "Principal Systems Architect",
    img: "blog-geospatial-tech",
    excerpt: "A technical look at Uber H3 spatial indexing, WebSocket store alerts, and real-time route optimization for dense urban traffic.",
    content: `Delivering groceries in 15 minutes in congested Indian cities requires sub-second decision making.

When a customer taps 'Order Now', FillCarts executes three parallel algorithms:

- **H3 Hexagonal Spatial Indexing:** We map cities into Resolution-9 hexagonal cells (approx 100m diameter).
- **Sub-100ms Store Inventory Query:** Redis memory caches confirm item availability at nearby stores.
- **Rider Proximity & Traffic Estimation:** Real-time GPS telemetry evaluates rider velocity and signal delays to dispatch the optimal delivery partner.`,
  },
  {
    id: 3,
    title: "100% Medical Cover & Daily Payouts: Rethinking Delivery Fleet Welfare",
    category: "Fleet & Safety",
    readTime: "5 min read",
    date: "Jul 24, 2026",
    author: "Rajesh Kumar",
    authorRole: "Rider Experience Lead",
    img: "blog-rider-welfare",
    excerpt: "Speed should never compromise safety. Here is how we enforce strict speed limits, daily payouts, and full medical coverage.",
    content: `Our delivery partners are the backbone of hyperlocal commerce.

### Our Fleet Commitments

- **No Penalty for Traffic Delays:** We never penalize riders if an order takes longer due to weather or traffic.
- **Instant Daily Payouts:** Riders can transfer earnings directly to their bank account at the end of every shift.
- **Comprehensive Insurance:** Full accident coverage, hospitalization benefit, and family health cover from Day 1.`,
  },
  {
    id: 4,
    title: "The Economics of Morning Milk & Daily Bread Subscriptions",
    category: "Subscriptions & Daily Needs",
    readTime: "6 min read",
    date: "Jul 18, 2026",
    author: "Meera Deshmukh",
    authorRole: "Product Lead - Subscriptions",
    img: "blog-milk-economics",
    excerpt: "How automated 7 AM milk deliveries create predictable revenue for local dairies and zero-friction mornings for households.",
    content: `Daily milk, curd, and fresh bread represent the highest-frequency purchases in Indian households.

By allowing users to set flexible subscriptions (e.g. 1L Milk Daily, 500g Curd on Mon/Thu), local dairy vendors can predict exact morning demand 24 hours in advance, eliminating unsold stock wastage.`,
  },
  {
    id: 5,
    title: "Farm-to-Plate in 3 Hours: Preserving Nutrients in Leafy Greens",
    category: "Produce Freshness",
    readTime: "4 min read",
    date: "Jul 10, 2026",
    author: "Dr. Kavita Reddy",
    authorRole: "Quality & Supply Chain Advisor",
    img: "blog-farm-produce",
    excerpt: "How direct mandi-to-kirana sourcing cuts supply chain links and delivers crisper spinach, tomatoes, and herbs.",
    content: `Traditional supply chains pass vegetables through 4-5 middlemen over 48 hours. FillCarts hyperlocal vendors source directly from local farmers and wholesale mandis at 4 AM, delivering to customers by 7 AM.`,
  },
  {
    id: 6,
    title: "How Pharmacy Quick-Commerce Saves Lives in Late-Night Emergencies",
    category: "Kirana Digitization",
    readTime: "5 min read",
    date: "Jun 28, 2026",
    author: "Siddharth Mehta",
    authorRole: "Category Head - Pharmacy",
    img: "blog-pharmacy-night",
    excerpt: "Partnering with verified 24/7 neighbourhood chemists to deliver essential OTC medicines and first-aid late at night.",
    content: `When a child develops a fever at 2 AM, waiting until morning is not an option. By onboarding licensed neighbourhood chemists with 24/7 delivery permissions, FillCarts ensures critical medicines reach homes within 15 minutes.`,
  },
];

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const featuredArticle = hyperlocalBlogPosts.find((b) => b.featured) || hyperlocalBlogPosts[0];

  const filteredPosts = hyperlocalBlogPosts.filter((post) => {
    const matchesCat = selectedCategory === "All" || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setSubscribed(true);
    setTimeout(() => {
      setSubscribed(false);
      setNewsletterEmail("");
    }, 3000);
  };

  return (
    <div className="bg-slate-50 min-h-screen text-slate-900" style={{ fontFamily: "'Manrope', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,900&family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

      {/* Shared Navbar */}
      <Navbar />

      {/* Breadcrumb */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 py-2.5 text-xs text-slate-500 font-semibold flex items-center gap-1.5">
          <Link to="/" className="hover:text-blue-600">Home</Link>
          <ChevronRight size={13} />
          <span className="text-slate-900 font-bold">Hyperlocal Blog & Insights</span>
        </div>
      </div>

      {/* Hero Section */}
      <section className="max-w-4xl mx-auto px-6 py-14 text-center">
        <div className="inline-flex items-center gap-2 bg-violet-50 border border-violet-200 text-violet-700 rounded-full px-3.5 py-1.5 text-sm font-bold mb-5">
          <BookOpen size={14} className="text-violet-600" /> Hyperlocal Commerce & Tech Insights
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight text-slate-900" style={{ fontFamily: "'Fraunces', serif" }}>
          Stories, Tech & Local Merchant Growth.
        </h1>
        <p className="text-slate-500 text-base md:text-lg max-w-2xl mx-auto font-medium leading-relaxed mb-8">
          Discover how FillCarts is digitizing Kirana stores, optimizing 15-minute rider dispatch, and ensuring daily fresh deliveries.
        </p>

        {/* Search Bar */}
        <div className="max-w-md mx-auto relative flex items-center bg-white border border-slate-200 rounded-full px-4 py-2.5 shadow-sm">
          <Search size={16} className="text-slate-400 mr-2" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search e.g. Kirana, Geospatial, Subscriptions..."
            className="w-full bg-transparent text-sm outline-none text-slate-900 placeholder:text-slate-400 font-semibold"
          />
        </div>
      </section>

      {/* Featured Article Banner */}
      {!searchQuery && selectedCategory === "All" && (
        <section className="max-w-6xl mx-auto px-6 pb-12">
          <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm grid md:grid-cols-2 gap-0 items-center">
            <div className="aspect-video md:aspect-auto md:h-full bg-slate-100 relative overflow-hidden">
              <img
                src={`https://picsum.photos/seed/${featuredArticle.img}/800/600`}
                alt={featuredArticle.title}
                className="w-full h-full object-cover"
              />
              <span className="absolute top-4 left-4 bg-blue-600 text-white font-extrabold text-xs px-3.5 py-1.5 rounded-full shadow-md">
                Featured Hyperlocal Story
              </span>
            </div>

            <div className="p-8 md:p-12">
              <div className="flex items-center gap-3 text-xs font-bold text-slate-500 mb-3">
                <span className="text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">{featuredArticle.category}</span>
                <span>•</span>
                <span className="flex items-center gap-1"><Clock size={13} /> {featuredArticle.readTime}</span>
              </div>

              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3 leading-tight" style={{ fontFamily: "'Fraunces', serif" }}>
                {featuredArticle.title}
              </h2>
              <p className="text-slate-600 text-sm font-medium leading-relaxed mb-6">
                {featuredArticle.excerpt}
              </p>

              <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center">
                    {featuredArticle.author[0]}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">{featuredArticle.author}</div>
                    <div className="text-[11px] font-semibold text-slate-400">{featuredArticle.date}</div>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedArticle(featuredArticle)}
                  className="bg-slate-900 hover:bg-blue-600 text-white font-bold text-xs rounded-full px-5 py-2.5 inline-flex items-center gap-1.5 transition-colors"
                >
                  Read Story <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Category Tabs & Articles Grid */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="mb-8 flex items-center justify-between gap-4 flex-wrap">
          <h2 className="text-2xl font-bold" style={{ fontFamily: "'Fraunces', serif" }}>Hyperlocal Articles</h2>

          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
            {blogCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap border transition-all ${
                  selectedCategory === cat
                    ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                    : "bg-white border-slate-200 text-slate-600 hover:border-slate-400"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Posts Grid */}
        {filteredPosts.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-500 font-semibold">
            No articles found matching your search term.
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <div
                key={post.id}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:-translate-y-1 hover:shadow-lg transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="aspect-video bg-slate-100 overflow-hidden relative">
                    <img
                      src={`https://picsum.photos/seed/${post.img}/600/400`}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-md text-slate-900 font-extrabold text-[11px] px-2.5 py-1 rounded-full border border-slate-200">
                      {post.category}
                    </span>
                  </div>

                  <div className="p-5">
                    <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400 mb-2">
                      <Calendar size={12} /> {post.date}
                      <span>•</span>
                      <Clock size={12} /> {post.readTime}
                    </div>

                    <h3 className="text-base font-bold text-slate-900 mb-2 leading-snug hover:text-blue-600 transition-colors cursor-pointer" onClick={() => setSelectedArticle(post)}>
                      {post.title}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed line-clamp-3 mb-4">
                      {post.excerpt}
                    </p>
                  </div>
                </div>

                <div className="px-5 pb-5 pt-0 flex items-center justify-between border-t border-slate-100 pt-3">
                  <div className="text-xs font-bold text-slate-700">{post.author}</div>
                  <button
                    onClick={() => setSelectedArticle(post)}
                    className="text-xs font-bold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
                  >
                    Read Article <ChevronRight size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Newsletter Signup Banner */}
      <section className="max-w-6xl mx-auto px-6 pb-16">
        <div className="bg-slate-900 text-white rounded-3xl p-8 md:p-12 flex flex-wrap items-center justify-between gap-6 shadow-xl">
          <div>
            <div className="text-xs font-extrabold uppercase tracking-widest text-blue-400 mb-2 flex items-center gap-1.5">
              <Sparkles size={14} /> Hyperlocal Insights Weekly
            </div>
            <h2 className="text-2xl md:text-3xl font-bold mb-2" style={{ fontFamily: "'Fraunces', serif" }}>
              Stay ahead in Indian Quick-Commerce.
            </h2>
            <p className="text-xs md:text-sm text-slate-300 max-w-md font-medium">
              Get our weekly deep-dives on kirana digitization, geospatial tech, and hyperlocal logistics directly in your inbox.
            </p>
          </div>

          {subscribed ? (
            <div className="bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 font-bold text-xs px-6 py-3.5 rounded-full flex items-center gap-2">
              <CheckCircle2 size={16} /> Subscribed to FillCarts Insights!
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex gap-2 max-w-md w-full md:w-auto">
              <input
                required
                type="email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Enter your email address"
                className="bg-white/10 border border-white/20 text-white text-xs font-semibold rounded-full px-5 py-3 outline-none focus:border-blue-400 flex-1 md:w-64 placeholder:text-slate-400"
              />
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs px-6 py-3 rounded-full whitespace-nowrap shadow-md transition-all"
              >
                Subscribe
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Article Reader Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 md:p-10 shadow-2xl relative border border-slate-200 my-8 max-h-[85vh] overflow-y-auto">
            <button
              onClick={() => setSelectedArticle(null)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200"
            >
              <X size={16} />
            </button>

            <div className="flex items-center gap-3 text-xs font-bold text-slate-500 mb-3">
              <span className="text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">{selectedArticle.category}</span>
              <span>•</span>
              <span>{selectedArticle.readTime}</span>
              <span>•</span>
              <span>{selectedArticle.date}</span>
            </div>

            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4 leading-tight" style={{ fontFamily: "'Fraunces', serif" }}>
              {selectedArticle.title}
            </h2>

            <div className="flex items-center gap-3 border-y border-slate-100 py-3 mb-6">
              <div className="w-9 h-9 rounded-full bg-blue-600 text-white font-bold text-sm flex items-center justify-center">
                {selectedArticle.author[0]}
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">{selectedArticle.author}</div>
                <div className="text-[11px] font-semibold text-slate-400">{selectedArticle.authorRole}</div>
              </div>
            </div>

            <div className="aspect-video bg-slate-100 rounded-2xl overflow-hidden mb-6">
              <img
                src={`https://picsum.photos/seed/${selectedArticle.img}/800/500`}
                alt={selectedArticle.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="prose prose-slate text-sm text-slate-600 leading-relaxed font-medium space-y-4">
              {selectedArticle.content.split("\n\n").map((paragraph, idx) => {
                if (paragraph.startsWith("### ")) {
                  return <h3 key={idx} className="text-lg font-bold text-slate-900 pt-2">{paragraph.replace("### ", "")}</h3>;
                }
                return <p key={idx}>{paragraph}</p>;
              })}
            </div>

            <div className="mt-8 border-t border-slate-100 pt-4 flex justify-between items-center">
              <span className="text-xs font-bold text-slate-400">FillCarts Hyperlocal Insights</span>
              <button
                onClick={() => setSelectedArticle(null)}
                className="bg-slate-900 text-white font-bold text-xs px-5 py-2.5 rounded-full"
              >
                Close Article
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
}
