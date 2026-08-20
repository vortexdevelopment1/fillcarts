import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import AppKartHome from "./components/AppKartHome";
import CategoriesPage from "./components/CategoriesPage";

// Dedicated Rider Portal Imports (src/rider/)
import RiderHomePage from "./rider/pages/RiderHomePage";
import RiderAboutPage from "./rider/pages/RiderAboutPage";

// Dedicated Vendor Portal Imports (src/vendor/)
import VendorHomePage from "./vendor/pages/VendorHomePage";
import VendorAboutPage from "./vendor/pages/VendorAboutPage";

import AboutPage from "./components/AboutPage";
import SupportPage from "./components/SupportPage";
import CustomerLoginPage from "./components/CustomerLoginPage";
import CustomerRegistrationPage from "./components/CustomerRegistrationPage";
import SubscriptionPage from "./components/SubscriptionPage";
import CareersPage from "./components/CareersPage";
import BlogPage from "./components/BlogPage";
import CartPage from "./components/CartPage";
import UserProfilePage from "./components/UserProfilePage";
import { CartProvider } from "./context/CartContext";
import FeaturesPage from "./components/FeaturesPage";
import TermsPage from "./components/TermsPage";
import PrivacyPolicyPage from "./components/PrivacyPolicyPage";
import ProductDetailPage from "./components/ProductDetailPage";
import SearchResultsPage from "./components/SearchResultsPage";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/profile" element={<UserProfilePage />} />
          <Route path="/login" element={<CustomerLoginPage />} />
          <Route path="/register" element={<CustomerRegistrationPage />} />
          <Route path="/" element={<AppKartHome />} />
          <Route path="/search" element={<SearchResultsPage />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/features" element={<FeaturesPage />} />

          {/* Vendor Partner Portal Routes (src/vendor/) */}
          <Route path="/vendor" element={<VendorHomePage />} />
          <Route path="/become-vendor" element={<VendorHomePage />} />
          <Route path="/vendor/about" element={<VendorAboutPage />} />
          <Route path="/vendor-about" element={<VendorAboutPage />} />

          {/* Rider Partner Portal Routes (src/rider/) */}
          <Route path="/rider" element={<RiderHomePage />} />
          <Route path="/become-rider" element={<RiderHomePage />} />
          <Route path="/rider/about" element={<RiderAboutPage />} />
          <Route path="/rider-about" element={<RiderAboutPage />} />

          <Route path="/about" element={<AboutPage />} />
          <Route path="/support" element={<SupportPage />} />
          <Route path="/login/customer" element={<CustomerLoginPage />} />
          <Route path="/subscriptions" element={<SubscriptionPage />} />
          <Route path="/careers" element={<CareersPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPolicyPage />} />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;