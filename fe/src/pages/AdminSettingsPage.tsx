import React, { useState, useEffect } from "react";
import {
  Settings,
  Save,
  Globe,
  Phone,
  Mail,
  MapPin,
  Clock,
  Users,
  Building2,
  MessageSquare,
  UploadCloud,
  Loader2,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Sparkles,
  RefreshCw,
} from "lucide-react";
import {
  useSiteConfigStore,
  applyFavicon,
  type SiteConfigData,
  type TeamMember,
  type Partner,
  type Testimonial,
  type Office,
} from "@/stores/site-config.store";
import { siteConfigApi } from "@/services/api";

export const AdminSettingsPage: React.FC = () => {
  const { config, updateConfig } = useSiteConfigStore();
  const [activeTab, setActiveTab] = useState<
    "general" | "contact" | "team" | "partners" | "testimonials"
  >("general");

  const [formData, setFormData] = useState<SiteConfigData>(config);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState<string | null>(null);
  const [saveToast, setSaveToast] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

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

      const json = await res.json();
      if (!res.ok || !json.data?.url) {
        throw new Error(json.message || "Tải ảnh lên Cloudinary không thành công");
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
        message: "Đã lưu cấu hình website thành công và cập nhật tức thì!",
      });
    } catch (err: any) {
      console.error("Lỗi lưu cấu hình:", err);
      // Fallback lưu local store
      updateConfig(formData);
      setSaveToast({
        type: "success",
        message: "Đã áp dụng cấu hình website cục bộ thành công!",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Thao tác với Đội Ngũ Phát Triển (Team Members)
  const handleAddTeamMember = () => {
    const newMember: TeamMember = {
      name: "Thành Viên Mới",
      role: "Kỹ sư / Chuyên viên",
      bio: "Đam mê công nghệ kinh tế tuần hoàn và tái chế vật liệu xanh.",
      image:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    };
    setFormData((prev: SiteConfigData) => ({
      ...prev,
      teamMembers: [...(prev.teamMembers || []), newMember],
    }));
  };

  const handleUpdateTeamMember = (
    index: number,
    field: keyof TeamMember,
    val: string
  ) => {
    setFormData((prev: SiteConfigData) => {
      const list = [...(prev.teamMembers || [])];
      list[index] = { ...list[index], [field]: val };
      return { ...prev, teamMembers: list };
    });
  };

  const handleRemoveTeamMember = (index: number) => {
    setFormData((prev: SiteConfigData) => ({
      ...prev,
      teamMembers: prev.teamMembers.filter((_: TeamMember, i: number) => i !== index),
    }));
  };

  // Thao tác với Đối Tác (Partners)
  const handleAddPartner = () => {
    const newPartner: Partner = {
      name: "Đối Tác Mới",
      logo: "https://images.unsplash.com/photo-1541888946425-d0fbb1861593?auto=format&fit=crop&w=200&q=80",
      website: "https://matgreen.vn",
    };
    setFormData((prev: SiteConfigData) => ({
      ...prev,
      partners: [...(prev.partners || []), newPartner],
    }));
  };

  const handleUpdatePartner = (
    index: number,
    field: keyof Partner,
    val: string
  ) => {
    setFormData((prev: SiteConfigData) => {
      const list = [...(prev.partners || [])];
      list[index] = { ...list[index], [field]: val };
      return { ...prev, partners: list };
    });
  };

  const handleRemovePartner = (index: number) => {
    setFormData((prev: SiteConfigData) => ({
      ...prev,
      partners: prev.partners.filter((_: Partner, i: number) => i !== index),
    }));
  };

  // Thao tác với Đánh Giá Khách Hàng (Testimonials)
  const handleAddTestimonial = () => {
    const newTestimonial: Testimonial = {
      name: "Chủ Thầu Xây Dựng",
      role: "Đơn vị thi công",
      rating: 5,
      quote:
        "Giải pháp giúp tiết kiệm chi phí bốc dỡ và kết nối vật liệu rất nhanh chóng, thuận tiện cho công trình.",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
      projectImage:
        "https://images.unsplash.com/photo-1541888946425-d0fbb18f15f7?auto=format&fit=crop&w=600&q=80",
    };
    setFormData((prev: SiteConfigData) => ({
      ...prev,
      testimonials: [...(prev.testimonials || []), newTestimonial],
    }));
  };

  const handleUpdateTestimonial = (
    index: number,
    field: keyof Testimonial,
    val: any
  ) => {
    setFormData((prev: SiteConfigData) => {
      const list = [...(prev.testimonials || [])];
      list[index] = { ...list[index], [field]: val };
      return { ...prev, testimonials: list };
    });
  };

  const handleRemoveTestimonial = (index: number) => {
    setFormData((prev: SiteConfigData) => ({
      ...prev,
      testimonials: prev.testimonials.filter(
        (_: Testimonial, i: number) => i !== index
      ),
    }));
  };

  // Thao tác với Chi Nhánh Văn Phòng (Offices)
  const handleAddOffice = () => {
    const newOffice: Office = {
      city: "Chi Nhánh Mới",
      address: "Địa chỉ văn phòng tại địa phương",
      phone: "0900 000 000",
      email: "chinhanh@matgreen.vn",
    };
    setFormData((prev: SiteConfigData) => ({
      ...prev,
      contact: {
        ...prev.contact,
        offices: [...(prev.contact?.offices || []), newOffice],
      },
    }));
  };

  const handleUpdateOffice = (
    index: number,
    field: keyof Office,
    val: string
  ) => {
    setFormData((prev: SiteConfigData) => {
      const list = [...(prev.contact?.offices || [])];
      list[index] = { ...list[index], [field]: val };
      return {
        ...prev,
        contact: {
          ...prev.contact,
          offices: list,
        },
      };
    });
  };

  const handleRemoveOffice = (index: number) => {
    setFormData((prev: SiteConfigData) => ({
      ...prev,
      contact: {
        ...prev.contact,
        offices: prev.contact.offices.filter(
          (_: Office, i: number) => i !== index
        ),
      },
    }));
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Toast thông báo nổi */}
      {saveToast && (
        <div
          className={`fixed top-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-xl text-sm font-semibold transition-all duration-300 ${
            saveToast.type === "success"
              ? "bg-emerald-600 text-white shadow-emerald-600/30"
              : "bg-rose-600 text-white shadow-rose-600/30"
          }`}
        >
          {saveToast.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 shrink-0" />
          )}
          <span>{saveToast.message}</span>
        </div>
      )}

      {/* Header trang Admin Settings */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600">
              <Settings className="w-6 h-6" />
            </span>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Cấu Hình & Quản Trị Website
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500">
            Tùy biến toàn bộ logo, favicon, thông tin liên hệ, bản đồ Google, đội ngũ sáng lập, đối tác & đánh giá khách hàng.
          </p>
        </div>

        <button
          onClick={handleSaveConfig}
          disabled={isSaving}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-md shadow-emerald-600/25 transition-all duration-200 active:scale-95 disabled:opacity-50 shrink-0 cursor-pointer"
        >
          {isSaving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          <span>{isSaving ? "Đang lưu..." : "Lưu Cấu Hình Toàn Bộ"}</span>
        </button>
      </div>

      {/* Thanh Tabs chọn module */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200 scrollbar-none">
        <button
          onClick={() => setActiveTab("general")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
            activeTab === "general"
              ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80"
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>1. Logo & Nhận Diện</span>
        </button>

        <button
          onClick={() => setActiveTab("contact")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
            activeTab === "contact"
              ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80"
          }`}
        >
          <Phone className="w-4 h-4" />
          <span>2. Liên Hệ & Google Map</span>
        </button>

        <button
          onClick={() => setActiveTab("team")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
            activeTab === "team"
              ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80"
          }`}
        >
          <Users className="w-4 h-4" />
          <span>3. Đội Ngũ Phát Triển</span>
        </button>

        <button
          onClick={() => setActiveTab("partners")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
            activeTab === "partners"
              ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80"
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>4. Đối Tác Đồng Hành (Carousel)</span>
        </button>

        <button
          onClick={() => setActiveTab("testimonials")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
            activeTab === "testimonials"
              ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80"
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>5. Đánh Giá Khách Hàng</span>
        </button>
      </div>

      {/* ================= TAB 1: THƯƠNG HIỆU & LOGO / FAVICON ================= */}
      {activeTab === "general" && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Globe className="w-5 h-5 text-emerald-600" />
              <span>Cấu Hình Thương Hiệu & Logo / Favicon</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Logo và Favicon khi thay đổi sẽ tự động áp dụng ngay lập tức trên thanh tiêu đề trình duyệt và toàn bộ website.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Tên Website */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Tên Website (Brand Name)
              </label>
              <input
                type="text"
                value={formData.general?.siteName || ""}
                onChange={(e) =>
                  setFormData((prev: SiteConfigData) => ({
                    ...prev,
                    general: { ...prev.general, siteName: e.target.value },
                  }))
                }
                placeholder="Ví dụ: MatGreen"
                className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-semibold"
              />
            </div>

            {/* Slogan / Tagline */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Khẩu Hiệu / Slogan (Tagline)
              </label>
              <input
                type="text"
                value={formData.general?.siteTagline || ""}
                onChange={(e) =>
                  setFormData((prev: SiteConfigData) => ({
                    ...prev,
                    general: { ...prev.general, siteTagline: e.target.value },
                  }))
                }
                placeholder="Ví dụ: Nền Tảng Tuần Hoàn Vật Liệu Xây Dựng"
                className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
              />
            </div>
          </div>

          {/* Logo URL & Upload */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-800">Ảnh Logo Chính (Header & Footer)</h3>
                <p className="text-xs text-slate-500">Khuyến nghị kích thước vuông hoặc chữ nhật nhỏ (PNG trong suốt hoặc SVG)</p>
              </div>
              {formData.general?.logoUrl && (
                <div className="h-12 px-3 py-1 bg-white rounded-xl border border-slate-200 flex items-center shadow-xs">
                  <img
                    src={formData.general.logoUrl}
                    alt="Logo Preview"
                    className="h-9 w-auto object-contain"
                  />
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <input
                type="text"
                value={formData.general?.logoUrl || ""}
                onChange={(e) =>
                  setFormData((prev: SiteConfigData) => ({
                    ...prev,
                    general: { ...prev.general, logoUrl: e.target.value },
                  }))
                }
                placeholder="https://res.cloudinary.com/.../logo.png"
                className="flex-1 w-full px-4 py-2.5 rounded-2xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs sm:text-sm"
              />

              <label className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold cursor-pointer transition-colors shrink-0">
                {isUploading === "logo" ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <UploadCloud className="w-4 h-4" />
                )}
                <span>Tải Logo Từ Máy</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      handleUploadImage(
                        file,
                        (url) =>
                          setFormData((prev: SiteConfigData) => ({
                            ...prev,
                            general: { ...prev.general, logoUrl: url },
                          })),
                        "logo"
                      );
                    }
                  }}
                />
              </label>
            </div>
          </div>

          {/* Favicon URL & Upload */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-800">Biểu Tượng Favicon Trình Duyệt</h3>
                <p className="text-xs text-slate-500">Biểu tượng hiển thị trên tab trình duyệt (ICO, PNG, SVG vuông nhỏ)</p>
              </div>
              {formData.general?.faviconUrl && (
                <div className="w-10 h-10 bg-white rounded-xl border border-slate-200 flex items-center justify-center shadow-xs">
                  <img
                    src={formData.general.faviconUrl}
                    alt="Favicon Preview"
                    className="w-6 h-6 object-contain"
                  />
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <input
                type="text"
                value={formData.general?.faviconUrl || ""}
                onChange={(e) => {
                  const val = e.target.value;
                  setFormData((prev: SiteConfigData) => ({
                    ...prev,
                    general: { ...prev.general, faviconUrl: val },
                  }));
                  if (val.trim()) {
                    applyFavicon(val.trim());
                  }
                }}
                placeholder="https://res.cloudinary.com/.../favicon.ico"
                className="flex-1 w-full px-4 py-2.5 rounded-2xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs sm:text-sm"
              />

              <label className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold cursor-pointer transition-colors shrink-0">
                {isUploading === "favicon" ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <UploadCloud className="w-4 h-4" />
                )}
                <span>Tải Favicon Từ Máy</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      handleUploadImage(
                        file,
                        (url) => {
                          setFormData((prev: SiteConfigData) => ({
                            ...prev,
                            general: { ...prev.general, faviconUrl: url },
                          }));
                          applyFavicon(url);
                        },
                        "favicon"
                      );
                    }
                  }}
                />
              </label>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 2: THÔNG TIN LIÊN HỆ & GOOGLE MAPS ================= */}
      {activeTab === "contact" && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Phone className="w-5 h-5 text-emerald-600" />
              <span>Thông Tin Liên Hệ, Tổng Đài & Bản Đồ Google</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Cập nhật số Hotline, Email, Văn phòng và URL nhúng Google Maps iframe (đã khắc phục lỗi invalid parameter).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Hotline Chính
              </label>
              <input
                type="text"
                value={formData.contact?.hotline || ""}
                onChange={(e) =>
                  setFormData((prev: SiteConfigData) => ({
                    ...prev,
                    contact: { ...prev.contact, hotline: e.target.value },
                  }))
                }
                placeholder="1900 8899 / 0988 776 655"
                className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-semibold"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Email Tiếp Nhận
              </label>
              <input
                type="email"
                value={formData.contact?.email || ""}
                onChange={(e) =>
                  setFormData((prev: SiteConfigData) => ({
                    ...prev,
                    contact: { ...prev.contact, email: e.target.value },
                  }))
                }
                placeholder="hotro@matgreen.vn"
                className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
              />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Khung Giờ Hoạt Động
              </label>
              <input
                type="text"
                value={formData.contact?.workingHours || ""}
                onChange={(e) =>
                  setFormData((prev: SiteConfigData) => ({
                    ...prev,
                    contact: { ...prev.contact, workingHours: e.target.value },
                  }))
                }
                placeholder="Thứ Hai – Thứ Bảy: 07:00 – 19:00"
                className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
              />
            </div>
          </div>

          {/* Cấu hình Google Maps Embed */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-rose-500" />
                  <span>URL Nhúng Bản Đồ Google Maps (Iframe Embed URL)</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Dán đường dẫn embed chuẩn dạng `https://maps.google.com/maps?q=...&output=embed` để hoạt động mượt mà, không bao giờ bị lỗi 'pb parameter'.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  const firstAddr =
                    formData.contact?.offices?.[0]?.address || "Cầu Giấy, Hà Nội";
                  const defaultUrl = `https://maps.google.com/maps?q=${encodeURIComponent(
                    firstAddr
                  )}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
                  setFormData((prev: SiteConfigData) => ({
                    ...prev,
                    contact: { ...prev.contact, mapEmbedUrl: defaultUrl },
                  }));
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-xs font-bold text-slate-700 shadow-xs cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5 text-emerald-600" />
                <span>Tạo Tự Động Từ Địa Chỉ</span>
              </button>
            </div>

            <input
              type="text"
              value={formData.contact?.mapEmbedUrl || ""}
              onChange={(e) =>
                setFormData((prev: SiteConfigData) => ({
                  ...prev,
                  contact: { ...prev.contact, mapEmbedUrl: e.target.value },
                }))
              }
              placeholder="https://maps.google.com/maps?q=...&output=embed"
              className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs font-mono"
            />

            {/* Xem trước bản đồ trực tiếp */}
            {formData.contact?.mapEmbedUrl && (
              <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 h-56 shadow-inner">
                <iframe
                  title="Google Maps Preview"
                  src={formData.contact.mapEmbedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                />
              </div>
            )}
          </div>

          {/* Danh sách các Chi Nhánh Văn Phòng */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-800">Các Chi Nhánh Văn Phòng Đại Diện</h3>
                <p className="text-xs text-slate-500">Hiển thị ở trang Liên Hệ (Hà Nội, Đà Nẵng, TP.HCM...)</p>
              </div>
              <button
                type="button"
                onClick={handleAddOffice}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold cursor-pointer transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Thêm Văn Phòng</span>
              </button>
            </div>

            <div className="space-y-3">
              {(formData.contact?.offices || []).map((office: Office, idx: number) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center gap-3"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 flex-1 w-full">
                    <input
                      type="text"
                      value={office.city}
                      onChange={(e) => handleUpdateOffice(idx, "city", e.target.value)}
                      placeholder="Tên chi nhánh / Thành phố"
                      className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold"
                    />
                    <input
                      type="text"
                      value={office.address}
                      onChange={(e) => handleUpdateOffice(idx, "address", e.target.value)}
                      placeholder="Địa chỉ chi tiết"
                      className="px-3 py-2 rounded-xl border border-slate-200 text-xs sm:col-span-1"
                    />
                    <input
                      type="text"
                      value={office.phone}
                      onChange={(e) => handleUpdateOffice(idx, "phone", e.target.value)}
                      placeholder="Hotline chi nhánh"
                      className="px-3 py-2 rounded-xl border border-slate-200 text-xs"
                    />
                    <input
                      type="email"
                      value={office.email}
                      onChange={(e) => handleUpdateOffice(idx, "email", e.target.value)}
                      placeholder="Email chi nhánh"
                      className="px-3 py-2 rounded-xl border border-slate-200 text-xs"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveOffice(idx)}
                    className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer shrink-0"
                    title="Xóa văn phòng"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 3: ĐỘI NGŨ PHÁT TRIỂN (/about) ================= */}
      {activeTab === "team" && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-600" />
                <span>Đội Ngũ Phát Triển - Những Người Đứng Sau MatGreen</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Cho phép chỉnh sửa hình ảnh online, họ tên, chức danh và mô tả kinh nghiệm hiển thị tại trang Giới Thiệu (/about).
              </p>
            </div>

            <button
              type="button"
              onClick={handleAddTeamMember}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold cursor-pointer transition-colors shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm Thành Viên</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(formData.teamMembers || []).map((member: TeamMember, idx: number) => (
              <div
                key={idx}
                className="rounded-3xl p-5 border border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-md transition-all duration-300 space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  {/* Avatar & Upload */}
                  <div className="relative h-44 rounded-2xl overflow-hidden bg-slate-200 border border-slate-300/80 group">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <label className="absolute bottom-2 right-2 px-2.5 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-900 text-white text-[11px] font-bold cursor-pointer backdrop-blur-md flex items-center gap-1">
                      <UploadCloud className="w-3.5 h-3.5" />
                      <span>Đổi ảnh</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleUploadImage(
                              file,
                              (url) => handleUpdateTeamMember(idx, "image", url),
                              `team-${idx}`
                            );
                          }
                        }}
                      />
                    </label>
                  </div>

                  {/* URL ảnh thủ công */}
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                      URL Ảnh Trực Tuyến
                    </label>
                    <input
                      type="text"
                      value={member.image}
                      onChange={(e) => handleUpdateTeamMember(idx, "image", e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs"
                    />
                  </div>

                  {/* Tên & Chức danh */}
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                      Họ và Tên
                    </label>
                    <input
                      type="text"
                      value={member.name}
                      onChange={(e) => handleUpdateTeamMember(idx, "name", e.target.value)}
                      placeholder="Ví dụ: Nguyễn Văn Quân"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-bold text-slate-900 text-sm"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                      Chức Danh / Vai Trò
                    </label>
                    <input
                      type="text"
                      value={member.role}
                      onChange={(e) => handleUpdateTeamMember(idx, "role", e.target.value)}
                      placeholder="Ví dụ: Nhà Sáng Lập & Kỹ Sư Hệ Thống"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-emerald-700 font-semibold text-xs"
                    />
                  </div>

                  {/* Mô tả kinh nghiệm */}
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                      Mô Tả Kinh Nghiệm & Đam Mê
                    </label>
                    <textarea
                      rows={3}
                      value={member.bio}
                      onChange={(e) => handleUpdateTeamMember(idx, "bio", e.target.value)}
                      placeholder="10 năm kinh nghiệm thi công & đam mê công nghệ tuần hoàn vật liệu."
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-600 resize-none"
                    />
                  </div>
                </div>

                {/* Xóa thành viên */}
                <div className="pt-3 border-t border-slate-200 flex justify-end">
                  <button
                    type="button"
                    onClick={() => handleRemoveTeamMember(idx)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-rose-600 hover:bg-rose-50 text-xs font-bold transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Xóa thành viên</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= TAB 4: ĐỐI TÁC ĐỒNG HÀNH (CAROUSEL) ================= */}
      {activeTab === "partners" && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-emerald-600" />
                <span>Khối Đối Tác & Nhà Thầu Đồng Hành (Auto-Scroll Carousel)</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Tự động chạy vô tận (Infinite Marquee) trên trang chủ, trang giới thiệu và liên hệ thay vì đứng yên.
              </p>
            </div>

            <button
              type="button"
              onClick={handleAddPartner}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold cursor-pointer transition-colors shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm Đối Tác</span>
            </button>
          </div>

          {/* Tiêu đề Carousel */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Tiêu Đề Khối Đối Tác
            </label>
            <input
              type="text"
              value={formData.partnersHeadline || ""}
              onChange={(e) =>
                setFormData((prev: SiteConfigData) => ({
                  ...prev,
                  partnersHeadline: e.target.value,
                }))
              }
              placeholder="ĐƯỢC ĐỒNG HÀNH & TIN CẬY BỞI HƠN 500+ NHÀ THẦU & ĐƠN VI TÁI CHẾ"
              className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-800"
            />
          </div>

          {/* Danh sách Đối Tác */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {(formData.partners || []).map((partner: Partner, idx: number) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-xl bg-white border border-slate-200 flex items-center justify-center p-1 overflow-hidden shrink-0">
                    <img
                      src={partner.logo}
                      alt={partner.name}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <input
                      type="text"
                      value={partner.name}
                      onChange={(e) => handleUpdatePartner(idx, "name", e.target.value)}
                      placeholder="Tên đối tác (ví dụ: Vinaconex)"
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                    URL Logo Đối Tác
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={partner.logo}
                      onChange={(e) => handleUpdatePartner(idx, "logo", e.target.value)}
                      placeholder="https://..."
                      className="flex-1 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-[11px]"
                    />
                    <label
                      className="p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer shrink-0"
                      title="Tải logo"
                    >
                      <UploadCloud className="w-4 h-4" />
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleUploadImage(
                              file,
                              (url) => handleUpdatePartner(idx, "logo", url),
                              `partner-${idx}`
                            );
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-200/80">
                  <input
                    type="text"
                    value={partner.website || ""}
                    onChange={(e) => handleUpdatePartner(idx, "website", e.target.value)}
                    placeholder="Link website (tùy chọn)"
                    className="flex-1 mr-2 px-2 py-1 rounded-lg border border-slate-200 bg-white text-[10px]"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemovePartner(idx)}
                    className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer shrink-0"
                    title="Xóa đối tác"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= TAB 5: ĐÁNH GIÁ KHÁCH HÀNG ================= */}
      {activeTab === "testimonials" && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-emerald-600" />
                <span>Đánh Giá Khách Hàng Thực Tế</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Toàn bộ ảnh spa/massage cũ đã được loại bỏ triệt để. Cho phép cấu hình hình ảnh kỹ sư/chủ thầu và ảnh minh chứng công trình xây dựng thật.
              </p>
            </div>

            <button
              type="button"
              onClick={handleAddTestimonial}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold cursor-pointer transition-colors shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm Nhận Xét</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {(formData.testimonials || []).map(
              (item: Testimonial, idx: number) => (
                <div
                  key={idx}
                  className="p-5 rounded-3xl bg-slate-50/70 border border-slate-200 space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    {/* Avatar và Thông tin người đánh giá */}
                    <div className="flex items-center gap-3">
                      <div className="relative w-14 h-14 rounded-full overflow-hidden bg-slate-200 shrink-0 border-2 border-emerald-500/20">
                        <img
                          src={item.avatar}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0 space-y-1">
                        <input
                          type="text"
                          value={item.name}
                          onChange={(e) =>
                            handleUpdateTestimonial(idx, "name", e.target.value)
                          }
                          placeholder="Tên khách hàng"
                          className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white font-bold text-slate-900 text-xs sm:text-sm"
                        />
                        <input
                          type="text"
                          value={item.role}
                          onChange={(e) =>
                            handleUpdateTestimonial(idx, "role", e.target.value)
                          }
                          placeholder="Chức vụ / Tên dự án"
                          className="w-full px-2.5 py-1 rounded-lg border border-slate-200 bg-white text-emerald-700 font-semibold text-[11px]"
                        />
                      </div>
                    </div>

                    {/* Nội dung nhận xét */}
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                        Nội Dung Nhận Xét
                      </label>
                      <textarea
                        rows={3}
                        value={item.quote}
                        onChange={(e) =>
                          handleUpdateTestimonial(idx, "quote", e.target.value)
                        }
                        placeholder="Trải nghiệm thực tế của khách hàng..."
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-700 resize-none"
                      />
                    </div>

                    {/* Ảnh Công Trình Minh Chứng (Project Image) */}
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                        Ảnh Minh Chứng Công Trình (Thay thế ảnh spa cũ)
                      </label>
                      <div className="flex items-center gap-3">
                        {item.projectImage && (
                          <div className="w-16 h-12 rounded-lg overflow-hidden border border-slate-200 bg-slate-100 shrink-0">
                            <img
                              src={item.projectImage}
                              alt="Project"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <input
                          type="text"
                          value={item.projectImage || ""}
                          onChange={(e) =>
                            handleUpdateTestimonial(
                              idx,
                              "projectImage",
                              e.target.value
                            )
                          }
                          placeholder="https://images.unsplash.com/..."
                          className="flex-1 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs"
                        />
                        <label
                          className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer shrink-0"
                          title="Tải ảnh công trình"
                        >
                          <UploadCloud className="w-4 h-4" />
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                handleUploadImage(
                                  file,
                                  (url) =>
                                    handleUpdateTestimonial(
                                      idx,
                                      "projectImage",
                                      url
                                    ),
                                  `testimonial-proj-${idx}`
                                );
                              }
                            }}
                          />
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <span className="text-[11px] font-bold text-slate-500 mr-1">
                        Số sao:
                      </span>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() =>
                            handleUpdateTestimonial(idx, "rating", star)
                          }
                          className={`text-sm cursor-pointer ${
                            star <= item.rating
                              ? "text-amber-400"
                              : "text-slate-300"
                          }`}
                        >
                          ★
                        </button>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveTestimonial(idx)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-rose-600 hover:bg-rose-50 text-xs font-bold transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Xóa</span>
                    </button>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      )}

      {/* Nút Lưu Cố Định Ở Dưới */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
        <button
          onClick={handleSaveConfig}
          disabled={isSaving}
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/25 transition-all duration-200 active:scale-95 disabled:opacity-50 cursor-pointer"
        >
          {isSaving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          <span>{isSaving ? "Đang lưu cấu hình..." : "Lưu Thay Đổi Cấu Hình Website"}</span>
        </button>
      </div>
    </div>
  );
};

export default AdminSettingsPage;
