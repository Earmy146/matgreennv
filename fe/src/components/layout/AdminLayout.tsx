import React, { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  Shield,
  LayoutDashboard,
  ShieldAlert,
  Newspaper,
  Users,
  Layers,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Sparkles,
  ChevronRight,
  Bell,
  CheckCircle2,
} from "lucide-react";
import { useAuthStore } from "@/stores/auth.store";

export const AdminLayout: React.FC = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navItems = [
    {
      label: "Tổng Quan Hệ Thống",
      href: "/admin",
      icon: LayoutDashboard,
      description: "Số liệu KPI, người dùng, bài đăng",
    },
    {
      label: "Kiểm Duyệt & An Toàn",
      href: "/admin/moderation",
      icon: ShieldAlert,
      description: "Xử lý bài đăng, báo cáo, khóa tài khoản",
    },
    {
      label: "Quản Trị Tin Tức",
      href: "/admin/news",
      icon: Newspaper,
      description: "Biên tập cẩm nang & tin tức tuần hoàn",
      adminOnly: true,
    },
  ];

  return (
    <div
      className="min-h-screen bg-slate-100/80 text-slate-800 flex font-sans admin-scrollable"
      data-lenis-prevent
    >
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      {/* Admin Dedicated Sidebar */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col w-80 bg-slate-900 text-white border-r border-slate-800 shadow-2xl transition-all duration-300 ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Brand & Portal Badge */}
        <div className="h-20 shrink-0 flex items-center justify-between px-6 border-b border-slate-800 bg-slate-950/40">
          <Link to="/admin" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-lg shadow-emerald-500/25 group-hover:scale-105 transition-transform">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-black text-white tracking-tight">MatGreen</span>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Admin
                </span>
              </div>
              <span className="text-[11px] text-slate-400 font-medium block">
                Cổng Điều Hành Nền Tảng
              </span>
            </div>
          </Link>

          <button
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Section */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
          <div className="space-y-1.5">
            <div className="px-3 text-[11px] font-bold tracking-wider uppercase text-slate-400 mb-2">
              Nghiệp Vụ Quản Trị
            </div>

            {navItems.map((item) => {
              if (item.adminOnly && user?.role !== "admin") return null;

              const Icon = item.icon;
              const isActive =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setIsMobileOpen(false)}
                  className={`flex items-start gap-3.5 px-4 py-3.5 rounded-2xl transition-all duration-200 ${
                    isActive
                      ? "bg-emerald-600 text-white font-bold shadow-lg shadow-emerald-600/30"
                      : "text-slate-300 hover:text-white hover:bg-slate-800/80"
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 shrink-0 mt-0.5 ${
                      isActive ? "text-white" : "text-slate-400"
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold leading-tight">{item.label}</div>
                    <div
                      className={`text-xs leading-normal mt-1 ${
                        isActive ? "text-emerald-100" : "text-slate-400"
                      }`}
                    >
                      {item.description}
                    </div>
                  </div>
                  {isActive && <ChevronRight className="w-4 h-4 shrink-0 mt-1 text-emerald-200" />}
                </Link>
              );
            })}
          </div>

          {/* Quick Shortcuts to Client View */}
          <div className="pt-4 border-t border-slate-800 space-y-1.5">
            <div className="px-3 text-[11px] font-bold tracking-wider uppercase text-slate-400 mb-2">
              Trải Nghiệm Khách Hàng
            </div>

            <Link
              to="/materials"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
            >
              <span className="flex items-center gap-2.5">
                <Layers className="w-4 h-4 text-emerald-400" />
                <span>Xem Sàn Vật Liệu</span>
              </span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
            </Link>

            <Link
              to="/"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
            >
              <span className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-teal-400" />
                <span>Xem Trang Chủ Web</span>
              </span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
            </Link>
          </div>
        </div>

        {/* Admin User Info & Logout Footer */}
        <div className="p-4 shrink-0 border-t border-slate-800 bg-slate-950/60">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-600 text-slate-950 font-black flex items-center justify-center text-sm shadow-sm shrink-0">
                {user?.name?.[0]?.toUpperCase() || "A"}
              </div>
              <div className="overflow-hidden">
                <div className="font-bold text-xs text-white truncate">{user?.name || "Quản trị viên"}</div>
                <div className="text-[10px] text-emerald-400 font-semibold truncate flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  {user?.role === "admin" ? "Quản Trị Viên Cấp Cao" : "Kiểm Duyệt Viên"}
                </div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              title="Đăng xuất khỏi Cổng Quản Trị"
              className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer shrink-0"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Admin View Container */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-80 transition-all">
        {/* Topbar for Admin Portal */}
        <header className="sticky top-0 z-30 h-16 bg-white/95 backdrop-blur-md border-b border-slate-200/90 px-4 sm:px-8 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
              <span className="hidden sm:inline">Cổng Quản Trị MatGreen</span>
              <span className="hidden sm:inline">/</span>
              <span className="text-slate-900 font-bold">
                {pathname === "/admin" && "Bảng Điều Hành Tổng Quan"}
                {pathname === "/admin/moderation" && "Kiểm Duyệt & An Toàn"}
                {pathname === "/admin/news" && "Quản Trị Tin Tức"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* System Status Pill */}
            <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Máy chủ hoạt động tốt</span>
            </div>

            {/* Quick Switch to Client Dashboard */}
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-colors"
              title="Chuyển sang giao diện bảng điều khiển người dùng"
            >
              <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden md:inline">Giao Diện Người Dùng</span>
            </Link>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Đăng Xuất</span>
            </button>
          </div>
        </header>

        {/* Content Outlet */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
