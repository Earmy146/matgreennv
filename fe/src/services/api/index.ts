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
  update: async (id: string, data: Partial<MaterialItem>) => {
    const res = await api.patch<{ data: MaterialItem }>(`/materials/${id}`, data);
    return res.data.data;
  },
  verifyLocation: async (id: string) => {
    const res = await api.post<{ data: MaterialItem }>(`/materials/${id}/verify-location`);
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

export interface MaterialRequest {
  _id: string;
  message?: string;
  status: "pending" | "approved" | "rejected" | "cancelled" | "completed";
  scheduledAt?: string;
  completedAt?: string;
  material: MaterialItem;
  requester: { _id: string; name: string; phone?: string; email?: string };
  createdAt: string;
  updatedAt: string;
}

export const materialRequestsApi = {
  create: async (materialId: string, message?: string) => {
    const res = await api.post<{ data: MaterialRequest }>("/material-requests", {
      materialId,
      message,
    });
    return res.data.data;
  },
  listMine: async (role: "requester" | "owner" = "requester") => {
    const res = await api.get<{ data: MaterialRequest[] }>("/material-requests", {
      params: { role },
    });
    return res.data.data;
  },
  updateStatus: async (id: string, status: MaterialRequest["status"]) => {
    const res = await api.patch<{ data: MaterialRequest }>(`/material-requests/${id}/status`, {
      status,
    });
    return res.data.data;
  },
  schedule: async (id: string, scheduledAt: string) => {
    const res = await api.patch<{ data: MaterialRequest }>(`/material-requests/${id}/schedule`, {
      scheduledAt,
    });
    return res.data.data;
  },
};

export interface ChatAttachment {
  url: string;
  name: string;
  mimetype: string;
  size?: number;
}

export interface ChatMessage {
  _id: string;
  content: string;
  sender: { _id: string; name: string; avatar?: string };
  receiver: { _id: string; name: string; avatar?: string };
  material?: string;
  isRead: boolean;
  createdAt: string;
  attachments?: ChatAttachment[];
}

export interface ChatMessagesPage {
  items: ChatMessage[];
  pagination: { page: number; limit: number; total: number; hasMore: boolean };
}

export interface ChatConversation {
  partner: { _id: string; name: string; avatar?: string };
  materialId?: string;
  lastMessage: { _id: string; content: string; createdAt: string };
  unreadCount: number;
}

export const chatApi = {
  getConversations: async () => {
    const res = await api.get<{ data: ChatConversation[] }>("/chat/conversations");
    return res.data.data;
  },
  getMessages: async (params: { partnerId: string; materialId?: string; page?: number; limit?: number }) => {
    const res = await api.get<{ data: ChatMessagesPage }>("/chat/messages", { params });
    return res.data.data;
  },
  sendMessage: async (payload: { receiverId: string; materialId?: string; content: string; attachments?: ChatAttachment[] }) => {
    const res = await api.post<{ data: ChatMessage }>("/chat/messages", payload);
    return res.data.data;
  },
  markRead: async (payload: { partnerId: string; materialId?: string }) => {
    await api.patch("/chat/messages/read", payload);
  },
};

export interface NotificationItem {
  _id: string;
  type: "chat" | "request_created" | "request_status" | "request_scheduled" | "moderation";
  title: string;
  message: string;
  link?: string;
  readAt?: string;
  createdAt: string;
}

export const notificationsApi = {
  list: async (limit = 30) => {
    const res = await api.get<{ data: { items: NotificationItem[]; unreadCount: number } }>("/notifications", {
      params: { limit },
    });
    return res.data.data;
  },
  markRead: async (id: string) => {
    await api.patch(`/notifications/${id}/read`);
  },
  markAllRead: async () => {
    await api.patch("/notifications/read-all");
  },
};

export interface FavoriteItem {
  _id: string;
  createdAt: string;
  material: MaterialItem;
}

export const favoritesApi = {
  list: async () => {
    const res = await api.get<{ data: FavoriteItem[] }>("/favorites");
    return res.data.data;
  },
  status: async (materialId: string) => {
    const res = await api.get<{ data: { materialId: string; saved: boolean } }>(`/favorites/${materialId}/status`);
    return res.data.data;
  },
  add: async (materialId: string) => {
    const res = await api.post<{ data: { materialId: string; saved: boolean } }>(`/favorites/${materialId}`);
    return res.data.data;
  },
  remove: async (materialId: string) => {
    const res = await api.delete<{ data: { materialId: string; saved: boolean } }>(`/favorites/${materialId}`);
    return res.data.data;
  },
};

export const reviewsApi = {
  list: async (requestId: string) => {
    const res = await api.get(`/reviews/${requestId}`);
    return res.data.data;
  },
  create: async (requestId: string, rating: number, comment: string) => {
    const res = await api.post(`/reviews/${requestId}`, { rating, comment });
    return res.data.data;
  },
};

export const reportsApi = {
  create: async (payload: { targetType: "material" | "user"; materialId?: string; targetUserId?: string; reason: string }) => {
    const res = await api.post("/reports", payload);
    return res.data.data;
  },
  list: async (params?: { page?: number; limit?: number; status?: string }) => (await api.get("/reports", { params })).data.data,
  update: async (id: string, status: string, resolution: string) => (await api.patch(`/reports/${id}`, { status, resolution })).data.data,
};

export const adminApi = {
  stats: async () => (await api.get("/admin/stats")).data.data,
  users: async (params?: { page?: number; limit?: number; search?: string }) => (await api.get("/admin/users", { params })).data.data,
  suspendUser: async (id: string, suspended: boolean, reason: string) => (await api.patch(`/admin/users/${id}/suspend`, { suspended, reason })).data.data,
  materials: async (params?: { page?: number; limit?: number }) => (await api.get("/admin/materials", { params })).data.data,
  phoneVerificationRequests: async (params?: { page?: number; limit?: number }) => (await api.get("/admin/phone-verification-requests", { params })).data.data,
  verifyPhone: async (id: string, verified: boolean, reason: string) => (await api.patch(`/admin/users/${id}/phone-verification`, { verified, reason })).data.data,
  moderateMaterial: async (id: string, status: string, reason: string) => (await api.patch(`/admin/materials/${id}/status`, { status, reason })).data.data,
  auditLogs: async (params?: { page?: number; limit?: number }) => (await api.get("/admin/audit-logs", { params })).data.data,
  getSiteConfig: async () => (await api.get("/admin/site-config")).data.data,
  updateSiteConfig: async (data: any) => (await api.put("/admin/site-config", data)).data.data,
};

export const siteConfigApi = {
  get: async () => (await api.get("/site-config")).data.data,
  update: async (data: any) => (await api.put("/admin/site-config", data)).data.data,
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
  uploadAttachment: async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await api.post<{ data: { url: string; originalname: string; mimetype: string; bytes: number } }>("/upload/attachment", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return { url: res.data.data.url, name: res.data.data.originalname, mimetype: res.data.data.mimetype, size: res.data.data.bytes };
  },
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
  updateProfile: async (payload: { name: string; phone?: string; address?: string; bio?: string }) => {
    const res = await api.patch<{ message: string; data: any }>("/auth/profile", payload);
    return res.data;
  },
  changePassword: async (payload: { currentPassword: string; newPassword: string }) => {
    const res = await api.patch<{ message: string; data: any }>("/auth/change-password", payload);
    return res.data;
  },
  forgotPassword: async (email: string) => {
    const res = await api.post<{ message: string; data: any }>("/auth/forgot-password", { email });
    return res.data;
  },
  resetPassword: async (payload: { email: string; otp: string; newPassword: string }) => {
    const res = await api.post<{ message: string; data: any }>("/auth/reset-password", payload);
    return res.data;
  },
  requestPhoneVerification: async (note?: string) => {
    const res = await api.post<{ message: string; data: any }>("/auth/phone-verification-request", { note });
    return res.data;
  },
  publicProfile: async (id: string) => {
    const res = await api.get<{ message: string; data: any }>(`/auth/users/${id}/profile`);
    return res.data;
  },
};
