import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  AlertCircle,
  ArrowRight,
  Bot,
  Camera,
  CheckCircle2,
  ExternalLink,
  ImagePlus,
  Leaf,
  Lightbulb,
  Loader2,
  MapPin,
  RotateCcw,
  Send,
  Sparkles,
  Truck,
  Wallet,
  X,
} from "lucide-react";
import { aiMaterialsApi } from "@/services/api";
import { useAuthStore } from "@/stores/auth.store";
import { useLocationStore } from "@/stores/location.store";
import { AiMarkdownText } from "@/components/ai/AiMarkdownText";
import { CATEGORY_LABELS, formatCurrency, formatDistance } from "@/lib/utils";
import type {
  AiChatMessage,
  DemolitionAnalysisResult,
  ExtractedMaterialItem,
  MaterialPostPrefill,
  UserAiQuota,
} from "@/types/ai.types";

const CHAT_STORAGE_KEY = "matgreen_ai_advisor_chat_v2";

const DEFAULT_WELCOME: AiChatMessage = {
  role: "assistant",
  content:
    "Chào bạn! Mình là **MatGreen AI** kết nối trực tiếp dữ liệu kho vật liệu thật của MatGreen.\n- Hỏi tìm vật liệu **cho tặng 0đ** hoặc **thanh lý** quanh vị trí GPS của bạn.\n- Hỏi định giá sắt thép, tôn, cửa nhôm kính, gỗ cốp pha cũ.\n- Hỏi quy trình tháo dỡ & loại xe tải phù hợp.",
};

const QUICK_PROMPTS = [
  "Tìm vật liệu cho tặng miễn phí gần vị trí của tôi",
  "Trên sàn đang có lô sắt thép hoặc cửa nhôm kính nào không?",
  "Tháo dỡ nhà cấp 4 60m² nên bán hay cho tặng những gì để tiết kiệm nhất?",
  "Định giá tham khảo tôn lạnh cũ, xà gồ sắt hộp và gạch thẻ nguyên vẹn",
];

function loadSavedMessages(): AiChatMessage[] {
  try {
    const raw = localStorage.getItem(CHAT_STORAGE_KEY);
    if (!raw) return [DEFAULT_WELCOME];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed.slice(-20);
    }
  } catch {
    // ignore storage errors
  }
  return [DEFAULT_WELCOME];
}

export const AiAdvisorPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { latitude, longitude, radiusKm, address: gpsAddress } = useLocationStore();

  const [activeTab, setActiveTab] = useState<"demolition" | "chat">("demolition");

  // Demolition state
  const [description, setDescription] = useState(
    "Công trình nhà cấp 4 diện tích 70m2 chuẩn bị đập để xây mới. Có khoảng 4 bộ cửa nhôm kính, 1 bộ thiết bị vệ sinh cũ, mái tôn lạnh khoảng 70m2 và khung sắt hộp còn tốt, ngoài ra có khoảng 3 xe xà bần gạch vỡ cần dọn dẹp gấp."
  );
  const [siteAddress, setSiteAddress] = useState(gpsAddress || "");
  const [siteFiles, setSiteFiles] = useState<File[]>([]);
  const [sitePreviews, setSitePreviews] = useState<string[]>([]);
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzeError, setAnalyzeError] = useState<string | null>(null);
  const [result, setResult] = useState<DemolitionAnalysisResult | null>(null);

  // Chat state
  const [messages, setMessages] = useState<AiChatMessage[]>(() => loadSavedMessages());
  const [inputMsg, setInputMsg] = useState("");
  const [chatting, setChatting] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);
  const [quota, setQuota] = useState<UserAiQuota | null>(null);
  const [guestRemaining, setGuestRemaining] = useState<number | null>(null);
  const chatBottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages.slice(-20)));
    } catch {
      // ignore quota exceeded
    }
  }, [messages]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, chatting]);

  useEffect(() => {
    if (isAuthenticated) {
      aiMaterialsApi
        .getUserQuota()
        .then(setQuota)
        .catch(() => {});
    } else {
      aiMaterialsApi
        .getChatQuota()
        .then((q) => setGuestRemaining(q.daily_remaining))
        .catch(() => {});
    }
  }, [isAuthenticated]);

  useEffect(() => {
    return () => {
      sitePreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [sitePreviews]);

  const handleSelectSiteImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setAnalyzeError(null);

    const combined = [...siteFiles, ...files].slice(0, 4);
    for (const file of combined) {
      if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
        setAnalyzeError("Chỉ hỗ trợ ảnh JPG, PNG hoặc WEBP.");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setAnalyzeError("Mỗi ảnh hiện trường tối đa 5 MB.");
        return;
      }
    }

    sitePreviews.forEach((url) => URL.revokeObjectURL(url));
    setSiteFiles(combined);
    setSitePreviews(combined.map((f) => URL.createObjectURL(f)));
    e.target.value = "";
  };

  const handleRemoveSiteImage = (idx: number) => {
    URL.revokeObjectURL(sitePreviews[idx]);
    setSiteFiles((prev) => prev.filter((_, i) => i !== idx));
    setSitePreviews((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleAnalyze = async () => {
    if (!description.trim() && siteFiles.length === 0) {
      setAnalyzeError("Vui lòng nhập mô tả công trình hoặc tải lên ít nhất 1 ảnh hiện trường.");
      return;
    }
    if (siteFiles.length > 0 && !isAuthenticated) {
      setAnalyzeError("Vui lòng đăng nhập tài khoản MatGreen để sử dụng tính năng Vision AI phân tích ảnh công trình.");
      return;
    }
    if (siteFiles.length === 0 && description.trim().length < 10) {
      setAnalyzeError("Mô tả công trình cần tối thiểu 10 ký tự để AI bóc tách chính xác.");
      return;
    }

    setAnalyzing(true);
    setAnalyzeError(null);
    try {
      const data =
        siteFiles.length > 0
          ? await aiMaterialsApi.analyzeDemolitionWithImages(siteFiles, description, siteAddress)
          : await aiMaterialsApi.analyzeDemolition(description, siteAddress);
      setResult(data);
      if (isAuthenticated) {
        aiMaterialsApi.getUserQuota().then(setQuota).catch(() => {});
      }
    } catch (err: any) {
      const msg =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        "Không thể kết nối MatGreen AI lúc này. Vui lòng thử lại sau ít giây.";
      setAnalyzeError(msg);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleCreatePostFromItem = (item: ExtractedMaterialItem) => {
    const prefill: MaterialPostPrefill = {
      title: item.title,
      category: item.category,
      type: item.suggested_type === "sell" ? "sell" : "free",
      price: item.suggested_type === "sell" ? Math.round(item.suggested_price || 0) : 0,
      unit: item.unit || "gói",
      description:
        item.post_description ||
        `<p><strong>${item.title}</strong></p><p>Số lượng ước tính: ${item.estimated_quantity}</p><p>${item.reuse_recommendation}</p>`,
      sourceLabel: "Trợ lý AI Bóc Tách Công Trình",
    };
    navigate("/post", { state: { aiPrefill: prefill } });
  };

  const handleSendChat = async (textOverride?: string) => {
    const text = (textOverride ?? inputMsg).trim();
    if (!text || chatting) return;

    const nextMessages: AiChatMessage[] = [...messages, { role: "user", content: text }];
    setMessages(nextMessages);
    if (!textOverride) setInputMsg("");
    setChatError(null);
    setChatting(true);

    try {
      const payloadMessages = nextMessages.slice(-18).map(({ role, content }) => ({ role, content }));
      const res = await aiMaterialsApi.chatAdvice({
        messages: payloadMessages,
        latitude,
        longitude,
        radius_km: radiusKm || 10,
        context: siteAddress ? `Khu vực người dùng quan tâm: ${siteAddress}` : undefined,
      });

      setMessages([
        ...nextMessages,
        {
          role: "assistant",
          content: res.reply,
          recommended_materials: res.recommended_materials,
          tools_used: res.tools_used,
          model: res.model,
        },
      ]);

      if (res.quota && !isAuthenticated) {
        setGuestRemaining(res.quota.daily_remaining);
      } else if (isAuthenticated) {
        aiMaterialsApi.getUserQuota().then(setQuota).catch(() => {});
      }
    } catch (err: any) {
      const msg =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        "Không thể nhận phản hồi từ MatGreen AI lúc này. Vui lòng thử lại sau.";
      setChatError(msg);
    } finally {
      setChatting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-2">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>MatGreen AI • Vision & Kho Vật Liệu Thời Gian Thực</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Trợ Lý AI Bóc Tách & Tư Vấn Tuần Hoàn
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Phân tích mô tả hoặc ảnh công trình để định giá, ước lượng xe chở và đẩy thẳng thành bài đăng — hoặc chat tìm vật liệu thật quanh GPS của bạn.
          </p>
        </div>

        {/* Quota pill */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {isAuthenticated && quota ? (
            <>
              <span className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-semibold">
                Chat AI:{" "}
                <strong className="text-emerald-700">
                  {quota.unlimited ? "Không giới hạn" : `${quota.chat.remaining}/${quota.chat.dailyLimit} lượt`}
                </strong>
              </span>
              <span className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-semibold">
                Vision Ảnh:{" "}
                <strong className="text-teal-700">
                  {quota.unlimited ? "Không giới hạn" : `${quota.image.remaining}/${quota.image.dailyLimit} ảnh`}
                </strong>
              </span>
            </>
          ) : (
            <Link
              to="/login"
              className="px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 font-semibold hover:bg-amber-100 transition-colors"
            >
              {guestRemaining !== null
                ? `Khách: còn ${guestRemaining} lượt text/ngày • Đăng nhập để mở Vision AI`
                : "Đăng nhập để mở Vision AI & 50 lượt/ngày"}
            </Link>
          )}
        </div>
      </div>

      {/* Mode Switch Tabs */}
      <div className="inline-flex p-1 rounded-2xl bg-slate-200/70 border border-slate-200">
        <button
          type="button"
          onClick={() => setActiveTab("demolition")}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === "demolition"
              ? "bg-white text-emerald-800 shadow-xs"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Sparkles className="w-4 h-4" />
          Bóc Tách Công Trình (Text + Ảnh)
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("chat")}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === "chat"
              ? "bg-white text-emerald-800 shadow-xs"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Bot className="w-4 h-4" />
          Chat Tư Vấn & Tìm Vật Liệu Thật
        </button>
      </div>

      {/* TAB 1: DEMOLITION ANALYZER */}
      {activeTab === "demolition" && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2 space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Mô tả hiện trạng công trình tháo dỡ / vật liệu dư thừa
                </label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-3.5 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="VD: Nhà cấp 4 70m², mái tôn lạnh, tường gạch 20, 4 bộ cửa nhôm kính, 1 bồn cầu..."
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Khu vực / Địa chỉ (tùy chọn)
                </label>
                <input
                  type="text"
                  value={siteAddress}
                  onChange={(e) => setSiteAddress(e.target.value)}
                  placeholder="VD: Cầu Giấy, Hà Nội"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-100 text-[11px] text-emerald-900 leading-relaxed">
                  <strong>Mẹo:</strong> Ghi rõ diện tích (m²), số tầng, loại mái, số bộ cửa hoặc tải thêm 1–4 ảnh thực tế để AI ước tính sát nhất.
                </div>
              </div>
            </div>

            {/* Site Photos Upload (Vision AI) */}
            <div className="pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Camera className="w-4 h-4 text-teal-600" />
                  Ảnh hiện trường công trình (Tùy chọn • Tối đa 4 ảnh Vision AI)
                </label>
                {!isAuthenticated && (
                  <Link to="/login" className="text-xs font-bold text-emerald-700 hover:underline">
                    Đăng nhập để dùng ảnh →
                  </Link>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {sitePreviews.map((url, idx) => (
                  <div
                    key={url}
                    className="relative w-24 h-24 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100"
                  >
                    <img src={url} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemoveSiteImage(idx)}
                      className="absolute top-1 right-1 p-1 rounded-full bg-slate-900/80 text-white hover:bg-rose-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}

                {siteFiles.length < 4 && (
                  <label
                    className={`w-24 h-24 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center text-center px-2 transition-colors ${
                      isAuthenticated
                        ? "border-slate-300 hover:border-emerald-500 hover:bg-emerald-50/40 cursor-pointer"
                        : "border-slate-200 bg-slate-50 opacity-60 cursor-not-allowed"
                    }`}
                  >
                    <ImagePlus className="w-5 h-5 text-slate-400 mb-1" />
                    <span className="text-[10px] font-bold text-slate-600">Thêm ảnh</span>
                    <input
                      type="file"
                      multiple
                      accept="image/jpeg,image/png,image/webp"
                      disabled={!isAuthenticated || analyzing}
                      onChange={handleSelectSiteImages}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            {analyzeError && (
              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
                <span>{analyzeError}</span>
              </div>
            )}

            <div className="flex items-center justify-between gap-3 pt-1">
              <span className="text-xs text-slate-400">
                {siteFiles.length > 0
                  ? `Đang dùng chế độ Vision AI với ${siteFiles.length} ảnh đính kèm`
                  : "Chế độ phân tích văn bản nhanh"}
              </span>
              <button
                type="button"
                onClick={handleAnalyze}
                disabled={analyzing}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-sm shadow-md transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                {analyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                {analyzing
                  ? siteFiles.length > 0
                    ? "Vision AI đang đọc ảnh & bóc tách..."
                    : "AI đang bóc tách công trình..."
                  : "Bắt Đầu Bóc Tách Bằng AI"}
              </button>
            </div>
          </div>

          {/* Analysis Result */}
          {result && (
            <div className="bg-white rounded-3xl border border-emerald-200 p-5 sm:p-7 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-slate-100">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-extrabold text-slate-900">Kết Quả Bóc Tách & Khuyến Nghị</h2>
                    {result.model && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-100 text-slate-500">
                        {result.model}
                      </span>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{result.summary}</p>
                </div>
                <div className="px-4 py-2.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-2 shrink-0">
                  <span className="text-xs text-emerald-800 font-semibold">Tiềm năng tái chế:</span>
                  <span className="text-xl font-black text-emerald-600">{result.recycling_potential_score}%</span>
                </div>
              </div>

              {/* KPI Strip */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80">
                  <div className="text-[11px] font-semibold text-amber-800 flex items-center gap-1.5">
                    <Wallet className="w-3.5 h-3.5" /> Giá trị thu hồi ước tính
                  </div>
                  <div className="text-lg font-black text-amber-900 mt-1">
                    {result.estimated_recovery_value_vnd
                      ? formatCurrency(result.estimated_recovery_value_vnd)
                      : "Chủ yếu cho tặng"}
                  </div>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="text-[11px] font-semibold text-slate-600 flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5" /> Số chuyến xe ước tính
                  </div>
                  <div className="text-lg font-black text-slate-900 mt-1">
                    {result.estimated_truck_trips ? `~ ${result.estimated_truck_trips} chuyến` : "Tùy tải xe"}
                  </div>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="text-[11px] font-semibold text-slate-600">Thể tích phát sinh</div>
                  <div className="text-lg font-black text-slate-900 mt-1">
                    {result.estimated_volume_m3 ? `~ ${result.estimated_volume_m3} m³` : "Đang ước lượng"}
                  </div>
                </div>
                <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/80">
                  <div className="text-[11px] font-semibold text-emerald-800 flex items-center gap-1.5">
                    <Leaf className="w-3.5 h-3.5" /> CO₂ giảm phát thải
                  </div>
                  <div className="text-lg font-black text-emerald-700 mt-1">
                    {result.estimated_co2_saved_kg
                      ? `~ ${Math.round(result.estimated_co2_saved_kg).toLocaleString("vi-VN")} kg`
                      : "Tích cực"}
                  </div>
                </div>
              </div>

              {/* Extracted Material Items with One-Click Post */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {result.materials.map((item, idx) => {
                  const isFree = item.suggested_type !== "sell";
                  return (
                    <div
                      key={idx}
                      className={`p-4 rounded-2xl border flex flex-col justify-between gap-3 ${
                        isFree ? "bg-emerald-50/40 border-emerald-200" : "bg-amber-50/40 border-amber-200"
                      }`}
                    >
                      <div className="space-y-2.5">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                              {CATEGORY_LABELS[item.category] || item.category}
                            </span>
                            <h3 className="font-bold text-slate-900 text-sm leading-snug">{item.title}</h3>
                          </div>
                          <span
                            className={`text-[11px] px-2.5 py-0.5 rounded-full font-bold shrink-0 ${
                              isFree ? "bg-emerald-600 text-white" : "bg-amber-600 text-white"
                            }`}
                          >
                            {isFree ? "Cho Tặng 0đ" : "Bán Thanh Lý"}
                          </span>
                        </div>

                        <div className="text-xs text-slate-700 space-y-1">
                          <div>
                            Ước lượng: <strong>{item.estimated_quantity}</strong> (Đơn vị: {item.unit})
                          </div>
                          {!isFree && item.suggested_price > 0 && (
                            <div className="text-amber-700 font-extrabold">
                              Giá gợi ý: ~{formatCurrency(item.suggested_price)} / {item.unit}
                            </div>
                          )}
                        </div>

                        <div className="text-xs text-slate-600 bg-white/90 p-2.5 rounded-xl border border-slate-200/70">
                          💡 <em>{item.reuse_recommendation}</em>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleCreatePostFromItem(item)}
                        className="w-full py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <span>Đăng tin hạng mục này ngay</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Dismantle tips */}
              {result.dismantle_tips && result.dismantle_tips.length > 0 && (
                <div className="p-4 rounded-2xl bg-slate-900 text-slate-100 space-y-2">
                  <div className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                    <Lightbulb className="w-4 h-4" /> Khuyến nghị tháo dỡ giữ giá & an toàn
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-200">
                    {result.dismantle_tips.map((tip, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: AI CHAT WITH LIVE TOOL CALLING */}
      {activeTab === "chat" && (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm flex flex-col">
          <div className="px-5 py-4 bg-slate-900 text-white flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <Bot className="w-5 h-5 text-emerald-400" />
              <div>
                <div className="font-bold text-sm">Hỏi Đáp & Tra Cứu Kho Vật Liệu Với MatGreen AI</div>
                <div className="text-[11px] text-slate-400">
                  {latitude && longitude
                    ? `Đang gắn GPS (${latitude.toFixed(4)}, ${longitude.toFixed(4)}) • Bán kính ${radiusKm} km`
                    : "Chưa bật GPS — AI sẽ tìm trên toàn sàn MatGreen"}
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setMessages([DEFAULT_WELCOME]);
                setChatError(null);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Cuộc trò chuyện mới
            </button>
          </div>

          <div className="p-4 sm:p-5 h-[430px] overflow-y-auto space-y-4 bg-slate-50">
            {messages.map((m, i) => (
              <div key={i} className={`flex flex-col ${m.role === "user" ? "items-end" : "items-start"}`}>
                <div
                  className={`max-w-[85%] px-4 py-3 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    m.role === "user"
                      ? "bg-emerald-600 text-white rounded-br-none"
                      : "bg-white border border-slate-200 text-slate-800 rounded-bl-none shadow-xs"
                  }`}
                >
                  {m.role === "user" ? (
                    <span className="whitespace-pre-wrap">{m.content}</span>
                  ) : (
                    <AiMarkdownText content={m.content} />
                  )}
                </div>

                {/* Recommended Live Material Cards */}
                {m.recommended_materials && m.recommended_materials.length > 0 && (
                  <div className="mt-2.5 w-full max-w-[90%] grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {m.recommended_materials.map((card) => (
                      <Link
                        key={card.id}
                        to={`/materials/${card.id}`}
                        className="flex items-center gap-3 p-2.5 rounded-2xl bg-white border border-slate-200 hover:border-emerald-400 hover:shadow-sm transition-all"
                      >
                        {card.image ? (
                          <img
                            src={card.image}
                            alt={card.title}
                            className="w-14 h-14 rounded-xl object-cover shrink-0 bg-slate-100"
                          />
                        ) : (
                          <div className="w-14 h-14 rounded-xl bg-emerald-50 text-emerald-700 font-bold text-xs flex items-center justify-center shrink-0">
                            MatGreen
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-bold text-slate-900 truncate">{card.title}</div>
                          <div className="text-[11px] font-bold mt-0.5">
                            <span className={card.type === "free" ? "text-emerald-600" : "text-amber-600"}>
                              {card.type === "free"
                                ? "Cho tặng 0đ"
                                : `${formatCurrency(card.price)} / ${card.unit}`}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-500 truncate flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3 shrink-0 text-emerald-600" />
                            <span className="truncate">{card.address || "Xem chi tiết"}</span>
                            {card.distance_km !== null && card.distance_km !== undefined && (
                              <span className="text-emerald-700 font-semibold shrink-0">
                                ({formatDistance(card.distance_km)})
                              </span>
                            )}
                          </div>
                        </div>
                        <ExternalLink className="w-4 h-4 text-slate-400 shrink-0" />
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {chatting && (
              <div className="text-xs text-slate-500 flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
                <span>MatGreen AI đang tra cứu dữ liệu sàn & soạn câu trả lời...</span>
              </div>
            )}

            {chatError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{chatError}</span>
              </div>
            )}
            <div ref={chatBottomRef} />
          </div>

          {/* Quick prompts */}
          <div className="px-4 py-2.5 bg-white border-t border-slate-100 flex gap-2 overflow-x-auto">
            {QUICK_PROMPTS.map((q) => (
              <button
                key={q}
                type="button"
                disabled={chatting}
                onClick={() => handleSendChat(q)}
                className="text-xs px-3 py-1.5 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 whitespace-nowrap font-medium transition-colors cursor-pointer disabled:opacity-50"
              >
                {q}
              </button>
            ))}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              void handleSendChat();
            }}
            className="p-3.5 bg-white border-t border-slate-200 flex gap-2"
          >
            <input
              type="text"
              placeholder="Hỏi tìm vật liệu quanh bạn, định giá phế liệu, thủ tục tháo dỡ..."
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button
              type="submit"
              disabled={chatting || !inputMsg.trim()}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold transition-colors disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Gửi</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
