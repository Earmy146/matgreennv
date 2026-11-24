import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Bot,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Edit3,
  Eye,
  FileText,
  Layers,
  Newspaper,
  Settings,
  Shield,
  ShieldCheck,
  Sparkles,
  Tag,
  Users,
} from "lucide-react";
import { useAuthStore } from "@/stores/auth.store";
import { adminApi } from "@/services/api";
import { AdminEditMaterialModal } from "@/components/admin/AdminEditMaterialModal";
import { CATEGORY_LABELS, formatPrice } from "@/lib/utils";

export const AUDIT_ACTION_LABELS: Record<string, string> = {
  suspend_user: "Tạm khóa tài khoản",
  unsuspend_user: "Mở khóa tài khoản",
  change_role_moderator: "Bổ nhiệm Kiểm duyệt viên",
  change_role_user: "Chuyển về Thành viên",
  moderate_material_available: "Duyệt hiển thị bài đăng",
  moderate_material_completed: "Ẩn / Đóng bài đăng",
  moderate_material_reserved: "Đánh dấu đã đặt chỗ",
  delete_material: "Xóa vĩnh viễn bài đăng",
  verify_phone: "Xác minh số điện thoại",
  reject_phone: "Từ chối xác minh SĐT",
};

export const AdminHubPage: React.FC = () => {
  const { user } = useAuthStore();
  const [selectedMaterial, setSelectedMaterial] = useState<any | null>(null);
  const [materialPage, setMaterialPage] = useState(1);

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: adminApi.stats,
    refetchInterval: 45000,
    retry: 1,
  });

  const {
    data: materialsData,
    isLoading: materialsLoading,
    refetch: refetchMaterials,
  } = useQuery({
    queryKey: ["admin-hub-materials", materialPage],
    queryFn: () => adminApi.materials({ page: materialPage, limit: 6 }),
    retry: 1,
  });

  const { data: recentLogs } = useQuery({
    queryKey: ["admin-recent-logs"],
    queryFn: () => adminApi.auditLogs({ limit: 6 }),
    retry: 1,
  });

  const categoryRows: Array<{ category: string; count: number }> = stats?.categoryBreakdown || [];
  const maxCatCount = Math.max(1, ...categoryRows.map((c) => c.count));
  const aiHealth = stats?.aiHealth;
  const aiOnline = aiHealth?.status === "ok";

  const modules = [
    {
      title: "Kiểm Duyệt Vật Liệu & An Toàn",
      description:
        "Phê duyệt bài đăng, xử lý báo cáo vi phạm, xác minh SĐT và phân quyền tài khoản.",
      href: "/admin/moderation",
      icon: Shield,
      badge: "Cốt lõi",
      badgeColor: "bg-emerald-50 text-emerald-800 border-emerald-200",
      cta: "Vào Bảng Kiểm Duyệt",
    },
    {
      title: "Quản Trị Tin Tức & Cẩm Nang",
      description:
        "Biên tập bài viết mới, cập nhật cẩm nang kinh nghiệm tháo dỡ và tuần hoàn vật liệu.",
      href: "/admin/news",
      icon: Newspaper,
      badge: "Truyền thông",
      badgeColor: "bg-teal-50 text-teal-800 border-teal-200",
      cta: "Quản Lý Bài Viết",
      adminOnly: true,
    },
    {
      title: "Cấu Hình Thương Hiệu & Giao Diện",
      description:
        "Cập nhật Logo, tiêu đề, thông tin liên hệ và nội dung hiển thị trên Trang Chủ.",
      href: "/admin/settings",
      icon: Settings,
      badge: "Hệ thống",
      badgeColor: "bg-sky-50 text-sky-800 border-sky-200",
      cta: "Mở Cấu Hình",
      adminOnly: true,
    },
  ];

  return (
    <div className="space-y-7 animate-fadeIn" data-lenis-prevent>
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 p-6 sm:p-8 text-white shadow-xl border border-slate-800">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Trung Tâm Điều Hành MatGreen</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Xin chào, {user?.name || "Quản trị viên"}!
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              Theo dõi trực tiếp nguồn cung vật liệu tuần hoàn, trạng thái Microservice AI và kiểm duyệt an toàn toàn sàn.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              to="/admin/moderation"
              className="px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition-all flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              Kiểm Duyệt Nhanh
            </Link>
            <Link
              to="/materials"
              className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/15 transition-colors"
            >
              Ra Ngoài Sàn →
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase mb-2">
            <span>Thành Viên</span>
            <Users className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-black text-slate-900">
            {statsLoading ? "..." : stats?.users ?? 0}
          </div>
          <span className="text-[11px] text-emerald-700 font-semibold mt-1 block">
            {stats?.verifiedPhones ?? 0} SĐT đã xác minh · {stats?.suspendedUsers ?? 0} bị khóa
          </span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase mb-2">
            <span>Tổng Bài Đăng</span>
            <FileText className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-black text-slate-900">
            {statsLoading ? "..." : stats?.materials ?? 0}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">
            {stats?.freeMaterials ?? 0} Cho tặng · {stats?.sellMaterials ?? 0} Thanh lý
          </span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase mb-2">
            <span>Giao Dịch Yêu Cầu</span>
            <CheckCircle2 className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-3xl font-black text-teal-700">
            {statsLoading ? "..." : stats?.requests?.total ?? 0}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">
            {stats?.requests?.completed ?? 0} giao dịch đã hoàn tất
          </span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase mb-2">
            <span>Báo Cáo Chờ Xử Lý</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-3xl font-black text-amber-600">
            {statsLoading ? "..." : stats?.reports?.open ?? 0}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">
            {stats?.reports?.resolved ?? 0} báo cáo đã giải quyết
          </span>
        </div>
      </div>

      {/* Analytics Row: Category Chart + AI Service Live Health */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Category Distribution Chart */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/90 p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-emerald-600" />
              Phân Bố Nguồn Cung Theo Danh Mục
            </h2>
            <span className="text-[11px] text-slate-400 font-semibold">
              Đã bàn giao xong: {stats?.completedMaterials ?? 0} bài
            </span>
          </div>

          {categoryRows.length === 0 ? (
            <div className="py-10 text-center text-xs text-slate-400">Chưa có dữ liệu thống kê danh mục.</div>
          ) : (
            <div className="space-y-3">
              {categoryRows.map((row) => {
                const pct = Math.max(6, Math.round((row.count / maxCatCount) * 100));
                return (
                  <div key={row.category} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-700">
                        {CATEGORY_LABELS[row.category] || row.category}
                      </span>
                      <span className="font-extrabold text-slate-900">{row.count} bài</span>
                    </div>
                    <div className="h-2.5 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-emerald-600 to-teal-400 transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* AI Microservice Live Status Card */}
        <div className="lg:col-span-5 bg-slate-900 text-white rounded-3xl p-6 shadow-md flex flex-col justify-between gap-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold">MatGreen AI Microservice</h3>
                  <span className="text-[11px] text-slate-400">Giám sát kết nối LLM Proxy & Redis</span>
                </div>
              </div>
              <span
                className={`px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1.5 ${
                  aiOnline
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                    : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${aiOnline ? "bg-emerald-400" : "bg-amber-400"}`} />
                {aiOnline ? "Online" : aiHealth?.status || "Đang kiểm tra"}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2.5 pt-1 text-xs">
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                <div className="text-[10px] text-slate-400 uppercase">Chat Model</div>
                <div className="font-mono font-bold text-emerald-300 truncate mt-0.5">
                  {aiHealth?.chat_model || "gemini-3.1-flash-lite"}
                </div>
              </div>
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                <div className="text-[10px] text-slate-400 uppercase">Vision Model</div>
                <div className="font-mono font-bold text-teal-300 truncate mt-0.5">
                  {aiHealth?.vision_model || "gemini-3-flash"}
                </div>
              </div>
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                <div className="text-[10px] text-slate-400 uppercase">CLIProxy Status</div>
                <div className="font-bold text-white mt-0.5">
                  {aiHealth?.proxy_status || "unknown"}
                </div>
              </div>
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                <div className="text-[10px] text-slate-400 uppercase">Phiên Chat Đã Lưu</div>
                <div className="font-black text-white mt-0.5">
                  {stats?.aiConversations ?? 0} hội thoại
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              Redis: <strong className="text-slate-200">{aiHealth?.redis_status || "connected"}</strong>
            </span>
            <Link to="/ai-advisor" className="text-emerald-400 hover:underline font-bold">
              Mở AI Advisor →
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Materials Table (Fixed owner & location.address mapping!) */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Layers className="w-5 h-5 text-emerald-600" />
              Bài Đăng Mới Nhất Trên Sàn (Chỉnh Sửa Nhanh)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Kiểm tra nhanh người đăng, tọa độ địa chỉ và chỉnh sửa trực tiếp nội dung bài viết.
            </p>
          </div>

          <Link
            to="/admin/moderation"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800"
          >
            <span>Vào Bảng Kiểm Duyệt Đầy Đủ</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {materialsLoading ? (
          <div className="py-12 text-center text-xs text-slate-400">Đang tải danh sách bài đăng...</div>
        ) : !materialsData?.items?.length ? (
          <div className="py-12 text-center text-xs text-slate-400">Chưa có bài đăng nào trên hệ thống.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider text-[10px]">
                  <th className="pb-3 font-bold">Vật Liệu</th>
                  <th className="pb-3 font-bold">Người Đăng</th>
                  <th className="pb-3 font-bold">Giá & Đơn Vị</th>
                  <th className="pb-3 font-bold">Trạng Thái</th>
                  <th className="pb-3 font-bold text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {materialsData.items.map((item: any) => {
                  const ownerObj = item.owner || item.author;
                  const itemAddr = item.location?.address || item.address || "Chưa cập nhật";
                  return (
                    <tr key={item._id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 pr-4">
                        <div className="flex items-center gap-3">
                          {item.images?.[0] ? (
                            <img
                              src={item.images[0]}
                              alt=""
                              className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0 bg-slate-100"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-xl border border-slate-200 bg-slate-100 flex items-center justify-center text-slate-400 shrink-0">
                              <Tag className="w-4 h-4" />
                            </div>
                          )}
                          <div className="min-w-0">
                            <div className="font-bold text-slate-900 text-xs truncate max-w-xs">
                              {item.title}
                            </div>
                            <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1.5">
                              <span className="font-semibold text-emerald-700">
                                {CATEGORY_LABELS[item.category] || item.category}
                              </span>
                              <span>·</span>
                              <span className="truncate max-w-[180px]" title={itemAddr}>
                                {itemAddr}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 pr-4">
                        <div className="font-bold text-slate-800">{ownerObj?.name || "Thành viên"}</div>
                        <div className="text-[11px] text-slate-400 font-mono">
                          {item.contactPhone || ownerObj?.phone || ownerObj?.email || ""}
                        </div>
                      </td>

                      <td className="py-3.5 pr-4">
                        <div className="font-bold text-slate-900">
                          {item.type === "free" || item.price === 0 ? (
                            <span className="text-emerald-700 font-bold">Cho/Tặng 0đ</span>
                          ) : (
                            formatPrice(item.price)
                          )}
                        </div>
                        {item.unit && item.type === "sell" && (
                          <div className="text-[10px] text-slate-400">/{item.unit}</div>
                        )}
                      </td>

                      <td className="py-3.5 pr-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                            item.status === "available"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : item.status === "reserved"
                              ? "bg-amber-50 text-amber-700 border-amber-200"
                              : "bg-slate-100 text-slate-600 border-slate-200"
                          }`}
                        >
                          {item.status === "available"
                            ? "Đang hiển thị"
                            : item.status === "reserved"
                            ? "Đã đặt chỗ"
                            : "Đã đóng / Hoàn tất"}
                        </span>
                      </td>

                      <td className="py-3.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setSelectedMaterial(item)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs border border-emerald-200 transition-colors cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Sửa</span>
                          </button>
                          <Link
                            to={`/materials/${item._id}`}
                            className="p-1.5 rounded-xl border border-slate-200 text-slate-600 hover:text-emerald-700 hover:bg-slate-100 transition-colors"
                            title="Xem chi tiết bài đăng"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500">
                Trang <strong>{materialsData?.pagination?.page || materialPage}</strong> /{" "}
                <strong>{materialsData?.pagination?.totalPages || 1}</strong> (Tổng{" "}
                <strong>{materialsData?.pagination?.total || 0}</strong> bài)
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  disabled={materialPage <= 1}
                  onClick={() => setMaterialPage((p) => Math.max(1, p - 1))}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 font-bold disabled:opacity-40 cursor-pointer flex items-center gap-1"
                >
                  <ChevronLeft className="w-3.5 h-3.5" /> Trước
                </button>
                <button
                  type="button"
                  disabled={materialPage >= (materialsData?.pagination?.totalPages || 1)}
                  onClick={() => setMaterialPage((p) => p + 1)}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 font-bold disabled:opacity-40 cursor-pointer flex items-center gap-1"
                >
                  Sau <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Management Modules */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {modules.map((m) => {
          if (m.adminOnly && user?.role !== "admin" && user?.role !== "superadmin") return null;
          const Icon = m.icon;
          return (
            <Link
              key={m.href}
              to={m.href}
              className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-2xs hover:shadow-lg hover:-translate-y-0.5 transition-all flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${m.badgeColor}`}>
                    {m.badge}
                  </span>
                </div>
                <h3 className="text-base font-black text-slate-900 group-hover:text-emerald-700">
                  {m.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">{m.description}</p>
              </div>
              <div className="mt-5 pt-3 border-t border-slate-100 inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700">
                <span>{m.cta}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Recent Audit Logs (Translated to Vietnamese!) */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-2xs">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-black text-slate-900 flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-600" />
            Nhật Ký Quản Trị Gần Đây
          </h2>
          <Link to="/admin/moderation" className="text-xs font-bold text-emerald-700 hover:underline">
            Xem tất cả →
          </Link>
        </div>

        <div className="divide-y divide-slate-100">
          {(recentLogs?.items || []).slice(0, 6).map((log: any) => (
            <div key={log._id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                <strong className="text-slate-900">{log.actor?.name || "Quản trị viên"}</strong>
                <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-semibold text-[11px]">
                  {AUDIT_ACTION_LABELS[log.action] || log.action}
                </span>
                {log.reason && <span className="text-slate-500 italic">“{log.reason}”</span>}
              </div>
              <span className="text-slate-400 text-[11px] shrink-0">
                {new Date(log.createdAt).toLocaleString("vi-VN")}
              </span>
            </div>
          ))}
          {!recentLogs?.items?.length && (
            <div className="py-6 text-center text-xs text-slate-400">Chưa có nhật ký hoạt động nào.</div>
          )}
        </div>
      </div>

      <AdminEditMaterialModal
        material={selectedMaterial}
        isOpen={Boolean(selectedMaterial)}
        onClose={() => setSelectedMaterial(null)}
        onSuccess={() => refetchMaterials()}
      />
    </div>
  );
};
