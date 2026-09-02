import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";

const googleClientId = (
  import.meta.env.VITE_GOOGLE_CLIENT_ID ||
  "643677050596-69ercoqaljqblua1hglgu2ne73fvk9b4.apps.googleusercontent.com"
).trim();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={googleClientId}>
      <App />
    </GoogleOAuthProvider>
  </StrictMode>
);
