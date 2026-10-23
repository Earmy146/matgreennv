import api from "@/lib/api";
import aiApi from "@/lib/ai-api";
import type { MaterialItem, NearbyMaterialsResult } from "@/types/material.types";

export const materialsApi = {
  getNearby: async (params: {
    latitude: number;
    longitude: number;
    radiusKm?: number;
    diameterKm?: number;
    category?: string;
    type?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<NearbyMaterialsResult> => {
    const res = await api.get<{ data: NearbyMaterialsResult }>("/materials/nearby", { params });
    return res.data.data;
  },

  getAll: async (params?: { category?: string; type?: string; page?: number; limit?: number }) => {
    const res = await api.get<{ data: NearbyMaterialsResult }>("/materials", { params });
    return res.data.data;
  },

  getMyPosts: async (params?: { status?: string; page?: number; limit?: number }) => {
    const res = await api.get<{ data: { items: MaterialItem[]; pagination: any } }>("/materials/my-posts", {
      params,
    });
    return res.data.data;
  },

  updateStatus: async (id: string, status: string) => {
    const res = await api.patch<{ data: MaterialItem }>(`/materials/${id}/status`, { status });
    return res.data.data;
  },

  delete: async (id: string) => {
    const res = await api.delete<{ data: { success: boolean; message: string } }>(`/materials/${id}`);
    return res.data.data;
  },

  getById: async (id: string, coords?: { lat?: number; lng?: number }) => {
    const res = await api.get<{ data: MaterialItem }>(`/materials/${id}`, { params: coords });
    return res.data.data;
  },

  create: async (data: {
    title: string;
    description: string;
    category: string;
    type: string;
    price: number;
    unit: string;
    images: string[];
    latitude: number;
    longitude: number;
    accuracy: number;
    capturedAt: string;
    address: string;
    contactPhone: string;
    contactZalo?: string;
    contactName?: string;
    contactHours?: string;
  }) => {
    const res = await api.post<{ data: MaterialItem }>("/materials", data);
    return res.data.data;
  },
};

export const aiMaterialsApi = {
  analyzeDemolition: async (description: string, address?: string) => {
    const res = await aiApi.post("/ai/materials/analyze-demolition", {
      description,
      address,
    });
    return res.data;
  },

  chatAdvice: async (messages: Array<{ role: string; content: string }>, context?: string) => {
    const res = await aiApi.post("/ai/chat", { messages, context });
    return res.data;
  },
};

export const uploadApi = {
  uploadImage: async (file: File, folder = "materials") => {
    const formData = new FormData();
    formData.append("image", file);
    formData.append("folder", folder);

    const res = await api.post<{
      data: {
        url: string;
        public_id: string;
        format: string;
        width: number;
        height: number;
      };
    }>("/upload/image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data.data;
  },
};

export const authApi = {
  register: async (payload: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    address?: string;
  }) => {
    const res = await api.post<{
      message: string;
      data: { email: string; needVerify: boolean; message: string };
    }>("/auth/register", payload);
    return res.data;
  },

  verifyEmail: async (payload: { email: string; otp: string }) => {
    const res = await api.post<{
      message: string;
      data: {
        user: any;
        token: string;
        message: string;
      };
    }>("/auth/verify-email", payload);
    return res.data;
  },

  resendOtp: async (email: string) => {
    const res = await api.post<{
      message: string;
      data: { email: string; message: string };
    }>("/auth/resend-otp", { email });
    return res.data;
  },

  login: async (payload: { email: string; password: string }) => {
    const res = await api.post<{
      message: string;
      data: {
        user?: any;
        token?: string;
        needVerify?: boolean;
        email?: string;
        message?: string;
      };
    }>("/auth/login", payload);
    return res.data;
  },

  me: async () => {
    const res = await api.get<{ message: string; data: any }>("/auth/me");
    return res.data;
  },
};
