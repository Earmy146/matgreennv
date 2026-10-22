import axios from "axios";
import { useAuthStore } from "@/stores/auth.store";

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

export default api;
