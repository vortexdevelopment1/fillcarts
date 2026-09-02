import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import AppKartHome from "./pages/AppKartHome";
import CategoriesPage from "./pages/CategoriesPage";
import AboutPage from "./pages/AboutPage";
import SupportPage from "./pages/SupportPage";
import CustomerLoginPage from "./pages/CustomerLoginPage";
import CustomerRegistrationPage from "./pages/CustomerRegistrationPage";
import SubscriptionPage from "./pages/SubscriptionPage";
import CareersPage from "./pages/CareersPage";
import BlogPage from "./pages/BlogPage";
import CartPage from "./pages/CartPage";
import WishlistPage from "./pages/WishlistPage";
import UserProfilePage from "./pages/UserProfilePage";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import FeaturesPage from "./pages/FeaturesPage";
import TermsPage from "./pages/TermsPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import SearchResultsPage from "./pages/SearchResultsPage";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default function App() {
  return (
    <CartProvider>
      <WishlistProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<AppKartHome />} />
            <Route path="/profile" element={<UserProfilePage />} />
            <Route path="/login" element={<CustomerLoginPage />} />
            <Route path="/register" element={<CustomerRegistrationPage />} />
            <Route path="/search" element={<SearchResultsPage />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
            <Route path="/features" element={<FeaturesPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/support" element={<SupportPage />} />
            <Route path="/login/customer" element={<CustomerLoginPage />} />
            <Route path="/subscriptions" element={<SubscriptionPage />} />
            <Route path="/careers" element={<CareersPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/privacy" element={<PrivacyPolicyPage />} />

            {/* Fallback wildcard to prevent 404 */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </WishlistProvider>
    </CartProvider>
  );
}
