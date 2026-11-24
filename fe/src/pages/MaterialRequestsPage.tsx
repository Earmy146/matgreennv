import React, { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useSearchParams } from "react-router-dom";
import {
  ArrowDownLeft,
  ArrowUpRight,
  CalendarClock,
  CheckCircle2,
  ClipboardList,
  Loader2,
  MapPin,
  MessageSquare,
  Phone,
  Star,
  UserCheck,
  XCircle,
} from "lucide-react";
import { materialRequestsApi, reviewsApi, type MaterialRequest } from "@/services/api";
import { toast } from "@/stores/toast.store";
import { formatCurrency, formatRelativeTime } from "@/lib/utils";

type RoleTab = "requester" | "owner";
type StatusFilter = "all" | "pending" | "approved" | "completed" | "closed";

const STATUS_LABELS: Record<MaterialRequest["status"], string> = {
  pending: "Đang chờ duyệt",
  approved: "Đã duyệt • Đang hẹn nhận",
  rejected: "Đã từ chối",
  cancelled: "Đã hủy",
  completed: "Giao dịch hoàn tất",
};

const STATUS_CLASSES: Record<MaterialRequest["status"], string> = {
  pending: "bg-amber-50 text-amber-800 border-amber-200",
  approved: "bg-emerald-50 text-emerald-800 border-emerald-200",
  rejected: "bg-rose-50 text-rose-800 border-rose-200",
  cancelled: "bg-slate-100 text-slate-600 border-slate-200",
  completed: "bg-blue-50 text-blue-800 border-blue-200",
};

const STEPS = [
  { key: "sent", label: "Gửi yêu cầu" },
  { key: "approved", label: "Chủ bài duyệt" },
  { key: "scheduled", label: "Hẹn lịch lấy" },
  { key: "completed", label: "Bàn giao xong" },
] as const;

function getStepIndex(req: MaterialRequest): number {
  if (req.status === "completed") return 3;
  if (req.status === "approved") return req.scheduledAt ? 2 : 1;
  return 0;
}

export const MaterialRequestsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab: RoleTab = searchParams.get("tab") === "owner" ? "owner" : "requester";
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [scheduleValues, setScheduleValues] = useState<Record<string, string>>({});
  const [reviewValues, setReviewValues] = useState<
    Record<string, { rating: number; comment: string }>
  >({});

  const outgoingQuery = useQuery({
    queryKey: ["material-requests", "requester"],
    queryFn: () => materialRequestsApi.listMine("requester"),
  });

  const incomingQuery = useQuery({
    queryKey: ["material-requests", "owner"],
    queryFn: () => materialRequestsApi.listMine("owner"),
  });

  const outgoingRequests = outgoingQuery.data || [];
  const incomingRequests = incomingQuery.data || [];
  const pendingIncomingCount = incomingRequests.filter((r) => r.status === "pending").length;

  const activeList = activeTab === "owner" ? incomingRequests : outgoingRequests;
  const isLoading = activeTab === "owner" ? incomingQuery.isLoading : outgoingQuery.isLoading;
  const isError = activeTab === "owner" ? incomingQuery.isError : outgoingQuery.isError;

  const filteredRequests = useMemo(() => {
    return activeList.filter((req) => {
      if (statusFilter === "all") return true;
      if (statusFilter === "closed") {
        return req.status === "rejected" || req.status === "cancelled";
      }
      return req.status === statusFilter;
    });
  }, [activeList, statusFilter]);

  const invalidateAll = () => {
    queryClient.invalidateQueries({ queryKey: ["material-requests"] });
    queryClient.invalidateQueries({ queryKey: ["my-materials"] });
  };

  const updateStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: MaterialRequest["status"] }) =>
      materialRequestsApi.updateStatus(id, status),
    onSuccess: (_data, vars) => {
      invalidateAll();
      const msgMap: Record<string, string> = {
        approved: "Đã duyệt yêu cầu! Bài đăng chuyển sang trạng thái Đã hẹn.",
        rejected: "Đã từ chối yêu cầu nhận vật liệu.",
        cancelled: "Đã hủy yêu cầu nhận vật liệu.",
        completed: "Đã xác nhận bàn giao vật liệu thành công!",
      };
      toast.success(msgMap[vars.status] || "Đã cập nhật trạng thái giao dịch");
    },
    onError: (err: any) =>
      toast.error(err?.response?.data?.message || "Không thể cập nhật trạng thái yêu cầu"),
  });

  const schedule = useMutation({
    mutationFn: ({ id, scheduledAt }: { id: string; scheduledAt: string }) =>
      materialRequestsApi.schedule(id, scheduledAt),
    onSuccess: () => {
      invalidateAll();
      toast.success("Đã cập nhật lịch hẹn nhận vật liệu!");
    },
    onError: (err: any) =>
      toast.error(err?.response?.data?.message || "Không thể đặt lịch lúc này"),
  });

  const review = useMutation({
    mutationFn: ({ id, rating, comment }: { id: string; rating: number; comment: string }) =>
      reviewsApi.create(id, rating, comment),
    onSuccess: () => {
      invalidateAll();
      toast.success("Cảm ơn bạn đã gửi đánh giá uy tín giao dịch!");
    },
    onError: (err: any) =>
      toast.error(err?.response?.data?.message || "Không thể gửi đánh giá"),
  });

  const handleTabChange = (tab: RoleTab) => {
    setSearchParams({ tab });
    setStatusFilter("all");
  };

  return (
    <div className="max-w-5xl mx-auto py-2 space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200">
            <ClipboardList className="w-3.5 h-3.5" /> Trung tâm giao dịch hai chiều
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
            Quản lý yêu cầu & bàn giao vật liệu
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Theo dõi yêu cầu bạn gửi đi (Nhà B) và duyệt yêu cầu người khác gửi đến bài của bạn (Nhà A).
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/materials"
            className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700"
          >
            Tìm vật liệu
          </Link>
          <Link
            to="/post"
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold"
          >
            + Đăng vật liệu
          </Link>
        </div>
      </div>

      {/* Two-way Role Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 bg-slate-100/90 p-1.5 rounded-2xl border border-slate-200/80">
        <button
          type="button"
          onClick={() => handleTabChange("requester")}
          className={`flex items-center justify-between px-4 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === "requester"
              ? "bg-white text-slate-900 shadow-sm border border-slate-200/80"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <span className="flex items-center gap-2">
            <ArrowUpRight className="w-4 h-4 text-emerald-600" />
            <span>Yêu cầu tôi gửi đi (Bên nhận)</span>
          </span>
          <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-extrabold">
            {outgoingRequests.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => handleTabChange("owner")}
          className={`flex items-center justify-between px-4 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === "owner"
              ? "bg-white text-slate-900 shadow-sm border border-slate-200/80"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <span className="flex items-center gap-2">
            <ArrowDownLeft className="w-4 h-4 text-amber-600" />
            <span>Yêu cầu gửi đến tôi (Chủ bài đăng)</span>
          </span>
          <span className="flex items-center gap-1.5">
            {pendingIncomingCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-rose-600 text-white text-[11px] font-extrabold">
                {pendingIncomingCount} chờ duyệt
              </span>
            )}
            <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-extrabold">
              {incomingRequests.length}
            </span>
          </span>
        </button>
      </div>

      {/* Status Filter Pills */}
      <div className="flex flex-wrap items-center gap-1.5">
        {(
          [
            ["all", "Tất cả"],
            ["pending", "Chờ duyệt"],
            ["approved", "Đã duyệt / Đang hẹn"],
            ["completed", "Đã hoàn tất"],
            ["closed", "Đã hủy / Từ chối"],
          ] as const
        ).map(([val, label]) => (
          <button
            key={val}
            type="button"
            onClick={() => setStatusFilter(val)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              statusFilter === val
                ? "bg-slate-900 text-white"
                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Request Cards */}
      {isLoading ? (
        <div className="py-16 flex justify-center text-emerald-700">
          <Loader2 className="animate-spin w-6 h-6" />
        </div>
      ) : isError ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-800">
          Không thể tải danh sách giao dịch lúc này. Vui lòng thử lại sau.
        </div>
      ) : filteredRequests.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center space-y-3">
          <ClipboardList className="w-12 h-12 text-slate-300 mx-auto" />
          <h2 className="font-bold text-slate-800">
            {activeTab === "owner"
              ? "Chưa có yêu cầu nào gửi đến bài đăng của bạn"
              : "Bạn chưa có yêu cầu nhận vật liệu nào ở mục này"}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
            {activeTab === "owner"
              ? "Hãy đăng vật liệu kèm ảnh rõ nét và ghim tọa độ chính xác để người cần quanh khu vực dễ dàng tìm thấy."
              : "Khi tìm thấy nguồn vật liệu phù hợp trên Kho vật liệu hoặc Bản đồ Radar, hãy bấm Gửi yêu cầu cho người đăng."}
          </p>
          <Link
            to={activeTab === "owner" ? "/post" : "/materials"}
            className="inline-flex px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold"
          >
            {activeTab === "owner" ? "Đăng tin vật liệu mới" : "Khám phá kho vật liệu"}
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRequests.map((request) => {
            const isOwnerView = activeTab === "owner";
            const counterpart = isOwnerView ? request.requester : request.material?.owner;
            const counterpartId = counterpart?._id;
            const stepIndex = getStepIndex(request);
            const isClosed = request.status === "rejected" || request.status === "cancelled";
            const currentRating = reviewValues[request._id]?.rating || 5;
            const currentComment = reviewValues[request._id]?.comment || "";

            return (
              <article
                key={request._id}
                className="rounded-3xl border border-slate-200 bg-white p-5 shadow-2xs space-y-4"
              >
                {/* Top Row: Material Thumbnail + Info + Status Badge */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex items-start gap-3.5 min-w-0">
                    <Link
                      to={`/materials/${request.material?._id}`}
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0"
                    >
                      {request.material?.images?.[0] ? (
                        <img
                          src={request.material.images[0]}
                          alt={request.material.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-400">
                          Không ảnh
                        </div>
                      )}
                    </Link>

                    <div className="space-y-1.5 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <Link
                          to={`/materials/${request.material?._id}`}
                          className="font-extrabold text-slate-900 hover:text-emerald-700 text-sm sm:text-base line-clamp-1"
                        >
                          {request.material?.title || "Bài đăng vật liệu"}
                        </Link>
                        {request.material && (
                          <span className="text-xs font-extrabold text-emerald-700">
                            {formatCurrency(request.material.price)}
                          </span>
                        )}
                      </div>

                      {request.material?.location?.address && (
                        <div className="text-xs text-slate-500 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span className="truncate">{request.material.location.address}</span>
                        </div>
                      )}

                      {/* Counterpart Profile Info */}
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-600 pt-0.5">
                        <span className="inline-flex items-center gap-1.5">
                          <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                          <span>{isOwnerView ? "Người xin nhận:" : "Chủ bài đăng:"}</span>
                          {counterpartId ? (
                            <Link
                              to={`/users/${counterpartId}`}
                              className="font-bold text-slate-900 hover:text-emerald-700 underline decoration-slate-300"
                            >
                              {counterpart?.name || "Thành viên"}
                            </Link>
                          ) : (
                            <strong className="text-slate-900">{counterpart?.name || "Thành viên"}</strong>
                          )}
                        </span>
                        {counterpart?.phone && (
                          <a
                            href={`tel:${counterpart.phone}`}
                            className="inline-flex items-center gap-1 text-emerald-700 font-semibold hover:underline"
                          >
                            <Phone className="w-3 h-3" />
                            {counterpart.phone}
                          </a>
                        )}
                        <span className="text-[11px] text-slate-400">
                          {formatRelativeTime(request.createdAt)}
                        </span>
                      </div>

                      {request.message && (
                        <p className="text-xs text-slate-600 bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 mt-1">
                          Lời nhắn: “{request.message}”
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0">
                    <span
                      className={`inline-flex px-3 py-1 rounded-full border text-xs font-bold ${
                        STATUS_CLASSES[request.status]
                      }`}
                    >
                      {STATUS_LABELS[request.status]}
                    </span>

                    {counterpartId && request.material?._id && (
                      <Link
                        to={`/chat?partnerId=${counterpartId}&materialId=${request.material._id}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold transition-colors"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Nhắn tin trao đổi</span>
                      </Link>
                    )}
                  </div>
                </div>

                {/* 4-Step Visual Progress Bar (for active / completed flows) */}
                {!isClosed && (
                  <div className="grid grid-cols-4 gap-1.5 pt-2 border-t border-slate-100">
                    {STEPS.map((step, idx) => {
                      const done = idx <= stepIndex;
                      return (
                        <div key={step.key} className="space-y-1">
                          <div
                            className={`h-1.5 rounded-full transition-colors ${
                              done ? "bg-emerald-500" : "bg-slate-200"
                            }`}
                          />
                          <div
                            className={`text-[10.5px] font-bold truncate ${
                              done ? "text-emerald-800" : "text-slate-400"
                            }`}
                          >
                            {idx + 1}. {step.label}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Pending Actions */}
                {request.status === "pending" && (
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
                    {isOwnerView ? (
                      <>
                        <span className="text-xs text-slate-500">
                          Kiểm tra hồ sơ uy tín của người nhận trước khi duyệt giữ hàng.
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            disabled={updateStatus.isPending}
                            onClick={() =>
                              updateStatus.mutate({ id: request._id, status: "rejected" })
                            }
                            className="px-3.5 py-2 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-bold disabled:opacity-50 cursor-pointer"
                          >
                            Từ chối
                          </button>
                          <button
                            type="button"
                            disabled={updateStatus.isPending}
                            onClick={() =>
                              updateStatus.mutate({ id: request._id, status: "approved" })
                            }
                            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold disabled:opacity-50 cursor-pointer"
                          >
                            Duyệt cho nhận
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <span className="text-xs text-slate-500">
                          Đang chờ chủ bài đăng phản hồi yêu cầu của bạn.
                        </span>
                        <button
                          type="button"
                          disabled={updateStatus.isPending}
                          onClick={() =>
                            updateStatus.mutate({ id: request._id, status: "cancelled" })
                          }
                          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-50 cursor-pointer"
                        >
                          <XCircle className="w-3.5 h-3.5" /> Hủy yêu cầu
                        </button>
                      </>
                    )}
                  </div>
                )}

                {/* Approved: Scheduling & Handover Completion */}
                {request.status === "approved" && (
                  <div className="rounded-2xl bg-emerald-50/80 border border-emerald-200 p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-2">
                      <div className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                        <CalendarClock className="w-4 h-4 text-emerald-700" />
                        {request.scheduledAt
                          ? `Lịch hẹn bốc hàng: ${new Date(request.scheduledAt).toLocaleString("vi-VN")}`
                          : "Chốt thời gian qua công trình nhận vật liệu"}
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <input
                          type="datetime-local"
                          value={scheduleValues[request._id] || ""}
                          onChange={(e) =>
                            setScheduleValues((cur) => ({ ...cur, [request._id]: e.target.value }))
                          }
                          className="rounded-xl border border-emerald-200 bg-white px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                        <button
                          type="button"
                          disabled={schedule.isPending || !scheduleValues[request._id]}
                          onClick={() =>
                            schedule.mutate({
                              id: request._id,
                              scheduledAt: scheduleValues[request._id],
                            })
                          }
                          className="px-3 py-1.5 rounded-xl border border-emerald-300 bg-white hover:bg-emerald-100 text-emerald-800 text-xs font-bold disabled:opacity-50 cursor-pointer"
                        >
                          {request.scheduledAt ? "Đổi lịch hẹn" : "Đặt lịch hẹn"}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {!isOwnerView && (
                        <button
                          type="button"
                          disabled={updateStatus.isPending}
                          onClick={() =>
                            updateStatus.mutate({ id: request._id, status: "cancelled" })
                          }
                          className="px-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-600 hover:bg-slate-50 text-xs font-bold disabled:opacity-50 cursor-pointer"
                        >
                          Hủy hẹn
                        </button>
                      )}
                      <button
                        type="button"
                        disabled={updateStatus.isPending}
                        onClick={() =>
                          updateStatus.mutate({ id: request._id, status: "completed" })
                        }
                        className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold disabled:opacity-50 cursor-pointer shadow-xs"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>
                          {isOwnerView ? "Xác nhận đã bàn giao xong" : "Xác nhận đã nhận đủ hàng"}
                        </span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Completed: Interactive Star Review OR Submitted Review Summary */}
                {request.status === "completed" && (
                  <div className="rounded-2xl border border-amber-200/80 bg-amber-50/70 p-4">
                    {request.myReview ? (
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                            <span>Đánh giá của bạn cho đối tác:</span>
                            <span className="inline-flex items-center gap-0.5 text-amber-500">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-3.5 h-3.5 ${
                                    i < (request.myReview?.rating || 0)
                                      ? "fill-amber-400 text-amber-400"
                                      : "text-amber-200"
                                  }`}
                                />
                              ))}
                            </span>
                          </div>
                          {request.myReview.comment && (
                            <p className="text-xs text-slate-600">“{request.myReview.comment}”</p>
                          )}
                        </div>
                        <span className="text-[11px] font-bold text-emerald-700 bg-white px-2.5 py-1 rounded-full border border-emerald-200">
                          Đã ghi nhận uy tín
                        </span>
                      </div>
                    ) : (
                      <div className="space-y-2.5">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="text-xs font-bold text-amber-950">
                            Chấm điểm uy tín cho{" "}
                            {isOwnerView ? "người nhận vật liệu" : "chủ công trình"}:
                          </span>
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                onClick={() =>
                                  setReviewValues((v) => ({
                                    ...v,
                                    [request._id]: {
                                      rating: star,
                                      comment: v[request._id]?.comment || "",
                                    },
                                  }))
                                }
                                className="p-0.5 cursor-pointer"
                                title={`${star} sao`}
                              >
                                <Star
                                  className={`w-5 h-5 transition-transform hover:scale-110 ${
                                    star <= currentRating
                                      ? "fill-amber-400 text-amber-400"
                                      : "text-amber-200"
                                  }`}
                                />
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-2">
                          <input
                            value={currentComment}
                            onChange={(e) =>
                              setReviewValues((v) => ({
                                ...v,
                                [request._id]: {
                                  rating: currentRating,
                                  comment: e.target.value,
                                },
                              }))
                            }
                            placeholder="Nhận xét thực tế (đúng hẹn, hỗ trợ bốc xếp nhiệt tình, vật liệu đúng mô tả...)"
                            className="flex-1 rounded-xl border border-amber-200 bg-white px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                          />
                          <button
                            type="button"
                            disabled={review.isPending}
                            onClick={() =>
                              review.mutate({
                                id: request._id,
                                rating: currentRating,
                                comment: currentComment,
                              })
                            }
                            className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold disabled:opacity-50 cursor-pointer shrink-0"
                          >
                            Gửi đánh giá
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};
