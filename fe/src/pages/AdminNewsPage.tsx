import React, { useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import {
  Newspaper,
  PlusCircle,
  Edit3,
  Trash2,
  Eye,
  ArrowLeft,
  CheckCircle2,
  X,
  Save,
  Search,
  UploadCloud,
  Loader2,
  Image as ImageIcon,
} from "lucide-react";
import { useNewsStore } from "@/stores/news.store";
import type { NewsArticle } from "@/types/news.types";
import { RichTextEditor } from "@/components/common/RichTextEditor";

const SUGGESTED_NEWS_IMAGES = [
  {
    name: "Vật liệu tái chế",
    url: "https://res.cloudinary.com/dwcuijzvd/image/upload/v1792728276/finance-lite/news/mat-mvkg4ktp-2a6bf9a482b9.png",
  },
  {
    name: "Tháo dỡ an toàn",
    url: "https://res.cloudinary.com/dwcuijzvd/image/upload/v1792728277/finance-lite/news/mat-mvkg4mfc-f1d945df1299.png",
  },
  {
    name: "Sàn 0 đồng",
    url: "https://res.cloudinary.com/dwcuijzvd/image/upload/v1792728277/finance-lite/news/mat-mvkg4mzi-a456fb843bf6.png",
  },
  {
    name: "Kiểm định xà bần",
    url: "https://res.cloudinary.com/dwcuijzvd/image/upload/v1792728278/finance-lite/news/mat-mvkg4np8-15f79c916a37.png",
  },
  {
    name: "Cộng đồng xanh",
    url: "https://res.cloudinary.com/dwcuijzvd/image/upload/v1792728279/finance-lite/news/mat-mvkg4oaw-7442d2ab7bd2.png",
  },
  {
    name: "Vận chuyển GPS",
    url: "https://res.cloudinary.com/dwcuijzvd/image/upload/v1792728280/finance-lite/news/mat-mvkg4oyb-fa68d429e6da.png",
  },
];

export const AdminNewsPage: React.FC = () => {
  const { articles, addArticle, updateArticle, deleteArticle } = useNewsStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<NewsArticle | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [uploadingTarget, setUploadingTarget] = useState<"thumbnail" | "banner" | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    category: "Kinh Tế Tuần Hoàn" as NewsArticle["category"],
    authorName: "Ban Biên Tập MatGreen",
    authorRole: "Chuyên Gia Vật Liệu Tuần Hoàn",
    authorAvatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    thumbnail:
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&auto=format&fit=crop&q=80",
    bannerImage:
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&auto=format&fit=crop&q=80",
    readTimeMinutes: 5,
    tags: "Kinh tế tuần hoàn, Tháo dỡ, Tái chế",
  });

  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 3000);
  };

  const handleOpenCreateModal = () => {
    setEditingArticle(null);
    setFormData({
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      category: "Kinh Tế Tuần Hoàn",
      authorName: "Ban Biên Tập MatGreen",
      authorRole: "Chuyên Gia Vật Liệu Tuần Hoàn",
      authorAvatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      thumbnail:
        "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&auto=format&fit=crop&q=80",
      bannerImage:
        "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&auto=format&fit=crop&q=80",
      readTimeMinutes: 5,
      tags: "Kinh tế tuần hoàn, Tháo dỡ, Tái chế",
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (article: NewsArticle) => {
    setEditingArticle(article);
    setFormData({
      title: article.title,
      slug: article.slug,
      excerpt: article.excerpt,
      content: article.content,
      category: article.category,
      authorName: article.author.name,
      authorRole: article.author.role,
      authorAvatar: article.author.avatar,
      thumbnail: article.thumbnail,
      bannerImage: article.bannerImage || article.thumbnail,
      readTimeMinutes: article.readTimeMinutes,
      tags: article.tags.join(", "),
    });
    setIsModalOpen(true);
  };

  // Tự sinh slug từ tiêu đề
  const handleTitleChange = (val: string) => {
    setFormData((prev) => {
      const generatedSlug = val
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[đĐ]/g, "d")
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-");

      return {
        ...prev,
        title: val,
        slug: editingArticle ? prev.slug : generatedSlug,
      };
    });
  };

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    target: "thumbnail" | "banner"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Kiểm tra định dạng
    if (!file.type.startsWith("image/")) {
      setUploadError("Vui lòng chọn file hình ảnh hợp lệ (JPG, PNG, WEBP)");
      return;
    }

    setUploadingTarget(target);
    setUploadError(null);

    const body = new FormData();
    body.append("image", file);
    body.append("folder", "news");

    try {
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
            : "Tải ảnh lên máy chủ thất bại");
        throw new Error(message);
      }

      const uploadedUrl = json.data.url;
      if (target === "thumbnail") {
        setFormData((prev) => ({
          ...prev,
          thumbnail: uploadedUrl,
          bannerImage:
            !prev.bannerImage || prev.bannerImage.includes("res.cloudinary.com")
              ? uploadedUrl
              : prev.bannerImage,
        }));
      } else {
        setFormData((prev) => ({ ...prev, bannerImage: uploadedUrl }));
      }
      showToast("Tải ảnh lên máy chủ thành công!");
    } catch (err: any) {
      setUploadError(err.message || "Lỗi tải ảnh");
    } finally {
      setUploadingTarget(null);
      e.target.value = "";
    }
  };

  const handleSelectPreset = (url: string) => {
    setFormData((prev) => ({
      ...prev,
      thumbnail: url,
      bannerImage: url,
    }));
    showToast("Đã chọn ảnh minh họa cho bài viết!");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const thumbnail = formData.thumbnail.trim();
    if (!thumbnail) {
      setUploadError("Vui lòng tải lên hoặc nhập URL ảnh đại diện.");
      return;
    }
    setUploadError(null);

    const tagsArray = formData.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    if (editingArticle) {
      updateArticle(editingArticle.id, {
        title: formData.title,
        slug: formData.slug,
        excerpt: formData.excerpt,
        content: formData.content,
        category: formData.category,
        author: {
          name: formData.authorName,
          role: formData.authorRole,
          avatar: formData.authorAvatar,
        },
        thumbnail,
        bannerImage: formData.bannerImage,
        readTimeMinutes: Number(formData.readTimeMinutes) || 5,
        tags: tagsArray,
      });
      showToast("Đã cập nhật bài viết thành công!");
    } else {
      addArticle({
        title: formData.title,
        slug: formData.slug || `bai-viet-${Date.now()}`,
        excerpt: formData.excerpt,
        content: formData.content,
        category: formData.category,
        author: {
          name: formData.authorName,
          role: formData.authorRole,
          avatar: formData.authorAvatar,
        },
        thumbnail,
        bannerImage: formData.bannerImage,
        readTimeMinutes: Number(formData.readTimeMinutes) || 5,
        tags: tagsArray,
      });
      showToast("Đã thêm bài viết mới thành công!");
    }

    setIsModalOpen(false);
  };

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa bài viết "${title}"?`)) {
      deleteArticle(id);
      showToast("Đã xóa bài viết khỏi hệ thống!");
    }
  };

  const filteredArticles = articles.filter((a) =>
    a.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 mb-1">
              <Link to="/news" className="hover:text-emerald-600 flex items-center gap-1">
                <ArrowLeft className="w-3.5 h-3.5" /> Tin tức
              </Link>
              <span>/</span>
              <span className="text-emerald-700">Quản trị bài viết</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Quản Lý Nội Dung Tin Tức & Cẩm Nang
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Dành cho Quản trị viên tạo bài viết mới, chỉnh sửa nội dung và quản lý bài đăng.
            </p>
          </div>

          <button
            onClick={handleOpenCreateModal}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 active:scale-98 transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" /> Viết Bài Mới
          </button>
        </div>

        {/* Toast Alert */}
        {successToast && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2.5 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            {successToast}
          </div>
        )}

        {/* Search Bar & Stats */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Tìm kiếm bài viết theo tiêu đề..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="text-xs font-semibold text-slate-500">
            Tổng cộng: <strong className="text-slate-900">{articles.length}</strong> bài viết
          </div>
        </div>

        {/* Articles Table */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 uppercase tracking-wider font-bold">
                <tr>
                  <th className="py-4 px-6">Bài Viết</th>
                  <th className="py-4 px-4">Chuyên Mục</th>
                  <th className="py-4 px-4">Tác Giả</th>
                  <th className="py-4 px-4">Ngày Đăng</th>
                  <th className="py-4 px-4">Lượt Xem</th>
                  <th className="py-4 px-6 text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredArticles.map((article) => (
                  <tr key={article.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3.5">
                        <img
                          src={article.thumbnail}
                          alt={article.title}
                          className="w-14 h-14 rounded-xl object-cover shrink-0 border border-slate-200"
                        />
                        <div>
                          <Link
                            to={`/news/${article.slug}`}
                            className="font-bold text-slate-900 hover:text-emerald-600 line-clamp-1 text-sm transition-colors"
                          >
                            {article.title}
                          </Link>
                          <span className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                            {article.excerpt}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[11px]">
                        {article.category}
                      </span>
                    </td>

                    <td className="py-4 px-4 font-medium text-slate-700">
                      {article.author.name}
                    </td>

                    <td className="py-4 px-4 text-slate-500">
                      {article.publishedAt}
                    </td>

                    <td className="py-4 px-4 font-semibold text-slate-700">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5 text-slate-400" />
                        {article.views}
                      </span>
                    </td>

                    <td className="py-4 px-6 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => handleOpenEditModal(article)}
                          className="p-2 rounded-xl text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 transition-colors cursor-pointer"
                          title="Chỉnh sửa bài viết"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(article.id, article.title)}
                          className="p-2 rounded-xl text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Xóa bài viết"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      {/* Modal Tạo/Sửa Bài Viết */}
      {isModalOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-hidden animate-fadeIn"
            data-lenis-prevent
          >
            <div
              className="bg-white rounded-3xl border border-slate-200 w-full max-w-4xl max-h-[90vh] shadow-2xl relative flex flex-col overflow-hidden"
              data-lenis-prevent
            >
              {/* Header Cố Định */}
              <div className="px-6 py-4 sm:px-8 sm:py-5 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white">
                <div>
                  <h2 className="text-lg sm:text-xl font-black text-slate-900">
                    {editingArticle ? "Chỉnh Sửa Bài Viết" : "Tạo Bài Viết Mới"}
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Điền đầy đủ thông tin để bài viết được hiển thị lên trang tin tức và trang chủ.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form Body Cuộn Độc Lập */}
              <form
                id="admin-news-article-form"
                onSubmit={handleSubmit}
                className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-4 text-xs"
                data-lenis-prevent
              >
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Tiêu đề bài viết *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Nhập tiêu đề hấp dẫn..."
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Đường dẫn tĩnh (Slug) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="duong-dan-bai-viet"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Chuyên mục *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        category: e.target.value as NewsArticle["category"],
                      })
                    }
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  >
                    <option value="Kinh Tế Tuần Hoàn">Kinh Tế Tuần Hoàn</option>
                    <option value="Kinh Nghiệm Tháo Dỡ">Kinh Nghiệm Tháo Dỡ</option>
                    <option value="Vật Liệu Xanh">Vật Liệu Xanh</option>
                    <option value="Hướng Dẫn & Mẹo">Hướng Dẫn & Mẹo</option>
                  </select>
                </div>
              </div>

              {/* Khu vực upload thumbnail lên máy chủ */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block font-bold text-slate-700 uppercase tracking-wider text-[11px]">
                    Ảnh đại diện (Thumbnail) *
                  </label>
                  {uploadingTarget === "thumbnail" && (
                    <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" /> Đang tải lên máy chủ...
                    </span>
                  )}
                </div>

                {uploadError && (
                  <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                    {uploadError}
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-3">
                  {/* Preview Thumbnail */}
                  <div className="w-24 h-24 rounded-2xl border-2 border-dashed border-slate-200 overflow-hidden shrink-0 bg-slate-50 relative group">
                    {formData.thumbnail ? (
                      <img
                        src={formData.thumbnail}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                        <ImageIcon className="w-6 h-6" />
                        <span className="text-[10px] mt-1">Chưa có ảnh</span>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <label className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 font-bold text-xs cursor-pointer transition-colors">
                        <UploadCloud className="w-4 h-4 text-emerald-600" />
                        {uploadingTarget === "thumbnail" ? "Đang tải lên máy chủ..." : "Tải ảnh từ máy tính"}
                        <input
                          type="file"
                          accept="image/*"
                          disabled={uploadingTarget !== null}
                          onChange={(e) => handleFileUpload(e, "thumbnail")}
                          className="hidden"
                        />
                      </label>
                    </div>

                    <input
                      type="text"
                      inputMode="url"
                      required
                      placeholder="Hoặc dán URL ảnh trực tiếp (https://... hoặc /uploads/...)"
                      value={formData.thumbnail}
                      onChange={(e) => {
                        setUploadError(null);
                        setFormData({ ...formData, thumbnail: e.target.value });
                      }}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                {/* Ảnh minh họa gợi ý để chọn nhanh */}
                <div className="pt-2">
                  <span className="block text-[11px] font-bold text-slate-500 mb-1.5">
                    Hoặc chọn ảnh minh họa gợi ý cho bài viết:
                  </span>
                  <div className="grid grid-cols-6 gap-2">
                    {SUGGESTED_NEWS_IMAGES.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSelectPreset(preset.url)}
                        title={preset.name}
                        className={`group relative rounded-xl overflow-hidden border-2 transition-all cursor-pointer aspect-video ${
                          formData.thumbnail === preset.url
                            ? "border-emerald-600 ring-2 ring-emerald-500/30 scale-102"
                            : "border-slate-200 hover:border-emerald-400 opacity-80 hover:opacity-100"
                        }`}
                      >
                        <img
                          src={preset.url}
                          alt={preset.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Ảnh bìa lớn (Banner Header)
                  </label>
                  <div className="flex gap-2">
                    <label className="shrink-0 inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 font-bold text-xs cursor-pointer transition-colors">
                      <UploadCloud className="w-4 h-4 text-emerald-600" />
                      {uploadingTarget === "banner" ? "Đang tải..." : "Tải ảnh"}
                      <input
                        type="file"
                        accept="image/*"
                        disabled={uploadingTarget !== null}
                        onChange={(e) => handleFileUpload(e, "banner")}
                        className="hidden"
                      />
                    </label>
                    <input
                      type="text"
                      inputMode="url"
                      placeholder="https://... hoặc /uploads/..."
                      value={formData.bannerImage}
                      onChange={(e) => setFormData({ ...formData, bannerImage: e.target.value })}
                      className="min-w-0 flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Tên tác giả *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="KS. Nguyễn Văn A"
                    value={formData.authorName}
                    onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Đoạn tóm tắt (Excerpt) *
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="Tóm tắt ngắn gọn 2-3 câu giới thiệu bài viết..."
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                  <span>Nội dung bài viết chi tiết (Bộ công cụ nâng cao) *</span>
                  <span className="text-[11px] font-normal text-slate-400 lowercase">
                    hỗ trợ chèn ảnh, căn lề, cỡ chữ, định dạng phong phú
                  </span>
                </label>
                <RichTextEditor
                  value={formData.content}
                  onChange={(content) => setFormData({ ...formData, content })}
                  placeholder="Nhập nội dung bài viết, tiêu đề phân mục, chèn ảnh minh họa..."
                  minHeight={320}
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Từ khóa (Tags, cách nhau bằng dấu phẩy)
                </label>
                <input
                  type="text"
                  placeholder="Kinh tế tuần hoàn, Tháo dỡ, Xà bần"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              </form>

              {/* Footer Cố Định */}
              <div className="px-6 py-4 sm:px-8 border-t border-slate-100 flex items-center justify-end gap-3 shrink-0 bg-slate-50/90">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 font-bold text-slate-700 hover:bg-white transition-colors cursor-pointer"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  form="admin-news-article-form"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md cursor-pointer active:scale-98 transition-all"
                >
                  <Save className="w-4 h-4" />
                  {editingArticle ? "Lưu Thay Đổi" : "Đăng Bài Viết"}
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};
