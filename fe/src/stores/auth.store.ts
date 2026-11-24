import { create } from "zustand";
import type { User } from "@/types/user.types";

interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
}

function normalizeUser(raw: any): User | null {
  if (!raw || typeof raw !== "object") return null;
  const id = raw.id || raw._id;
  if (!id || !raw.email) return null;
  return {
    ...raw,
    id: String(id),
    role: raw.role || "user",
  } as User;
}

function loadInitialAuth(): { user: User | null; token: string | null; isAuthenticated: boolean } {
  try {
    const rawToken = localStorage.getItem("matgreen_token");
    const rawUser = localStorage.getItem("matgreen_user");
    const token = rawToken && rawToken !== "undefined" && rawToken !== "null" ? rawToken : null;
    const parsedUser = rawUser ? normalizeUser(JSON.parse(rawUser)) : null;

    if (!token || !parsedUser) {
      localStorage.removeItem("matgreen_token");
      localStorage.removeItem("matgreen_user");
      return { user: null, token: null, isAuthenticated: false };
    }

    return { user: parsedUser, token, isAuthenticated: true };
  } catch {
    localStorage.removeItem("matgreen_token");
    localStorage.removeItem("matgreen_user");
    return { user: null, token: null, isAuthenticated: false };
  }
}

const initial = loadInitialAuth();

export const useAuthStore = create<AuthStore>((set) => ({
  user: initial.user,
  token: initial.token,
  isAuthenticated: initial.isAuthenticated,
  setAuth: (rawUser, token) => {
    const user = normalizeUser(rawUser);
    if (!user || !token) return;
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
