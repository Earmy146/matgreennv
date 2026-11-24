import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AlertTriangle,
  Check,
  CheckCircle2,
  Clock,
  Edit3,
  ExternalLink,
  Eye,
  History,
  Layers,
  Loader2,
  Lock,
  Phone,
  Search,
  Shield,
  Tag,
  Trash2,
  Users,
  X,
} from "lucide-react";
import { adminApi, reportsApi } from "@/services/api";
import { useAuthStore } from "@/stores/auth.store";
import { toast } from "@/stores/toast.store";
import { AdminEditMaterialModal } from "@/components/admin/AdminEditMaterialModal";
import { AdminReasonModal } from "@/components/admin/AdminReasonModal";
import { AUDIT_ACTION_LABELS } from "./AdminHubPage";
import { CATEGORY_LABELS, formatPrice } from "@/lib/utils";

const PAGE_SIZE = 10;
type TabType = "materials" | "reports" | "phoneVerification" | "users" | "auditLogs";

interface PendingReasonAction {
  title: string;
  defaultReason: string;
  presets: string[];
  danger?: boolean;
  confirmLabel: string;
  execute: (reason: string) => void;
}

export const AdminModerationPage: React.FC = () => {
  const queryClient = useQueryClient();
  const { user: currentUser } = useAuthStore();
  const isAdmin = currentUser?.role === "admin" || currentUser?.role === "superadmin";

  const [activeTab, setActiveTab] = useState<TabType>("materials");

  // Pagination & Server-side filters
  const [materialPage, setMaterialPage] = useState(1);
  const [materialSearch, setMaterialSearch] = useState("");
  const [materialStatusFilter, setMaterialStatusFilter] = useState("all");
  const [materialCategoryFilter, setMaterialCategoryFilter] = useState("all");

  const [reportPage, setReportPage] = useState(1);
  const [reportStatusFilter, setReportStatusFilter] = useState("all");

  const [userPage, setUserPage] = useState(1);
  const [userSearch, setUserSearch] = useState("");
  const [userRoleFilter, setUserRoleFilter] = useState("all");
  const [userSuspendedFilter, setUserSuspendedFilter] = useState("all");

  // Modals
  const [selectedMaterialForEdit, setSelectedMaterialForEdit] = useState<any | null>(null);
  const [reasonModal, setReasonModal] = useState<PendingReasonAction | null>(null);

  const { data: stats } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: adminApi.stats,
  });

  const { data: materialsData, isLoading: materialsLoading, refetch: refetchMaterials } = useQuery({
    queryKey: [
      "admin-materials",
      materialPage,
      materialSearch,
      materialStatusFilter,
      materialCategoryFilter,
    ],
    queryFn: () =>
      adminApi.materials({
        page: materialPage,
        limit: PAGE_SIZE,
        search: materialSearch.trim() || undefined,
        status: materialStatusFilter !== "all" ? materialStatusFilter : undefined,
        category: materialCategoryFilter !== "all" ? materialCategoryFilter : undefined,
      }),
  });

  const { data: reportsData, isLoading: reportsLoading } = useQuery({
    queryKey: ["admin-reports", reportPage, reportStatusFilter],
    queryFn: () =>
      reportsApi.list({
        page: reportPage,
        limit: PAGE_SIZE,
        status: reportStatusFilter !== "all" ? reportStatusFilter : undefined,
      }),
  });

  const { data: usersData, isLoading: usersLoading } = useQuery({
    queryKey: ["admin-users", userPage, userSearch, userRoleFilter, userSuspendedFilter],
    queryFn: () =>
      adminApi.users({
        page: userPage,
        limit: PAGE_SIZE,
        search: userSearch.trim() || undefined,
        role: userRoleFilter !== "all" ? userRoleFilter : undefined,
        suspended: userSuspendedFilter !== "all" ? userSuspendedFilter : undefined,
      }),
  });

  const { data: phoneRequestsData, isLoading: phoneLoading } = useQuery({
    queryKey: ["phone-verification-requests"],
    queryFn: () => adminApi.phoneVerificationRequests({ limit: 30 }),
  });

  const { data: auditLogsData, isLoading: auditLoading } = useQuery({
    queryKey: ["admin-audit-logs"],
    queryFn: () => adminApi.auditLogs({ limit: 40 }),
  });

  const refreshAllAdmin = () => {
    queryClient.invalidateQueries({ queryKey: ["admin-materials"] });
    queryClient.invalidateQueries({ queryKey: ["admin-reports"] });
    queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    queryClient.invalidateQueries({ queryKey: ["phone-verification-requests"] });
    queryClient.invalidateQueries({ queryKey: ["admin-audit-logs"] });
    queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
  };

  const reportUpdateMutation = useMutation({
    mutationFn: ({ id, status, reason }: { id: string; status: string; reason: string }) =>
      reportsApi.update(id, status, reason),
    onSuccess: () => {
      refreshAllAdmin();
      setReasonModal(null);
      toast.success("Đã cập nhật trạng thái xử lý báo cáo");
    },
    onError: (err: any) => toast.error(err?.response?.data?.message || "Không thể xử lý báo cáo"),
  });

  const suspendMutation = useMutation({
    mutationFn: ({ id, suspended, reason }: { id: string; suspended: boolean; reason: string }) =>
      adminApi.suspendUser(id, suspended, reason),
    onSuccess: (_d, vars) => {
      refreshAllAdmin();
      setReasonModal(null);
      toast.success(vars.suspended ? "Đã khóa tài khoản vi phạm" : "Đã mở khóa tài khoản");
    },
    onError: (err: any) => toast.error(err?.response?.data?.message || "Không thể cập nhật tài khoản"),
  });

  const roleMutation = useMutation({
    mutationFn: ({ id, role, reason }: { id: string; role: "user" | "moderator"; reason: string }) =>
      adminApi.updateUserRole(id, role, reason),
    onSuccess: () => {
      refreshAllAdmin();
      setReasonModal(null);
      toast.success("Đã cập nhật vai trò người dùng");
    },
    onError: (err: any) => toast.error(err?.response?.data?.message || "Không thể đổi vai trò"),
  });

  const moderateMaterialMutation = useMutation({
    mutationFn: ({ id, status, reason }: { id: string; status: string; reason: string }) =>
      adminApi.moderateMaterial(id, status, reason),
    onSuccess: () => {
      refreshAllAdmin();
      setReasonModal(null);
      toast.success("Đã cập nhật trạng thái hiển thị bài đăng");
    },
    onError: (err: any) => toast.error(err?.response?.data?.message || "Không thể kiểm duyệt bài đăng"),
  });

  const deleteMaterialMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      adminApi.deleteMaterial(id, reason),
    onSuccess: () => {
      refreshAllAdmin();
      setReasonModal(null);
      toast.success("Đã xóa vĩnh viễn bài đăng vi phạm");
    },
    onError: (err: any) => toast.error(err?.response?.data?.message || "Không thể xóa bài đăng"),
  });

  const verifyPhoneMutation = useMutation({
    mutationFn: ({ id, verified, reason }: { id: string; verified: boolean; reason: string }) =>
      adminApi.verifyPhone(id, verified, reason),
    onSuccess: (_d, vars) => {
      refreshAllAdmin();
      setReasonModal(null);
      toast.success(vars.verified ? "Đã xác minh số điện thoại" : "Đã từ chối yêu cầu xác minh");
    },
    onError: (err: any) => toast.error(err?.response?.data?.message || "Không thể xử lý xác minh SĐT"),
  });

  const isMutating =
    reportUpdateMutation.isPending ||
    suspendMutation.isPending ||
    roleMutation.isPending ||
    moderateMaterialMutation.isPending ||
    deleteMaterialMutation.isPending ||
    verifyPhoneMutation.isPending;

  const Pager = ({
    page,
    totalPages,
    totalCount,
    onChange,
  }: {
    page: number;
    totalPages?: number;
    totalCount?: number;
    onChange: (p: number) => void;
  }) => {
    const pages = totalPages || 1;
    return (
      <div className="flex flex-col sm:flex-row items-center justify-between pt-4 mt-2 border-t border-slate-100 text-xs text-slate-500 gap-3">
        <span className="font-medium">
          Trang <strong>{page}</strong> / <strong>{pages}</strong>
          {totalCount !== undefined && (
            <span>
              {" "}
              (Tổng cộng <strong>{totalCount}</strong> mục)
            </span>
          )}
        </span>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => onChange(page - 1)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 disabled:opacity-40 font-bold cursor-pointer"
          >
            Trước
          </button>
          <button
            type="button"
            disabled={page >= pages}
            onClick={() => onChange(page + 1)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 disabled:opacity-40 font-bold cursor-pointer"
          >
            Sau
          </button>
        </div>
      </div>
    );
  };

  const materialItems = materialsData?.items || [];
  const reportItems = reportsData?.items || [];
  const userItems = usersData?.items || [];
  const phoneItems = phoneRequestsData?.items || [];

  return (
    <div className="space-y-6 animate-fadeIn" data-lenis-prevent>
      <div>
        <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
          <Shield className="w-4 h-4 text-emerald-600" />
          <span>Phân Hệ Quản Trị Vận Hành</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Kiểm Duyệt & An Toàn Nền Tảng
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Lọc trực tiếp trên toàn bộ cơ sở dữ liệu, xử lý tố cáo vi phạm, xác minh SĐT và phân quyền thành viên.
        </p>
      </div>

      {/* KPI Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3">
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Bài Đăng</span>
            <Layers className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{stats?.materials ?? 0}</div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Báo Cáo Mở</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-amber-600">{stats?.reports?.open ?? 0}</div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Đang Xem Xét</span>
            <History className="w-4 h-4 text-sky-500" />
          </div>
          <div className="text-2xl font-black text-sky-600">{stats?.reports?.reviewing ?? 0}</div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Đã Xử Lý</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-600">{stats?.reports?.resolved ?? 0}</div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Thành Viên</span>
            <Users className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{stats?.users ?? 0}</div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Tài Khoản Khóa</span>
            <Shield className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-black text-rose-600">{stats?.suspendedUsers ?? 0}</div>
        </div>
      </div>

      {/* Main Tabbed Container */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="border-b border-slate-200 bg-slate-50/60 px-4 sm:px-6 pt-3 flex items-center gap-2 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab("materials")}
            className={`pb-3 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === "materials"
                ? "border-emerald-600 text-emerald-700 font-black"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Bài Đăng</span>
            <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 text-[10px]">
              {materialsData?.pagination?.total ?? stats?.materials ?? 0}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("reports")}
            className={`pb-3 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === "reports"
                ? "border-emerald-600 text-emerald-700 font-black"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <span>Báo Cáo Vi Phạm</span>
            {(stats?.reports?.open || 0) > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-black">
                {stats?.reports?.open}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("phoneVerification")}
            className={`pb-3 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === "phoneVerification"
                ? "border-emerald-600 text-emerald-700 font-black"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Phone className="w-4 h-4 text-emerald-600" />
            <span>Xác Minh SĐT</span>
            {phoneItems.length > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-amber-500 text-white text-[10px]">
                {phoneItems.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("users")}
            className={`pb-3 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === "users"
                ? "border-emerald-600 text-emerald-700 font-black"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Thành Viên</span>
            <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 text-[10px]">
              {usersData?.pagination?.total ?? stats?.users ?? 0}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("auditLogs")}
            className={`pb-3 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === "auditLogs"
                ? "border-emerald-600 text-emerald-700 font-black"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Nhật Ký Quản Trị</span>
          </button>
        </div>

        <div className="p-4 sm:p-6">
          {/* TAB 1: MATERIALS */}
          {activeTab === "materials" && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-2">
                <div className="flex flex-wrap items-center gap-2 flex-1">
                  <div className="relative flex-1 min-w-[210px] max-w-xs">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="Tìm theo tiêu đề, địa chỉ, SĐT..."
                      value={materialSearch}
                      onChange={(e) => {
                        setMaterialSearch(e.target.value);
                        setMaterialPage(1);
                      }}
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <select
                    value={materialStatusFilter}
                    onChange={(e) => {
                      setMaterialStatusFilter(e.target.value);
                      setMaterialPage(1);
                    }}
                    className="px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white font-semibold"
                  >
                    <option value="all">Tất cả trạng thái</option>
                    <option value="available">🟢 Đang hiển thị</option>
                    <option value="reserved">🟡 Đã đặt chỗ</option>
                    <option value="completed">⚪ Đã ẩn / Hoàn thành</option>
                  </select>

                  <select
                    value={materialCategoryFilter}
                    onChange={(e) => {
                      setMaterialCategoryFilter(e.target.value);
                      setMaterialPage(1);
                    }}
                    className="px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white font-semibold"
                  >
                    <option value="all">Tất cả danh mục</option>
                    {Object.entries(CATEGORY_LABELS).map(([k, label]) => (
                      <option key={k} value={k}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>

                <span className="text-xs text-slate-400">
                  Kết quả: <strong>{materialsData?.pagination?.total ?? 0}</strong> bài
                </span>
              </div>

              {materialsLoading ? (
                <div className="py-16 text-center text-xs text-slate-400">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-emerald-600" />
                  Đang tải danh sách bài đăng...
                </div>
              ) : materialItems.length === 0 ? (
                <div className="py-16 text-center text-xs text-slate-400">
                  Không tìm thấy bài đăng nào phù hợp bộ lọc.
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
                      {materialItems.map((item: any) => {
                        const ownerObj = item.owner || item.author;
                        const addr = item.location?.address || item.address || "Chưa có địa chỉ";
                        return (
                          <tr key={item._id} className="hover:bg-slate-50 transition-colors">
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
                                    <span className="truncate max-w-[180px]" title={addr}>
                                      {addr}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </td>

                            <td className="py-3.5 pr-4">
                              <div className="font-bold text-slate-800">
                                {ownerObj?.name || "Thành viên"}
                              </div>
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
                                  : "Đã đóng"}
                              </span>
                            </td>

                            <td className="py-3.5 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => setSelectedMaterialForEdit(item)}
                                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs border border-emerald-200 cursor-pointer"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                  <span>Sửa</span>
                                </button>

                                {isAdmin && item.status !== "available" && (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setReasonModal({
                                        title: "Duyệt hiển thị lại bài đăng",
                                        defaultReason: "Bài đăng hợp lệ, đủ điều kiện hiển thị trên sàn",
                                        presets: [
                                          "Bài đăng hợp lệ, đủ điều kiện hiển thị trên sàn",
                                          "Đã cập nhật đầy đủ ảnh và thông tin liên hệ",
                                        ],
                                        confirmLabel: "Duyệt hiển thị",
                                        execute: (reason) =>
                                          moderateMaterialMutation.mutate({
                                            id: item._id,
                                            status: "available",
                                            reason,
                                          }),
                                      })
                                    }
                                    className="p-1.5 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 cursor-pointer"
                                    title="Duyệt hiển thị"
                                  >
                                    <Check className="w-3.5 h-3.5" />
                                  </button>
                                )}

                                {isAdmin && item.status === "available" && (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setReasonModal({
                                        title: "Tạm ẩn bài đăng khỏi sàn",
                                        defaultReason: "Nội dung hoặc tọa độ cần bổ sung rõ hơn",
                                        presets: [
                                          "Nội dung hoặc tọa độ cần bổ sung rõ hơn",
                                          "Thông tin liên hệ không chính xác",
                                          "Vật liệu đã hết nhưng chưa đóng bài",
                                        ],
                                        danger: true,
                                        confirmLabel: "Ẩn bài đăng",
                                        execute: (reason) =>
                                          moderateMaterialMutation.mutate({
                                            id: item._id,
                                            status: "completed",
                                            reason,
                                          }),
                                      })
                                    }
                                    className="p-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 cursor-pointer"
                                    title="Tạm ẩn bài"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                )}

                                {isAdmin && (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setReasonModal({
                                        title: "Xóa vĩnh viễn bài đăng vi phạm",
                                        defaultReason: "Bài đăng spam / sai sự thật vi phạm quy chế MatGreen",
                                        presets: [
                                          "Bài đăng spam / quảng cáo sai quy định",
                                          "Bài đăng trùng lặp nhiều lần",
                                          "Dấu hiệu lừa đảo / thông tin giả mạo",
                                        ],
                                        danger: true,
                                        confirmLabel: "Xóa vĩnh viễn",
                                        execute: (reason) =>
                                          deleteMaterialMutation.mutate({ id: item._id, reason }),
                                      })
                                    }
                                    className="p-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 cursor-pointer"
                                    title="Xóa vĩnh viễn"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                )}

                                <Link
                                  to={`/materials/${item._id}`}
                                  className="p-1.5 rounded-xl border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                                  title="Xem trên sàn"
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

                  <Pager
                    page={materialPage}
                    totalPages={materialsData?.pagination?.totalPages}
                    totalCount={materialsData?.pagination?.total}
                    onChange={setMaterialPage}
                  />
                </div>
              )}
            </div>
          )}

          {/* TAB 2: REPORTS (Now displays Target Material / Target User card!) */}
          {activeTab === "reports" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2">
                <select
                  value={reportStatusFilter}
                  onChange={(e) => {
                    setReportStatusFilter(e.target.value);
                    setReportPage(1);
                  }}
                  className="px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white font-semibold"
                >
                  <option value="all">Tất cả báo cáo</option>
                  <option value="open">🔴 Chờ xử lý</option>
                  <option value="reviewing">🟡 Đang xem xét</option>
                  <option value="resolved">🟢 Đã giải quyết</option>
                </select>
                <span className="text-xs text-slate-400">
                  Tổng: <strong>{reportsData?.pagination?.total ?? reportItems.length}</strong> báo cáo
                </span>
              </div>

              {reportsLoading ? (
                <div className="py-16 text-center text-xs text-slate-400">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-emerald-600" />
                  Đang tải danh sách báo cáo...
                </div>
              ) : reportItems.length === 0 ? (
                <div className="py-16 text-center text-xs text-slate-400">
                  Chưa có báo cáo vi phạm nào trong danh mục này.
                </div>
              ) : (
                <div className="space-y-3">
                  {reportItems.map((report: any) => (
                    <div
                      key={report._id}
                      className="p-4 rounded-2xl border border-slate-200 bg-white space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              report.targetType === "material"
                                ? "bg-amber-100 text-amber-900"
                                : "bg-purple-100 text-purple-900"
                            }`}
                          >
                            {report.targetType === "material" ? "Báo cáo Vật Liệu" : "Báo cáo Người Dùng"}
                          </span>
                          <span className="font-bold text-slate-900 text-sm">{report.reason}</span>
                        </div>

                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold self-start ${
                            report.status === "open"
                              ? "bg-rose-100 text-rose-800"
                              : report.status === "reviewing"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-emerald-100 text-emerald-800"
                          }`}
                        >
                          {report.status === "open"
                            ? "Chờ xử lý"
                            : report.status === "reviewing"
                            ? "Đang xem xét"
                            : "Đã giải quyết"}
                        </span>
                      </div>

                      {/* Target Object Link Card */}
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-wrap items-center justify-between gap-2 text-xs">
                        {report.targetType === "material" && report.material ? (
                          <>
                            <div>
                              <span className="text-slate-500">Bài đăng bị báo cáo: </span>
                              <strong className="text-slate-900">{report.material.title}</strong>
                            </div>
                            <Link
                              to={`/materials/${report.material._id}`}
                              className="inline-flex items-center gap-1 font-bold text-emerald-700 hover:underline"
                            >
                              Mở bài đăng <ExternalLink className="w-3.5 h-3.5" />
                            </Link>
                          </>
                        ) : report.targetUser ? (
                          <>
                            <div>
                              <span className="text-slate-500">Tài khoản bị báo cáo: </span>
                              <strong className="text-slate-900">
                                {report.targetUser.name} ({report.targetUser.email})
                              </strong>
                            </div>
                            <Link
                              to={`/users/${report.targetUser._id}`}
                              className="inline-flex items-center gap-1 font-bold text-emerald-700 hover:underline"
                            >
                              Xem hồ sơ <ExternalLink className="w-3.5 h-3.5" />
                            </Link>
                          </>
                        ) : (
                          <span className="text-slate-400 italic">Đối tượng bị báo cáo đã bị xóa.</span>
                        )}
                      </div>

                      {report.resolution && (
                        <div className="text-xs text-emerald-800 bg-emerald-50/70 px-3 py-2 rounded-xl border border-emerald-200">
                          <strong>Kết quả xử lý:</strong> {report.resolution}
                        </div>
                      )}

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-100">
                        <div className="text-[11px] text-slate-400">
                          Người báo cáo: <strong>{report.reporter?.name || "Thành viên"}</strong> ·{" "}
                          {new Date(report.createdAt).toLocaleString("vi-VN")}
                        </div>

                        {report.status !== "resolved" && (
                          <div className="flex items-center gap-2">
                            {report.status === "open" && (
                              <button
                                type="button"
                                onClick={() =>
                                  setReasonModal({
                                    title: "Chuyển sang trạng thái Đang Xem Xét",
                                    defaultReason: "Ban quản trị đã tiếp nhận và đang xác minh thông tin",
                                    presets: [
                                      "Ban quản trị đã tiếp nhận và đang xác minh thông tin",
                                      "Đang liên hệ người đăng để đối chiếu thực tế",
                                    ],
                                    confirmLabel: "Đánh dấu đang xem xét",
                                    execute: (reason) =>
                                      reportUpdateMutation.mutate({
                                        id: report._id,
                                        status: "reviewing",
                                        reason,
                                      }),
                                  })
                                }
                                className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs cursor-pointer"
                              >
                                Xem Xét
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() =>
                                setReasonModal({
                                  title: "Hoàn tất xử lý báo cáo",
                                  defaultReason: "Đã kiểm tra và xử lý nội dung vi phạm theo quy chế",
                                  presets: [
                                    "Đã ẩn bài đăng vi phạm và nhắc nhở người đăng",
                                    "Đã kiểm tra, nội dung không vi phạm quy chế",
                                    "Đã khóa tài khoản vi phạm",
                                  ],
                                  confirmLabel: "Đánh dấu Đã giải quyết",
                                  execute: (reason) =>
                                    reportUpdateMutation.mutate({
                                      id: report._id,
                                      status: "resolved",
                                      reason,
                                    }),
                                })
                              }
                              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs cursor-pointer"
                            >
                              Giải Quyết
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  <Pager
                    page={reportPage}
                    totalPages={reportsData?.pagination?.totalPages}
                    totalCount={reportsData?.pagination?.total}
                    onChange={setReportPage}
                  />
                </div>
              )}
            </div>
          )}

          {/* TAB 3: PHONE VERIFICATION */}
          {activeTab === "phoneVerification" && (
            <div className="space-y-4">
              {phoneLoading ? (
                <div className="py-16 text-center text-xs text-slate-400">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-emerald-600" />
                  Đang tải yêu cầu xác minh...
                </div>
              ) : phoneItems.length === 0 ? (
                <div className="py-16 text-center text-xs text-slate-400">
                  Hiện không có yêu cầu xác minh số điện thoại nào đang chờ.
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {phoneItems.map((u: any) => (
                    <div
                      key={u._id}
                      className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                          <span>{u.name}</span>
                          <span className="font-mono text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                            📞 {u.phone}
                          </span>
                        </div>
                        <div className="text-xs text-slate-500">Email: {u.email}</div>
                        {u.phoneVerificationNote && (
                          <div className="text-xs text-slate-600 italic bg-slate-50 p-2 rounded-lg border border-slate-100 max-w-lg">
                            “{u.phoneVerificationNote}”
                          </div>
                        )}
                      </div>

                      {isAdmin && (
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              setReasonModal({
                                title: `Xác minh SĐT cho ${u.name}`,
                                defaultReason: "Đã liên hệ xác thực số điện thoại chính chủ thành công",
                                presets: [
                                  "Đã liên hệ xác thực số điện thoại chính chủ thành công",
                                  "Thông tin hồ sơ nhà thầu hợp lệ",
                                ],
                                confirmLabel: "Duyệt Xác Minh",
                                execute: (reason) =>
                                  verifyPhoneMutation.mutate({ id: u._id, verified: true, reason }),
                              })
                            }
                            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                          >
                            <Check className="w-4 h-4" /> Duyệt
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              setReasonModal({
                                title: `Từ chối xác minh SĐT của ${u.name}`,
                                defaultReason: "Số điện thoại không liên lạc được hoặc chưa chính xác",
                                presets: [
                                  "Số điện thoại không liên lạc được",
                                  "Định dạng số điện thoại chưa hợp lệ",
                                ],
                                danger: true,
                                confirmLabel: "Từ chối",
                                execute: (reason) =>
                                  verifyPhoneMutation.mutate({ id: u._id, verified: false, reason }),
                              })
                            }
                            className="px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs border border-rose-200 flex items-center gap-1.5 cursor-pointer"
                          >
                            <X className="w-4 h-4" /> Từ chối
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: USERS MANAGEMENT (With Search, Filters & Role Toggle!) */}
          {activeTab === "users" && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-2">
                <div className="flex flex-wrap items-center gap-2 flex-1">
                  <div className="relative flex-1 min-w-[210px] max-w-xs">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="Tìm tên, email hoặc số điện thoại..."
                      value={userSearch}
                      onChange={(e) => {
                        setUserSearch(e.target.value);
                        setUserPage(1);
                      }}
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <select
                    value={userRoleFilter}
                    onChange={(e) => {
                      setUserRoleFilter(e.target.value);
                      setUserPage(1);
                    }}
                    className="px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white font-semibold"
                  >
                    <option value="all">Tất cả vai trò</option>
                    <option value="user">Thành viên</option>
                    <option value="moderator">Kiểm duyệt viên</option>
                    <option value="admin">Quản trị viên</option>
                  </select>

                  <select
                    value={userSuspendedFilter}
                    onChange={(e) => {
                      setUserSuspendedFilter(e.target.value);
                      setUserPage(1);
                    }}
                    className="px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white font-semibold"
                  >
                    <option value="all">Mọi trạng thái</option>
                    <option value="false">Đang hoạt động</option>
                    <option value="true">Đã bị khóa</option>
                  </select>
                </div>

                <span className="text-xs text-slate-500">
                  Tổng: <strong>{usersData?.pagination?.total ?? 0}</strong> tài khoản
                </span>
              </div>

              {usersLoading ? (
                <div className="py-16 text-center text-xs text-slate-400">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-emerald-600" />
                  Đang tải danh sách thành viên...
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider text-[10px]">
                        <th className="pb-3 font-bold">Thành Viên</th>
                        <th className="pb-3 font-bold">Email / SĐT</th>
                        <th className="pb-3 font-bold">Vai Trò</th>
                        <th className="pb-3 font-bold">Trạng Thái</th>
                        <th className="pb-3 font-bold text-right">Thao Tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {userItems.map((u: any) => (
                        <tr key={u._id} className="hover:bg-slate-50 transition-colors">
                          <td className="py-3.5 pr-4">
                            <Link
                              to={`/users/${u._id}`}
                              className="font-bold text-slate-900 hover:text-emerald-700"
                            >
                              {u.name}
                            </Link>
                            <div className="text-[11px] text-slate-400 font-mono">
                              Tham gia: {new Date(u.createdAt).toLocaleDateString("vi-VN")}
                            </div>
                          </td>

                          <td className="py-3.5 pr-4">
                            <div className="font-medium text-slate-700">{u.email}</div>
                            <div className="text-[11px] text-slate-400">
                              {u.phone || "Chưa có SĐT"}
                              {u.phoneVerified && (
                                <span className="ml-1 text-emerald-700 font-bold">✓</span>
                              )}
                            </div>
                          </td>

                          <td className="py-3.5 pr-4">
                            <span
                              className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                                u.role === "admin"
                                  ? "bg-amber-100 text-amber-900"
                                  : u.role === "moderator"
                                  ? "bg-purple-100 text-purple-900"
                                  : "bg-slate-100 text-slate-700"
                              }`}
                            >
                              {u.role === "admin"
                                ? "Quản trị viên"
                                : u.role === "moderator"
                                ? "Kiểm duyệt viên"
                                : "Thành viên"}
                            </span>
                          </td>

                          <td className="py-3.5 pr-4">
                            {u.isSuspended ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 font-bold border border-rose-200 text-[10px]">
                                <Lock className="w-3 h-3" /> Đã Khóa
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200 text-[10px]">
                                <CheckCircle2 className="w-3 h-3" /> Hoạt động
                              </span>
                            )}
                          </td>

                          <td className="py-3.5 text-right">
                            {isAdmin && u.role !== "admin" && u.role !== "superadmin" && (
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => {
                                    const nextRole = u.role === "moderator" ? "user" : "moderator";
                                    setReasonModal({
                                      title:
                                        nextRole === "moderator"
                                          ? `Bổ nhiệm ${u.name} làm Kiểm duyệt viên`
                                          : `Chuyển ${u.name} về Thành viên thường`,
                                      defaultReason:
                                        nextRole === "moderator"
                                          ? "Bổ sung nhân sự hỗ trợ kiểm duyệt nội dung sàn"
                                          : "Điều chỉnh lại phân quyền vận hành",
                                      presets: [
                                        "Bổ sung nhân sự hỗ trợ kiểm duyệt nội dung sàn",
                                        "Điều chỉnh lại phân quyền vận hành",
                                      ],
                                      confirmLabel: "Xác nhận đổi vai trò",
                                      execute: (reason) =>
                                        roleMutation.mutate({ id: u._id, role: nextRole, reason }),
                                    });
                                  }}
                                  className="px-2.5 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs cursor-pointer"
                                >
                                  {u.role === "moderator" ? "Hạ quyền" : "Cấp Mod"}
                                </button>

                                <button
                                  type="button"
                                  onClick={() =>
                                    setReasonModal({
                                      title: u.isSuspended
                                        ? `Mở khóa tài khoản ${u.name}`
                                        : `Tạm khóa tài khoản ${u.name}`,
                                      defaultReason: u.isSuspended
                                        ? "Đã cam kết tuân thủ quy chế cộng đồng MatGreen"
                                        : "Tài khoản vi phạm quy chế đăng tin trên sàn",
                                      presets: u.isSuspended
                                        ? ["Đã cam kết tuân thủ quy chế cộng đồng MatGreen"]
                                        : [
                                            "Đăng tin spam / quảng cáo sai quy định",
                                            "Nhiều người dùng báo cáo thông tin không trung thực",
                                          ],
                                      danger: !u.isSuspended,
                                      confirmLabel: u.isSuspended ? "Mở khóa" : "Khóa tài khoản",
                                      execute: (reason) =>
                                        suspendMutation.mutate({
                                          id: u._id,
                                          suspended: !u.isSuspended,
                                          reason,
                                        }),
                                    })
                                  }
                                  className={`px-3 py-1.5 rounded-xl font-bold text-xs cursor-pointer ${
                                    u.isSuspended
                                      ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                                      : "bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200"
                                  }`}
                                >
                                  {u.isSuspended ? "Mở Khóa" : "Khóa"}
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <Pager
                    page={userPage}
                    totalPages={usersData?.pagination?.totalPages}
                    totalCount={usersData?.pagination?.total}
                    onChange={setUserPage}
                  />
                </div>
              )}
            </div>
          )}

          {/* TAB 5: AUDIT LOGS */}
          {activeTab === "auditLogs" && (
            <div className="space-y-4">
              {auditLoading ? (
                <div className="py-16 text-center text-xs text-slate-400">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-emerald-600" />
                  Đang tải nhật ký...
                </div>
              ) : !auditLogsData?.items?.length ? (
                <div className="py-16 text-center text-xs text-slate-400">
                  Chưa có nhật ký hoạt động nào được ghi nhận.
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {auditLogsData.items.map((log: any) => (
                    <div
                      key={log._id}
                      className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                    >
                      <div className="flex items-start gap-2.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <strong className="text-slate-900">
                              {log.actor?.name || "Quản trị viên"}
                            </strong>
                            <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-semibold text-[11px]">
                              {AUDIT_ACTION_LABELS[log.action] || log.action}
                            </span>
                          </div>
                          {log.reason && (
                            <div className="text-[11px] text-slate-500 italic mt-0.5">
                              Lý do: “{log.reason}”
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="text-[11px] text-slate-400 font-mono shrink-0">
                        {new Date(log.createdAt).toLocaleString("vi-VN")}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <AdminEditMaterialModal
        material={selectedMaterialForEdit}
        isOpen={Boolean(selectedMaterialForEdit)}
        onClose={() => setSelectedMaterialForEdit(null)}
        onSuccess={() => refetchMaterials()}
      />

      <AdminReasonModal
        open={Boolean(reasonModal)}
        title={reasonModal?.title || ""}
        defaultReason={reasonModal?.defaultReason || ""}
        presets={reasonModal?.presets || []}
        danger={reasonModal?.danger}
        confirmLabel={reasonModal?.confirmLabel}
        loading={isMutating}
        onConfirm={(reason) => reasonModal?.execute(reason)}
        onCancel={() => setReasonModal(null)}
      />
    </div>
  );
};
