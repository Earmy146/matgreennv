import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Bell,
  ChevronDown,
  Loader2,
  LocateFixed,
  MapPin,
  Menu,
  MessageSquare,
  PlusCircle,
  Search,
  Shield,
  X,
} from "lucide-react";
import {
  POPULAR_LOCATIONS,
  useLocationStore,
  type LocationPreset,
} from "@/stores/location.store";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useAuthStore } from "@/stores/auth.store";
import { toast } from "@/stores/toast.store";
import { chatApi, notificationsApi, type NotificationItem } from "@/services/api";

function getRealtimeSocketUrl() {
  const configuredApiUrl = import.meta.env.VITE_API_BASE_URL;
  if (configuredApiUrl?.startsWith("http")) {
    return configuredApiUrl.replace(/\/api\/?$/, "");
  }
  return window.location.origin;
}

interface DashboardTopbarProps {
  onToggleMobileMenu: () => void;
  onToggleSidebar?: () => void;
  collapsed?: boolean;
}

const RADIUS_PRESETS = [1, 3, 5, 10, 20, 50];

export const DashboardTopbar: React.FC<DashboardTopbarProps> = ({
  onToggleMobileMenu,
}) => {
  const { latitude, longitude, radiusKm, setRadius, setLocation, address } = useLocationStore();
  const { getCurrentLocation, isLocating, error: gpsError } = useGeolocation();
  const { user, token, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();

  const [searchValue, setSearchValue] = useState(searchParams.get("search") || "");
  const [locationPopoverOpen, setLocationPopoverOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [customRadiusInput, setCustomRadiusInput] = useState(String(radiusKm));

  const locationRef = useRef<HTMLDivElement | null>(null);
  const notifRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setSearchValue(searchParams.get("search") || "");
  }, [searchParams]);

  useEffect(() => {
    setCustomRadiusInput(String(radiusKm));
  }, [radiusKm]);

  // Close popovers on outside click
  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (locationRef.current && !locationRef.current.contains(event.target as Node)) {
        setLocationPopoverOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
    };
    window.addEventListener("pointerdown", handlePointerDown);
    return () => window.removeEventListener("pointerdown", handlePointerDown);
  }, []);

  const { data: notifications } = useQuery({
    queryKey: ["notifications"],
    queryFn: () => notificationsApi.list(),
    enabled: isAuthenticated,
    refetchInterval: 30000,
  });

  const { data: conversations = [] } = useQuery({
    queryKey: ["chat-conversations-unread"],
    queryFn: chatApi.getConversations,
    enabled: isAuthenticated,
    staleTime: 30000,
    refetchInterval: 45000,
  });
  const unreadChatCount = conversations.reduce((sum, c) => sum + (c.unreadCount || 0), 0);

  // Global Realtime Socket Listener for instant notification & chat badges
  useEffect(() => {
    if (!isAuthenticated || !token) return;
    const socket = io(getRealtimeSocketUrl(), {
      auth: { token },
      transports: ["websocket"],
    });

    socket.on("new_notification", (notif: NotificationItem) => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["material-requests"] });
      if (notif?.title || notif?.message) {
        toast.info(notif.title ? `${notif.title}: ${notif.message}` : notif.message);
      }
    });

    socket.on("new_message", () => {
      queryClient.invalidateQueries({ queryKey: ["chat-conversations-unread"] });
    });

    return () => {
      socket.disconnect();
    };
  }, [isAuthenticated, queryClient, token]);

  const markAllRead = useMutation({
    mutationFn: notificationsApi.markAllRead,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notifications"] }),
  });
  const markRead = useMutation({
    mutationFn: notificationsApi.markRead,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notifications"] }),
  });

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const term = searchValue.trim();
    const params = new URLSearchParams(
      location.pathname === "/materials" || location.pathname === "/dashboard"
        ? searchParams
        : undefined
    );
    if (term) params.set("search", term);
    else params.delete("search");

    const targetPath = location.pathname === "/dashboard" ? "/dashboard" : "/materials";
    const qs = params.toString();
    navigate(qs ? `${targetPath}?${qs}` : targetPath);
  };

  const handleClearSearch = () => {
    setSearchValue("");
    if (location.pathname === "/materials" || location.pathname === "/dashboard") {
      const params = new URLSearchParams(searchParams);
      params.delete("search");
      const qs = params.toString();
      navigate(qs ? `${location.pathname}?${qs}` : location.pathname);
    }
  };

  const handleSelectPreset = (preset: LocationPreset) => {
    setLocation(preset.lat, preset.lng, preset.address, 10, new Date().toISOString());
    setLocationPopoverOpen(false);
  };

  const handleApplyCustomRadius = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(customRadiusInput);
    if (!Number.isNaN(val) && val >= 0.5 && val <= 200) {
      setRadius(Math.round(val * 10) / 10);
    }
  };

  const shortLocationLabel =
    latitude && longitude
      ? address && !address.startsWith("GPS (")
        ? address.split(",")[0]
        : "Đã bật GPS"
      : "Chọn vị trí";

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/90 h-16 px-3 sm:px-6 flex items-center justify-between gap-2.5 sm:gap-4">
      {/* Left: Mobile hamburger + REAL Working Global Search */}
      <div className="flex items-center gap-2.5 flex-1 min-w-0 max-w-xl">
        <button
          type="button"
          onClick={onToggleMobileMenu}
          className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
          title="Mở menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <form onSubmit={handleSearchSubmit} className="relative flex-1 min-w-0">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Tìm sắt thép, gạch cũ, cửa nhôm, xà bần hoặc địa chỉ..."
            className="w-full pl-10 pr-9 py-2 rounded-xl bg-slate-100/80 border border-slate-200/80 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all placeholder:text-slate-400"
          />
          {searchValue && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200/70 cursor-pointer"
              title="Xóa từ khóa"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </form>
      </div>

      {/* Right: Unified Location/Radius Popover + Chat + Notifications + Post */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
        {/* Single Consolidated GPS + Radius Control */}
        <div className="relative" ref={locationRef}>
          <button
            type="button"
            onClick={() => setLocationPopoverOpen((open) => !open)}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
              latitude && longitude
                ? "border-emerald-200 bg-emerald-50/80 text-emerald-800 hover:bg-emerald-100/70"
                : "border-amber-300 bg-amber-50 text-amber-900 hover:bg-amber-100"
            }`}
            title="Cài đặt vị trí GPS & bán kính quét"
          >
            <MapPin className="w-3.5 h-3.5 shrink-0 text-emerald-600" />
            <span className="hidden md:inline max-w-[110px] truncate">{shortLocationLabel}</span>
            <span className="px-1.5 py-0.5 rounded-md bg-white/90 text-emerald-700 text-[11px] font-extrabold border border-emerald-200/70">
              {radiusKm} km
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
          </button>

          {locationPopoverOpen && (
            <div
              data-lenis-prevent
              className="absolute right-0 top-12 w-80 max-w-[calc(100vw-1.5rem)] rounded-2xl border border-slate-200 bg-white shadow-2xl p-4 space-y-4 z-50"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-extrabold text-slate-900">Vị Trí & Bán Kính Quét</div>
                  <div className="text-[11px] text-slate-500 mt-0.5 truncate max-w-[210px]">
                    {latitude && longitude
                      ? address || `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
                      : "Chưa bật GPS (đang xem toàn sàn)"}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setLocationPopoverOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <button
                type="button"
                onClick={async () => {
                  try {
                    await getCurrentLocation();
                  } catch {
                    // error shown below
                  }
                }}
                disabled={isLocating}
                className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-60 cursor-pointer"
              >
                {isLocating ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <LocateFixed className="w-4 h-4" />
                )}
                <span>{isLocating ? "Đang dò tọa độ GPS..." : "Cập nhật GPS hiện tại của tôi"}</span>
              </button>

              {gpsError && (
                <div className="text-[11px] text-rose-600 bg-rose-50 border border-rose-200 rounded-xl px-3 py-2">
                  {gpsError}
                </div>
              )}

              {/* Radius pills + custom input */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Bán kính tìm kiếm ({radiusKm} km)
                </div>
                <div className="grid grid-cols-6 gap-1">
                  {RADIUS_PRESETS.map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRadius(r)}
                      className={`py-1.5 rounded-lg text-[11px] font-bold transition-colors cursor-pointer ${
                        radiusKm === r
                          ? "bg-emerald-600 text-white shadow-xs"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {r}km
                    </button>
                  ))}
                </div>
                <form onSubmit={handleApplyCustomRadius} className="flex items-center gap-1.5 pt-1">
                  <input
                    type="number"
                    min="0.5"
                    max="200"
                    step="0.5"
                    value={customRadiusInput}
                    onChange={(e) => setCustomRadiusInput(e.target.value)}
                    className="flex-1 px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Nhập bán kính tùy chỉnh (km)"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold cursor-pointer"
                  >
                    Áp dụng
                  </button>
                </form>
              </div>

              {/* Quick city presets */}
              <div className="space-y-1.5 pt-2 border-t border-slate-100">
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Hoặc chọn nhanh khu vực
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {POPULAR_LOCATIONS.map((preset) => (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => handleSelectPreset(preset)}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 text-slate-700 text-[11px] font-semibold transition-colors cursor-pointer"
                    >
                      {preset.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Chat Button — REAL unread count only */}
        <Link
          to="/chat"
          className="relative p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
          title="Tin nhắn"
        >
          <MessageSquare className="w-4 h-4" />
          {unreadChatCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1 rounded-full bg-emerald-600 text-white text-[9px] font-bold flex items-center justify-center">
              {unreadChatCount > 9 ? "9+" : unreadChatCount}
            </span>
          )}
        </Link>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            type="button"
            onClick={() => setNotificationsOpen((open) => !open)}
            className="relative p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            title="Thông báo"
          >
            <Bell className="w-4 h-4" />
            {(notifications?.unreadCount || 0) > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1 rounded-full bg-rose-600 text-white text-[9px] font-bold flex items-center justify-center">
                {notifications?.unreadCount}
              </span>
            )}
          </button>
          {notificationsOpen && (
            <div
              data-lenis-prevent
              className="absolute right-0 top-12 w-80 max-w-[calc(100vw-2rem)] rounded-2xl border border-slate-200 bg-white shadow-2xl overflow-hidden z-50"
            >
              <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-slate-100">
                <strong className="text-sm text-slate-900">Thông báo</strong>
                {(notifications?.unreadCount || 0) > 0 && (
                  <button
                    type="button"
                    onClick={() => markAllRead.mutate()}
                    className="text-[11px] font-bold text-emerald-700 hover:underline cursor-pointer"
                  >
                    Đánh dấu đã đọc
                  </button>
                )}
              </div>
              <div className="max-h-80 overflow-y-auto overscroll-contain">
                {!notifications?.items.length ? (
                  <p className="px-4 py-8 text-center text-xs text-slate-500">Chưa có thông báo.</p>
                ) : (
                  notifications.items.map((notification) => (
                    <button
                      type="button"
                      key={notification._id}
                      onClick={() => {
                        if (!notification.readAt) markRead.mutate(notification._id);
                        setNotificationsOpen(false);
                        if (notification.link) navigate(notification.link);
                      }}
                      className={`w-full text-left px-4 py-3 border-b border-slate-100 hover:bg-slate-50 cursor-pointer ${
                        notification.readAt ? "bg-white" : "bg-emerald-50/60"
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <span
                          className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${
                            notification.readAt ? "bg-slate-300" : "bg-emerald-600"
                          }`}
                        />
                        <span className="min-w-0">
                          <span className="block text-xs font-bold text-slate-800">{notification.title}</span>
                          <span className="block mt-1 text-xs text-slate-600">{notification.message}</span>
                          <span className="block mt-1 text-[10px] text-slate-400">
                            {new Date(notification.createdAt).toLocaleString("vi-VN")}
                          </span>
                        </span>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Admin quick button */}
        {isAuthenticated && (user?.role === "admin" || user?.role === "moderator") && (
          <Link
            to="/admin"
            className="hidden xl:inline-flex items-center gap-1.5 px-2.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors"
            title="Cổng Quản Trị"
          >
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            <span>Admin</span>
          </Link>
        )}

        {/* Primary Post CTA */}
        <Link
          to="/post"
          className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs active:scale-95 transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Đăng Tin</span>
        </Link>

        {/* User Avatar */}
        {isAuthenticated ? (
          <Link
            to="/profile"
            className="w-8 h-8 rounded-xl bg-emerald-100 border border-emerald-200 text-emerald-800 font-bold flex items-center justify-center text-xs overflow-hidden shrink-0"
            title={user?.name}
          >
            {user?.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              user?.name?.[0]?.toUpperCase() || "U"
            )}
          </Link>
        ) : (
          <Link
            to="/login"
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 px-2.5 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200"
          >
            Đăng nhập
          </Link>
        )}
      </div>
    </header>
  );
};
