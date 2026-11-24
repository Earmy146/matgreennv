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
  const token = useAuthStore.getState().token;
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default aiApi;
