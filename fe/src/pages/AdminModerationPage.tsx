import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  History,
  Shield,
  Users,
  Search,
  Filter,
  Check,
  X,
  Phone,
  Eye,
  Edit3,
  Lock,
  Unlock,
  ShieldCheck,
  Clock,
  Layers,
  ArrowRight,
  ExternalLink,
  Loader2,
  FileText,
  BadgeAlert,
} from "lucide-react";
import { adminApi, reportsApi } from "@/services/api";
import { AdminEditMaterialModal } from "@/components/admin/AdminEditMaterialModal";
import { CATEGORY_LABELS, formatPrice } from "@/lib/utils";

const PAGE_SIZE = 10;
type TabType = "materials" | "reports" | "phoneVerification" | "users" | "auditLogs";

export const AdminModerationPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<TabType>("materials");

  // Tab Pagination states
  const [materialPage, setMaterialPage] = useState(1);
  const [reportPage, setReportPage] = useState(1);
  const [userPage, setUserPage] = useState(1);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [materialStatusFilter, setMaterialStatusFilter] = useState<string>("all");
  const [reportStatusFilter, setReportStatusFilter] = useState<string>("all");

  // Action reasons state
  const [reasonMap, setReasonMap] = useState<Record<string, string>>({});

  // Edit Modal State
  const [selectedMaterialForEdit, setSelectedMaterialForEdit] = useState<any | null>(null);

  // Data Queries
  const { data: stats } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: adminApi.stats,
  });

  const { data: materialsData, isLoading: materialsLoading, refetch: refetchMaterials } = useQuery({
    queryKey: ["admin-materials", materialPage],
    queryFn: () => adminApi.materials({ page: materialPage, limit: PAGE_SIZE }),
  });

  const { data: reportsData, isLoading: reportsLoading, refetch: refetchReports } = useQuery({
    queryKey: ["admin-reports", reportPage],
    queryFn: () => reportsApi.list({ page: reportPage, limit: PAGE_SIZE }),
  });

  const { data: usersData, isLoading: usersLoading, refetch: refetchUsers } = useQuery({
    queryKey: ["admin-users", userPage],
    queryFn: () => adminApi.users({ page: userPage, limit: PAGE_SIZE }),
  });

  const { data: phoneRequestsData, isLoading: phoneLoading, refetch: refetchPhones } = useQuery({
    queryKey: ["phone-verification-requests"],
    queryFn: () => adminApi.phoneVerificationRequests({ limit: PAGE_SIZE }),
  });

  const { data: auditLogsData, isLoading: auditLoading } = useQuery({
    queryKey: ["admin-audit-logs"],
    queryFn: () => adminApi.auditLogs({ limit: 30 }),
  });

  // Action Mutations
  const reportUpdateMutation = useMutation({
    mutationFn: ({ id, status, actionReason }: { id: string; status: string; actionReason: string }) =>
      reportsApi.update(id, status, actionReason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-reports"] });
      queryClient.invalidateQueries({ queryKey: ["admin-audit-logs"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
    },
  });

  const suspendMutation = useMutation({
    mutationFn: ({ id, suspended, actionReason }: { id: string; suspended: boolean; actionReason: string }) =>
      adminApi.suspendUser(id, suspended, actionReason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      queryClient.invalidateQueries({ queryKey: ["admin-audit-logs"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
    },
  });

  const moderateMaterialMutation = useMutation({
    mutationFn: ({ id, status, actionReason }: { id: string; status: string; actionReason: string }) =>
      adminApi.moderateMaterial(id, status, actionReason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-materials"] });
      queryClient.invalidateQueries({ queryKey: ["admin-audit-logs"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
    },
  });

  const verifyPhoneMutation = useMutation({
    mutationFn: ({ id, verified, actionReason }: { id: string; verified: boolean; actionReason: string }) =>
      adminApi.verifyPhone(id, verified, actionReason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["phone-verification-requests"] });
      queryClient.invalidateQueries({ queryKey: ["admin-audit-logs"] });
    },
  });

  const getOrPromptReason = (id: string, defaultReason: string = "") => {
    if (reasonMap[id]?.trim()) return reasonMap[id].trim();
    const input = window.prompt("Nhập lý do kiểm duyệt bắt buộc cho thao tác này:", defaultReason);
    if (!input?.trim()) return null;
    const clean = input.trim();
    setReasonMap((prev) => ({ ...prev, [id]: clean }));
    return clean;
  };

  // Filtered lists
  const filteredMaterials = (materialsData?.items || []).filter((item: any) => {
    const matchesStatus =
      materialStatusFilter === "all" || item.status === materialStatusFilter;
    const matchesSearch =
      !searchQuery.trim() ||
      item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.author?.name?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const filteredReports = (reportsData?.items || []).filter((rep: any) => {
    if (reportStatusFilter === "all") return true;
    return rep.status === reportStatusFilter;
  });

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
          Hiển thị trang <strong>{page}</strong> / <strong>{pages}</strong>
          {totalCount !== undefined && (
            <span> (Tổng cộng <strong>{totalCount}</strong> mục)</span>
          )}
        </span>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => onChange(page - 1)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 disabled:opacity-40 font-bold transition-colors cursor-pointer"
          >
            Trang trước
          </button>
          
          <div className="flex items-center gap-1">
            {Array.from({ length: pages }).map((_, idx) => {
              const pageNum = idx + 1;
              return (
                <button
                  key={pageNum}
                  type="button"
                  onClick={() => onChange(pageNum)}
                  className={`w-7 h-7 rounded-xl font-bold transition-all cursor-pointer ${
                    pageNum === page
                      ? "bg-emerald-600 text-white shadow-xs"
                      : "border border-slate-200 text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            disabled={page >= pages}
            onClick={() => onChange(page + 1)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 disabled:opacity-40 font-bold transition-colors cursor-pointer"
          >
            Trang sau
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-fadeIn" data-lenis-prevent>
      {/* Header Top */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
            <Shield className="w-4 h-4 text-emerald-600" />
            <span>Phân Hệ Quản Trị Vận Hành</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Kiểm Duyệt & An Toàn Nền Tảng
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Giám sát chất lượng nguồn cung, xử lý tố cáo vi phạm, xác minh danh tính và ghi nhận toàn bộ nhật ký thao tác.
          </p>
        </div>
      </div>

      {/* KPI Stats Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3">
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Bài Đăng</span>
            <Layers className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{stats?.materials || 0}</div>
          <span className="text-[10px] text-slate-400">Nguồn cung trên sàn</span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Báo Cáo Mở</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-amber-600">{stats?.reports?.open || 0}</div>
          <span className="text-[10px] text-slate-400">Cần xử lý gấp</span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Đang Xem Xét</span>
            <History className="w-4 h-4 text-sky-500" />
          </div>
          <div className="text-2xl font-black text-sky-600">{stats?.reports?.reviewing || 0}</div>
          <span className="text-[10px] text-slate-400">Đang kiểm chứng</span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Đã Xử Lý</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-600">{stats?.reports?.resolved || 0}</div>
          <span className="text-[10px] text-slate-400">Báo cáo hoàn tất</span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Thành Viên</span>
            <Users className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{stats?.users || 0}</div>
          <span className="text-[10px] text-slate-400">Đã đăng ký</span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Tài Khoản Khóa</span>
            <Shield className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-black text-rose-600">{stats?.suspendedUsers || 0}</div>
          <span className="text-[10px] text-slate-400">Vi phạm quy chế</span>
        </div>
      </div>

      {/* Main Tabbed Container */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
        {/* Navigation Tabs Header */}
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
            <span>Kiểm Duyệt Bài Đăng</span>
            <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 text-[10px]">
              {materialsData?.pagination?.totalItems || 0}
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
            <span>Xác Minh Số Điện Thoại</span>
            {(phoneRequestsData?.items?.length || 0) > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-amber-500 text-white text-[10px]">
                {phoneRequestsData?.items?.length}
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
            <span>Danh Sách Thành Viên</span>
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

        {/* Tab Body */}
        <div className="p-4 sm:p-6">
          {/* TAB 1: KIỂM DUYỆT BÀI ĐĂNG */}
          {activeTab === "materials" && (
            <div className="space-y-4">
              {/* Filter bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-3">
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <div className="relative flex-1 sm:w-72">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="Tìm bài đăng hoặc tên người đăng..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <select
                    value={materialStatusFilter}
                    onChange={(e) => setMaterialStatusFilter(e.target.value)}
                    className="px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none"
                  >
                    <option value="all">Tất cả trạng thái</option>
                    <option value="available">🟢 Đang hiển thị</option>
                    <option value="pending">🟡 Chờ kiểm duyệt</option>
                    <option value="completed">⚪ Đã ẩn / Hoàn thành</option>
                  </select>
                </div>

                <div className="text-xs text-slate-400">
                  Tìm thấy <strong>{filteredMaterials.length}</strong> bài đăng
                </div>
              </div>

              {/* Table of materials */}
              {materialsLoading ? (
                <div className="py-16 text-center text-xs text-slate-400">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-emerald-600" />
                  Đang tải danh sách bài đăng...
                </div>
              ) : filteredMaterials.length === 0 ? (
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
                      {filteredMaterials.map((item: any) => (
                        <tr key={item._id} className="hover:bg-slate-50 transition-colors">
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
                                <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1.5">
                                  <span className="font-medium text-emerald-700">
                                    {CATEGORY_LABELS[item.category] || item.category}
                                  </span>
                                  <span>·</span>
                                  <span className="truncate max-w-[150px]">
                                    {item.address || "Chưa có địa chỉ"}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </td>

                          <td className="py-3.5 pr-4">
                            <div className="font-semibold text-slate-800">
                              {item.author?.name || "Người dùng"}
                            </div>
                            <div className="text-[11px] text-slate-400 font-mono">
                              {item.contactPhone || "Chưa có SĐT"}
                            </div>
                          </td>

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

                          <td className="py-3.5 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* Chỉnh Sửa Trực Tiếp Bài Đăng */}
                              <button
                                type="button"
                                onClick={() => setSelectedMaterialForEdit(item)}
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs border border-emerald-200 transition-colors cursor-pointer"
                                title="Chỉnh sửa nội dung bài đăng bằng bộ công cụ nâng cao"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                                <span>Sửa Bài</span>
                              </button>

                              {/* Duyệt hiển thị nếu đang pending */}
                              {item.status !== "available" && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    const actionReason = getOrPromptReason(
                                      item._id,
                                      "Phê duyệt bài đăng hợp lệ"
                                    );
                                    if (actionReason) {
                                      moderateMaterialMutation.mutate({
                                        id: item._id,
                                        status: "available",
                                        actionReason,
                                      });
                                    }
                                  }}
                                  className="p-1.5 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition-colors cursor-pointer"
                                  title="Duyệt hiển thị bài đăng"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                </button>
                              )}

                              {/* Ẩn bài đăng nếu đang hiển thị */}
                              {item.status === "available" && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    const actionReason = getOrPromptReason(
                                      item._id,
                                      "Nội dung cần chỉnh sửa hoặc tạm dừng hiển thị"
                                    );
                                    if (actionReason) {
                                      moderateMaterialMutation.mutate({
                                        id: item._id,
                                        status: "completed",
                                        actionReason,
                                      });
                                    }
                                  }}
                                  className="p-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-colors cursor-pointer"
                                  title="Ẩn bài viết khỏi sàn"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              )}

                              {/* Xem trên sàn */}
                              <a
                                href={`/materials/${item._id}`}
                                target="_blank"
                                rel="noreferrer"
                                className="p-1.5 rounded-xl border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                                title="Xem bài đăng ngoài sàn"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </a>
                            </div>
                          </td>
                        </tr>
                      ))}
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

          {/* TAB 2: XỬ LÝ BÁO CÁO VI PHẠM */}
          {activeTab === "reports" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3">
                <div className="flex items-center gap-2">
                  <select
                    value={reportStatusFilter}
                    onChange={(e) => setReportStatusFilter(e.target.value)}
                    className="px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                  >
                    <option value="all">Tất cả báo cáo</option>
                    <option value="open">🔴 Chờ xử lý</option>
                    <option value="reviewing">🟡 Đang xem xét</option>
                    <option value="resolved">🟢 Đã giải quyết</option>
                  </select>
                </div>
                <span className="text-xs text-slate-400">
                  Tổng: <strong>{filteredReports.length}</strong> báo cáo
                </span>
              </div>

              {reportsLoading ? (
                <div className="py-16 text-center text-xs text-slate-400">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-emerald-600" />
                  Đang tải danh sách báo cáo...
                </div>
              ) : filteredReports.length === 0 ? (
                <div className="py-16 text-center text-xs text-slate-400">
                  Chưa có báo cáo vi phạm nào trong danh mục này.
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredReports.map((report: any) => (
                    <div
                      key={report._id}
                      className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 transition-all space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              report.targetType === "material"
                                ? "bg-amber-100 text-amber-900"
                                : "bg-purple-100 text-purple-900"
                            }`}
                          >
                            {report.targetType === "material" ? "Vật Liệu" : "Người Dùng"}
                          </span>
                          <span className="font-bold text-slate-900 text-sm">
                            {report.reason}
                          </span>
                        </div>

                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
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

                      {report.details && (
                        <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                          <strong>Chi tiết tố cáo:</strong> {report.details}
                        </div>
                      )}

                      {/* Action Bar */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-100">
                        <div className="text-[11px] text-slate-400">
                          Người gửi: <strong>{report.reporter?.name || "Ẩn danh"}</strong> ·{" "}
                          {new Date(report.createdAt).toLocaleString("vi-VN")}
                        </div>

                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            placeholder="Ghi chú kết quả xử lý..."
                            value={reasonMap[report._id] || ""}
                            onChange={(e) =>
                              setReasonMap((prev) => ({
                                ...prev,
                                [report._id]: e.target.value,
                              }))
                            }
                            className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs w-48 sm:w-60 focus:outline-none"
                          />

                          {report.status === "open" && (
                            <button
                              type="button"
                              onClick={() => {
                                const actionReason = getOrPromptReason(
                                  report._id,
                                  "Đang liên hệ hai bên để xác minh"
                                );
                                if (actionReason) {
                                  reportUpdateMutation.mutate({
                                    id: report._id,
                                    status: "reviewing",
                                    actionReason,
                                  });
                                }
                              }}
                              className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs transition-colors cursor-pointer"
                            >
                              Xem Xét
                            </button>
                          )}

                          {report.status !== "resolved" && (
                            <button
                              type="button"
                              onClick={() => {
                                const actionReason = getOrPromptReason(
                                  report._id,
                                  "Đã xử lý nhắc nhở hoặc ẩn nội dung vi phạm"
                                );
                                if (actionReason) {
                                  reportUpdateMutation.mutate({
                                    id: report._id,
                                    status: "resolved",
                                    actionReason,
                                  });
                                }
                              }}
                              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors cursor-pointer"
                            >
                              Giải Quyết
                            </button>
                          )}
                        </div>
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

          {/* TAB 3: XÁC MINH SỐ ĐIỆN THOẠI */}
          {activeTab === "phoneVerification" && (
            <div className="space-y-4">
              <p className="text-xs text-slate-500">
                Danh sách thành viên gửi yêu cầu xác minh số điện thoại chính chủ để gia tăng độ uy tín khi giao dịch trên sàn MatGreen.
              </p>

              {phoneLoading ? (
                <div className="py-16 text-center text-xs text-slate-400">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-emerald-600" />
                  Đang tải yêu cầu xác minh...
                </div>
              ) : !phoneRequestsData?.items || phoneRequestsData.items.length === 0 ? (
                <div className="py-16 text-center text-xs text-slate-400">
                  Hiện không có yêu cầu xác minh số điện thoại nào đang chờ.
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {phoneRequestsData.items.map((user: any) => (
                    <div
                      key={user._id}
                      className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                          <span>{user.name}</span>
                          <span className="font-mono text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                            📞 {user.phone}
                          </span>
                        </div>
                        <div className="text-xs text-slate-500">Email: {user.email}</div>
                        {user.phoneVerificationNote && (
                          <div className="text-xs text-slate-600 italic bg-slate-50 p-2 rounded-lg border border-slate-100 max-w-lg">
                            "{user.phoneVerificationNote}"
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            const actionReason = getOrPromptReason(
                              user._id,
                              "Số điện thoại hợp lệ và đã gọi xác minh"
                            );
                            if (actionReason) {
                              verifyPhoneMutation.mutate({
                                id: user._id,
                                verified: true,
                                actionReason,
                              });
                            }
                          }}
                          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                        >
                          <Check className="w-4 h-4" />
                          <span>Duyệt Xác Minh</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            const actionReason = getOrPromptReason(
                              user._id,
                              "Số điện thoại không liên lạc được hoặc không hợp lệ"
                            );
                            if (actionReason) {
                              verifyPhoneMutation.mutate({
                                id: user._id,
                                verified: false,
                                actionReason,
                              });
                            }
                          }}
                          className="px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs border border-rose-200 flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <X className="w-4 h-4" />
                          <span>Từ Chối</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: QUẢN LÝ THÀNH VIÊN */}
          {activeTab === "users" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3">
                <span className="text-xs text-slate-500">
                  Tổng số tài khoản: <strong>{usersData?.pagination?.totalItems || 0}</strong>
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
                      {(usersData?.items || []).map((u: any) => (
                        <tr key={u._id} className="hover:bg-slate-50 transition-colors">
                          <td className="py-3.5 pr-4">
                            <div className="font-bold text-slate-900">{u.name}</div>
                            <div className="text-[11px] text-slate-400 font-mono">
                              ID: {u._id}
                            </div>
                          </td>

                          <td className="py-3.5 pr-4">
                            <div className="font-medium text-slate-700">{u.email}</div>
                            <div className="text-[11px] text-slate-400">
                              {u.phone || "Chưa có SĐT"}
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
                            {u.role !== "admin" && (
                              <button
                                type="button"
                                onClick={() => {
                                  const actionReason = getOrPromptReason(
                                    u._id,
                                    u.isSuspended
                                      ? "Mở khóa tài khoản sau khi xem xét"
                                      : "Khóa tài khoản do vi phạm quy chế"
                                  );
                                  if (actionReason) {
                                    suspendMutation.mutate({
                                      id: u._id,
                                      suspended: !u.isSuspended,
                                      actionReason,
                                    });
                                  }
                                }}
                                className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-colors cursor-pointer ${
                                  u.isSuspended
                                    ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                                    : "bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200"
                                }`}
                              >
                                {u.isSuspended ? "Mở Khóa" : "Khóa Tài Khoản"}
                              </button>
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

          {/* TAB 5: NHẬT KÝ QUẢN TRỊ */}
          {activeTab === "auditLogs" && (
            <div className="space-y-4">
              <p className="text-xs text-slate-500">
                Toàn bộ lịch sử thao tác của Ban Quản Trị và Hệ Thống đều được ghi lại tự động với lý do và mốc thời gian minh bạch.
              </p>

              {auditLoading ? (
                <div className="py-16 text-center text-xs text-slate-400">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-emerald-600" />
                  Đang tải nhật ký...
                </div>
              ) : !auditLogsData?.items || auditLogsData.items.length === 0 ? (
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
                          <div>
                            <strong className="text-slate-900">{log.actor?.name || "Hệ thống"}</strong>{" "}
                            <span className="text-slate-600">{log.action}</span>
                          </div>
                          {log.reason && (
                            <div className="text-[11px] text-slate-500 italic mt-0.5">
                              Lý do: "{log.reason}"
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="text-[11px] text-slate-400 font-mono shrink-0 sm:text-right">
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

      {/* Modal Chỉnh Sửa Bài Viết Người Đăng Bằng RichTextEditor */}
      <AdminEditMaterialModal
        material={selectedMaterialForEdit}
        isOpen={Boolean(selectedMaterialForEdit)}
        onClose={() => setSelectedMaterialForEdit(null)}
        onSuccess={() => {
          refetchMaterials();
        }}
      />
    </div>
  );
};
