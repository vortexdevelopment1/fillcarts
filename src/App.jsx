import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppKartHome from "./components/AppKartHome";
import CategoriesPage from "./components/CategoriesPage";
import BecomeVendorPage from "./components/BecomeVendorPage";
import BecomeRiderPage from "./components/BecomeRiderPage";
import AboutPage from "./components/AboutPage";
import SupportPage from "./components/SupportPage";
import CustomerLoginPage from "./components/CustomerLoginPage";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<CustomerLoginPage />} />
        <Route path="/" element={<AppKartHome />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/become-vendor" element={<BecomeVendorPage />} />
        <Route path="/become-rider" element={<BecomeRiderPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/support" element={<SupportPage />} />
        <Route path="/login/customer" element={<CustomerLoginPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;