import React, { useState } from "react";
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
} from "lucide-react";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { useNewsStore } from "@/stores/news.store";
import type { NewsArticle } from "@/types/news.types";

export const AdminNewsPage: React.FC = () => {
  const { articles, addArticle, updateArticle, deleteArticle } = useNewsStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<NewsArticle | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [successToast, setSuccessToast] = useState<string | null>(null);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

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
        thumbnail: formData.thumbnail,
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
        thumbnail: formData.thumbnail,
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
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      <LandingHeader />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-10 w-full">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
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
              Dành cho Quản trị viên (Admin) tạo bài viết mới, chỉnh sửa nội dung và quản lý bài đăng.
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
      </main>

      {/* Modal Tạo/Sửa Bài Viết */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative animate-fadeIn">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-black text-slate-900 mb-1">
              {editingArticle ? "Chỉnh Sửa Bài Viết" : "Tạo Bài Viết Mới"}
            </h2>
            <p className="text-xs text-slate-500 mb-6">
              Điền đầy đủ thông tin để bài viết được hiển thị lên trang tin tức và trang chủ.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Link ảnh đại diện (Thumbnail) *
                  </label>
                  <input
                    type="url"
                    required
                    placeholder="https://images.unsplash.com/..."
                    value={formData.thumbnail}
                    onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
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
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Nội dung bài viết chi tiết *
                </label>
                <textarea
                  rows={6}
                  required
                  placeholder="Nhập nội dung bài viết, các tiêu đề phân mục..."
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-y font-normal"
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

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md cursor-pointer active:scale-98"
                >
                  <Save className="w-4 h-4" />
                  {editingArticle ? "Lưu Thay Đổi" : "Đăng Bài Viết"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <LandingFooter />
    </div>
  );
};
