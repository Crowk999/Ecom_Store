const rawApiBase = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";
const rawBackendBase = import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:8000";

export const API_BASE = rawApiBase.replace(/\/$/, "");
export const BACKEND_BASE = rawBackendBase.replace(/\/$/, "");
export const API_URL = `${API_BASE}/`;
export const CART_API_URL = `${API_BASE}/carts/`;
export const AUTH_URL = `${API_BASE}/`;

export const buildImageUrl = (path: string) =>
  path.startsWith("http") ? path : `${BACKEND_BASE}${path}`;
