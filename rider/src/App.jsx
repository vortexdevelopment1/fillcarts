import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import RiderHomePage from "./pages/RiderHomePage";
import RiderAboutPage from "./pages/RiderAboutPage";
import RiderTermsPage from "./pages/RiderTermsPage";
import RiderPrivacyPage from "./pages/RiderPrivacyPage";
import RiderSupportPage from "./pages/RiderSupportPage";

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
        <Route path="/" element={<RiderHomePage />} />
        <Route path="/rider" element={<RiderHomePage />} />
        <Route path="/become-rider" element={<RiderHomePage />} />
        <Route path="/about" element={<RiderAboutPage />} />
        <Route path="/rider/about" element={<RiderAboutPage />} />
        <Route path="/rider-about" element={<RiderAboutPage />} />
        <Route path="/terms" element={<RiderTermsPage />} />
        <Route path="/rider/terms" element={<RiderTermsPage />} />
        <Route path="/privacy" element={<RiderPrivacyPage />} />
        <Route path="/rider/privacy" element={<RiderPrivacyPage />} />
        <Route path="/support" element={<RiderSupportPage />} />
        <Route path="/rider/support" element={<RiderSupportPage />} />
        <Route path="/rider-support" element={<RiderSupportPage />} />

        {/* Fallback wildcard to prevent 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
