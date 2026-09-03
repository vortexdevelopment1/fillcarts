import axios from "axios";

const rawBaseUrl =
  import.meta.env.VITE_API_URL ||
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.PROD
    ? "https://fillcarts-backend.onrender.com"
    : "http://localhost:3000");

const cleanedBaseUrl = rawBaseUrl.trim().replace(/\/+$/, "");
const API_BASE_URL = cleanedBaseUrl.endsWith("/api")
  ? cleanedBaseUrl
  : `${cleanedBaseUrl}/api`;

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("vendorToken") || localStorage.getItem("token");
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

let onUnauthorizedCallback = null;

export const setOnUnauthorized = (cb) => {
  onUnauthorizedCallback = cb;
};

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      if (typeof onUnauthorizedCallback === "function") {
        onUnauthorizedCallback(error);
      }
    }
    return Promise.reject(error);
  }
);

export { API_BASE_URL };
export default api;