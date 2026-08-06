import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import FeaturesPage from "./components/FeaturesPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<CustomerLoginPage />} />
        <Route path="/register" element={<CustomerRegistrationPage />} />
        <Route path="/" element={<AppKartHome />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/features" element={<FeaturesPage />} />
        <Route path="/become-vendor" element={<BecomeVendorPage />} />
        <Route path="/become-rider" element={<BecomeRiderPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/support" element={<SupportPage />} />
        <Route path="/login/customer" element={<CustomerLoginPage />} />
        <Route path="/subscriptions" element={<SubscriptionPage />} />
        <Route path="/careers" element={<CareersPage />} />
        <Route path="/blog" element={<BlogPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;