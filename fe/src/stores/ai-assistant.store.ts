import { create } from "zustand";

interface ActiveMaterialContext {
  materialId: string;
  title: string;
}

interface AiAssistantState {
  isOpen: boolean;
  materialContext: ActiveMaterialContext | null;
  pendingPrompt: string | null;
  openDrawer: (options?: { materialContext?: ActiveMaterialContext | null; prompt?: string }) => void;
  closeDrawer: () => void;
  clearPendingPrompt: () => void;
  clearMaterialContext: () => void;
}

export const useAiAssistantStore = create<AiAssistantState>((set) => ({
  isOpen: false,
  materialContext: null,
  pendingPrompt: null,
  openDrawer: (options) =>
    set({
      isOpen: true,
      materialContext: options?.materialContext ?? null,
      pendingPrompt: options?.prompt ?? null,
    }),
  closeDrawer: () => set({ isOpen: false }),
  clearPendingPrompt: () => set({ pendingPrompt: null }),
  clearMaterialContext: () => set({ materialContext: null }),
}));
