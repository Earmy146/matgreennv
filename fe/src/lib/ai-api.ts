import axios from "axios";

const aiBaseUrl = import.meta.env.VITE_AI_BASE_URL ?? "/ai-api";

export const aiApi = axios.create({
  baseURL: aiBaseUrl,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default aiApi;
