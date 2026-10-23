import React, { useState, useEffect } from "react";
import {
  Settings,
  Save,
  Globe,
  Home,
  BookOpen,
  Phone,
  Briefcase,
  UploadCloud,
  Loader2,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Sparkles,
  RefreshCw,
  Image as ImageIcon,
  Video,
  Layers,
  MapPin,
  Clock,
  HelpCircle,
  Users,
  Building2,
  MessageSquare,
  Award,
  ChevronRight,
  Eye,
  Newspaper,
  Gift,
  Tag,
  ShoppingBag,
} from "lucide-react";
import {
  useSiteConfigStore,
  applyFavicon,
  DEFAULT_SITE_CONFIG,
  type SiteConfigData,
  type TeamMember,
  type Partner,
  type Testimonial,
  type Office,
  type ServiceItem,
  type GalleryItem,
  type StatItem,
  type StepItem,
  type PackageItem,
  type FaqItem,
  type OfferCardItem,
  type ProductItem,
} from "@/stores/site-config.store";
import { siteConfigApi } from "@/services/api";

export const AdminSettingsPage: React.FC = () => {
  const { config, updateConfig } = useSiteConfigStore();
  const [activeTab, setActiveTab] = useState<
    "general" | "home" | "about" | "contact" | "services" | "news"
  >("home");

  // State form lưu cấu hình
  const [formData, setFormData] = useState<SiteConfigData>(config);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState<string | null>(null);
  const [saveToast, setSaveToast] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Sub-tab cho Trang Chủ để phân tách nội dung dễ quản lý
  const [homeSubTab, setHomeSubTab] = useState<
    "hero" | "offers" | "about" | "services" | "products" | "why" | "gallery" | "stats" | "news" | "partners" | "testimonials"
  >("hero");

  // Đồng bộ form khi store có dữ liệu mới
  useEffect(() => {
    if (config) {
      setFormData(config);
    }
  }, [config]);

  // Tự ẩn thông báo sau 4s
  useEffect(() => {
    if (saveToast) {
      const timer = setTimeout(() => setSaveToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [saveToast]);

  // Upload ảnh lên Cloudinary qua API
  const handleUploadImage = async (
    file: File,
    onSuccess: (url: string) => void,
    folder: string = "site-config"
  ) => {
    if (!file.type.startsWith("image/")) {
      setSaveToast({
        type: "error",
        message: "Vui lòng chọn file hình ảnh hợp lệ (JPG, PNG, SVG, WEBP, ICO)",
      });
      return;
    }

    setIsUploading(folder);
    try {
      const body = new FormData();
      body.append("image", file);
      body.append("folder", folder);

      const res = await fetch("/api/upload/image", {
        method: "POST",
        body,
      });

      const contentType = res.headers.get("content-type") || "";
      const json = contentType.includes("application/json")
        ? await res.json()
        : null;
      if (!res.ok || !json?.data?.url) {
        const message =
          json?.message ||
          (res.status === 413
            ? "Ảnh quá lớn. Vui lòng chọn ảnh nhỏ hơn 10MB."
            : "Tải ảnh lên Cloudinary không thành công");
        throw new Error(message);
      }

      onSuccess(json.data.url);
      setSaveToast({
        type: "success",
        message: "Đã tải ảnh lên Cloudinary thành công!",
      });
    } catch (err: any) {
      setSaveToast({
        type: "error",
        message: err.message || "Không thể tải ảnh lên",
      });
    } finally {
      setIsUploading(null);
    }
  };

  // Lưu toàn bộ cấu hình
  const handleSaveConfig = async () => {
    setIsSaving(true);
    try {
      const res = await siteConfigApi.update(formData);
      if (res && res.data) {
        updateConfig(res.data);
        if (res.data.general?.faviconUrl) {
          applyFavicon(res.data.general.faviconUrl);
        }
      } else {
        updateConfig(formData);
      }
      setSaveToast({
        type: "success",
        message: "Lưu cấu hình hệ thống website thành công!",
      });
    } catch (err: any) {
      setSaveToast({
        type: "error",
        message: err.message || "Lưu cấu hình thất bại, vui lòng thử lại!",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Reset về cấu hình mặc định ban đầu
  const handleResetDefaults = () => {
    if (window.confirm("Bạn có chắc chắn muốn khôi phục toàn bộ cấu hình về mặc định ban đầu của MatGreen?")) {
      setFormData(DEFAULT_SITE_CONFIG);
      setSaveToast({
        type: "success",
        message: "Đã đặt lại dữ liệu mặc định. Hãy nhấn 'Lưu Cấu Hình' để áp dụng!",
      });
    }
  };

  // Helper render Image Uploader
  const renderImageUploader = (
    label: string,
    currentUrl: string,
    onUrlChange: (newUrl: string) => void,
    helperText?: string,
    previewHeight: string = "h-36",
    options?: { stacked?: boolean; uploadKey?: string }
  ) => {
    const uploadId = `upload-${(
      options?.uploadKey || label.replace(/\s+/g, "-").toLowerCase()
    ).replace(/[^a-zA-Z0-9_-]/g, "-")}`;
    return (
      <div className="space-y-2">
        <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
          {label}
        </label>
        {helperText && <p className="text-[11px] text-slate-500">{helperText}</p>}

        <div
          className={
            options?.stacked
              ? "flex flex-col gap-3 items-stretch"
              : "flex flex-col sm:flex-row gap-4 items-start sm:items-center"
          }
        >
          {/* Preview Khung ảnh */}
          <div
            className={`${options?.stacked ? "w-full" : "w-full sm:w-48"} ${previewHeight} rounded-2xl bg-stone-100 border-2 border-dashed border-stone-300 overflow-hidden relative group shrink-0 flex items-center justify-center`}
          >
            {currentUrl ? (
              <>
                <img
                  src={currentUrl}
                  alt={label}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <a
                  href={currentUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-bold transition-opacity"
                >
                  <Eye className="w-4 h-4 mr-1" /> Xem Gốc
                </a>
              </>
            ) : (
              <div className="text-center p-2 text-slate-400">
                <ImageIcon className="w-6 h-6 mx-auto mb-1 opacity-60" />
                <span className="text-[10px]">Chưa có ảnh</span>
              </div>
            )}
          </div>

          {/* Ô nhập URL & Nút Upload */}
          <div className="flex-1 w-full space-y-2">
            <input
              type="text"
              placeholder="Dán đường dẫn ảnh (URL hoặc Cloudinary)..."
              value={currentUrl || ""}
              onChange={(e) => onUrlChange(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />

            <div className="flex items-center gap-2">
              <label
                htmlFor={uploadId}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 hover:bg-emerald-100 text-xs font-bold cursor-pointer transition-colors"
              >
                {isUploading === uploadId ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-700" />
                ) : (
                  <UploadCloud className="w-3.5 h-3.5 text-emerald-700" />
                )}
                <span>Tải Ảnh Từ Máy</span>
              </label>

              <input
                id={uploadId}
                type="file"
                accept="image/*"
                className="hidden"
                disabled={isUploading !== null}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    handleUploadImage(file, (url) => onUrlChange(url), uploadId);
                  }
                }}
              />

              {currentUrl && (
                <button
                  type="button"
                  onClick={() => onUrlChange("")}
                  className="text-xs text-rose-600 hover:text-rose-700 font-medium px-2 py-1"
                >
                  Xóa ảnh
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Toast thông báo lưu */}
      {saveToast && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-5 py-3 rounded-2xl shadow-2xl text-xs font-bold text-white transition-all transform animate-bounce-short ${
            saveToast.type === "success" ? "bg-emerald-600" : "bg-rose-600"
          }`}
        >
          {saveToast.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" />
          )}
          <span>{saveToast.message}</span>
        </div>
      )}

      {/* Header Quản Trị */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold uppercase tracking-wider mb-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
            Quản Trị Giao Diện & Hình Ảnh Website
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-display tracking-tight">
            Cấu Hình & Quản Trị Website
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Tùy biến toàn bộ hình ảnh, banner, video, thông tin các trang: Trang Chủ, Giới Thiệu, Liên Hệ, Dịch Vụ và Cấu hình chung.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-slate-700 text-xs font-bold cursor-pointer transition-colors"
            title="Khôi phục mặc định"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">Khôi Phục Mặc Định</span>
          </button>

          <button
            type="button"
            onClick={handleSaveConfig}
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-lg shadow-emerald-600/20 active:scale-95 cursor-pointer transition-all disabled:opacity-50"
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>{isSaving ? "Đang Lưu Cấu Hình..." : "Lưu Thay Đổi Toàn Bộ"}</span>
          </button>
        </div>
      </div>

      {/* Hệ thống 5 Tabs lớn điều hướng theo từng trang */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-stone-200 scrollbar-none">
        <button
          type="button"
          onClick={() => setActiveTab("general")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all cursor-pointer ${
            activeTab === "general"
              ? "bg-slate-900 text-white shadow-md shadow-slate-900/15"
              : "bg-white text-slate-600 hover:bg-stone-100 border border-stone-200"
          }`}
        >
          <Globe className="w-4 h-4 text-emerald-400" />
          <span>1. Cấu Hình Chung & Nhận Diện</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("home")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all cursor-pointer ${
            activeTab === "home"
              ? "bg-emerald-700 text-white shadow-md shadow-emerald-700/20"
              : "bg-white text-slate-600 hover:bg-stone-100 border border-stone-200"
          }`}
        >
          <Home className="w-4 h-4" />
          <span>2. Cấu Hình Trang Chủ (Tất Cả Ảnh & Khối)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("about")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all cursor-pointer ${
            activeTab === "about"
              ? "bg-emerald-700 text-white shadow-md shadow-emerald-700/20"
              : "bg-white text-slate-600 hover:bg-stone-100 border border-stone-200"
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>3. Cấu Hình Trang Giới Thiệu</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("contact")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all cursor-pointer ${
            activeTab === "contact"
              ? "bg-emerald-700 text-white shadow-md shadow-emerald-700/20"
              : "bg-white text-slate-600 hover:bg-stone-100 border border-stone-200"
          }`}
        >
          <Phone className="w-4 h-4" />
          <span>4. Cấu Hình Trang Liên Hệ & Bản Đồ</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("services")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all cursor-pointer ${
            activeTab === "services"
              ? "bg-emerald-700 text-white shadow-md shadow-emerald-700/20"
              : "bg-white text-slate-600 hover:bg-stone-100 border border-stone-200"
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>5. Cấu Hình Trang Dịch Vụ & Bảng Giá</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("news")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all cursor-pointer ${
            activeTab === "news"
              ? "bg-emerald-700 text-white shadow-md shadow-emerald-700/20"
              : "bg-white text-slate-600 hover:bg-stone-100 border border-stone-200"
          }`}
        >
          <Newspaper className="w-4 h-4 text-emerald-400" />
          <span>6. Cấu Hình Trang Tin Tức (News Page)</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: CẤU HÌNH CHUNG & NHẬN DIỆN */}
      {/* ========================================================================= */}
      {activeTab === "general" && (
        <div className="space-y-6">
          {/* Khối Thương hiệu & Logo */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
            <div className="border-b border-stone-100 pb-4">
              <h2 className="text-lg font-black text-slate-900 font-display flex items-center gap-2">
                <Globe className="w-5 h-5 text-emerald-600" />
                Cấu Hình Thương Hiệu & Logo / Favicon
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Logo và Favicon khi thay đổi sẽ tự động áp dụng ngay lập tức trên thanh tiêu đề trình duyệt, thanh Menu Header và Chân trang Footer.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                  Tên Website (Brand Name)
                </label>
                <input
                  type="text"
                  value={formData.general?.siteName || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      general: { ...formData.general, siteName: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  placeholder="Ví dụ: MatGreen"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                  Khẩu Hiệu / Slogan (Tagline)
                </label>
                <input
                  type="text"
                  value={formData.general?.siteTagline || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      general: { ...formData.general, siteTagline: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  placeholder="Ví dụ: Kết Nối Cung Cầu Vật Liệu & Tái Sử Dụng Tháo Dỡ Toàn Quốc"
                />
              </div>
            </div>

            <div className="pt-2 border-t border-stone-100 grid grid-cols-1 md:grid-cols-2 gap-8">
              {renderImageUploader(
                "Ảnh Logo Chính (Header & Footer)",
                formData.general?.logoUrl || "",
                (url) =>
                  setFormData({
                    ...formData,
                    general: { ...formData.general, logoUrl: url },
                  }),
                "Khuyến nghị ảnh nền trong suốt (PNG/SVG) kích thước ngang hoặc vuông nhỏ."
              )}

              {renderImageUploader(
                "Biểu Tượng Favicon Trình Duyệt",
                formData.general?.faviconUrl || "",
                (url) =>
                  setFormData({
                    ...formData,
                    general: { ...formData.general, faviconUrl: url },
                  }),
                "Biểu tượng nhỏ hiển thị trên tab trình duyệt (ICO, PNG, SVG vuông nhỏ)."
              )}
            </div>
          </div>

          {/* Khối Mạng Xã Hội & Chân Trang Footer */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
            <div className="border-b border-stone-100 pb-4">
              <h2 className="text-lg font-black text-slate-900 font-display flex items-center gap-2">
                <Globe className="w-5 h-5 text-emerald-600" />
                Mạng Xã Hội & Nội Dung Chân Trang (Footer)
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                  Đường dẫn Facebook Fanpage
                </label>
                <input
                  type="text"
                  value={formData.general?.socialFacebook || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      general: { ...formData.general, socialFacebook: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  placeholder="https://facebook.com/matgreen"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                  Đường dẫn Kênh Youtube
                </label>
                <input
                  type="text"
                  value={formData.general?.socialYoutube || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      general: { ...formData.general, socialYoutube: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  placeholder="https://youtube.com/@matgreen"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                  Zalo OA / Hotline Zalo
                </label>
                <input
                  type="text"
                  value={formData.general?.socialZalo || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      general: { ...formData.general, socialZalo: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  placeholder="https://zalo.me/0988776655"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                  Instagram Trang Chủ
                </label>
                <input
                  type="text"
                  value={formData.general?.socialInstagram || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      general: { ...formData.general, socialInstagram: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  placeholder="https://instagram.com/matgreen"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                Đoạn Văn Giới Thiệu Ngắn Ở Chân Trang (Footer)
              </label>
              <textarea
                rows={3}
                value={formData.general?.footerDesc || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    general: { ...formData.general, footerDesc: e.target.value },
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                Dòng Bản Quyền (Copyright)
              </label>
              <input
                type="text"
                value={formData.general?.copyrightText || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    general: { ...formData.general, copyrightText: e.target.value },
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            {renderImageUploader(
              "Ảnh Họa Tiết Nền Chân Trang (Footer Background Pattern)",
              formData.general?.footerBgPattern || "/assets/images/shapes/footer-bg-1-1.png",
              (url) =>
                setFormData({
                  ...formData,
                  general: { ...formData.general, footerBgPattern: url },
                }),
              "general-footer-bg",
              "Ảnh hoa văn đồ họa lặp lại ở nền Chân trang Footer (/assets/images/shapes/footer-bg-1-1.png)"
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: CẤU HÌNH TRANG CHỦ (TẤT CẢ CÁC KHỐI & HÌNH ẢNH) */}
      {/* ========================================================================= */}
      {activeTab === "home" && (
        <div className="space-y-6">
          {/* Sub-tabs điều hướng các khối trên Trang Chủ */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 bg-stone-100 p-1.5 rounded-2xl border border-stone-200">
            {[
              { id: "hero", label: "Hero Banner & Video" },
              { id: "offers", label: "2 Thẻ Ưu Đãi (Offers)" },
              { id: "about", label: "Khối Giới Thiệu (About)" },
              { id: "services", label: "4 Dịch Vụ Cốt Lõi" },
              { id: "products", label: "Nguồn Cung Mẫu (4 Sản Phẩm)" },
              { id: "why", label: "Lợi Thế (Why Choose Parallax)" },
              { id: "gallery", label: "Thư Viện Công Trình (Gallery)" },
              { id: "stats", label: "Thống Kê (Funfacts)" },
              { id: "news", label: "Khối Tin Tức (Trang Chủ)" },
              { id: "partners", label: "Carousel Đối Tác" },
              { id: "testimonials", label: "Đánh Giá Khách Hàng" },
            ].map((sub) => (
              <button
                key={sub.id}
                type="button"
                onClick={() => setHomeSubTab(sub.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  homeSubTab === sub.id
                    ? "bg-white text-emerald-800 shadow-sm border border-stone-200"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {sub.label}
              </button>
            ))}
          </div>

          {/* SUB-TAB: HERO */}
          {homeSubTab === "hero" && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
              <div className="border-b border-stone-100 pb-4">
                <h3 className="text-base font-black text-slate-900 font-display flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  Hero Banner Đầu Trang Chủ & Video Giới Thiệu
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Chỉnh sửa hình ảnh đại diện lớn góc phải, link video Youtube, tiêu đề và khẩu hiệu mở đầu.
                </p>
              </div>

              {renderImageUploader(
                "Ảnh Đại Diện Hero Chính (Góc Phải Hero)",
                formData.homePage?.hero?.imageUrl || "",
                (url) =>
                  setFormData({
                    ...formData,
                    homePage: {
                      ...formData.homePage,
                      hero: { ...formData.homePage.hero, imageUrl: url },
                    },
                  }),
                "Ảnh minh họa ấn tượng thể hiện tuần hoàn vật liệu, kiến trúc sư, xe cộ công trình.",
                "h-48"
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                    Huy Hiệu (Badge Nhỏ Trên Tiêu Đề)
                  </label>
                  <input
                    type="text"
                    value={formData.homePage?.hero?.badge || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        homePage: {
                          ...formData.homePage,
                          hero: { ...formData.homePage.hero, badge: e.target.value },
                        },
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                    Đường Dẫn Video Youtube Nhúng (Popup Play)
                  </label>
                  <div className="flex gap-2 items-center">
                    <input
                      type="text"
                      value={formData.homePage?.hero?.youtubeVideoUrl || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          homePage: {
                            ...formData.homePage,
                            hero: { ...formData.homePage.hero, youtubeVideoUrl: e.target.value },
                          },
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                      placeholder="https://www.youtube-nocookie.com/embed/..."
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                    Tiêu Đề Dòng 1
                  </label>
                  <input
                    type="text"
                    value={formData.homePage?.hero?.titleLine1 || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        homePage: {
                          ...formData.homePage,
                          hero: { ...formData.homePage.hero, titleLine1: e.target.value },
                        },
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                    Từ Khóa Nổi Bật (Chữ Xanh Lá)
                  </label>
                  <input
                    type="text"
                    value={formData.homePage?.hero?.titleHighlight || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        homePage: {
                          ...formData.homePage,
                          hero: { ...formData.homePage.hero, titleHighlight: e.target.value },
                        },
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                    Tiêu Đề Dòng 2
                  </label>
                  <input
                    type="text"
                    value={formData.homePage?.hero?.titleLine2 || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        homePage: {
                          ...formData.homePage,
                          hero: { ...formData.homePage.hero, titleLine2: e.target.value },
                        },
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                    3 Điểm Nổi Bật (Ngăn cách bằng dấu phẩy)
                  </label>
                  <input
                    type="text"
                    value={formData.homePage?.hero?.highlights?.join(", ") || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        homePage: {
                          ...formData.homePage,
                          hero: {
                            ...formData.homePage.hero,
                            highlights: e.target.value.split(",").map((s) => s.trim()),
                          },
                        },
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                    placeholder="Cho nhận 0đ, Radar GPS, AI bóc tách"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                  Đoạn Văn Mô Tả Hero (Subtitle)
                </label>
                <textarea
                  rows={3}
                  value={formData.homePage?.hero?.subtitle || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      homePage: {
                        ...formData.homePage,
                        hero: { ...formData.homePage.hero, subtitle: e.target.value },
                      },
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>
            </div>
          )}

          {/* SUB-TAB: OFFERS */}
          {homeSubTab === "offers" && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-8">
              <div className="border-b border-stone-100 pb-4">
                <h3 className="text-base font-black text-slate-900 font-display flex items-center gap-2">
                  <Gift className="w-4 h-4 text-emerald-600" />
                  2 Thẻ Ưu Đãi Trang Chủ (Offers: Cho Nhận 0đ & Thanh Lý)
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Chỉnh sửa hình ảnh nền, ảnh hoa văn trang trí góc, huy hiệu, tiêu đề và nút kêu gọi hành động của 2 thẻ ưu đãi nổi bật.
                </p>
              </div>

              {/* Grid 2 Thẻ */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Thẻ 1 */}
                <div className="p-6 rounded-2xl border-2 border-emerald-200/80 bg-emerald-50/20 space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-emerald-100">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-extrabold uppercase">
                      Thẻ 1: Cho Tặng 0đ
                    </span>
                  </div>

                  {renderImageUploader(
                    "Ảnh Nền Thẻ 1 (Background Image)",
                    formData.homePage?.offers?.card1?.bgImage || "/assets/images/backgrounds/offer-1-1-bg.png",
                    (url) =>
                      setFormData({
                        ...formData,
                        homePage: {
                          ...formData.homePage,
                          offers: {
                            ...formData.homePage?.offers,
                            card1: { ...(formData.homePage?.offers?.card1 || DEFAULT_SITE_CONFIG.homePage.offers.card1), bgImage: url },
                            card2: formData.homePage?.offers?.card2 || DEFAULT_SITE_CONFIG.homePage.offers.card2,
                          },
                        },
                      }),
                    "offer-card1-bg",
                    "Khuyên dùng kích thước ~600x400px hoặc ảnh hoa văn nền"
                  )}

                  {renderImageUploader(
                    "Ảnh Trang Trí Góc (Shape Image)",
                    formData.homePage?.offers?.card1?.shapeImage || "/assets/images/shapes/offer-s-1-1.png",
                    (url) =>
                      setFormData({
                        ...formData,
                        homePage: {
                          ...formData.homePage,
                          offers: {
                            ...formData.homePage?.offers,
                            card1: { ...(formData.homePage?.offers?.card1 || DEFAULT_SITE_CONFIG.homePage.offers.card1), shapeImage: url },
                            card2: formData.homePage?.offers?.card2 || DEFAULT_SITE_CONFIG.homePage.offers.card2,
                          },
                        },
                      }),
                    "offer-card1-shape",
                    "Ảnh đồ họa trong suốt PNG đặt ở góc dưới phải"
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Huy Hiệu (Badge)</label>
                      <input
                        type="text"
                        value={formData.homePage?.offers?.card1?.badge || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            homePage: {
                              ...formData.homePage,
                              offers: {
                                ...formData.homePage?.offers,
                                card1: { ...(formData.homePage?.offers?.card1 || DEFAULT_SITE_CONFIG.homePage.offers.card1), badge: e.target.value },
                                card2: formData.homePage?.offers?.card2 || DEFAULT_SITE_CONFIG.homePage.offers.card2,
                              },
                            },
                          })
                        }
                        className="w-full px-3 py-1.5 rounded-lg border border-stone-200 text-xs bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Ghi Chú Phụ</label>
                      <input
                        type="text"
                        value={formData.homePage?.offers?.card1?.subText || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            homePage: {
                              ...formData.homePage,
                              offers: {
                                ...formData.homePage?.offers,
                                card1: { ...(formData.homePage?.offers?.card1 || DEFAULT_SITE_CONFIG.homePage.offers.card1), subText: e.target.value },
                                card2: formData.homePage?.offers?.card2 || DEFAULT_SITE_CONFIG.homePage.offers.card2,
                              },
                            },
                          })
                        }
                        className="w-full px-3 py-1.5 rounded-lg border border-stone-200 text-xs bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Tiêu Đề Thẻ</label>
                    <input
                      type="text"
                      value={formData.homePage?.offers?.card1?.title || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          homePage: {
                            ...formData.homePage,
                            offers: {
                              ...formData.homePage?.offers,
                              card1: { ...(formData.homePage?.offers?.card1 || DEFAULT_SITE_CONFIG.homePage.offers.card1), title: e.target.value },
                              card2: formData.homePage?.offers?.card2 || DEFAULT_SITE_CONFIG.homePage.offers.card2,
                            },
                          },
                        })
                      }
                      className="w-full px-3 py-1.5 rounded-lg border border-stone-200 text-xs bg-white font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Mô Tả Thẻ</label>
                    <textarea
                      rows={3}
                      value={formData.homePage?.offers?.card1?.desc || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          homePage: {
                            ...formData.homePage,
                            offers: {
                              ...formData.homePage?.offers,
                              card1: { ...(formData.homePage?.offers?.card1 || DEFAULT_SITE_CONFIG.homePage.offers.card1), desc: e.target.value },
                              card2: formData.homePage?.offers?.card2 || DEFAULT_SITE_CONFIG.homePage.offers.card2,
                            },
                          },
                        })
                      }
                      className="w-full px-3 py-1.5 rounded-lg border border-stone-200 text-xs bg-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Chữ Nút Bấm</label>
                      <input
                        type="text"
                        value={formData.homePage?.offers?.card1?.buttonText || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            homePage: {
                              ...formData.homePage,
                              offers: {
                                ...formData.homePage?.offers,
                                card1: { ...(formData.homePage?.offers?.card1 || DEFAULT_SITE_CONFIG.homePage.offers.card1), buttonText: e.target.value },
                                card2: formData.homePage?.offers?.card2 || DEFAULT_SITE_CONFIG.homePage.offers.card2,
                              },
                            },
                          })
                        }
                        className="w-full px-3 py-1.5 rounded-lg border border-stone-200 text-xs bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Liên Kết (Link)</label>
                      <input
                        type="text"
                        value={formData.homePage?.offers?.card1?.buttonLink || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            homePage: {
                              ...formData.homePage,
                              offers: {
                                ...formData.homePage?.offers,
                                card1: { ...(formData.homePage?.offers?.card1 || DEFAULT_SITE_CONFIG.homePage.offers.card1), buttonLink: e.target.value },
                                card2: formData.homePage?.offers?.card2 || DEFAULT_SITE_CONFIG.homePage.offers.card2,
                              },
                            },
                          })
                        }
                        className="w-full px-3 py-1.5 rounded-lg border border-stone-200 text-xs bg-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Thẻ 2 */}
                <div className="p-6 rounded-2xl border-2 border-amber-200/80 bg-amber-50/20 space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-amber-100">
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-600 text-white text-[10px] font-extrabold uppercase">
                      Thẻ 2: Thanh Lý Dọn Kho
                    </span>
                  </div>

                  {renderImageUploader(
                    "Ảnh Nền Thẻ 2 (Background Image)",
                    formData.homePage?.offers?.card2?.bgImage || "/assets/images/backgrounds/offer-1-2-bg.png",
                    (url) =>
                      setFormData({
                        ...formData,
                        homePage: {
                          ...formData.homePage,
                          offers: {
                            ...formData.homePage?.offers,
                            card1: formData.homePage?.offers?.card1 || DEFAULT_SITE_CONFIG.homePage.offers.card1,
                            card2: { ...(formData.homePage?.offers?.card2 || DEFAULT_SITE_CONFIG.homePage.offers.card2), bgImage: url },
                          },
                        },
                      }),
                    "offer-card2-bg",
                    "Khuyên dùng kích thước ~600x400px hoặc ảnh hoa văn nền"
                  )}

                  {renderImageUploader(
                    "Ảnh Trang Trí Góc (Shape Image)",
                    formData.homePage?.offers?.card2?.shapeImage || "/assets/images/shapes/offer-s-1-1.png",
                    (url) =>
                      setFormData({
                        ...formData,
                        homePage: {
                          ...formData.homePage,
                          offers: {
                            ...formData.homePage?.offers,
                            card1: formData.homePage?.offers?.card1 || DEFAULT_SITE_CONFIG.homePage.offers.card1,
                            card2: { ...(formData.homePage?.offers?.card2 || DEFAULT_SITE_CONFIG.homePage.offers.card2), shapeImage: url },
                          },
                        },
                      }),
                    "offer-card2-shape",
                    "Ảnh đồ họa trong suốt PNG đặt ở góc dưới phải"
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Huy Hiệu (Badge)</label>
                      <input
                        type="text"
                        value={formData.homePage?.offers?.card2?.badge || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            homePage: {
                              ...formData.homePage,
                              offers: {
                                ...formData.homePage?.offers,
                                card1: formData.homePage?.offers?.card1 || DEFAULT_SITE_CONFIG.homePage.offers.card1,
                                card2: { ...(formData.homePage?.offers?.card2 || DEFAULT_SITE_CONFIG.homePage.offers.card2), badge: e.target.value },
                              },
                            },
                          })
                        }
                        className="w-full px-3 py-1.5 rounded-lg border border-stone-200 text-xs bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Ghi Chú Phụ</label>
                      <input
                        type="text"
                        value={formData.homePage?.offers?.card2?.subText || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            homePage: {
                              ...formData.homePage,
                              offers: {
                                ...formData.homePage?.offers,
                                card1: formData.homePage?.offers?.card1 || DEFAULT_SITE_CONFIG.homePage.offers.card1,
                                card2: { ...(formData.homePage?.offers?.card2 || DEFAULT_SITE_CONFIG.homePage.offers.card2), subText: e.target.value },
                              },
                            },
                          })
                        }
                        className="w-full px-3 py-1.5 rounded-lg border border-stone-200 text-xs bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Tiêu Đề Thẻ</label>
                    <input
                      type="text"
                      value={formData.homePage?.offers?.card2?.title || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          homePage: {
                            ...formData.homePage,
                            offers: {
                              ...formData.homePage?.offers,
                              card1: formData.homePage?.offers?.card1 || DEFAULT_SITE_CONFIG.homePage.offers.card1,
                              card2: { ...(formData.homePage?.offers?.card2 || DEFAULT_SITE_CONFIG.homePage.offers.card2), title: e.target.value },
                            },
                          },
                        })
                      }
                      className="w-full px-3 py-1.5 rounded-lg border border-stone-200 text-xs bg-white font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Mô Tả Thẻ</label>
                    <textarea
                      rows={3}
                      value={formData.homePage?.offers?.card2?.desc || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          homePage: {
                            ...formData.homePage,
                            offers: {
                              ...formData.homePage?.offers,
                              card1: formData.homePage?.offers?.card1 || DEFAULT_SITE_CONFIG.homePage.offers.card1,
                              card2: { ...(formData.homePage?.offers?.card2 || DEFAULT_SITE_CONFIG.homePage.offers.card2), desc: e.target.value },
                            },
                          },
                        })
                      }
                      className="w-full px-3 py-1.5 rounded-lg border border-stone-200 text-xs bg-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Chữ Nút Bấm</label>
                      <input
                        type="text"
                        value={formData.homePage?.offers?.card2?.buttonText || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            homePage: {
                              ...formData.homePage,
                              offers: {
                                ...formData.homePage?.offers,
                                card1: formData.homePage?.offers?.card1 || DEFAULT_SITE_CONFIG.homePage.offers.card1,
                                card2: { ...(formData.homePage?.offers?.card2 || DEFAULT_SITE_CONFIG.homePage.offers.card2), buttonText: e.target.value },
                              },
                            },
                          })
                        }
                        className="w-full px-3 py-1.5 rounded-lg border border-stone-200 text-xs bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Liên Kết (Link)</label>
                      <input
                        type="text"
                        value={formData.homePage?.offers?.card2?.buttonLink || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            homePage: {
                              ...formData.homePage,
                              offers: {
                                ...formData.homePage?.offers,
                                card1: formData.homePage?.offers?.card1 || DEFAULT_SITE_CONFIG.homePage.offers.card1,
                                card2: { ...(formData.homePage?.offers?.card2 || DEFAULT_SITE_CONFIG.homePage.offers.card2), buttonLink: e.target.value },
                              },
                            },
                          })
                        }
                        className="w-full px-3 py-1.5 rounded-lg border border-stone-200 text-xs bg-white"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SUB-TAB: ABOUT */}
          {homeSubTab === "about" && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
              <div className="border-b border-stone-100 pb-4">
                <h3 className="text-base font-black text-slate-900 font-display flex items-center gap-2">
                  <Layers className="w-4 h-4 text-emerald-600" />
                  Khối Giới Thiệu Cốt Lõi (Landing About)
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Chỉnh sửa ảnh công trình bo góc, con số thống kê 15k tấn, 6 lợi ích và thông tin chữ ký Người Sáng Lập.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {renderImageUploader(
                  "Ảnh Công Trình Tuần Hoàn (Khung lớn bên trái)",
                  formData.homePage?.about?.imageUrl || "",
                  (url) =>
                    setFormData({
                      ...formData,
                      homePage: {
                        ...formData.homePage,
                        about: { ...formData.homePage.about, imageUrl: url },
                      },
                    }),
                  "Ảnh chụp hiện trường thi công, tái chế hoặc máy xúc xà bần.",
                  "h-48"
                )}

                {renderImageUploader(
                  "Ảnh Đại Diện Người Sáng Lập (Founder Avatar)",
                  formData.homePage?.about?.founderAvatar || "",
                  (url) =>
                    setFormData({
                      ...formData,
                      homePage: {
                        ...formData.homePage,
                        about: { ...formData.homePage.about, founderAvatar: url },
                      },
                    }),
                  "Ảnh chân dung tròn góc chữ ký phía dưới danh sách lợi ích.",
                  "h-48"
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-stone-100">
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                    Huy Hiệu (Badge)
                  </label>
                  <input
                    type="text"
                    value={formData.homePage?.about?.badge || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        homePage: {
                          ...formData.homePage,
                          about: { ...formData.homePage.about, badge: e.target.value },
                        },
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                    Tiêu Đề Khối
                  </label>
                  <input
                    type="text"
                    value={formData.homePage?.about?.title || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        homePage: {
                          ...formData.homePage,
                          about: { ...formData.homePage.about, title: e.target.value },
                        },
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                    Con Số Thống Kê Nổi Bật (VD: 15k)
                  </label>
                  <input
                    type="text"
                    value={formData.homePage?.about?.statNumber || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        homePage: {
                          ...formData.homePage,
                          about: { ...formData.homePage.about, statNumber: e.target.value },
                        },
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                    Nhãn Thống Kê (VD: Tấn phế thải Được tái sinh mỗi ngày)
                  </label>
                  <input
                    type="text"
                    value={formData.homePage?.about?.statLabel || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        homePage: {
                          ...formData.homePage,
                          about: { ...formData.homePage.about, statLabel: e.target.value },
                        },
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                    Tên Người Sáng Lập (Founder)
                  </label>
                  <input
                    type="text"
                    value={formData.homePage?.about?.founderName || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        homePage: {
                          ...formData.homePage,
                          about: { ...formData.homePage.about, founderName: e.target.value },
                        },
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                    Chức Vụ Người Sáng Lập
                  </label>
                  <input
                    type="text"
                    value={formData.homePage?.about?.founderRole || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        homePage: {
                          ...formData.homePage,
                          about: { ...formData.homePage.about, founderRole: e.target.value },
                        },
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                  Đoạn Văn Ngắn 1
                </label>
                <textarea
                  rows={2}
                  value={formData.homePage?.about?.descShort || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      homePage: {
                        ...formData.homePage,
                        about: { ...formData.homePage.about, descShort: e.target.value },
                      },
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                  Đoạn Văn Chi Tiết 2
                </label>
                <textarea
                  rows={3}
                  value={formData.homePage?.about?.descLong || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      homePage: {
                        ...formData.homePage,
                        about: { ...formData.homePage.about, descLong: e.target.value },
                      },
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                  Danh Sách Lợi Ích Cốt Lõi (Mỗi dòng 1 lợi ích)
                </label>
                <textarea
                  rows={5}
                  value={formData.homePage?.about?.benefits?.join("\n") || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      homePage: {
                        ...formData.homePage,
                        about: {
                          ...formData.homePage.about,
                          benefits: e.target.value.split("\n").filter((l) => l.trim().length > 0),
                        },
                      },
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs text-slate-800 font-mono"
                  placeholder="Tiết kiệm 100% chi phí đổ xà bần&#10;Minh bạch tọa độ GPS&#10;..."
                />
              </div>
            </div>
          )}

          {/* SUB-TAB: SERVICES */}
          {homeSubTab === "services" && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-4">
                <div>
                  <h3 className="text-base font-black text-slate-900 font-display flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-emerald-600" />
                    4 Dịch Vụ Tuần Hoàn Cốt Lõi
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Cấu hình ảnh đại diện, tiêu đề, mô tả và liên kết cho từng thẻ dịch vụ.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const newItems = [
                      ...(formData.homePage?.services?.items || []),
                      {
                        title: "Dịch Vụ Mới",
                        desc: "Mô tả giải pháp tuần hoàn vật liệu...",
                        image: "https://images.unsplash.com/photo-1541888946425-d0fbb1861593?auto=format&fit=crop&w=800&q=80",
                        tag: "Dịch vụ",
                        link: "/dashboard",
                      },
                    ];
                    setFormData({
                      ...formData,
                      homePage: {
                        ...formData.homePage,
                        services: { ...formData.homePage.services, items: newItems },
                      },
                    });
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold hover:bg-emerald-100"
                >
                  <Plus className="w-3.5 h-3.5" /> Thêm Thẻ Dịch Vụ
                </button>
              </div>

              {/* Danh sách các card dịch vụ */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {formData.homePage?.services?.items?.map((srv, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl border border-stone-200 bg-stone-50/50 space-y-4 relative group"
                  >
                    <div className="flex items-center justify-between border-b border-stone-200/60 pb-2">
                      <span className="text-xs font-extrabold text-emerald-800">
                        Thẻ #{idx + 1}: {srv.title || "Chưa đặt tên"}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          const newItems = formData.homePage.services.items.filter((_, i) => i !== idx);
                          setFormData({
                            ...formData,
                            homePage: {
                              ...formData.homePage,
                              services: { ...formData.homePage.services, items: newItems },
                            },
                          });
                        }}
                        className="text-stone-400 hover:text-rose-600 transition-colors"
                        title="Xóa dịch vụ này"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {renderImageUploader(
                      `Ảnh Đại Diện Dịch Vụ #${idx + 1}`,
                      srv.image || "",
                      (url) => {
                        const newItems = [...formData.homePage.services.items];
                        newItems[idx].image = url;
                        setFormData({
                          ...formData,
                          homePage: {
                            ...formData.homePage,
                            services: { ...formData.homePage.services, items: newItems },
                          },
                        });
                      },
                      undefined,
                      "h-32"
                    )}

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Tiêu Đề Dịch Vụ
                        </label>
                        <input
                          type="text"
                          value={srv.title}
                          onChange={(e) => {
                            const newItems = [...formData.homePage.services.items];
                            newItems[idx].title = e.target.value;
                            setFormData({
                              ...formData,
                              homePage: {
                                ...formData.homePage,
                                services: { ...formData.homePage.services, items: newItems },
                              },
                            });
                          }}
                          className="w-full px-3 py-1.5 rounded-lg border border-stone-200 text-xs bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Huy Hiệu (Tag)
                        </label>
                        <input
                          type="text"
                          value={srv.tag}
                          onChange={(e) => {
                            const newItems = [...formData.homePage.services.items];
                            newItems[idx].tag = e.target.value;
                            setFormData({
                              ...formData,
                              homePage: {
                                ...formData.homePage,
                                services: { ...formData.homePage.services, items: newItems },
                              },
                            });
                          }}
                          className="w-full px-3 py-1.5 rounded-lg border border-stone-200 text-xs bg-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Mô Tả Ngắn
                      </label>
                      <textarea
                        rows={2}
                        value={srv.desc}
                        onChange={(e) => {
                          const newItems = [...formData.homePage.services.items];
                          newItems[idx].desc = e.target.value;
                          setFormData({
                            ...formData,
                            homePage: {
                              ...formData.homePage,
                              services: { ...formData.homePage.services, items: newItems },
                            },
                          });
                        }}
                        className="w-full px-3 py-1.5 rounded-lg border border-stone-200 text-xs bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Đường Dẫn Liên Kết (Link)
                      </label>
                      <input
                        type="text"
                        value={srv.link}
                        onChange={(e) => {
                          const newItems = [...formData.homePage.services.items];
                          newItems[idx].link = e.target.value;
                          setFormData({
                            ...formData,
                            homePage: {
                              ...formData.homePage,
                              services: { ...formData.homePage.services, items: newItems },
                            },
                          });
                        }}
                        className="w-full px-3 py-1.5 rounded-lg border border-stone-200 text-xs bg-white"
                        placeholder="/dashboard?category=..."
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SUB-TAB: PRODUCTS SAMPLE */}
          {homeSubTab === "products" && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-8">
              <div className="border-b border-stone-100 pb-4">
                <h3 className="text-base font-black text-slate-900 font-display flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-emerald-600" />
                  Nguồn Cung Mẫu - Vật Liệu Đang Chờ Bốc Dỡ (Products)
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Chỉnh sửa 4 sản phẩm mẫu thực tế hiển thị trên Trang Chủ. Có thể tải ảnh thật từ công trình, đổi tên, giá, khoảng cách GPS và địa chỉ.
                </p>
              </div>

              {/* Tiêu đề & mô tả khối */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-stone-50 p-5 rounded-2xl border border-stone-200">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Huy Hiệu (Badge Nhỏ)</label>
                  <input
                    type="text"
                    value={formData.homePage?.products?.badge || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        homePage: {
                          ...formData.homePage,
                          products: {
                            ...(formData.homePage?.products || DEFAULT_SITE_CONFIG.homePage.products),
                            badge: e.target.value,
                          },
                        },
                      })
                    }
                    className="w-full px-3 py-1.5 rounded-lg border border-stone-200 text-xs bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Tiêu Đề Khối</label>
                  <input
                    type="text"
                    value={formData.homePage?.products?.title || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        homePage: {
                          ...formData.homePage,
                          products: {
                            ...(formData.homePage?.products || DEFAULT_SITE_CONFIG.homePage.products),
                            title: e.target.value,
                          },
                        },
                      })
                    }
                    className="w-full px-3 py-1.5 rounded-lg border border-stone-200 text-xs bg-white font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Mô Tả Ngắn</label>
                  <input
                    type="text"
                    value={formData.homePage?.products?.desc || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        homePage: {
                          ...formData.homePage,
                          products: {
                            ...(formData.homePage?.products || DEFAULT_SITE_CONFIG.homePage.products),
                            desc: e.target.value,
                          },
                        },
                      })
                    }
                    className="w-full px-3 py-1.5 rounded-lg border border-stone-200 text-xs bg-white"
                  />
                </div>
              </div>

              {/* 4 Cards Sản Phẩm */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {(formData.homePage?.products?.items || DEFAULT_SITE_CONFIG.homePage.products.items).map((prod, idx) => (
                  <div
                    key={prod.id || idx}
                    className="p-5 rounded-2xl border border-stone-200 bg-stone-50/50 space-y-4 relative"
                  >
                    <div className="flex items-center justify-between border-b border-stone-200/60 pb-2">
                      <span className="text-xs font-extrabold text-emerald-800">
                        Sản Phẩm #{idx + 1}: {prod.title || "Chưa đặt tên"}
                      </span>
                      {prod.isFree ? (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-extrabold">
                          Cho 0đ
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-amber-600 text-white text-[10px] font-extrabold">
                          Thanh lý
                        </span>
                      )}
                    </div>

                    {renderImageUploader(
                      `Ảnh Sản Phẩm #${idx + 1}`,
                      prod.image || "",
                      (url) => {
                        const items = [
                          ...(formData.homePage?.products?.items || DEFAULT_SITE_CONFIG.homePage.products.items),
                        ];
                        items[idx] = { ...items[idx], image: url };
                        setFormData({
                          ...formData,
                          homePage: {
                            ...formData.homePage,
                            products: {
                              ...(formData.homePage?.products || DEFAULT_SITE_CONFIG.homePage.products),
                              items,
                            },
                          },
                        });
                      },
                      `prod-sample-${idx + 1}`,
                      "Ảnh chụp hiện trường lô vật liệu tại công trình"
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">Tên Vật Liệu</label>
                        <input
                          type="text"
                          value={prod.title}
                          onChange={(e) => {
                            const items = [
                              ...(formData.homePage?.products?.items || DEFAULT_SITE_CONFIG.homePage.products.items),
                            ];
                            items[idx] = { ...items[idx], title: e.target.value };
                            setFormData({
                              ...formData,
                              homePage: {
                                ...formData.homePage,
                                products: {
                                  ...(formData.homePage?.products || DEFAULT_SITE_CONFIG.homePage.products),
                                  items,
                                },
                              },
                            });
                          }}
                          className="w-full px-3 py-1.5 rounded-lg border border-stone-200 text-xs bg-white font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">Danh Mục</label>
                        <input
                          type="text"
                          value={prod.category}
                          onChange={(e) => {
                            const items = [
                              ...(formData.homePage?.products?.items || DEFAULT_SITE_CONFIG.homePage.products.items),
                            ];
                            items[idx] = { ...items[idx], category: e.target.value };
                            setFormData({
                              ...formData,
                              homePage: {
                                ...formData.homePage,
                                products: {
                                  ...(formData.homePage?.products || DEFAULT_SITE_CONFIG.homePage.products),
                                  items,
                                },
                              },
                            });
                          }}
                          className="w-full px-3 py-1.5 rounded-lg border border-stone-200 text-xs bg-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">Giá Hiển Thị</label>
                        <input
                          type="text"
                          value={prod.price}
                          onChange={(e) => {
                            const items = [
                              ...(formData.homePage?.products?.items || DEFAULT_SITE_CONFIG.homePage.products.items),
                            ];
                            items[idx] = { ...items[idx], price: e.target.value };
                            setFormData({
                              ...formData,
                              homePage: {
                                ...formData.homePage,
                                products: {
                                  ...(formData.homePage?.products || DEFAULT_SITE_CONFIG.homePage.products),
                                  items,
                                },
                              },
                            });
                          }}
                          className="w-full px-3 py-1.5 rounded-lg border border-stone-200 text-xs bg-white font-bold text-amber-600"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">Đơn Vị Tính</label>
                        <input
                          type="text"
                          value={prod.unit}
                          onChange={(e) => {
                            const items = [
                              ...(formData.homePage?.products?.items || DEFAULT_SITE_CONFIG.homePage.products.items),
                            ];
                            items[idx] = { ...items[idx], unit: e.target.value };
                            setFormData({
                              ...formData,
                              homePage: {
                                ...formData.homePage,
                                products: {
                                  ...(formData.homePage?.products || DEFAULT_SITE_CONFIG.homePage.products),
                                  items,
                                },
                              },
                            });
                          }}
                          className="w-full px-3 py-1.5 rounded-lg border border-stone-200 text-xs bg-white"
                          placeholder="viên / cây / m2 / xe"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">Khoảng Cách GPS</label>
                        <input
                          type="text"
                          value={prod.distance}
                          onChange={(e) => {
                            const items = [
                              ...(formData.homePage?.products?.items || DEFAULT_SITE_CONFIG.homePage.products.items),
                            ];
                            items[idx] = { ...items[idx], distance: e.target.value };
                            setFormData({
                              ...formData,
                              homePage: {
                                ...formData.homePage,
                                products: {
                                  ...(formData.homePage?.products || DEFAULT_SITE_CONFIG.homePage.products),
                                  items,
                                },
                              },
                            });
                          }}
                          className="w-full px-3 py-1.5 rounded-lg border border-stone-200 text-xs bg-white"
                          placeholder="1.2 km"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">Địa Chỉ / Khu Vực</label>
                        <input
                          type="text"
                          value={prod.address}
                          onChange={(e) => {
                            const items = [
                              ...(formData.homePage?.products?.items || DEFAULT_SITE_CONFIG.homePage.products.items),
                            ];
                            items[idx] = { ...items[idx], address: e.target.value };
                            setFormData({
                              ...formData,
                              homePage: {
                                ...formData.homePage,
                                products: {
                                  ...(formData.homePage?.products || DEFAULT_SITE_CONFIG.homePage.products),
                                  items,
                                },
                              },
                            });
                          }}
                          className="w-full px-3 py-1.5 rounded-lg border border-stone-200 text-xs bg-white"
                          placeholder="Cầu Giấy, Hà Nội"
                        />
                      </div>
                      <div className="pt-4">
                        <label className="inline-flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={prod.isFree}
                            onChange={(e) => {
                              const items = [
                                ...(formData.homePage?.products?.items || DEFAULT_SITE_CONFIG.homePage.products.items),
                              ];
                              items[idx] = {
                                ...items[idx],
                                isFree: e.target.checked,
                                price: e.target.checked ? "0đ (Cho Tặng)" : items[idx].price,
                              };
                              setFormData({
                                ...formData,
                                homePage: {
                                  ...formData.homePage,
                                  products: {
                                    ...(formData.homePage?.products || DEFAULT_SITE_CONFIG.homePage.products),
                                    items,
                                  },
                                },
                              });
                            }}
                            className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                          />
                          <span className="text-xs font-bold text-slate-700">Đánh dấu miễn phí (Cho tặng 0đ)</span>
                        </label>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SUB-TAB: WHY CHOOSE PARALLAX */}
          {homeSubTab === "why" && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
              <div className="border-b border-stone-100 pb-4">
                <h3 className="text-base font-black text-slate-900 font-display flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  Khối Lợi Thế Vượt Trội (Parallax Why Choose)
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Chỉnh sửa ảnh nền Parallax lớn lướt sâu, tiêu đề và 4 đặc quyền nổi bật.
                </p>
              </div>

              {renderImageUploader(
                "Ảnh Nền Parallax Lớn (Tại Khối 'Vì Sao Hàng Ngàn Chủ Thầu Tin Chọn')",
                formData.homePage?.whyChoose?.bgImageUrl || "",
                (url) =>
                  setFormData({
                    ...formData,
                    homePage: {
                      ...formData.homePage,
                      whyChoose: { ...formData.homePage.whyChoose, bgImageUrl: url },
                    },
                  }),
                "Ảnh công trình panorama khổ rộng (1920x1080), hiệu ứng lướt cuộn giữ cố định ảnh nền.",
                "h-48"
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                    Huy Hiệu (Badge)
                  </label>
                  <input
                    type="text"
                    value={formData.homePage?.whyChoose?.badge || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        homePage: {
                          ...formData.homePage,
                          whyChoose: { ...formData.homePage.whyChoose, badge: e.target.value },
                        },
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                    Tiêu Đề Khối
                  </label>
                  <input
                    type="text"
                    value={formData.homePage?.whyChoose?.title || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        homePage: {
                          ...formData.homePage,
                          whyChoose: { ...formData.homePage.whyChoose, title: e.target.value },
                        },
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                  Đoạn Văn Mô Tả
                </label>
                <textarea
                  rows={3}
                  value={formData.homePage?.whyChoose?.desc || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      homePage: {
                        ...formData.homePage,
                        whyChoose: { ...formData.homePage.whyChoose, desc: e.target.value },
                      },
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs text-slate-800"
                />
              </div>

              {/* 4 thẻ tính năng kính mờ */}
              <div className="pt-4 border-t border-stone-100 space-y-4">
                <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                  4 Đặc Quyền Tính Năng Hiển Thị
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {formData.homePage?.whyChoose?.items?.map((item, idx) => (
                    <div key={idx} className="p-4 rounded-xl border border-stone-200 bg-stone-50 space-y-2">
                      <label className="block text-[11px] font-bold text-slate-700">
                        Tính Năng #{idx + 1}
                      </label>
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) => {
                          const newItems = [...formData.homePage.whyChoose.items];
                          newItems[idx].title = e.target.value;
                          setFormData({
                            ...formData,
                            homePage: {
                              ...formData.homePage,
                              whyChoose: { ...formData.homePage.whyChoose, items: newItems },
                            },
                          });
                        }}
                        className="w-full px-3 py-1.5 rounded-lg border border-stone-200 text-xs bg-white font-bold"
                      />
                      <textarea
                        rows={2}
                        value={item.desc}
                        onChange={(e) => {
                          const newItems = [...formData.homePage.whyChoose.items];
                          newItems[idx].desc = e.target.value;
                          setFormData({
                            ...formData,
                            homePage: {
                              ...formData.homePage,
                              whyChoose: { ...formData.homePage.whyChoose, items: newItems },
                            },
                          });
                        }}
                        className="w-full px-3 py-1.5 rounded-lg border border-stone-200 text-xs bg-white"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SUB-TAB: GALLERY */}
          {homeSubTab === "gallery" && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
              <div className="border-b border-stone-100 pb-4">
                <h3 className="text-base font-black text-slate-900 font-display flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-emerald-600" />
                  Thư Viện Ảnh Công Trình Thực Tế (Landing Gallery)
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Quản lý 4 hình ảnh thực địa công trường đã kết nối thành công và nội dung cam kết minh bạch GPS.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {formData.homePage?.gallery?.items?.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl border border-stone-200 bg-stone-50/50 space-y-3"
                  >
                    <span className="text-xs font-bold text-slate-800">
                      Hình Ảnh Hiện Trường #{idx + 1}
                    </span>

                    {renderImageUploader(
                      `Ảnh Công Trình #${idx + 1}`,
                      item.image || "",
                      (url) => {
                        const newItems = [...formData.homePage.gallery.items];
                        newItems[idx].image = url;
                        setFormData({
                          ...formData,
                          homePage: {
                            ...formData.homePage,
                            gallery: { ...formData.homePage.gallery, items: newItems },
                          },
                        });
                      },
                      undefined,
                      "h-32"
                    )}

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Tiêu Đề Công Trình
                        </label>
                        <input
                          type="text"
                          value={item.title}
                          onChange={(e) => {
                            const newItems = [...formData.homePage.gallery.items];
                            newItems[idx].title = e.target.value;
                            setFormData({
                              ...formData,
                              homePage: {
                                ...formData.homePage,
                                gallery: { ...formData.homePage.gallery, items: newItems },
                              },
                            });
                          }}
                          className="w-full px-3 py-1.5 rounded-lg border border-stone-200 text-xs bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Thẻ / Huy Hiệu (Tag)
                        </label>
                        <input
                          type="text"
                          value={item.tag}
                          onChange={(e) => {
                            const newItems = [...formData.homePage.gallery.items];
                            newItems[idx].tag = e.target.value;
                            setFormData({
                              ...formData,
                              homePage: {
                                ...formData.homePage,
                                gallery: { ...formData.homePage.gallery, items: newItems },
                              },
                            });
                          }}
                          className="w-full px-3 py-1.5 rounded-lg border border-stone-200 text-xs bg-white"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SUB-TAB: STATS FUNFACTS */}
          {homeSubTab === "stats" && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
              <div className="border-b border-stone-100 pb-4">
                <h3 className="text-base font-black text-slate-900 font-display flex items-center gap-2">
                  <Award className="w-4 h-4 text-emerald-600" />
                  Số Liệu Thống Kê Nổi Bật (Landing Funfacts)
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Chỉnh sửa 4 con số ấn tượng về độ phủ sóng, sản lượng tấn và sự hài lòng.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {formData.homePage?.stats?.items?.map((st, idx) => (
                  <div key={idx} className="p-4 rounded-2xl border border-stone-200 bg-stone-50 space-y-2">
                    <span className="text-xs font-bold text-slate-500">Chỉ số #{idx + 1}</span>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Con Số (VD: 28+)
                      </label>
                      <input
                        type="text"
                        value={st.num}
                        onChange={(e) => {
                          const newItems = [...formData.homePage.stats.items];
                          newItems[idx].num = e.target.value;
                          setFormData({
                            ...formData,
                            homePage: {
                              ...formData.homePage,
                              stats: { ...formData.homePage.stats, items: newItems },
                            },
                          });
                        }}
                        className="w-full px-3 py-1.5 rounded-lg border border-stone-200 text-xs bg-white font-black text-emerald-700"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Tên Chỉ Số
                      </label>
                      <input
                        type="text"
                        value={st.label}
                        onChange={(e) => {
                          const newItems = [...formData.homePage.stats.items];
                          newItems[idx].label = e.target.value;
                          setFormData({
                            ...formData,
                            homePage: {
                              ...formData.homePage,
                              stats: { ...formData.homePage.stats, items: newItems },
                            },
                          });
                        }}
                        className="w-full px-3 py-1.5 rounded-lg border border-stone-200 text-xs bg-white font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Ghi Chú Phụ
                      </label>
                      <input
                        type="text"
                        value={st.sub}
                        onChange={(e) => {
                          const newItems = [...formData.homePage.stats.items];
                          newItems[idx].sub = e.target.value;
                          setFormData({
                            ...formData,
                            homePage: {
                              ...formData.homePage,
                              stats: { ...formData.homePage.stats, items: newItems },
                            },
                          });
                        }}
                        className="w-full px-3 py-1.5 rounded-lg border border-stone-200 text-xs bg-white text-slate-500"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SUB-TAB: NEWS SECTION ON HOME */}
          {homeSubTab === "news" && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
              <div className="border-b border-stone-100 pb-4">
                <h3 className="text-base font-black text-slate-900 font-display flex items-center gap-2">
                  <Newspaper className="w-4 h-4 text-emerald-600" />
                  Khối Tin Tức & Cẩm Nang Trên Trang Chủ
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Chỉnh sửa tiêu đề, khẩu hiệu của khối 3 bài viết tin tức mới nhất hiển thị trên Trang Chủ. (Quản trị nội dung và ảnh từng bài viết tại Tab 6 hoặc trang Tin Tức).
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                    Huy Hiệu (Badge Nhỏ)
                  </label>
                  <input
                    type="text"
                    value={formData.homePage?.newsSection?.badge || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        homePage: {
                          ...formData.homePage,
                          newsSection: {
                            ...(formData.homePage?.newsSection || DEFAULT_SITE_CONFIG.homePage.newsSection),
                            badge: e.target.value,
                          },
                        },
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                    Tiêu Đề Khối
                  </label>
                  <input
                    type="text"
                    value={formData.homePage?.newsSection?.title || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        homePage: {
                          ...formData.homePage,
                          newsSection: {
                            ...(formData.homePage?.newsSection || DEFAULT_SITE_CONFIG.homePage.newsSection),
                            title: e.target.value,
                          },
                        },
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                  Đoạn Văn Mô Tả Khối Tin Tức
                </label>
                <textarea
                  rows={3}
                  value={formData.homePage?.newsSection?.desc || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      homePage: {
                        ...formData.homePage,
                        newsSection: {
                          ...(formData.homePage?.newsSection || DEFAULT_SITE_CONFIG.homePage.newsSection),
                          desc: e.target.value,
                        },
                      },
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-emerald-900 block">Quản lý nội dung và hình ảnh bài viết</span>
                  <span className="text-[11px] text-emerald-700">Thêm, xóa, chỉnh sửa ảnh thumbnail và nội dung chi tiết bài viết tại Bảng Quản Trị Tin Tức.</span>
                </div>
                <a
                  href="/admin/news"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shrink-0 transition-colors inline-flex items-center gap-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> Mở Trang Quản Trị Tin Tức
                </a>
              </div>
            </div>
          )}

          {/* SUB-TAB: PARTNERS CAROUSEL */}
          {homeSubTab === "partners" && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-4">
                <div>
                  <h3 className="text-base font-black text-slate-900 font-display flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-emerald-600" />
                    Carousel Đối Tác & Nhà Thầu Đồng Hành
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Thêm, sửa ảnh logo đối tác, tên đơn vị hiển thị trên thanh Carousel cuộn vô tận.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const newPartners = [
                      ...(formData.partners || []),
                      {
                        name: "Đối Tác Mới",
                        logo: "https://images.unsplash.com/photo-1541888946425-d0fbb1861593?auto=format&fit=crop&w=200&q=80",
                        website: "",
                      },
                    ];
                    setFormData({ ...formData, partners: newPartners });
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold hover:bg-emerald-100"
                >
                  <Plus className="w-3.5 h-3.5" /> Thêm Đối Tác Mới
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                  Tiêu Đề Dòng Chữ Chạy Carousel (Headline)
                </label>
                <input
                  type="text"
                  value={formData.partnersHeadline || ""}
                  onChange={(e) => setFormData({ ...formData, partnersHeadline: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs text-slate-800"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {formData.partners?.map((p, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl border border-stone-200 bg-stone-50/50 space-y-3 relative group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800">
                        Đối tác #{idx + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          const newPartners = formData.partners.filter((_, i) => i !== idx);
                          setFormData({ ...formData, partners: newPartners });
                        }}
                        className="text-stone-400 hover:text-rose-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {renderImageUploader(
                      `Logo Đối Tác #${idx + 1}`,
                      p.logo || "",
                      (url) => {
                        const newPartners = [...formData.partners];
                        newPartners[idx].logo = url;
                        setFormData({ ...formData, partners: newPartners });
                      },
                      undefined,
                      "h-24"
                    )}

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Tên Đơn Vị / Đối Tác
                      </label>
                      <input
                        type="text"
                        value={p.name}
                        onChange={(e) => {
                          const newPartners = [...formData.partners];
                          newPartners[idx].name = e.target.value;
                          setFormData({ ...formData, partners: newPartners });
                        }}
                        className="w-full px-3 py-1.5 rounded-lg border border-stone-200 text-xs bg-white"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SUB-TAB: TESTIMONIALS */}
          {homeSubTab === "testimonials" && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-4">
                <div>
                  <h3 className="text-base font-black text-slate-900 font-display flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-emerald-600" />
                    Đánh Giá & Phản Hồi Từ Khách Hàng (Testimonials)
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Quản lý avatar khách hàng, ảnh công trình thật, lời chứng thực và số sao đánh giá.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const newTestimonials = [
                      ...(formData.testimonials || []),
                      {
                        name: "Kỹ sư Khách Hàng",
                        role: "Chỉ huy trưởng dự án...",
                        quote: "Dịch vụ kết nối rất nhanh chóng và tiện lợi...",
                        rating: 5,
                        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
                        projectImage: "https://images.unsplash.com/photo-1541888946425-d0fbb1861593?auto=format&fit=crop&w=500&q=80",
                      },
                    ];
                    setFormData({ ...formData, testimonials: newTestimonials });
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold hover:bg-emerald-100"
                >
                  <Plus className="w-3.5 h-3.5" /> Thêm Đánh Giá Mới
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {formData.testimonials?.map((t, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl border border-stone-200 bg-stone-50/50 space-y-4 relative"
                  >
                    <div className="flex items-center justify-between border-b border-stone-200/60 pb-2">
                      <span className="text-xs font-bold text-slate-800">
                        Đánh giá #{idx + 1}: {t.name}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          const newTestimonials = formData.testimonials.filter((_, i) => i !== idx);
                          setFormData({ ...formData, testimonials: newTestimonials });
                        }}
                        className="text-stone-400 hover:text-rose-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      {renderImageUploader(
                        "Ảnh Avatar Chân Dung",
                        t.avatar || "",
                        (url) => {
                          const newTestimonials = [...formData.testimonials];
                          newTestimonials[idx].avatar = url;
                          setFormData({ ...formData, testimonials: newTestimonials });
                        },
                        undefined,
                        "h-28",
                        { stacked: true, uploadKey: `testimonial-${idx}-avatar` }
                      )}

                      {renderImageUploader(
                        "Ảnh Hiện Trường Công Trình",
                        t.projectImage || "",
                        (url) => {
                          const newTestimonials = [...formData.testimonials];
                          newTestimonials[idx].projectImage = url;
                          setFormData({ ...formData, testimonials: newTestimonials });
                        },
                        undefined,
                        "h-28",
                        { stacked: true, uploadKey: `testimonial-${idx}-project` }
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Họ Tên Khách Hàng
                        </label>
                        <input
                          type="text"
                          value={t.name}
                          onChange={(e) => {
                            const newTestimonials = [...formData.testimonials];
                            newTestimonials[idx].name = e.target.value;
                            setFormData({ ...formData, testimonials: newTestimonials });
                          }}
                          className="w-full px-3 py-1.5 rounded-lg border border-stone-200 text-xs bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Chức Danh / Dự Án
                        </label>
                        <input
                          type="text"
                          value={t.role}
                          onChange={(e) => {
                            const newTestimonials = [...formData.testimonials];
                            newTestimonials[idx].role = e.target.value;
                            setFormData({ ...formData, testimonials: newTestimonials });
                          }}
                          className="w-full px-3 py-1.5 rounded-lg border border-stone-200 text-xs bg-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Lời Nhận Xét / Trải Nghiệm Thực Tế
                      </label>
                      <textarea
                        rows={3}
                        value={t.quote}
                        onChange={(e) => {
                          const newTestimonials = [...formData.testimonials];
                          newTestimonials[idx].quote = e.target.value;
                          setFormData({ ...formData, testimonials: newTestimonials });
                        }}
                        className="w-full px-3 py-1.5 rounded-lg border border-stone-200 text-xs bg-white"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: CẤU HÌNH TRANG GIỚI THIỆU (ABOUT PAGE) */}
      {/* ========================================================================= */}
      {activeTab === "about" && (
        <div className="space-y-6">
          {/* Banner Header Đầu Trang */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
            <div className="border-b border-stone-100 pb-4">
              <h3 className="text-base font-black text-slate-900 font-display flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-emerald-600" />
                Banner Đầu Trang Giới Thiệu (Page Header)
              </h3>
            </div>

            {renderImageUploader(
              "Ảnh Nền Banner Đầu Trang Giới Thiệu",
              formData.aboutPage?.header?.bgImageUrl || "",
              (url) =>
                setFormData({
                  ...formData,
                  aboutPage: {
                    ...formData.aboutPage,
                    header: { ...formData.aboutPage.header, bgImageUrl: url },
                  },
                }),
              "Khuyến nghị ảnh toàn cảnh thi công chất lượng cao (1920x600)."
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                  Tiêu Đề Banner
                </label>
                <input
                  type="text"
                  value={formData.aboutPage?.header?.title || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      aboutPage: {
                        ...formData.aboutPage,
                        header: { ...formData.aboutPage.header, title: e.target.value },
                      },
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                  Phụ Đề Banner
                </label>
                <input
                  type="text"
                  value={formData.aboutPage?.header?.subtitle || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      aboutPage: {
                        ...formData.aboutPage,
                        header: { ...formData.aboutPage.header, subtitle: e.target.value },
                      },
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs text-slate-800"
                />
              </div>
            </div>
          </div>

          {/* Câu chuyện sứ mệnh & Ảnh kép nghệ thuật */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
            <div className="border-b border-stone-100 pb-4">
              <h3 className="text-base font-black text-slate-900 font-display flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                Câu Chuyện Sáng Lập & 2 Hình Ảnh Kép Nghệ Thuật
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {renderImageUploader(
                "Ảnh Lớn 1 (Khung trên)",
                formData.aboutPage?.story?.image1 || "",
                (url) =>
                  setFormData({
                    ...formData,
                    aboutPage: {
                      ...formData.aboutPage,
                      story: { ...formData.aboutPage.story, image1: url },
                    },
                  }),
                "Hình ảnh công trình chính bo góc nghệ thuật."
              )}

              {renderImageUploader(
                "Ảnh Nhỏ 2 (Khung chồng góc dưới)",
                formData.aboutPage?.story?.image2 || "",
                (url) =>
                  setFormData({
                    ...formData,
                    aboutPage: {
                      ...formData.aboutPage,
                      story: { ...formData.aboutPage.story, image2: url },
                    },
                  }),
                "Hình ảnh phụ kỹ sư kiểm định hiện trường."
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-stone-100">
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                  Huy Hiệu (Badge)
                </label>
                <input
                  type="text"
                  value={formData.aboutPage?.story?.badge || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      aboutPage: {
                        ...formData.aboutPage,
                        story: { ...formData.aboutPage.story, badge: e.target.value },
                      },
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                  Tiêu Đề Sứ Mệnh
                </label>
                <input
                  type="text"
                  value={formData.aboutPage?.story?.title || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      aboutPage: {
                        ...formData.aboutPage,
                        story: { ...formData.aboutPage.story, title: e.target.value },
                      },
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs text-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                Đoạn Văn 1 (Mở đầu)
              </label>
              <textarea
                rows={2}
                value={formData.aboutPage?.story?.desc1 || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    aboutPage: {
                      ...formData.aboutPage,
                      story: { ...formData.aboutPage.story, desc1: e.target.value },
                    },
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                Đoạn Văn 2 (Chi tiết)
              </label>
              <textarea
                rows={3}
                value={formData.aboutPage?.story?.desc2 || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    aboutPage: {
                      ...formData.aboutPage,
                      story: { ...formData.aboutPage.story, desc2: e.target.value },
                    },
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs text-slate-800"
              />
            </div>
          </div>

          {/* Đội ngũ chuyên gia (Team Members) */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-4">
              <div>
                <h3 className="text-base font-black text-slate-900 font-display flex items-center gap-2">
                  <Users className="w-4 h-4 text-emerald-600" />
                  Đội Ngũ Sáng Lập & Chuyên Gia Cố Vấn
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Chỉnh sửa ảnh chân dung, họ tên, chức vụ và tiểu sử từng thành viên.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  const newMembers = [
                    ...(formData.teamMembers || []),
                    {
                      name: "Chuyên Gia Mới",
                      role: "Kỹ sư Cố Vấn Kỹ Thuật",
                      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
                      bio: "Kinh nghiệm chuyên môn nhiều năm trong lĩnh vực xây dựng...",
                    },
                  ];
                  setFormData({ ...formData, teamMembers: newMembers });
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold hover:bg-emerald-100"
              >
                <Plus className="w-3.5 h-3.5" /> Thêm Thành Viên
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {formData.teamMembers?.map((m, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl border border-stone-200 bg-stone-50/50 space-y-3 relative"
                >
                  <div className="flex items-center justify-between border-b border-stone-200/60 pb-2">
                    <span className="text-xs font-bold text-slate-800">
                      Thành viên #{idx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const newMembers = formData.teamMembers.filter((_, i) => i !== idx);
                        setFormData({ ...formData, teamMembers: newMembers });
                      }}
                      className="text-stone-400 hover:text-rose-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {renderImageUploader(
                    `Ảnh Chân Dung #${idx + 1}`,
                    m.image || "",
                    (url) => {
                      const newMembers = [...formData.teamMembers];
                      newMembers[idx].image = url;
                      setFormData({ ...formData, teamMembers: newMembers });
                    },
                    undefined,
                    "h-36"
                  )}

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Họ và Tên
                    </label>
                    <input
                      type="text"
                      value={m.name}
                      onChange={(e) => {
                        const newMembers = [...formData.teamMembers];
                        newMembers[idx].name = e.target.value;
                        setFormData({ ...formData, teamMembers: newMembers });
                      }}
                      className="w-full px-3 py-1.5 rounded-lg border border-stone-200 text-xs bg-white font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Chức Danh / Vị Trí
                    </label>
                    <input
                      type="text"
                      value={m.role}
                      onChange={(e) => {
                        const newMembers = [...formData.teamMembers];
                        newMembers[idx].role = e.target.value;
                        setFormData({ ...formData, teamMembers: newMembers });
                      }}
                      className="w-full px-3 py-1.5 rounded-lg border border-stone-200 text-xs bg-white text-emerald-800 font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Tiểu Sử Ngắn (Bio)
                    </label>
                    <textarea
                      rows={2}
                      value={m.bio}
                      onChange={(e) => {
                        const newMembers = [...formData.teamMembers];
                        newMembers[idx].bio = e.target.value;
                        setFormData({ ...formData, teamMembers: newMembers });
                      }}
                      className="w-full px-3 py-1.5 rounded-lg border border-stone-200 text-xs bg-white text-slate-600"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: CẤU HÌNH TRANG LIÊN HỆ & BẢN ĐỒ (CONTACT PAGE) */}
      {/* ========================================================================= */}
      {activeTab === "contact" && (
        <div className="space-y-6">
          {/* Banner Header Đầu Trang */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
            <div className="border-b border-stone-100 pb-4">
              <h3 className="text-base font-black text-slate-900 font-display flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-600" />
                Banner Đầu Trang Liên Hệ (Page Header)
              </h3>
            </div>

            {renderImageUploader(
              "Ảnh Nền Banner Đầu Trang Liên Hệ",
              formData.contactPage?.header?.bgImageUrl || "",
              (url) =>
                setFormData({
                  ...formData,
                  contactPage: {
                    ...formData.contactPage,
                    header: { ...formData.contactPage.header, bgImageUrl: url },
                  },
                }),
              "Khuyến nghị ảnh công trường hoặc trụ sở văn phòng hiện đại (1600x600)."
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                  Tiêu Đề Banner
                </label>
                <input
                  type="text"
                  value={formData.contactPage?.header?.title || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      contactPage: {
                        ...formData.contactPage,
                        header: { ...formData.contactPage.header, title: e.target.value },
                      },
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                  Phụ Đề Banner
                </label>
                <input
                  type="text"
                  value={formData.contactPage?.header?.subtitle || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      contactPage: {
                        ...formData.contactPage,
                        header: { ...formData.contactPage.header, subtitle: e.target.value },
                      },
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs text-slate-800"
                />
              </div>
            </div>
          </div>

          {/* Khung giờ mở cửa & Cam kết SLA */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
            <div className="border-b border-stone-100 pb-4">
              <h3 className="text-base font-black text-slate-900 font-display flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-600" />
                Khung Giờ Mở Cửa & Cam Kết Tiếp Nhận (SLA)
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                  Giờ Làm Việc Thứ Hai - Thứ Bảy
                </label>
                <input
                  type="text"
                  value={formData.contactPage?.opening?.weekdayHours || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      contactPage: {
                        ...formData.contactPage,
                        opening: {
                          ...formData.contactPage.opening,
                          weekdayHours: e.target.value,
                        },
                      },
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                  Chủ Nhật & Hotline 24/7
                </label>
                <input
                  type="text"
                  value={formData.contactPage?.opening?.sundayHours || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      contactPage: {
                        ...formData.contactPage,
                        opening: {
                          ...formData.contactPage.opening,
                          sundayHours: e.target.value,
                        },
                      },
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                  Cam Kết Tốc Độ Phản Hồi (SLA)
                </label>
                <input
                  type="text"
                  value={formData.contactPage?.opening?.slaText || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      contactPage: {
                        ...formData.contactPage,
                        opening: {
                          ...formData.contactPage.opening,
                          slaText: e.target.value,
                        },
                      },
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs text-slate-800"
                />
              </div>
            </div>
          </div>

          {/* Bản đồ Google Maps & Chi nhánh */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
            <div className="border-b border-stone-100 pb-4">
              <h3 className="text-base font-black text-slate-900 font-display flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-600" />
                Bản Đồ Google Map & Hệ Thống Văn Phòng Trụ Sở
              </h3>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                Đường Dẫn Bản Đồ Google Map Embed (Link nhúng Iframe)
              </label>
              <input
                type="text"
                value={formData.contact?.mapEmbedUrl || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    contact: { ...formData.contact, mapEmbedUrl: e.target.value },
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs text-slate-800"
                placeholder="https://maps.google.com/maps?q=...&output=embed"
              />
            </div>

            {/* Xem trước bản đồ */}
            {formData.contact?.mapEmbedUrl && (
              <div className="rounded-2xl overflow-hidden border border-stone-200 h-64 bg-stone-100">
                <iframe
                  src={formData.contact.mapEmbedUrl}
                  className="w-full h-full border-0"
                  loading="lazy"
                  title="Google Map Preview"
                />
              </div>
            )}

            {/* Danh sách 3 chi nhánh */}
            <div className="pt-4 border-t border-stone-100 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                  Danh Sách Trụ Sở & Chi Nhánh
                </h4>
                <button
                  type="button"
                  onClick={() => {
                    const newOffices = [
                      ...(formData.contact.offices || []),
                      {
                        city: "Chi Nhánh Mới",
                        address: "Địa chỉ chi nhánh...",
                        phone: "0900 000 000",
                        email: "chinhanh@matgreen.vn",
                      },
                    ];
                    setFormData({
                      ...formData,
                      contact: { ...formData.contact, offices: newOffices },
                    });
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold hover:bg-emerald-100"
                >
                  <Plus className="w-3.5 h-3.5" /> Thêm Chi Nhánh
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {formData.contact?.offices?.map((of, idx) => (
                  <div key={idx} className="p-4 rounded-2xl border border-stone-200 bg-stone-50 space-y-2 relative">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800">Văn phòng #{idx + 1}</span>
                      <button
                        type="button"
                        onClick={() => {
                          const newOffices = formData.contact.offices.filter((_, i) => i !== idx);
                          setFormData({
                            ...formData,
                            contact: { ...formData.contact, offices: newOffices },
                          });
                        }}
                        className="text-stone-400 hover:text-rose-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-0.5">Tên Chi Nhánh</label>
                      <input
                        type="text"
                        value={of.city}
                        onChange={(e) => {
                          const newOffices = [...formData.contact.offices];
                          newOffices[idx].city = e.target.value;
                          setFormData({
                            ...formData,
                            contact: { ...formData.contact, offices: newOffices },
                          });
                        }}
                        className="w-full px-3 py-1.5 rounded-lg border border-stone-200 text-xs bg-white font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-0.5">Địa Chỉ</label>
                      <input
                        type="text"
                        value={of.address}
                        onChange={(e) => {
                          const newOffices = [...formData.contact.offices];
                          newOffices[idx].address = e.target.value;
                          setFormData({
                            ...formData,
                            contact: { ...formData.contact, offices: newOffices },
                          });
                        }}
                        className="w-full px-3 py-1.5 rounded-lg border border-stone-200 text-xs bg-white"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-0.5">Hotline</label>
                        <input
                          type="text"
                          value={of.phone}
                          onChange={(e) => {
                            const newOffices = [...formData.contact.offices];
                            newOffices[idx].phone = e.target.value;
                            setFormData({
                              ...formData,
                              contact: { ...formData.contact, offices: newOffices },
                            });
                          }}
                          className="w-full px-2.5 py-1.5 rounded-lg border border-stone-200 text-xs bg-white font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-0.5">Email</label>
                        <input
                          type="text"
                          value={of.email}
                          onChange={(e) => {
                            const newOffices = [...formData.contact.offices];
                            newOffices[idx].email = e.target.value;
                            setFormData({
                              ...formData,
                              contact: { ...formData.contact, offices: newOffices },
                            });
                          }}
                          className="w-full px-2.5 py-1.5 rounded-lg border border-stone-200 text-xs bg-white font-mono"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: CẤU HÌNH TRANG DỊCH VỤ (SERVICES PAGE) */}
      {/* ========================================================================= */}
      {activeTab === "services" && (
        <div className="space-y-6">
          {/* Banner Header Đầu Trang */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
            <div className="border-b border-stone-100 pb-4">
              <h3 className="text-base font-black text-slate-900 font-display flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-emerald-600" />
                Banner Đầu Trang Dịch Vụ (Page Header)
              </h3>
            </div>

            {renderImageUploader(
              "Ảnh Nền Banner Đầu Trang Dịch Vụ",
              formData.servicesPage?.header?.bgImageUrl || "",
              (url) =>
                setFormData({
                  ...formData,
                  servicesPage: {
                    ...formData.servicesPage,
                    header: { ...formData.servicesPage.header, bgImageUrl: url },
                  },
                }),
              "Khuyến nghị ảnh toàn cảnh phân loại vật liệu xây dựng (1920x600)."
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                  Tiêu Đề Banner
                </label>
                <input
                  type="text"
                  value={formData.servicesPage?.header?.title || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      servicesPage: {
                        ...formData.servicesPage,
                        header: { ...formData.servicesPage.header, title: e.target.value },
                      },
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                  Phụ Đề Banner
                </label>
                <input
                  type="text"
                  value={formData.servicesPage?.header?.subtitle || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      servicesPage: {
                        ...formData.servicesPage,
                        header: { ...formData.servicesPage.header, subtitle: e.target.value },
                      },
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs text-slate-800"
                />
              </div>
            </div>
          </div>

          {/* 3 Gói giải pháp vai trò */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
            <div className="border-b border-stone-100 pb-4">
              <h3 className="text-base font-black text-slate-900 font-display flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-600" />
                Các Gói Giải Pháp Cho Từng Đối Tượng (Packages)
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Tùy biến tên gói, mức phí, đối tượng và danh sách quyền lợi tính năng.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {formData.servicesPage?.packages?.items?.map((pkg, idx) => (
                <div key={idx} className="p-5 rounded-2xl border border-stone-200 bg-stone-50 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">Gói #{idx + 1}</span>
                    <label className="inline-flex items-center gap-1.5 text-xs text-emerald-700 font-bold cursor-pointer">
                      <input
                        type="checkbox"
                        checked={pkg.highlight || false}
                        onChange={(e) => {
                          const newItems = [...formData.servicesPage.packages.items];
                          newItems[idx].highlight = e.target.checked;
                          setFormData({
                            ...formData,
                            servicesPage: {
                              ...formData.servicesPage,
                              packages: { items: newItems },
                            },
                          });
                        }}
                        className="rounded text-emerald-600"
                      />
                      <span>Nổi bật nhất</span>
                    </label>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-0.5">Tên Gói</label>
                    <input
                      type="text"
                      value={pkg.name}
                      onChange={(e) => {
                        const newItems = [...formData.servicesPage.packages.items];
                        newItems[idx].name = e.target.value;
                        setFormData({
                          ...formData,
                          servicesPage: {
                            ...formData.servicesPage,
                            packages: { items: newItems },
                          },
                        });
                      }}
                      className="w-full px-3 py-1.5 rounded-lg border border-stone-200 text-xs bg-white font-bold"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-0.5">Mức Giá</label>
                      <input
                        type="text"
                        value={pkg.price}
                        onChange={(e) => {
                          const newItems = [...formData.servicesPage.packages.items];
                          newItems[idx].price = e.target.value;
                          setFormData({
                            ...formData,
                            servicesPage: {
                              ...formData.servicesPage,
                              packages: { items: newItems },
                            },
                          });
                        }}
                        className="w-full px-3 py-1.5 rounded-lg border border-stone-200 text-xs bg-white font-black text-emerald-700"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-0.5">Chu Kỳ Phí</label>
                      <input
                        type="text"
                        value={pkg.period}
                        onChange={(e) => {
                          const newItems = [...formData.servicesPage.packages.items];
                          newItems[idx].period = e.target.value;
                          setFormData({
                            ...formData,
                            servicesPage: {
                              ...formData.servicesPage,
                              packages: { items: newItems },
                            },
                          });
                        }}
                        className="w-full px-3 py-1.5 rounded-lg border border-stone-200 text-xs bg-white text-slate-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-0.5">Đối Tượng Phục Vụ</label>
                    <input
                      type="text"
                      value={pkg.target}
                      onChange={(e) => {
                        const newItems = [...formData.servicesPage.packages.items];
                        newItems[idx].target = e.target.value;
                        setFormData({
                          ...formData,
                          servicesPage: {
                            ...formData.servicesPage,
                            packages: { items: newItems },
                          },
                        });
                      }}
                      className="w-full px-3 py-1.5 rounded-lg border border-stone-200 text-xs bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-0.5">
                      Danh Sách Quyền Lợi (Mỗi dòng 1 quyền lợi)
                    </label>
                    <textarea
                      rows={4}
                      value={pkg.features?.join("\n") || ""}
                      onChange={(e) => {
                        const newItems = [...formData.servicesPage.packages.items];
                        newItems[idx].features = e.target.value.split("\n").filter((l) => l.trim().length > 0);
                        setFormData({
                          ...formData,
                          servicesPage: {
                            ...formData.servicesPage,
                            packages: { items: newItems },
                          },
                        });
                      }}
                      className="w-full px-3 py-1.5 rounded-lg border border-stone-200 text-xs bg-white font-mono"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bộ câu hỏi thường gặp FAQs */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-4">
              <div>
                <h3 className="text-base font-black text-slate-900 font-display flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-emerald-600" />
                  Bộ Câu Hỏi Thường Gặp (FAQs)
                </h3>
              </div>

              <button
                type="button"
                onClick={() => {
                  const newFaqs = [
                    ...(formData.servicesPage?.faqs?.items || []),
                    {
                      q: "Câu hỏi thường gặp mới?",
                      a: "Câu trả lời giải đáp thắc mắc chi tiết...",
                    },
                  ];
                  setFormData({
                    ...formData,
                    servicesPage: {
                      ...formData.servicesPage,
                      faqs: { items: newFaqs },
                    },
                  });
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold hover:bg-emerald-100"
              >
                <Plus className="w-3.5 h-3.5" /> Thêm Câu Hỏi Mới
              </button>
            </div>

            <div className="space-y-4">
              {formData.servicesPage?.faqs?.items?.map((faq, idx) => (
                <div key={idx} className="p-4 rounded-2xl border border-stone-200 bg-stone-50 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">Câu hỏi #{idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => {
                        const newFaqs = formData.servicesPage.faqs.items.filter((_, i) => i !== idx);
                        setFormData({
                          ...formData,
                          servicesPage: {
                            ...formData.servicesPage,
                            faqs: { items: newFaqs },
                          },
                        });
                      }}
                      className="text-stone-400 hover:text-rose-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <input
                    type="text"
                    value={faq.q}
                    onChange={(e) => {
                      const newFaqs = [...formData.servicesPage.faqs.items];
                      newFaqs[idx].q = e.target.value;
                      setFormData({
                        ...formData,
                        servicesPage: {
                          ...formData.servicesPage,
                          faqs: { items: newFaqs },
                        },
                      });
                    }}
                    className="w-full px-3 py-1.5 rounded-lg border border-stone-200 text-xs bg-white font-bold"
                    placeholder="Câu hỏi..."
                  />

                  <textarea
                    rows={2}
                    value={faq.a}
                    onChange={(e) => {
                      const newFaqs = [...formData.servicesPage.faqs.items];
                      newFaqs[idx].a = e.target.value;
                      setFormData({
                        ...formData,
                        servicesPage: {
                          ...formData.servicesPage,
                          faqs: { items: newFaqs },
                        },
                      });
                    }}
                    className="w-full px-3 py-1.5 rounded-lg border border-stone-200 text-xs bg-white text-slate-600"
                    placeholder="Câu trả lời..."
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 6: CẤU HÌNH TRANG TIN TỨC (NEWS PAGE) */}
      {/* ========================================================================= */}
      {activeTab === "news" && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-4">
              <div>
                <h2 className="text-lg font-black text-slate-900 font-display flex items-center gap-2">
                  <Newspaper className="w-5 h-5 text-emerald-600" />
                  Banner Đầu Trang Tin Tức & Cẩm Nang (/news)
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Tùy chỉnh hình ảnh nền lớn đầu trang, tiêu đề và phần mô tả giới thiệu của trang danh sách tin tức và chi tiết bài viết.
                </p>
              </div>

              <a
                href="/admin/news"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shrink-0 shadow-md shadow-emerald-600/20 transition-all"
              >
                <Settings className="w-3.5 h-3.5" /> Quản Trị Bài Viết Tin Tức
              </a>
            </div>

            {renderImageUploader(
              "Ảnh Nền Banner Trang Tin Tức (Header Background Image)",
              formData.newsPage?.header?.bgImageUrl || "/assets/images/backgrounds/page-header-bg-1-1.jpg",
              (url) =>
                setFormData({
                  ...formData,
                  newsPage: {
                    ...formData.newsPage,
                    header: {
                      ...(formData.newsPage?.header || DEFAULT_SITE_CONFIG.newsPage.header),
                      bgImageUrl: url,
                    },
                  },
                }),
              "news-banner-bg",
              "Khuyên dùng ảnh phong cảnh công trình sắc nét độ phân giải 1920x600px"
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                  Tiêu Đề Banner Trang Tin Tức
                </label>
                <input
                  type="text"
                  value={formData.newsPage?.header?.title || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      newsPage: {
                        ...formData.newsPage,
                        header: {
                          ...(formData.newsPage?.header || DEFAULT_SITE_CONFIG.newsPage.header),
                          title: e.target.value,
                        },
                      },
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                  Đoạn Mô Tả Ngắn Dưới Tiêu Đề
                </label>
                <textarea
                  rows={2}
                  value={formData.newsPage?.header?.subtitle || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      newsPage: {
                        ...formData.newsPage,
                        header: {
                          ...(formData.newsPage?.header || DEFAULT_SITE_CONFIG.newsPage.header),
                          subtitle: e.target.value,
                        },
                      },
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Nút lưu cố định dưới chân trang */}
      <div className="pt-4 flex items-center justify-end gap-3 border-t border-stone-200">
        <button
          type="button"
          onClick={handleResetDefaults}
          className="px-4 py-2.5 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-slate-700 text-xs font-bold cursor-pointer transition-colors"
        >
          Khôi Phục Mặc Định
        </button>

        <button
          type="button"
          onClick={handleSaveConfig}
          disabled={isSaving}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-lg shadow-emerald-600/20 active:scale-95 cursor-pointer transition-all disabled:opacity-50"
        >
          {isSaving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          <span>{isSaving ? "Đang Lưu Cấu Hình..." : "Lưu Thay Đổi Cấu Hình Website"}</span>
        </button>
      </div>
    </div>
  );
};

export default AdminSettingsPage;
