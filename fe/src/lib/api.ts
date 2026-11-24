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

    // Không tự động logout đối với các endpoint xác thực hoặc đổi mật khẩu
    const isNonSessionAuthCall =
      reqUrl.includes("/auth/login") ||
      reqUrl.includes("/auth/register") ||
      reqUrl.includes("/auth/verify-email") ||
      reqUrl.includes("/auth/resend-otp") ||
      reqUrl.includes("/auth/forgot-password") ||
      reqUrl.includes("/auth/reset-password") ||
      reqUrl.includes("/auth/change-password");

    const authHeader: string =
      error?.config?.headers?.Authorization || error?.config?.headers?.authorization || "";
    const sentToken = authHeader.startsWith("Bearer ") ? authHeader.slice(7).trim() : "";
    const currentToken = useAuthStore.getState().token;

    // Chỉ đăng xuất khi đúng token hiện tại bị máy chủ từ chối (401)
    if (
      status === 401 &&
      !isNonSessionAuthCall &&
      Boolean(currentToken) &&
      sentToken === currentToken
    ) {
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
