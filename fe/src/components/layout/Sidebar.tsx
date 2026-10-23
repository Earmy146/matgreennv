import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Recycle,
  LayoutDashboard,
  Compass,
  PlusCircle,
  FolderOpen,
  MessageSquare,
  Sparkles,
  MapPin,
  LocateFixed,
  ChevronRight,
  LogOut,
  User as UserIcon,
  Layers,
  PhoneCall,
  ShieldCheck,
  ClipboardList,
  Heart,
} from "lucide-react";
import { useAuthStore } from "@/stores/auth.store";
import { useLocationStore } from "@/stores/location.store";
import { useGeolocation } from "@/hooks/useGeolocation";
import { formatDistance } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  highlight?: boolean;
  ai?: boolean;
}

interface NavGroup {
  group: string;
  items: NavItem[];
}

interface SidebarProps {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  collapsed = false,
  onToggleCollapse,
  isMobileOpen = false,
  onCloseMobile,
}) => {
  const { pathname } = useLocation();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { latitude, longitude, radiusKm, address } = useLocationStore();
  const { getCurrentLocation, isLocating } = useGeolocation();

  const navGroups: NavGroup[] = [
    {
      group: "Khám Phá & Tìm Kiếm",
      items: [
        {
          label: "Trang Chủ Landing Page",
          href: "/",
          icon: Layers,
        },
        {
          label: "Tổng Quan Dashboard",
          href: "/dashboard",
          icon: LayoutDashboard,
          badge: "Mới",
        },
        {
          label: "Kho Vật Liệu Quanh Bạn",
          href: "/materials",
          icon: Compass,
        },
        {
          label: "Vật Liệu Đã Lưu",
          href: "/saved",
          icon: Heart,
        },
        {
          label: "Hồ Sơ & Xác Minh",
          href: "/profile",
          icon: UserIcon,
        },
        {
          label: "Bản Đồ Radar Vị Trí",
          href: "/map-radar",
          icon: MapPin,
        },
      ],
    },
    {
      group: "Dành Cho Nhà A (Bên Tháo Dỡ)",
      items: [
        {
          label: "Đăng Vật Liệu Thừa",
          href: "/post",
          icon: PlusCircle,
          highlight: true,
        },
        {
          label: "Quản Lý Tin Của Tôi",
          href: "/my-posts",
          icon: FolderOpen,
        },
        {
          label: "Yêu Cầu Nhận Của Tôi",
          href: "/requests",
          icon: ClipboardList,
        },
      ],
    },
    {
      group: "Giao Dịch, Tin Tức & AI",
      items: [
        {
          label: "Tin Tức & Cẩm Nang",
          href: "/news",
          icon: MessageSquare,
        },
        {
          label: "Tin Nhắn Trao Đổi",
          href: "/chat",
          icon: PhoneCall,
          badge: "2",
        },
        {
          label: "AI Bóc Tách Tháo Dỡ",
          href: "/ai-advisor",
          icon: Sparkles,
          ai: true,
        },
      ],
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col bg-white border-r border-slate-200 transition-all duration-300 ease-in-out ${
          collapsed ? "w-20" : "w-72"
        } ${
          isMobileOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-100">
          <Link
            to="/dashboard"
            className="flex items-center gap-2.5 overflow-hidden group"
            onClick={onCloseMobile}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform shrink-0">
              <Recycle className="w-6 h-6 animate-spin-slow" />
            </div>
            {!collapsed && (
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-emerald-700 tracking-tight font-black text-xl">
                    Mat
                  </span>
                  <span className="text-slate-800 font-extrabold text-xl">
                    Green
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase -mt-1">
                  Vật Liệu Tuần Hoàn
                </span>
              </div>
            )}
          </Link>
        </div>

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-6">
          {navGroups.map((group, gIdx) => (
            <div key={gIdx} className="space-y-1">
              {!collapsed && (
                <div className="px-3 text-[11px] font-bold tracking-wider uppercase text-slate-400 mb-2">
                  {group.group}
                </div>
              )}
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={onCloseMobile}
                    title={collapsed ? item.label : undefined}
                    className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                      isActive
                        ? "bg-emerald-50 text-emerald-800 shadow-xs"
                        : item.highlight
                        ? "text-emerald-700 bg-emerald-50/50 hover:bg-emerald-100/70"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
                    }`}
                  >
                    <Icon
                      className={`w-5 h-5 shrink-0 transition-colors ${
                        isActive
                          ? "text-emerald-600"
                          : item.ai
                          ? "text-teal-600 group-hover:text-teal-700"
                          : item.highlight
                          ? "text-emerald-600"
                          : "text-slate-400 group-hover:text-slate-600"
                      }`}
                    />

                    {!collapsed && (
                      <>
                        <span className="truncate flex-1">{item.label}</span>
                        {item.badge && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                            {item.badge}
                          </span>
                        )}
                        {item.ai && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-teal-100 text-teal-800">
                            AI
                          </span>
                        )}
                      </>
                    )}

                    {/* Active indicator bar */}
                    {isActive && (
                      <span className="absolute left-0 top-2 bottom-2 w-1 bg-emerald-600 rounded-r-full" />
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </div>

        {/* GPS Live Status Widget */}
        {!collapsed && (
          <div className="p-3 mx-3 mb-3 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs text-slate-600">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-bold text-slate-700 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Vị Trí Của Bạn
              </span>
              <button
                onClick={getCurrentLocation}
                disabled={isLocating}
                className="text-emerald-700 hover:underline flex items-center gap-1 font-semibold text-[11px]"
                title="Lấy lại GPS"
              >
                <LocateFixed className="w-3.5 h-3.5" />
                Cập nhật
              </button>
            </div>
            <div className="text-[11px] text-slate-500 truncate" title={address}>
              📍 {address || "Chưa xác định"}
            </div>
            <div className="mt-1 text-[11px] text-slate-400 font-mono">
              Quét bán kính: <strong className="text-emerald-700 font-bold">{radiusKm} km</strong>
            </div>
          </div>
        )}

        {/* User Card & Logout */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/50">
          {isAuthenticated ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5 overflow-hidden">
                <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white font-bold flex items-center justify-center shrink-0 shadow-sm text-sm">
                  {user?.name?.[0]?.toUpperCase() || "U"}
                </div>
                {!collapsed && (
                  <div className="overflow-hidden">
                    <div className="font-bold text-xs text-slate-900 truncate">
                      {user?.name || "Người dùng"}
                    </div>
                    <div className="text-[10px] text-slate-400 truncate">
                      {user?.email || "user@matgreen.vn"}
                    </div>
                  </div>
                )}
              </div>
              {!collapsed && (
                <button
                  onClick={logout}
                  title="Đăng xuất"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="flex items-center justify-center gap-2 w-full py-2 px-3 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-sm hover:bg-emerald-700 transition-colors"
            >
              <UserIcon className="w-4 h-4" />
              {!collapsed && <span>Đăng Nhập</span>}
            </Link>
          )}
        </div>
      </aside>
    </>
  );
};
