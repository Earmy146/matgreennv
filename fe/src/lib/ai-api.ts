import axios from "axios";
import { useAuthStore } from "@/stores/auth.store";

const aiBaseUrl = import.meta.env.VITE_AI_BASE_URL ?? "/ai-api";

export const aiApi = axios.create({
  baseURL: aiBaseUrl,
  timeout: 90000,
  headers: {
    "Content-Type": "application/json",
  },
});

aiApi.interceptors.request.use((config) => {
  // Nếu request đang retry ở chế độ khách (skipAuth), không gắn lại token
  if ((config as any)._skipAuth) {
    return config;
  }
  const token = useAuthStore.getState().token;
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

aiApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalConfig = error?.config;
    // Không bao giờ xóa phiên đăng nhập chính (useAuthStore.logout) từ microservice AI!
    // Nếu AI service từ chối token (401 do lệch cấu hình), tự thử lại 1 lần ở chế độ khách để AI vẫn hoạt động mượt.
    if (
      error?.response?.status === 401 &&
      originalConfig &&
      !originalConfig._retriedWithoutAuth &&
      originalConfig.headers?.Authorization
    ) {
      originalConfig._retriedWithoutAuth = true;
      originalConfig._skipAuth = true;
      delete originalConfig.headers.Authorization;
      return aiApi.request(originalConfig);
    }
    return Promise.reject(error);
  }
);

export default aiApi;
