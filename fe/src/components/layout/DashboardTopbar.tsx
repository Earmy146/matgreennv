import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Menu,
  Search,
  MapPin,
  LocateFixed,
  PlusCircle,
  Bell,
  MessageSquare,
  Sparkles,
  SlidersHorizontal,
  Shield,
} from "lucide-react";
import { useLocationStore } from "@/stores/location.store";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useAuthStore } from "@/stores/auth.store";
import { notificationsApi } from "@/services/api";

interface DashboardTopbarProps {
  onToggleMobileMenu: () => void;
  onToggleSidebar?: () => void;
  collapsed?: boolean;
}

export const DashboardTopbar: React.FC<DashboardTopbarProps> = ({
  onToggleMobileMenu,
  onToggleSidebar,
  collapsed,
}) => {
  const { latitude, longitude, radiusKm, setRadius, address } = useLocationStore();
  const { getCurrentLocation, isLocating } = useGeolocation();
  const { user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [notificationsOpen, setNotificationsOpen] = React.useState(false);
  const { data: notifications } = useQuery({
    queryKey: ["notifications"],
    queryFn: () => notificationsApi.list(),
    enabled: isAuthenticated,
    refetchInterval: 30000,
  });
  const markAllRead = useMutation({
    mutationFn: notificationsApi.markAllRead,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notifications"] }),
  });
  const markRead = useMutation({
    mutationFn: notificationsApi.markRead,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notifications"] }),
  });

  const radiusList = [1, 3, 5, 10, 20];

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200 h-16 px-4 sm:px-6 flex items-center justify-between gap-3">
      {/* Left: Mobile hamburger & Global Search */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        <button
          onClick={onToggleMobileMenu}
          className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
          title="Mở menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Home Link */}
        <Link
          to="/"
          className="hidden lg:inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600 hover:text-emerald-700 hover:bg-slate-50 text-xs font-bold transition-colors"
          title="Về Trang Chủ"
        >
          Trang Chủ
        </Link>

        {/* Global Search Bar */}
        <div className="relative w-full max-w-md hidden sm:block">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Tìm theo vật liệu (thép, xà bần, cửa, gạch...) hoặc địa chỉ..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* Center: Radius Selector Pills */}
      <div className="hidden md:flex items-center gap-1.5 bg-slate-100/80 p-1 rounded-2xl border border-slate-200/60">
        <span className="text-[11px] font-bold text-slate-500 px-2 flex items-center gap-1">
          <SlidersHorizontal className="w-3 h-3 text-slate-400" />
          Bán kính:
        </span>
        {radiusList.map((r) => (
          <button
            key={r}
            onClick={() => setRadius(r)}
            className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
              radiusKm === r
                ? "bg-white text-emerald-700 shadow-xs"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            {r}km
          </button>
        ))}
      </div>

      {/* Right: GPS Quick Chip & Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick GPS button */}
        <button
          onClick={getCurrentLocation}
          disabled={isLocating}
          className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs transition-all cursor-pointer ${
            latitude && longitude
              ? "border border-emerald-200 bg-emerald-50 text-emerald-800 font-semibold hover:bg-emerald-100/70"
              : "bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-xs shadow-emerald-600/30 ring-2 ring-emerald-500/20"
          }`}
          title="Nhấn để lấy tọa độ thực tế từ GPS"
        >
          <LocateFixed
            className={`w-3.5 h-3.5 ${
              isLocating
                ? "animate-spin"
                : latitude && longitude
                ? "text-emerald-600"
                : "text-white"
            }`}
          />
          <span className="max-w-[120px] truncate">
            {isLocating
              ? "Đang dò GPS..."
              : latitude && longitude
              ? address || "GPS Đã Bật"
              : "Bật Vị Trí GPS"}
          </span>
        </button>

        {/* AI Quick Button */}
        <Link
          to="/ai-advisor"
          className="p-2 rounded-xl text-teal-700 bg-teal-50 hover:bg-teal-100 border border-teal-200 transition-colors"
          title="AI Bóc tách & Định giá"
        >
          <Sparkles className="w-4 h-4 text-teal-600" />
        </Link>

        {/* Chat Button */}
        <Link
          to="/chat"
          className="relative p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
          title="Tin nhắn"
        >
          <MessageSquare className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white" />
        </Link>

        <div className="relative">
          <button
            type="button"
            onClick={() => setNotificationsOpen((open) => !open)}
            className="relative p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
            title="Thông báo"
          >
            <Bell className="w-4 h-4" />
            {(notifications?.unreadCount || 0) > 0 && (
              <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full bg-rose-600 text-white text-[9px] font-bold flex items-center justify-center">
                {notifications?.unreadCount}
              </span>
            )}
          </button>
          {notificationsOpen && (
            <div className="absolute right-0 top-11 w-80 max-w-[calc(100vw-2rem)] rounded-2xl border border-slate-200 bg-white shadow-xl overflow-hidden z-50">
              <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-slate-100">
                <strong className="text-sm text-slate-900">Thông báo</strong>
                {(notifications?.unreadCount || 0) > 0 && (
                  <button type="button" onClick={() => markAllRead.mutate()} className="text-[11px] font-bold text-emerald-700 hover:underline">
                    Đánh dấu đã đọc
                  </button>
                )}
              </div>
              <div className="max-h-80 overflow-y-auto">
                {!notifications?.items.length ? (
                  <p className="px-4 py-8 text-center text-xs text-slate-500">Chưa có thông báo.</p>
                ) : notifications.items.map((notification) => (
                  <button
                    type="button"
                    key={notification._id}
                    onClick={() => {
                      if (!notification.readAt) markRead.mutate(notification._id);
                      setNotificationsOpen(false);
                      if (notification.link) navigate(notification.link);
                    }}
                    className={`w-full text-left px-4 py-3 border-b border-slate-100 hover:bg-slate-50 ${notification.readAt ? "bg-white" : "bg-emerald-50/60"}`}
                  >
                    <div className="flex items-start gap-2">
                      <span className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${notification.readAt ? "bg-slate-300" : "bg-emerald-600"}`} />
                      <span className="min-w-0">
                        <span className="block text-xs font-bold text-slate-800">{notification.title}</span>
                        <span className="block mt-1 text-xs text-slate-600">{notification.message}</span>
                        <span className="block mt-1 text-[10px] text-slate-400">{new Date(notification.createdAt).toLocaleString("vi-VN")}</span>
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Admin Quick Portal Access */}
        {isAuthenticated && (user?.role === "admin" || user?.role === "moderator") && (
          <Link
            to="/admin"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-sm transition-colors border border-slate-700"
            title="Trở về Cổng Quản Trị Hệ Thống"
          >
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Cổng Quản Trị</span>
          </Link>
        )}

        {/* Post Button (Nhà A) */}
        <Link
          to="/post"
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-bold shadow-sm shadow-emerald-600/20 active:scale-95 transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span className="hidden sm:inline">Đăng Vật Liệu</span>
        </Link>

        {/* User Avatar */}
        {isAuthenticated ? (
          <Link
            to="/my-posts"
            className="w-8 h-8 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-800 font-bold flex items-center justify-center text-xs"
            title={user?.name}
          >
            {user?.name?.[0]?.toUpperCase() || "U"}
          </Link>
        ) : (
          <Link
            to="/login"
            className="text-xs font-bold text-slate-700 hover:text-emerald-700 px-2 py-1"
          >
            Đăng nhập
          </Link>
        )}
      </div>
    </header>
  );
};
