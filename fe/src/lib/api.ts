import axios from "axios";
import { useAuthStore } from "@/stores/auth.store";
import { toast } from "@/stores/toast.store";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "/api";

export const api = axios.create({
  baseURL: apiBaseUrl,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let lastAuthLogoutAt = 0;

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const reqUrl: string = error?.config?.url || "";
    const isAuthEndpoint = reqUrl.includes("/auth/login") || reqUrl.includes("/auth/register");
    if (status === 401 && !isAuthEndpoint && useAuthStore.getState().token) {
      useAuthStore.getState().logout();
      const now = Date.now();
      if (now - lastAuthLogoutAt > 4000) {
        lastAuthLogoutAt = now;
        toast.warning("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại để tiếp tục.");
      }
    }
    return Promise.reject(error);
  }
);

export default api;
