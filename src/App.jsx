import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import AppKartHome from "./components/AppKartHome";
import CategoriesPage from "./components/CategoriesPage";
import BecomeVendorPage from "./components/BecomeVendorPage";
import BecomeRiderPage from "./components/BecomeRiderPage";
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
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/features" element={<FeaturesPage />} />
          <Route path="/become-vendor" element={<BecomeVendorPage />} />
          <Route path="/become-rider" element={<BecomeRiderPage />} />
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