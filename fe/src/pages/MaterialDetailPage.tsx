import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  Clock,
  Loader2,
  MapPin,
  MessageCircle,
  MessageSquare,
  Phone,
  User,
  CheckCircle2,
  Heart,
} from "lucide-react";
import { favoritesApi, materialRequestsApi, materialsApi, reportsApi } from "@/services/api";
import { useAuthStore } from "@/stores/auth.store";
import { formatCurrency, formatDistance, CATEGORY_LABELS } from "@/lib/utils";
import { useLocationStore } from "@/stores/location.store";

export const MaterialDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { latitude, longitude } = useLocationStore();
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [requestMessage, setRequestMessage] = useState("");
  const [reportReason, setReportReason] = useState("");
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuthStore();
  const favoriteStatus = useQuery({
    queryKey: ["favorite-status", id],
    queryFn: () => favoritesApi.status(id as string),
    enabled: Boolean(id && isAuthenticated),
  });
  const favoriteMutation = useMutation({
    mutationFn: () => favoriteStatus.data?.saved ? favoritesApi.remove(id as string) : favoritesApi.add(id as string),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["favorite-status", id] }),
  });
  const reportMutation = useMutation({ mutationFn: () => reportsApi.create({ targetType: "material", materialId: material?._id, reason: reportReason }), onSuccess: () => setReportReason("") });

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
    },
  });

  if (isLoading) {
    return <div className="py-20 flex justify-center text-emerald-700"><Loader2 className="animate-spin" /></div>;
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
  const [lng, lat] = material.location.coordinates;
  const cleanPhone = material.contactPhone.replace(/[^0-9+]/g, "");
  const mapUrl = `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=17/${lat}/${lng}`;
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;

  return (
    <div className="max-w-5xl mx-auto py-4 space-y-6">
      <Link to="/materials" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-emerald-700">
        <ArrowLeft className="w-4 h-4" /> Quay lại danh sách vật liệu quanh bạn
      </Link>

      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm grid grid-cols-1 md:grid-cols-2">
        <div className="bg-slate-100 p-4 space-y-3">
          <div className="h-72 rounded-2xl overflow-hidden relative border border-slate-200 bg-slate-900">
            {material.images?.length ? (
              <img src={material.images[selectedImageIdx] || material.images[0]} alt={material.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm">Chưa có ảnh vật liệu</div>
            )}
            <span className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold text-white ${isFree ? "bg-emerald-600" : "bg-amber-600"}`}>
              {isFree ? "Cho/Tặng miễn phí" : "Bán thanh lý"}
            </span>
            {material.distanceKm !== null && material.distanceKm !== undefined && (
              <span className="absolute bottom-3 right-3 px-2 py-0.5 rounded-md bg-black/70 text-white text-xs font-bold">
                Cách bạn {formatDistance(material.distanceKm)}
              </span>
            )}
          </div>
          {material.images?.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {material.images.map((image, index) => (
                <button key={image} onClick={() => setSelectedImageIdx(index)} className={`w-16 h-16 rounded-xl overflow-hidden border-2 ${selectedImageIdx === index ? "border-emerald-600" : "border-transparent"}`}>
                  <img src={image} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
          <iframe title="Bản đồ vị trí công trình" src={`https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.01}%2C${lat - 0.01}%2C${lng + 0.01}%2C${lat + 0.01}&layer=mapnik&marker=${lat}%2C${lng}`} className="w-full h-56 rounded-2xl border-0" loading="lazy" />
          <div className="flex gap-2">
            <a href={mapUrl} target="_blank" rel="noreferrer" className="flex-1 text-center py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-white">Xem bản đồ</a>
            <a href={directionsUrl} target="_blank" rel="noreferrer" className="flex-1 text-center py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700">Chỉ đường</a>
          </div>
        </div>

        <div className="p-6 sm:p-8 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="text-xs font-bold text-emerald-700 uppercase tracking-wider">{CATEGORY_LABELS[material.category] || "Vật liệu khác"}</div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">{material.title}</h1>
            {isAuthenticated && (
              <button
                type="button"
                onClick={() => favoriteMutation.mutate()}
                disabled={favoriteMutation.isPending}
                className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-bold ${favoriteStatus.data?.saved ? "border-rose-200 bg-rose-50 text-rose-700" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}
              >
                <Heart className={`w-4 h-4 ${favoriteStatus.data?.saved ? "fill-current" : ""}`} />
                {favoriteStatus.data?.saved ? "Đã lưu bài này" : "Lưu bài này"}
              </button>
            )}
            <div className="text-2xl font-extrabold text-amber-600">
              {formatCurrency(material.price)}{material.unit && !isFree ? ` / ${material.unit}` : ""}
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5 text-xs text-slate-700">
              <div className="flex items-start gap-2"><MapPin className="w-4 h-4 text-emerald-600 shrink-0" /><span>Địa chỉ: <strong>{material.location.address}</strong>{material.distanceKm !== null && material.distanceKm !== undefined ? ` (Cách bạn ${formatDistance(material.distanceKm)})` : ""}</span></div>
              <div className="flex items-center gap-2"><User className="w-4 h-4 text-slate-400" /><span>Người liên hệ: <strong>{material.contactName || material.owner.name}</strong></span></div>
              <div className="border-t border-slate-200 pt-2 mt-2 space-y-1">
                <div className="text-xs font-bold text-slate-700">Hồ sơ người đăng</div>
                {material.owner.email && <div className="text-xs text-slate-600">Email: {material.owner.email}</div>}
                {material.owner.phone && <div className="text-xs text-slate-600">SĐT: {material.owner.phone} {material.owner.phoneVerified ? <span className="text-emerald-700 font-semibold">(đã xác minh)</span> : <span className="text-amber-700 font-semibold">(chưa xác minh)</span>}</div>}
                {material.owner.bio && <div className="text-xs text-slate-600">Giới thiệu: {material.owner.bio}</div>}
              </div>
              {material.contactHours && <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-slate-400" /><span>Thời gian: <strong>{material.contactHours}</strong></span></div>}
              <div className={`font-bold ${material.location.verificationStatus === "verified" ? "text-emerald-700" : material.location.verificationStatus === "flagged" ? "text-rose-700" : "text-amber-700"}`}>
                {material.location.verificationStatus === "verified"
                  ? "GPS đã được đối chiếu với dữ liệu bản đồ"
                  : material.location.verificationStatus === "flagged"
                    ? "GPS có dấu hiệu lệch dữ liệu bản đồ, cần kiểm tra thêm"
                    : "GPS do người đăng cung cấp, chưa được đối chiếu"}
              </div>
            </div>
            <div>
              <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Mô tả hiện trạng</h2>
              <p className="text-sm text-slate-600 leading-relaxed">{material.description || "Chưa có mô tả."}</p>
            </div>
          </div>
          <div className="pt-6 border-t border-slate-100 space-y-2.5 mt-6">
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-3 space-y-2">
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
                className="w-full rounded-xl bg-emerald-700 py-2.5 text-xs font-bold text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {requestMutation.isPending
                  ? "Đang gửi yêu cầu..."
                  : material.status === "available"
                    ? "Gửi yêu cầu cho người đăng"
                    : "Bài đăng không còn sẵn sàng"}
              </button>
              {requestMutation.isSuccess && (
                <p className="text-xs font-medium text-emerald-800">Đã gửi yêu cầu. Người đăng sẽ xem và phản hồi.</p>
              )}
              {requestMutation.isError && (
                <p className="text-xs font-medium text-rose-700">
                  {(requestMutation.error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
                    "Không thể gửi yêu cầu. Bạn có thể cần đăng nhập."}
                </p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-2">
              <a href={`tel:${cleanPhone}`} className="flex items-center justify-center gap-2 py-3 rounded-2xl bg-emerald-600 text-white text-xs font-bold"><Phone className="w-4 h-4" /> Gọi điện</a>
              <a href={`https://zalo.me/${cleanPhone}`} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 py-3 rounded-2xl bg-blue-600 text-white text-xs font-bold"><MessageCircle className="w-4 h-4" /> Nhắn Zalo</a>
            </div>
            {isAuthenticated && (
              <div className="rounded-2xl border border-slate-200 p-3 space-y-2">
                <input value={reportReason} onChange={(e) => setReportReason(e.target.value)} placeholder="Nếu có vấn đề, nhập lý do báo cáo..." className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs" />
                <button type="button" disabled={!reportReason.trim() || reportMutation.isPending} onClick={() => reportMutation.mutate()} className="text-xs font-bold text-rose-700 disabled:opacity-50">Báo cáo bài đăng</button>
                <button type="button" disabled={!reportReason.trim() || reportMutation.isPending} onClick={() => reportsApi.create({ targetType: "user", targetUserId: material.owner._id, reason: reportReason }).then(() => setReportReason(""))} className="ml-3 text-xs font-bold text-rose-700 disabled:opacity-50">Báo cáo người đăng</button>
                {reportMutation.isSuccess && <span className="ml-2 text-xs text-emerald-700">Đã gửi báo cáo.</span>}
              </div>
            )}
            <Link to={`/chat?partnerId=${material.owner._id}&materialId=${material._id}`} className="flex items-center justify-center gap-2 w-full py-2.5 rounded-2xl bg-emerald-50 text-emerald-800 text-xs font-bold"><MessageSquare className="w-4 h-4" /> Chat trực tiếp trên MatGreen</Link>
          </div>
        </div>
      </div>
    </div>
  );
};
