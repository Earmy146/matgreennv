import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  Compass,
  PlusCircle,
  FolderOpen,
  MessageSquare,
  Sparkles,
  MapPin,
  LogOut,
  User as UserIcon,
  ClipboardList,
  Heart,
  Shield,
  Newspaper,
  Home,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { useAuthStore } from "@/stores/auth.store";
import { chatApi } from "@/services/api";
import { BrandLogo } from "@/components/common/BrandLogo";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badgeCount?: number;
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

  const { data: conversations = [] } = useQuery({
    queryKey: ["chat-conversations-unread"],
    queryFn: chatApi.getConversations,
    enabled: isAuthenticated,
    staleTime: 30000,
    refetchInterval: 45000,
  });

  const unreadChatCount = conversations.reduce((sum, c) => sum + (c.unreadCount || 0), 0);

  const navGroups: NavGroup[] = [
    {
      group: "Khám Phá Sàn",
      items: [
        { label: "Kho Vật Liệu", href: "/materials", icon: Compass },
        { label: "Bản Đồ Radar", href: "/dashboard", icon: MapPin },
        { label: "Trợ Lý AI MatGreen", href: "/ai-advisor", icon: Sparkles, ai: true },
        { label: "Tin Tức & Cẩm Nang", href: "/news", icon: Newspaper },
      ],
    },
    {
      group: "Giao Dịch & Cá Nhân",
      items: [
        { label: "Đăng Vật Liệu Mới", href: "/post", icon: PlusCircle, highlight: true },
        { label: "Quản Lý Tin Đăng", href: "/my-posts", icon: FolderOpen },
        { label: "Yêu Cầu Nhận", href: "/requests", icon: ClipboardList },
        {
          label: "Tin Nhắn",
          href: "/chat",
          icon: MessageSquare,
          badgeCount: unreadChatCount,
        },
        { label: "Vật Liệu Đã Lưu", href: "/saved", icon: Heart },
        { label: "Hồ Sơ Cá Nhân", href: "/profile", icon: UserIcon },
      ],
    },
  ];

  const isActivePath = (href: string) => {
    if (href === "/dashboard" && (pathname === "/dashboard" || pathname === "/map-radar")) {
      return true;
    }
    return pathname === href;
  };

  return (
    <>
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      <aside
        data-lenis-prevent
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col bg-white border-r border-slate-200/90 transition-all duration-300 ease-in-out ${
          collapsed ? "w-20" : "w-64"
        } ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        {/* Brand Header — Unified BrandLogo */}
        <div className="h-16 flex items-center justify-between px-3.5 border-b border-slate-100 shrink-0">
          <Link
            to="/"
            className="group min-w-0 flex-1"
            onClick={onCloseMobile}
            title="Về Trang Chủ MatGreen"
          >
            <BrandLogo size="sm" showText={!collapsed} />
          </Link>

          {onToggleCollapse && (
            <button
              type="button"
              onClick={onToggleCollapse}
              className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
              title={collapsed ? "Mở rộng menu" : "Thu gọn menu"}
            >
              {collapsed ? (
                <PanelLeftOpen className="w-4 h-4" />
              ) : (
                <PanelLeftClose className="w-4 h-4" />
              )}
            </button>
          )}
        </div>

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto overscroll-contain p-3 space-y-5">
          {navGroups.map((group) => (
            <div key={group.group} className="space-y-1">
              {!collapsed && (
                <div className="px-3 text-[10.5px] font-bold tracking-wider uppercase text-slate-400 mb-1.5">
                  {group.group}
                </div>
              )}
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = isActivePath(item.href);

                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={onCloseMobile}
                    title={collapsed ? item.label : undefined}
                    className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-semibold transition-all ${
                      isActive
                        ? "bg-emerald-50 text-emerald-800"
                        : item.highlight
                        ? "text-emerald-700 bg-emerald-50/50 hover:bg-emerald-100/70"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
                    }`}
                  >
                    <Icon
                      className={`w-[18px] h-[18px] shrink-0 transition-colors ${
                        isActive
                          ? "text-emerald-600"
                          : item.ai
                          ? "text-teal-600"
                          : item.highlight
                          ? "text-emerald-600"
                          : "text-slate-400 group-hover:text-slate-600"
                      }`}
                    />

                    {!collapsed && (
                      <>
                        <span className="truncate flex-1">{item.label}</span>
                        {typeof item.badgeCount === "number" && item.badgeCount > 0 && (
                          <span className="min-w-5 h-5 px-1.5 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                            {item.badgeCount > 99 ? "99+" : item.badgeCount}
                          </span>
                        )}
                        {item.ai && (
                          <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-md bg-teal-100 text-teal-800">
                            AI
                          </span>
                        )}
                      </>
                    )}

                    {isActive && (
                      <span className="absolute left-0 top-2 bottom-2 w-1 bg-emerald-600 rounded-r-full" />
                    )}
                  </Link>
                );
              })}
            </div>
          ))}

          {/* Back to Landing link */}
          <div className="pt-2 border-t border-slate-100">
            <Link
              to="/"
              onClick={onCloseMobile}
              title={collapsed ? "Về Trang Giới Thiệu" : undefined}
              className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-900 hover:bg-slate-100/80 transition-colors"
            >
              <Home className="w-4 h-4 shrink-0 text-slate-400" />
              {!collapsed && <span>Về Trang Giới Thiệu</span>}
            </Link>
          </div>
        </div>

        {/* Switch to Admin Portal */}
        {isAuthenticated && (user?.role === "admin" || user?.role === "moderator") && !collapsed && (
          <div className="px-3 pb-2 shrink-0">
            <Link
              to="/admin"
              onClick={onCloseMobile}
              className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold shadow-sm hover:bg-slate-800 transition-all"
            >
              <span className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-400" />
                <span>Cổng Quản Trị</span>
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                Admin
              </span>
            </Link>
          </div>
        )}

        {/* User Footer */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/60 shrink-0">
          {isAuthenticated ? (
            <div className="flex items-center justify-between gap-2">
              <Link
                to="/profile"
                onClick={onCloseMobile}
                className="flex items-center gap-2.5 overflow-hidden min-w-0 group"
              >
                <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white font-bold flex items-center justify-center shrink-0 overflow-hidden text-sm">
                  {user?.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    user?.name?.[0]?.toUpperCase() || "U"
                  )}
                </div>
                {!collapsed && (
                  <div className="overflow-hidden min-w-0">
                    <div className="font-bold text-xs text-slate-900 truncate group-hover:text-emerald-700">
                      {user?.name || "Người dùng"}
                    </div>
                    <div className="text-[10px] text-slate-400 truncate">{user?.email}</div>
                  </div>
                )}
              </Link>
              {!collapsed && (
                <button
                  type="button"
                  onClick={logout}
                  title="Đăng xuất"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer shrink-0"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              onClick={onCloseMobile}
              className="flex items-center justify-center gap-2 w-full py-2 px-3 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-xs hover:bg-emerald-700 transition-colors"
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
