import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  Shield,
  Newspaper,
  Users,
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  FileText,
  Clock,
  Layers,
  ShieldCheck,
  Activity,
  PhoneCall,
  Edit3,
  ExternalLink,
  Eye,
  Tag,
} from "lucide-react";
import { useAuthStore } from "@/stores/auth.store";
import { adminApi } from "@/services/api";
import { AdminEditMaterialModal } from "@/components/admin/AdminEditMaterialModal";
import { CATEGORY_LABELS, formatPrice } from "@/lib/utils";

export const AdminHubPage: React.FC = () => {
  const { user } = useAuthStore();
  const [selectedMaterial, setSelectedMaterial] = useState<any | null>(null);

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: adminApi.stats,
    retry: 1,
  });

  const {
    data: materialsData,
    isLoading: materialsLoading,
    refetch: refetchMaterials,
  } = useQuery({
    queryKey: ["admin-hub-materials"],
    queryFn: () => adminApi.materials({ page: 1, limit: 6 }),
    retry: 1,
  });

  const { data: recentLogs } = useQuery({
    queryKey: ["admin-recent-logs"],
    queryFn: () => adminApi.auditLogs({ limit: 5 }),
    retry: 1,
  });

  const modules = [
    {
      title: "Kiểm Duyệt Vật Liệu & An Toàn",
      description:
        "Phê duyệt bài đăng công trình, tiếp nhận tố cáo vi phạm, xác minh số điện thoại nhà thầu và khóa tài khoản vi phạm quy chế.",
      href: "/admin/moderation",
      icon: Shield,
      badge: "Cốt lõi",
      badgeColor: "bg-emerald-50 text-emerald-800 border-emerald-200",
      cta: "Vào Bảng Kiểm Duyệt",
    },
    {
      title: "Quản Trị Tin Tức & Cẩm Nang",
      description:
        "Biên tập bài viết mới, cập nhật cẩm nang kinh nghiệm tháo dỡ, phân loại tuần hoàn vật liệu và xuất bản nội dung.",
      href: "/admin/news",
      icon: Newspaper,
      badge: "Truyền thông",
      badgeColor: "bg-teal-50 text-teal-800 border-teal-200",
      cta: "Quản Lý Bài Viết",
      adminOnly: true,
    },
    {
      title: "Kho Vật Liệu Trên Sàn",
      description:
        "Xem danh sách toàn bộ các nguồn cung đang hiển thị trên sàn giao dịch, định vị công trình và mức giá thỏa thuận.",
      href: "/materials",
      icon: Layers,
      badge: "Dữ liệu sàn",
      badgeColor: "bg-sky-50 text-sky-800 border-sky-200",
      cta: "Giám Sát Sàn Vật Liệu",
      external: true,
    },
  ];

  return (
    <div className="space-y-8 animate-fadeIn" data-lenis-prevent>
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 p-6 sm:p-8 text-white shadow-xl border border-slate-800">
        <div className="absolute -right-12 -top-12 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Bảng Điều Hành Trung Tâm</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Xin chào, {user?.name || "Quản trị viên"}!
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              Bạn đang ở khu vực quản trị riêng biệt của MatGreen. Bạn có thể theo dõi chỉ số, phê duyệt nội dung và chỉnh sửa trực tiếp bài viết của người đăng bằng bộ công cụ nâng cao.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/admin/moderation"
              className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition-all flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              Kiểm Duyệt Nhanh
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div>
        <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
          <Activity className="w-4 h-4 text-emerald-600" />
          Chỉ Số Vận Hành Toàn Sàn
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase mb-2">
              <span>Người Dùng</span>
              <Users className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-3xl font-black text-slate-900">
              {statsLoading ? "..." : stats?.users || 0}
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">Tài khoản thành viên</span>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase mb-2">
              <span>Bài Đăng Vật Liệu</span>
              <FileText className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-3xl font-black text-slate-900">
              {statsLoading ? "..." : stats?.materials || 0}
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">Tổng nguồn cung hiện có</span>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase mb-2">
              <span>Báo Cáo Chờ Duyệt</span>
              <AlertTriangle className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-3xl font-black text-amber-600">
              {statsLoading ? "..." : stats?.reports?.open || 0}
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">Cần ban quản trị xử lý</span>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase mb-2">
              <span>Tài Khoản Khóa</span>
              <Shield className="w-4 h-4 text-rose-500" />
            </div>
            <div className="text-3xl font-black text-rose-600">
              {statsLoading ? "..." : stats?.suspendedUsers || 0}
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">Vi phạm quy định</span>
          </div>
        </div>
      </div>

      {/* DANH SÁCH BÀI ĐĂNG CỦA NGƯỜI DÙNG & CHO PHÉP ADMIN CHỈNH SỬA TRỰC TIẾP */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Layers className="w-5 h-5 text-emerald-600" />
              Bài Đăng Vật Liệu Của Người Dùng (Chỉnh Sửa Trực Tiếp)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Quản trị viên có thể xem xét và chỉnh sửa trực tiếp nội dung bài đăng của thành viên bằng bộ công cụ nâng cao.
            </p>
          </div>

          <Link
            to="/admin/moderation"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 transition-colors"
          >
            <span>Vào Bảng Kiểm Duyệt Đầy Đủ</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {materialsLoading ? (
          <div className="py-12 text-center text-xs text-slate-400">
            Đang tải danh sách bài đăng...
          </div>
        ) : !materialsData?.items || materialsData.items.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-400">
            Chưa có bài đăng nào trên hệ thống.
          </div>
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
                {materialsData.items.map((item: any) => (
                  <tr key={item._id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Material Info */}
                    <td className="py-3.5 pr-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            item.images?.[0] ||
                            "https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&w=160&q=80"
                          }
                          alt=""
                          className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0 bg-slate-100"
                        />
                        <div className="min-w-0">
                          <div className="font-bold text-slate-900 text-xs truncate max-w-xs">
                            {item.title}
                          </div>
                          <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-2">
                            <span className="font-medium text-emerald-700">
                              {CATEGORY_LABELS[item.category] || item.category}
                            </span>
                            <span>·</span>
                            <span className="truncate max-w-[160px]">{item.address || "Chưa có địa chỉ"}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Author */}
                    <td className="py-3.5 pr-4">
                      <div className="font-semibold text-slate-800">
                        {item.author?.name || "Người dùng"}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        {item.contactPhone || item.author?.phone || "Chưa có SĐT"}
                      </div>
                    </td>

                    {/* Price */}
                    <td className="py-3.5 pr-4">
                      <div className="font-bold text-slate-900">
                        {item.price === 0 ? (
                          <span className="text-emerald-700 font-bold">🎁 Miễn Phí (0đ)</span>
                        ) : (
                          formatPrice(item.price)
                        )}
                      </div>
                      {item.unit && (
                        <div className="text-[10px] text-slate-400">/{item.unit}</div>
                      )}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 pr-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                          item.status === "available"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : item.status === "pending"
                            ? "bg-amber-50 text-amber-700 border-amber-200"
                            : "bg-slate-100 text-slate-600 border-slate-200"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            item.status === "available"
                              ? "bg-emerald-500"
                              : item.status === "pending"
                              ? "bg-amber-500"
                              : "bg-slate-400"
                          }`}
                        />
                        {item.status === "available"
                          ? "Đang hiển thị"
                          : item.status === "pending"
                          ? "Chờ duyệt"
                          : "Đã ẩn / Hoàn thành"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Nút Chỉnh Sửa Trực Tiếp */}
                        <button
                          type="button"
                          onClick={() => setSelectedMaterial(item)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs border border-emerald-200 transition-colors cursor-pointer"
                          title="Chỉnh sửa nội dung bài viết với bộ công cụ nâng cao"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Chỉnh Sửa</span>
                        </button>

                        {/* Nút Xem Trên Sàn */}
                        <a
                          href={`/materials/${item._id}`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 rounded-xl border border-slate-200 text-slate-600 hover:text-emerald-700 hover:bg-slate-100 transition-colors"
                          title="Xem bài viết trên sàn giao dịch"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Management Modules */}
      <div>
        <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">
          Phân Hệ Quản Trị Nghiệp Vụ
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {modules.map((m) => {
            if (m.adminOnly && user?.role !== "admin") return null;
            const Icon = m.icon;

            return (
              <div
                key={m.href}
                className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span
                      className={`text-[11px] font-bold px-3 py-1 rounded-full border ${m.badgeColor}`}
                    >
                      {m.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-black text-slate-900 group-hover:text-emerald-700 transition-colors">
                      {m.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                      {m.description}
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  {m.external ? (
                    <a
                      href={m.href}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 transition-colors"
                    >
                      <span>{m.cta}</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </a>
                  ) : (
                    <Link
                      to={m.href}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 transition-colors"
                    >
                      <span>{m.cta}</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Audit Logs Preview */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-600" />
            Nhật Ký Quản Trị Gần Đây
          </h2>
          <Link
            to="/admin/moderation"
            className="text-xs font-bold text-emerald-700 hover:underline"
          >
            Xem tất cả
          </Link>
        </div>

        <div className="divide-y divide-slate-100">
          {(recentLogs?.items || []).slice(0, 5).map((log: any) => (
            <div key={log._id} className="py-3 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                <span className="font-bold text-slate-800">{log.actor?.name || "Hệ thống"}</span>
                <span className="text-slate-600">{log.action}</span>
                {log.reason && (
                  <span className="text-slate-400 italic">"{log.reason}"</span>
                )}
              </div>
              <span className="text-slate-400 text-[11px] shrink-0">
                {new Date(log.createdAt).toLocaleString("vi-VN")}
              </span>
            </div>
          ))}

          {(!recentLogs?.items || recentLogs.items.length === 0) && (
            <div className="py-6 text-center text-xs text-slate-400">
              Chưa có nhật ký hoạt động nào gần đây.
            </div>
          )}
        </div>
      </div>

      {/* Modal Chỉnh Sửa Bài Viết Người Đăng Bằng RichTextEditor */}
      <AdminEditMaterialModal
        material={selectedMaterial}
        isOpen={Boolean(selectedMaterial)}
        onClose={() => setSelectedMaterial(null)}
        onSuccess={() => refetchMaterials()}
      />
    </div>
  );
};
