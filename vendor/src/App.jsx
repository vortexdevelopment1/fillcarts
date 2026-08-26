import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import VendorHomePage from "./pages/VendorHomePage";
import VendorAboutPage from "./pages/VendorAboutPage";
import VendorTermsPrivacyPage from "./pages/VendorTermsPrivacyPage";
import VendorSupportPage from "./pages/VendorSupportPage";

function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const id = hash.replace("#", "");
      const timer = setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        } else {
          window.scrollTo(0, 0);
        }
      }, 100);
      return () => clearTimeout(timer);
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<VendorHomePage />} />
        <Route path="/vendor" element={<VendorHomePage />} />
        <Route path="/become-vendor" element={<VendorHomePage />} />
        <Route path="/about" element={<VendorAboutPage />} />
        <Route path="/vendor/about" element={<VendorAboutPage />} />
        <Route path="/vendor-about" element={<VendorAboutPage />} />
        <Route path="/terms" element={<VendorTermsPrivacyPage />} />
        <Route path="/privacy" element={<VendorTermsPrivacyPage />} />
        <Route path="/terms-and-privacy" element={<VendorTermsPrivacyPage />} />
        <Route path="/vendor/terms" element={<VendorTermsPrivacyPage />} />
        <Route path="/vendor/privacy" element={<VendorTermsPrivacyPage />} />
        <Route path="/support" element={<VendorSupportPage />} />
        <Route path="/help" element={<VendorSupportPage />} />
        <Route path="/contact" element={<VendorSupportPage />} />
        <Route path="/vendor/support" element={<VendorSupportPage />} />
        <Route path="/vendor/help" element={<VendorSupportPage />} />

        {/* Fallback wildcard to prevent 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
