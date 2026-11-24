import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  LocateFixed,
  Upload,
  CheckCircle,
  AlertCircle,
  Loader2,
  X,
  Phone,
  Clock,
  User,
  MessageCircle,
  Sparkles,
  Camera,
} from "lucide-react";
import { useLocationStore } from "@/stores/location.store";
import { useGeolocation } from "@/hooks/useGeolocation";
import { aiMaterialsApi, materialsApi, uploadApi } from "@/services/api";
import { CATEGORY_LABELS } from "@/lib/utils";
import { RichTextEditor } from "@/components/common/RichTextEditor";
import { LocationMapPicker } from "@/components/map/LocationMapPicker";
import type { InspectMaterialResult, MaterialPostPrefill } from "@/types/ai.types";

export const PostMaterialPage: React.FC = () => {
  const navigate = useNavigate();
  const routeLocation = useLocation();
  const aiPrefill = (routeLocation.state as { aiPrefill?: MaterialPostPrefill } | null)?.aiPrefill;
  const { latitude, longitude, address, accuracy, capturedAt, setLocation } = useLocationStore();
  const { getCurrentLocation, isLocating } = useGeolocation();

  const [formData, setFormData] = useState({
    title: aiPrefill?.title || "",
    description: aiPrefill?.description || "",
    category: aiPrefill?.category || "sat_thep",
    type: aiPrefill?.type || "free",
    price: aiPrefill?.price ?? 0,
    unit: aiPrefill?.unit || "gói",
    contactName: "",
    contactPhone: "",
    contactZalo: "",
    contactHours: "Gọi trước 30 phút hoặc giờ hành chính",
    address: address || "",
    latitude: latitude || 0,
    longitude: longitude || 0,
    accuracy: accuracy || 15,
    capturedAt: capturedAt || new Date().toISOString(),
    locationSource: "browser_gps" as "browser_gps" | "map_pin",
    images: [] as string[],
  });

  const [imageUrlInput, setImageUrlInput] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [aiInspecting, setAiInspecting] = useState(false);
  const [aiResult, setAiResult] = useState<InspectMaterialResult | null>(null);
  const [aiNotice, setAiNotice] = useState<string | null>(
    aiPrefill?.sourceLabel
      ? `Đã điền sẵn thông tin từ "${aiPrefill.sourceLabel}". Bạn hãy bổ sung ảnh thực tế, GPS và SĐT trước khi đăng nhé!`
      : null
  );
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (aiPrefill) {
      window.history.replaceState({}, document.title);
    }
  }, [aiPrefill]);

  // Chụp/chọn ảnh vật liệu -> AI Vision nhận diện & tự điền biểu mẫu + tự động tải ảnh lên tin đăng
  const handleAiInspectFromFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []).slice(0, 4);
    if (!selected.length) return;
    e.target.value = "";

    for (const file of selected) {
      if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
        setError("AI Vision chỉ hỗ trợ ảnh JPG, PNG hoặc WEBP.");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError("Mỗi ảnh gửi phân tích AI tối đa 5 MB.");
        return;
      }
    }

    setAiInspecting(true);
    setError(null);
    setAiNotice(null);

    try {
      // Chạy song song: gọi AI Vision nhận diện & upload ảnh lên gallery bài đăng
      const [inspectRes, uploadedUrls] = await Promise.all([
        aiMaterialsApi.inspectMaterialImages(selected, formData.title, formData.address),
        Promise.all(
          selected.map((file) =>
            uploadApi
              .uploadImage(file, "materials")
              .then((r) => r.url)
              .catch(() => null)
          )
        ),
      ]);

      const validUrls = uploadedUrls.filter((u): u is string => Boolean(u));
      const { draft } = inspectRes;
      setAiResult(inspectRes);
      setFormData((prev) => ({
        ...prev,
        title: draft.title || prev.title,
        category: draft.category || prev.category,
        type: draft.type === "sell" ? "sell" : "free",
        price: draft.type === "sell" ? Math.round(draft.price || 0) : 0,
        unit: draft.unit || prev.unit,
        description: draft.description || prev.description,
        images: validUrls.length ? [...prev.images, ...validUrls] : prev.images,
      }));
      setAiNotice(
        `AI đã nhận diện ảnh (độ tin cậy ${Math.round((draft.confidence || 0.75) * 100)}%, tình trạng ~${draft.condition_score}%) và tự điền biểu mẫu giúp bạn. Vui lòng kiểm tra lại giá và số lượng trước khi đăng!`
      );
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          err?.response?.data?.detail ||
          "Không thể phân tích ảnh bằng AI lúc này. Bạn vẫn có thể điền thủ công bên dưới."
      );
    } finally {
      setAiInspecting(false);
    }
  };

  // Upload ảnh thực tế từ thiết bị lên máy chủ
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImage(true);
    setError(null);
    try {
      // Cho phép upload lần lượt các file đã chọn
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const result = await uploadApi.uploadImage(file, "materials");
        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, result.url],
        }));
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || "Lỗi khi tải ảnh lên máy chủ");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleAddUrlImage = () => {
    if (imageUrlInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, imageUrlInput.trim()],
      }));
      setImageUrlInput("");
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, idx) => idx !== indexToRemove),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const hasValidGps = Boolean(formData.latitude && formData.longitude);
      if (!hasValidGps) {
        throw new Error("Vui lòng lấy GPS hiện tại hoặc chạm vào bản đồ để ghim vị trí công trình");
      }
      if (!formData.address.trim()) {
        throw new Error("Vui lòng nhập địa chỉ công trình");
      }

      const payload = {
        ...formData,
        capturedAt: new Date().toISOString(),
        accuracy: formData.accuracy || 15,
        price: formData.type === "free" ? 0 : Number(formData.price),
        contactZalo: formData.contactZalo || formData.contactPhone,
      };

      await materialsApi.create(payload);
      setSuccess(true);
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || "Không thể đăng bài");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-4">
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="border-b border-slate-100 pb-5 mb-6">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            Dành Cho Người Cho / Người Bán Thanh Lý (Nhà A)
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-2">
            Đăng Tin Vật Liệu Tháo Dỡ / Dư Thừa
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Ghi rõ mô tả, thông tin liên hệ và định vị chính xác vị trí công trình để người cần quanh bán kính tìm thấy và tới nhận/chở đi ngay.
          </p>
        </div>

        {success && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-emerald-600" />
            <span>Đăng bài thành công! Đang chuyển hướng về Dashboard...</span>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* AI Vision Auto-Fill Banner */}
        <div className="mb-6 p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-emerald-50 via-teal-50/60 to-white border border-emerald-200 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 text-xs font-extrabold text-emerald-800 uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                AI Nhận Diện Ảnh & Tự Điền Tin Đăng
              </div>
              <p className="text-xs text-slate-600">
                Chọn 1–4 ảnh vật liệu thực tế — MatGreen Vision AI sẽ tự động nhận diện loại vật liệu, gợi ý giá thanh lý/cho tặng, viết mô tả và gắn luôn ảnh vào bài đăng.
              </p>
            </div>
            <label
              className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-all shrink-0 ${
                aiInspecting ? "opacity-60 cursor-wait" : "cursor-pointer active:scale-95"
              }`}
            >
              {aiInspecting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>AI đang đọc ảnh...</span>
                </>
              ) : (
                <>
                  <Camera className="w-4 h-4" />
                  <span>Chụp / Chọn ảnh để AI điền</span>
                </>
              )}
              <input
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp"
                disabled={aiInspecting}
                onChange={handleAiInspectFromFiles}
                className="hidden"
              />
            </label>
          </div>

          {aiNotice && (
            <div className="p-3 rounded-xl bg-white/90 border border-emerald-200 text-xs text-emerald-900 space-y-1.5">
              <div className="font-semibold flex items-start gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{aiNotice}</span>
              </div>
              {aiResult?.summary && (
                <p className="text-slate-600 pl-5">
                  <strong>Nhận định AI:</strong> {aiResult.summary}
                  {aiResult.draft.estimated_quantity ? ` (Ước lượng: ${aiResult.draft.estimated_quantity})` : ""}
                </p>
              )}
              {aiResult?.warnings && aiResult.warnings.length > 0 && (
                <ul className="pl-5 list-disc text-amber-800 space-y-0.5">
                  {aiResult.warnings.map((w, idx) => (
                    <li key={idx}>{w}</li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Tiêu đề bài đăng *
            </label>
            <input
              type="text"
              required
              placeholder="VD: Cần tặng 3 xe xà bần san lấp và thanh lý 800kg sắt phế liệu..."
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
            />
          </div>

          {/* Category & Pricing Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Danh mục vật liệu
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm bg-white"
              >
                {Object.entries(CATEGORY_LABELS).map(([catKey, label]) => (
                  <option key={catKey} value={catKey}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Hình thức (Cho hay Bán)
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: "free", price: 0 })}
                  className={`py-2.5 rounded-xl text-xs font-bold border transition-colors ${
                    formData.type === "free"
                      ? "bg-emerald-50 border-emerald-500 text-emerald-800"
                      : "border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  🎁 Tặng Miễn Phí (0đ)
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: "sell" })}
                  className={`py-2.5 rounded-xl text-xs font-bold border transition-colors ${
                    formData.type === "sell"
                      ? "bg-amber-50 border-amber-500 text-amber-800"
                      : "border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  🏷️ Bán Thanh Lý
                </button>
              </div>
            </div>
          </div>

          {/* Price & Unit (if sell) */}
          {formData.type === "sell" && (
            <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-amber-50/50 border border-amber-200">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Giá thanh lý (VNĐ)
                </label>
                <input
                  type="number"
                  min="0"
                  step="1000"
                  placeholder="VD: 500000"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Đơn vị tính
                </label>
                <input
                  type="text"
                  placeholder="VD: trọn gói, kg, xe tải, m2..."
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                />
              </div>
            </div>
          )}

          {/* Section: Upload nhiều ảnh làm tin lên máy chủ */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Chụp / Tải nhiều ảnh vật liệu làm tin lên máy chủ
            </label>

            {/* Image Preview Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
              {formData.images.map((imgUrl, idx) => (
                <div key={idx} className="relative h-28 rounded-xl overflow-hidden border border-slate-200 group bg-slate-100">
                  <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="absolute top-1.5 right-1.5 p-1 rounded-full bg-slate-900/80 text-white hover:bg-rose-600 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                  <span className="absolute bottom-1 left-1.5 px-1.5 py-0.2 rounded bg-black/60 text-white text-[10px] font-mono">
                    Ảnh {idx + 1}
                  </span>
                </div>
              ))}

              {/* Upload trigger card */}
              <label className="flex flex-col items-center justify-center h-28 border-2 border-dashed border-slate-200 rounded-xl cursor-pointer hover:border-emerald-400 hover:bg-emerald-50/30 transition-colors">
                {uploadingImage ? (
                  <Loader2 className="w-6 h-6 text-emerald-600 animate-spin" />
                ) : (
                  <Upload className="w-6 h-6 text-slate-400 mb-1" />
                )}
                <span className="text-[11px] font-bold text-slate-600 text-center px-2">
                  {uploadingImage ? "Đang tải ảnh..." : "+ Chọn / Chụp ảnh"}
                </span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  disabled={uploadingImage}
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* Direct URL input fallback */}
            <div className="flex gap-2">
              <input
                type="url"
                placeholder="Hoặc dán trực tiếp đường link ảnh (https://...)"
                value={imageUrlInput}
                onChange={(e) => setImageUrlInput(e.target.value)}
                className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              <button
                type="button"
                onClick={handleAddUrlImage}
                className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700"
              >
                Thêm Link
              </button>
            </div>
          </div>

          {/* Section: Vị Trí Công Trình & Bản Đồ Ghim Tương Tác */}
          <LocationMapPicker
            latitude={formData.latitude}
            longitude={formData.longitude}
            address={formData.address}
            onChange={(loc) => {
              setLocation(loc.latitude, loc.longitude, loc.address, loc.accuracy, loc.capturedAt);
              setFormData((prev) => ({
                ...prev,
                latitude: loc.latitude,
                longitude: loc.longitude,
                address: loc.address,
                accuracy: loc.accuracy,
                capturedAt: loc.capturedAt,
                locationSource: loc.locationSource,
              }));
            }}
          />

          {/* Section: Đầy Đủ Các Trường Liên Hệ (SĐT, Zalo, Người liên hệ, Khung giờ) */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-4">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Phone className="w-4 h-4 text-emerald-600" />
              Thông Tin & Kênh Liên Hệ Cho Người Nhận
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Người phụ trách / Chủ nhà:
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="VD: Anh Nam (Chủ nhà)"
                    value={formData.contactName}
                    onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Số điện thoại gọi trực tiếp *:
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="tel"
                    required
                    placeholder="09xx xxx xxx"
                    value={formData.contactPhone}
                    onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Số Zalo (nếu khác SĐT):
                </label>
                <div className="relative">
                  <MessageCircle className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Số Zalo hoặc link Zalo"
                    value={formData.contactZalo}
                    onChange={(e) => setFormData({ ...formData, contactZalo: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Khung giờ đón hoặc bốc hàng:
                </label>
                <div className="relative">
                  <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="VD: 7h - 18h hàng ngày / Báo trước 1 tiếng"
                    value={formData.contactHours}
                    onChange={(e) => setFormData({ ...formData, contactHours: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Description with RichTextEditor */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
              <span>Mô tả chi tiết công trình & yêu cầu bốc dỡ (Bộ công cụ nâng cao)</span>
              <span className="text-[11px] font-normal text-slate-400 lowercase">
                chèn ảnh, bôi đậm, căn chỉnh, cỡ chữ
              </span>
            </label>
            <RichTextEditor
              value={formData.description}
              onChange={(description) => setFormData({ ...formData, description })}
              placeholder="VD: Đập bức tường phòng khách, gạch thẻ còn nguyên khoảng 2000 viên, xà bần đã xúc sẵn vào bao, hỗ trợ người nhận bốc lên xe..."
              minHeight={220}
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-sm shadow-md shadow-emerald-600/30 transition-all active:scale-98 disabled:opacity-50"
          >
            {submitting ? "Đang xử lý đăng tin..." : "Đăng Tin Công Trình Ngay"}
          </button>
        </form>
      </div>
    </div>
  );
};
