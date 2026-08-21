import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import VendorHomePage from "./pages/VendorHomePage";
import VendorAboutPage from "./pages/VendorAboutPage";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

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

        {/* Fallback wildcard to prevent 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
