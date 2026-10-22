import api from "@/lib/api";
import aiApi from "@/lib/ai-api";
import type { MaterialItem } from "@/types/material.types";

export const materialsApi = {
  getNearby: async (params: {
    latitude: number;
    longitude: number;
    radiusKm: number;
    category?: string;
    type?: string;
  }) => {
    const res = await api.get<{ data: MaterialItem[] }>("/materials/nearby", { params });
    return res.data.data;
  },

  getAll: async (params?: { category?: string; type?: string; page?: number; limit?: number }) => {
    const res = await api.get<{ data: { items: MaterialItem[] } }>("/materials", { params });
    return res.data.data.items;
  },

  getById: async (id: string, coords?: { lat?: number; lng?: number }) => {
    const res = await api.get<{ data: MaterialItem }>(`/materials/${id}`, { params: coords });
    return res.data.data;
  },

  create: async (data: any) => {
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

