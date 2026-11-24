import axios from "axios";
import { useAuthStore } from "@/stores/auth.store";
import { toast } from "@/stores/toast.store";

const aiBaseUrl = import.meta.env.VITE_AI_BASE_URL ?? "/ai-api";

export const aiApi = axios.create({
  baseURL: aiBaseUrl,
  timeout: 90000,
  headers: {
    "Content-Type": "application/json",
  },
});

aiApi.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let lastAiLogoutAt = 0;

aiApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401 && useAuthStore.getState().token) {
      useAuthStore.getState().logout();
      const now = Date.now();
      if (now - lastAiLogoutAt > 4000) {
        lastAiLogoutAt = now;
        toast.warning("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại để sử dụng MatGreen AI.");
      }
    }
    return Promise.reject(error);
  }
);

export default aiApi;
