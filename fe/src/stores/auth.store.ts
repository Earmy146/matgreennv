import { create } from "zustand";
import type { User } from "@/types/user.types";

interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: localStorage.getItem("matgreen_user")
    ? JSON.parse(localStorage.getItem("matgreen_user")!)
    : null,
  token: localStorage.getItem("matgreen_token") || null,
  isAuthenticated: Boolean(localStorage.getItem("matgreen_token")),
  setAuth: (user, token) => {
    localStorage.setItem("matgreen_user", JSON.stringify(user));
    localStorage.setItem("matgreen_token", token);
    set({ user, token, isAuthenticated: true });
  },
  logout: () => {
    localStorage.removeItem("matgreen_user");
    localStorage.removeItem("matgreen_token");
    set({ user: null, token: null, isAuthenticated: false });
  },
}));
