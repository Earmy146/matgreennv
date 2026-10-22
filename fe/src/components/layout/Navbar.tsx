import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Recycle, PlusCircle, MapPin, Sparkles, MessageSquare, User as UserIcon } from "lucide-react";
import { useAuthStore } from "@/stores/auth.store";

export const Navbar: React.FC = () => {
  const { pathname } = useLocation();
  const { user, isAuthenticated, logout } = useAuthStore();

  const navLinks = [
    { label: "Tìm Quanh Đây", href: "/", icon: MapPin },
    { label: "AI Bóc Tách Vật Liệu", href: "/ai-advisor", icon: Sparkles },
    { label: "Tin Nhắn", href: "/chat", icon: MessageSquare },
  ];

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/85 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2.5 font-bold text-xl text-slate-900 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <Recycle className="w-6 h-6 animate-spin-slow" />
          </div>
          <div>
            <span className="text-emerald-700 tracking-tight font-extrabold text-2xl">Mat</span>
            <span className="text-slate-800">Green</span>
            <span className="hidden sm:inline-block ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              Vật Liệu Tháo Dỡ
            </span>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                to={link.href}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-emerald-50 text-emerald-700 font-semibold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-emerald-600" : "text-slate-400"}`} />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Action Button & Auth */}
        <div className="flex items-center gap-3">
          <Link
            to="/post"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm shadow-sm shadow-emerald-600/30 hover:shadow-md transition-all active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span className="hidden sm:inline">Đăng Vật Liệu</span>
          </Link>

          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 hidden sm:inline">Chào, {user?.name}</span>
              <button
                onClick={logout}
                className="text-xs text-rose-600 hover:underline px-2 py-1"
              >
                Đăng xuất
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-1 text-sm font-medium text-slate-700 hover:text-emerald-700 px-3 py-2 rounded-lg hover:bg-slate-100"
            >
              <UserIcon className="w-4 h-4 text-slate-400" />
              <span>Đăng nhập</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
