export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  role: "user" | "moderator" | "admin" | "superadmin";
  isVerified?: boolean;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}
