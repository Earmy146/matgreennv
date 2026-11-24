import { create } from "zustand";
import { aiMaterialsApi } from "@/services/api";
import type { AiChatMessage, AiConversationSummary } from "@/types/ai.types";

const GUEST_STORAGE_KEY = "matgreen_ai_guest_chat_v2";
const ACTIVE_CONV_KEY = "matgreen_ai_active_conv_v2";

export const DEFAULT_AI_WELCOME: AiChatMessage = {
  role: "assistant",
  content:
    "Xin chào! Mình là **MatGreen AI** kết nối trực tiếp kho vật liệu thật của MatGreen.\n- Hỏi tìm vật liệu **cho tặng 0đ** hoặc **thanh lý** quanh vị trí GPS của bạn.\n- Thẩm định giá sắt thép, tôn, cửa nhôm kính, gỗ cốp pha cũ.\n- Tư vấn phương án tháo dỡ & loại xe tải vận chuyển phù hợp.",
};

function readGuestMessages(): AiChatMessage[] {
  try {
    const raw = localStorage.getItem(GUEST_STORAGE_KEY);
    if (!raw) return [DEFAULT_AI_WELCOME];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) return parsed.slice(-30);
  } catch {
    // ignore storage errors
  }
  return [DEFAULT_AI_WELCOME];
}

function writeGuestMessages(messages: AiChatMessage[]) {
  try {
    localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(messages.slice(-30)));
  } catch {
    // ignore
  }
}

interface ActiveMaterialContext {
  materialId: string;
  title: string;
}

interface AiAssistantState {
  isOpen: boolean;
  materialContext: ActiveMaterialContext | null;
  pendingPrompt: string | null;

  // Shared synchronized conversation state across FloatingAiAssistant & AiAdvisorPage
  activeConversationId: string | null;
  conversations: AiConversationSummary[];
  messages: AiChatMessage[];
  historyLoading: boolean;
  historyLoadedForUser: string | null;

  openDrawer: (options?: { materialContext?: ActiveMaterialContext | null; prompt?: string }) => void;
  closeDrawer: () => void;
  clearPendingPrompt: () => void;
  clearMaterialContext: () => void;

  syncForAuth: (userId: string | null) => Promise<void>;
  selectConversation: (conversationId: string) => Promise<void>;
  startNewConversation: (isAuthenticated: boolean) => void;
  deleteConversation: (conversationId: string) => Promise<void>;
  setMessagesLocal: (messages: AiChatMessage[], isAuthenticated: boolean) => void;
  persistTurn: (params: {
    isAuthenticated: boolean;
    userContent: string;
    assistantMessage: AiChatMessage;
    materialId?: string | null;
  }) => Promise<void>;
}

export const useAiAssistantStore = create<AiAssistantState>((set, get) => ({
  isOpen: false,
  materialContext: null,
  pendingPrompt: null,

  activeConversationId: null,
  conversations: [],
  messages: readGuestMessages(),
  historyLoading: false,
  historyLoadedForUser: null,

  openDrawer: (options) =>
    set((state) => ({
      isOpen: true,
      materialContext:
        options?.materialContext !== undefined ? options.materialContext : state.materialContext,
      pendingPrompt: options?.prompt ?? null,
    })),
  closeDrawer: () => set({ isOpen: false }),
  clearPendingPrompt: () => set({ pendingPrompt: null }),
  clearMaterialContext: () => set({ materialContext: null }),

  syncForAuth: async (userId) => {
    if (!userId) {
      set({
        historyLoadedForUser: null,
        activeConversationId: null,
        conversations: [],
        messages: readGuestMessages(),
        historyLoading: false,
      });
      return;
    }
    if (get().historyLoadedForUser === userId && !get().historyLoading) {
      return;
    }

    set({ historyLoading: true });
    try {
      const list = await aiMaterialsApi.listConversations(20);
      const savedActiveId = localStorage.getItem(ACTIVE_CONV_KEY);
      const targetId =
        savedActiveId && list.some((c) => c._id === savedActiveId)
          ? savedActiveId
          : list[0]?._id || null;

      if (targetId) {
        const detail = await aiMaterialsApi.getConversation(targetId);
        set({
          conversations: list,
          activeConversationId: detail._id,
          messages: detail.messages.length ? detail.messages : [DEFAULT_AI_WELCOME],
          historyLoadedForUser: userId,
          historyLoading: false,
        });
      } else {
        set({
          conversations: list,
          activeConversationId: null,
          messages: [DEFAULT_AI_WELCOME],
          historyLoadedForUser: userId,
          historyLoading: false,
        });
      }
    } catch {
      set({
        historyLoadedForUser: userId,
        historyLoading: false,
      });
    }
  },

  selectConversation: async (conversationId) => {
    set({ historyLoading: true });
    try {
      const detail = await aiMaterialsApi.getConversation(conversationId);
      localStorage.setItem(ACTIVE_CONV_KEY, detail._id);
      set({
        activeConversationId: detail._id,
        messages: detail.messages.length ? detail.messages : [DEFAULT_AI_WELCOME],
        historyLoading: false,
      });
    } catch {
      set({ historyLoading: false });
    }
  },

  startNewConversation: (isAuthenticated) => {
    localStorage.removeItem(ACTIVE_CONV_KEY);
    if (!isAuthenticated) {
      writeGuestMessages([DEFAULT_AI_WELCOME]);
    }
    set({
      activeConversationId: null,
      messages: [DEFAULT_AI_WELCOME],
      materialContext: null,
    });
  },

  deleteConversation: async (conversationId) => {
    await aiMaterialsApi.deleteConversation(conversationId);
    const remaining = get().conversations.filter((c) => c._id !== conversationId);
    const wasActive = get().activeConversationId === conversationId;
    if (wasActive) {
      localStorage.removeItem(ACTIVE_CONV_KEY);
      if (remaining[0]) {
        set({ conversations: remaining });
        await get().selectConversation(remaining[0]._id);
      } else {
        set({
          conversations: remaining,
          activeConversationId: null,
          messages: [DEFAULT_AI_WELCOME],
        });
      }
    } else {
      set({ conversations: remaining });
    }
  },

  setMessagesLocal: (messages, isAuthenticated) => {
    if (!isAuthenticated) {
      writeGuestMessages(messages);
    }
    set({ messages });
  },

  persistTurn: async ({ isAuthenticated, userContent, assistantMessage, materialId }) => {
    if (!isAuthenticated) {
      writeGuestMessages(get().messages);
      return;
    }
    try {
      const saved = await aiMaterialsApi.saveConversationTurn({
        conversationId: get().activeConversationId,
        materialId: materialId || undefined,
        userMessage: { content: userContent },
        assistantMessage: {
          content: assistantMessage.content,
          recommended_materials: assistantMessage.recommended_materials,
          tools_used: assistantMessage.tools_used,
          model: assistantMessage.model,
        },
      });
      localStorage.setItem(ACTIVE_CONV_KEY, saved._id);
      const summary: AiConversationSummary = {
        _id: saved._id,
        title: saved.title,
        materialId: saved.materialId,
        messageCount: saved.messages.length,
        lastMessagePreview: assistantMessage.content.slice(0, 120),
        lastMessageAt: saved.lastMessageAt,
        createdAt: saved.createdAt,
      };
      const nextList = [
        summary,
        ...get().conversations.filter((c) => c._id !== saved._id),
      ].slice(0, 20);

      set({
        activeConversationId: saved._id,
        conversations: nextList,
      });
    } catch {
      // Do not interrupt UX if history persistence fails transiently
    }
  },
}));
