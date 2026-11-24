import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Flag,
  Heart,
  Loader2,
  MapPin,
  Maximize2,
  MessageCircle,
  MessageSquare,
  Pencil,
  Phone,
  Share2,
  Sparkles,
  User,
  X,
} from "lucide-react";
import { favoritesApi, materialRequestsApi, materialsApi, reportsApi } from "@/services/api";
import { useAuthStore } from "@/stores/auth.store";
import { useAiAssistantStore } from "@/stores/ai-assistant.store";
import { useLocationStore } from "@/stores/location.store";
import { toast } from "@/stores/toast.store";
import { CATEGORY_LABELS, formatCurrency, formatDistance, formatRelativeTime } from "@/lib/utils";
import { MaterialMap } from "@/components/map/MaterialMap";
import { SafeHtmlContent } from "@/components/common/SafeHtmlContent";

export const MaterialDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { latitude, longitude } = useLocationStore();
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [requestMessage, setRequestMessage] = useState("");
  const [reportReason, setReportReason] = useState("");
  const queryClient = useQueryClient();
  const { user, isAuthenticated } = useAuthStore();
  const openAiDrawer = useAiAssistantStore((state) => state.openDrawer);

  const favoriteStatus = useQuery({
    queryKey: ["favorite-status", id],
    queryFn: () => favoritesApi.status(id as string),
    enabled: Boolean(id && isAuthenticated),
  });

  const favoriteMutation = useMutation({
    mutationFn: () =>
      favoriteStatus.data?.saved
        ? favoritesApi.remove(id as string)
        : favoritesApi.add(id as string),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["favorite-status", id] });
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
      toast.success(res.saved ? "Đã lưu bài đăng vào danh sách yêu thích" : "Đã bỏ lưu bài đăng");
    },
    onError: () => toast.error("Không thể cập nhật trạng thái lưu tin"),
  });

  const reportMutation = useMutation({
    mutationFn: (targetType: "material" | "user") =>
      reportsApi.create(
        targetType === "material"
          ? { targetType: "material", materialId: material?._id, reason: reportReason }
          : { targetType: "user", targetUserId: material?.owner._id, reason: reportReason }
      ),
    onSuccess: () => {
      setReportReason("");
      setReportModalOpen(false);
      toast.success("Đã gửi báo cáo tới quản trị viên. Cảm ơn bạn!");
    },
    onError: () => toast.error("Không thể gửi báo cáo lúc này."),
  });

  const { data: material, isLoading, isError } = useQuery({
    queryKey: ["material-detail", id, latitude, longitude],
    queryFn: () =>
      materialsApi.getById(id as string, {
        lat: latitude ?? undefined,
        lng: longitude ?? undefined,
      }),
    enabled: Boolean(id),
    retry: 1,
  });

  const requestMutation = useMutation({
    mutationFn: () => {
      if (!material?._id) throw new Error("Chưa tải xong bài đăng");
      return materialRequestsApi.create(material._id, requestMessage);
    },
    onSuccess: () => {
      setRequestMessage("");
      queryClient.invalidateQueries({ queryKey: ["material-requests"] });
      toast.success("Đã gửi yêu cầu nhận vật liệu! Người đăng sẽ sớm phản hồi.");
    },
    onError: (err: any) => {
      toast.error(
        err?.response?.data?.message || "Không thể gửi yêu cầu. Bạn vui lòng đăng nhập trước."
      );
    },
  });

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Đã sao chép đường link bài đăng!");
    } catch {
      toast.info("Hãy sao chép đường link từ thanh địa chỉ trình duyệt.");
    }
  };

  if (isLoading) {
    return (
      <div className="py-20 flex justify-center text-emerald-700">
        <Loader2 className="animate-spin w-6 h-6" />
      </div>
    );
  }

  if (isError || !material) {
    return (
      <div className="max-w-3xl mx-auto py-10 space-y-4">
        <Link to="/materials" className="inline-flex items-center gap-2 text-sm text-slate-600">
          <ArrowLeft className="w-4 h-4" /> Quay lại danh sách
        </Link>
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-rose-800">
          Không thể tải bài đăng này. Bài đăng có thể đã bị xóa hoặc máy chủ đang gặp sự cố.
        </div>
      </div>
    );
  }

  const isFree = material.type === "free";
  const isOwner = Boolean(user?.id && material.owner?._id === user.id);
  const [lng, lat] = material.location.coordinates;
  const cleanPhone = material.contactPhone.replace(/[^0-9+]/g, "");
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
  const activeImage = material.images?.[selectedImageIdx] || material.images?.[0];

  return (
    <div className="max-w-5xl mx-auto py-2 space-y-5">
      <div className="flex items-center justify-between gap-2">
        <Link
          to="/materials"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-emerald-700"
        >
          <ArrowLeft className="w-4 h-4" /> Quay lại kho vật liệu
        </Link>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => void handleShare()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" /> Chia sẻ
          </button>
          {isAuthenticated && !isOwner && (
            <button
              type="button"
              onClick={() => setReportModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 text-xs font-bold text-slate-600 cursor-pointer"
            >
              <Flag className="w-3.5 h-3.5" /> Báo cáo
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm grid grid-cols-1 md:grid-cols-2">
        {/* Left: Gallery + Map */}
        <div className="bg-slate-100/80 p-4 space-y-3">
          <div className="h-72 rounded-2xl overflow-hidden relative border border-slate-200 bg-slate-900 group">
            {activeImage ? (
              <>
                <img
                  src={activeImage}
                  alt={material.title}
                  onClick={() => setLightboxOpen(true)}
                  className="w-full h-full object-cover cursor-zoom-in"
                />
                <button
                  type="button"
                  onClick={() => setLightboxOpen(true)}
                  className="absolute top-3 right-3 p-2 rounded-xl bg-black/60 hover:bg-black/80 text-white opacity-90 cursor-pointer"
                  title="Phóng to ảnh"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm">
                Chưa có ảnh vật liệu
              </div>
            )}
            <span
              className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold text-white ${
                isFree ? "bg-emerald-600" : "bg-amber-600"
              }`}
            >
              {isFree ? "Cho/Tặng miễn phí" : "Bán thanh lý"}
            </span>
            {material.distanceKm !== null && material.distanceKm !== undefined && (
              <span className="absolute bottom-3 right-3 px-2.5 py-1 rounded-xl bg-black/75 text-white text-xs font-bold">
                Cách bạn {formatDistance(material.distanceKm)}
              </span>
            )}
          </div>

          {material.images?.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {material.images.map((image, index) => (
                <button
                  key={`${image}-${index}`}
                  type="button"
                  onClick={() => setSelectedImageIdx(index)}
                  className={`w-16 h-16 rounded-xl overflow-hidden border-2 shrink-0 cursor-pointer ${
                    selectedImageIdx === index ? "border-emerald-600" : "border-transparent opacity-75 hover:opacity-100"
                  }`}
                >
                  <img src={image} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          <MaterialMap lat={lat} lng={lng} className="h-56" />
          <div className="flex gap-2">
            <a
              href={mapUrl}
              target="_blank"
              rel="noreferrer"
              className="flex-1 text-center py-2.5 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50"
            >
              Xem bản đồ
            </a>
            <a
              href={directionsUrl}
              target="_blank"
              rel="noreferrer"
              className="flex-1 text-center py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700"
            >
              Chỉ đường Google Maps
            </a>
          </div>
        </div>

        {/* Right: Info & Actions */}
        <div className="p-6 sm:p-7 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-2 text-xs">
              <span className="font-bold text-emerald-700 uppercase tracking-wider">
                {CATEGORY_LABELS[material.category] || "Vật liệu khác"}
              </span>
              {material.createdAt && (
                <span className="text-slate-400">{formatRelativeTime(material.createdAt)}</span>
              )}
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
              {material.title}
            </h1>

            <div className="flex flex-wrap items-center gap-2">
              {isAuthenticated && !isOwner && (
                <button
                  type="button"
                  onClick={() => favoriteMutation.mutate()}
                  disabled={favoriteMutation.isPending}
                  className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-bold cursor-pointer ${
                    favoriteStatus.data?.saved
                      ? "border-rose-200 bg-rose-50 text-rose-700"
                      : "border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <Heart className={`w-4 h-4 ${favoriteStatus.data?.saved ? "fill-current" : ""}`} />
                  {favoriteStatus.data?.saved ? "Đã lưu bài này" : "Lưu bài này"}
                </button>
              )}
              <button
                type="button"
                onClick={() =>
                  openAiDrawer({
                    materialContext: { materialId: material._id, title: material.title },
                    prompt: `Hãy thẩm định giúp mình lô vật liệu "${material.title}": mức giá/hình thức có hợp lý không, cần loại xe nào để chở và cần kiểm tra những điểm gì khi đến lấy?`,
                  })
                }
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Hỏi AI thẩm định lô này
              </button>
            </div>

            <div className={`text-2xl font-extrabold ${isFree ? "text-emerald-600" : "text-amber-600"}`}>
              {formatCurrency(material.price)}
              {material.unit && !isFree ? ` / ${material.unit}` : ""}
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5 text-xs text-slate-700">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  Địa chỉ: <strong>{material.location.address}</strong>
                  {material.distanceKm !== null && material.distanceKm !== undefined
                    ? ` (Cách bạn ${formatDistance(material.distanceKm)})`
                    : ""}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-slate-400" />
                <span>
                  Người liên hệ: <strong>{material.contactName || material.owner.name}</strong>
                </span>
              </div>
              <div className="border-t border-slate-200 pt-2.5 mt-2 space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <div className="text-xs font-bold text-slate-700">Hồ sơ người đăng</div>
                  {material.owner?._id && (
                    <Link
                      to={`/users/${material.owner._id}`}
                      className="text-[11px] font-bold text-emerald-700 hover:underline"
                    >
                      Xem uy tín & bài đăng →
                    </Link>
                  )}
                </div>
                <div className="flex items-center gap-2.5 py-1">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center overflow-hidden shrink-0">
                    {material.owner?.avatar ? (
                      <img
                        src={material.owner.avatar}
                        alt={material.owner.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      material.owner?.name?.[0]?.toUpperCase() || "U"
                    )}
                  </div>
                  <div className="min-w-0">
                    {material.owner?._id ? (
                      <Link
                        to={`/users/${material.owner._id}`}
                        className="font-bold text-xs text-slate-900 hover:text-emerald-700 block truncate"
                      >
                        {material.owner.name}
                      </Link>
                    ) : (
                      <span className="font-bold text-xs text-slate-900">{material.owner?.name}</span>
                    )}
                    {material.owner.phone && (
                      <div className="text-[11px] text-slate-600">
                        SĐT: {material.owner.phone}{" "}
                        {material.owner.phoneVerified ? (
                          <span className="text-emerald-700 font-semibold">(đã xác minh)</span>
                        ) : (
                          <span className="text-amber-700 font-semibold">(chưa xác minh)</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                {material.owner.bio && (
                  <div className="text-xs text-slate-600">Giới thiệu: {material.owner.bio}</div>
                )}
              </div>
              {material.contactHours && (
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span>
                    Thời gian: <strong>{material.contactHours}</strong>
                  </span>
                </div>
              )}
              <div
                className={`font-bold ${
                  material.location.verificationStatus === "verified"
                    ? "text-emerald-700"
                    : material.location.verificationStatus === "flagged"
                    ? "text-rose-700"
                    : "text-amber-700"
                }`}
              >
                {material.location.verificationStatus === "verified"
                  ? "GPS đã được đối chiếu với dữ liệu bản đồ"
                  : material.location.verificationStatus === "flagged"
                  ? "GPS có dấu hiệu lệch dữ liệu bản đồ, cần kiểm tra thêm"
                  : "GPS do người đăng cung cấp, chưa được đối chiếu"}
              </div>
            </div>

            <div>
              <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Mô tả hiện trạng
              </h2>
              <SafeHtmlContent html={material.description} fallback="Chưa có mô tả chi tiết." />
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 space-y-2.5 mt-6">
            {isOwner ? (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4 space-y-2.5">
                <div className="text-xs font-bold text-emerald-900">Đây là bài đăng của bạn</div>
                <div className="flex gap-2">
                  <Link
                    to={`/materials/${material._id}/edit`}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold"
                  >
                    <Pencil className="w-3.5 h-3.5" /> Chỉnh sửa bài đăng
                  </Link>
                  <Link
                    to="/my-posts"
                    className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-white border border-emerald-200 text-emerald-800 text-xs font-bold hover:bg-emerald-50"
                  >
                    Quản lý tin của tôi
                  </Link>
                </div>
              </div>
            ) : (
              <>
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-3.5 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-900">
                    <CheckCircle2 className="w-4 h-4" /> Đăng ký nhận vật liệu
                  </div>
                  <textarea
                    value={requestMessage}
                    onChange={(event) => setRequestMessage(event.target.value)}
                    placeholder="Mô tả nhu cầu và thời gian bạn có thể đến lấy..."
                    rows={2}
                    className="w-full rounded-xl border border-emerald-200 bg-white px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <button
                    type="button"
                    disabled={requestMutation.isPending || material.status !== "available"}
                    onClick={() => requestMutation.mutate()}
                    className="w-full rounded-xl bg-emerald-700 py-2.5 text-xs font-bold text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                  >
                    {requestMutation.isPending
                      ? "Đang gửi yêu cầu..."
                      : material.status === "available"
                      ? "Gửi yêu cầu cho người đăng"
                      : "Bài đăng không còn sẵn sàng"}
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <a
                    href={`tel:${cleanPhone}`}
                    className="flex items-center justify-center gap-2 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold"
                  >
                    <Phone className="w-4 h-4" /> Gọi điện
                  </a>
                  <a
                    href={`https://zalo.me/${cleanPhone}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold"
                  >
                    <MessageCircle className="w-4 h-4" /> Nhắn Zalo
                  </a>
                </div>

                <Link
                  to={`/chat?partnerId=${material.owner._id}&materialId=${material._id}`}
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold"
                >
                  <MessageSquare className="w-4 h-4" /> Chat trực tiếp trên MatGreen
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Image Lightbox Modal */}
      {lightboxOpen && activeImage && (
        <div
          data-lenis-prevent
          onClick={() => setLightboxOpen(false)}
          className="fixed inset-0 z-[95] bg-black/90 flex items-center justify-center p-4"
        >
          <button
            type="button"
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/15 hover:bg-white/25 text-white cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={activeImage}
            alt={material.title}
            onClick={(e) => e.stopPropagation()}
            className="max-w-full max-h-[88vh] rounded-2xl object-contain shadow-2xl"
          />
        </div>
      )}

      {/* Report Modal */}
      {reportModalOpen && (
        <div
          data-lenis-prevent
          onClick={() => setReportModalOpen(false)}
          className="fixed inset-0 z-[90] bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-3xl bg-white border border-slate-200 p-6 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-slate-900">Báo cáo vi phạm</h3>
              <button
                type="button"
                onClick={() => setReportModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <textarea
              rows={3}
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              placeholder="Mô tả lý do báo cáo (thông tin sai lệch, trùng lặp, dấu hiệu lừa đảo...)"
              className="w-full rounded-xl border border-slate-200 p-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                disabled={!reportReason.trim() || reportMutation.isPending}
                onClick={() => reportMutation.mutate("material")}
                className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold disabled:opacity-50 cursor-pointer"
              >
                Báo cáo bài đăng
              </button>
              <button
                type="button"
                disabled={!reportReason.trim() || reportMutation.isPending}
                onClick={() => reportMutation.mutate("user")}
                className="px-3.5 py-2 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-bold disabled:opacity-50 cursor-pointer"
              >
                Báo cáo người đăng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
