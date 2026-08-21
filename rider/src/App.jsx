import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import RiderHomePage from "./pages/RiderHomePage";
import RiderAboutPage from "./pages/RiderAboutPage";

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

        {/* Fallback wildcard to prevent 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
