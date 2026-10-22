import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Newspaper,
  Calendar,
  Clock,
  ArrowRight,
  Search,
  Filter,
  Eye,
  Tag,
  PlusCircle,
  Settings,
} from "lucide-react";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { useNewsStore } from "@/stores/news.store";
import { useAuthStore } from "@/stores/auth.store";

export const NewsPage: React.FC = () => {
  const { user } = useAuthStore();
  const { articles } = useNewsStore();
  const [selectedCategory, setSelectedCategory] = useState<string>("Tất cả");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const categories = [
    "Tất cả",
    "Kinh Tế Tuần Hoàn",
    "Kinh Nghiệm Tháo Dỡ",
    "Vật Liệu Xanh",
    "Hướng Dẫn & Mẹo",
  ];

  const filteredNews = articles.filter((article) => {
    const matchesCategory =
      selectedCategory === "Tất cả" || article.category === selectedCategory;
    const matchesSearch =
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      <LandingHeader />

      {/* Hero Header */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950 text-white py-16 px-4 sm:px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-3">
            <Newspaper className="w-3.5 h-3.5" />
            Cẩm Nang & Xu Hướng
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-3">
            Tin Tức & Kinh Nghiệm Tái Sinh Vật Liệu
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Nơi chia sẻ kiến thức thực tế về tháo dỡ công trình, kỹ thuật thu hồi vật tư nguyên vẹn và các giải pháp xây dựng bền vững vì môi trường.
          </p>

          <div className="mt-6">
            <Link
              to="/admin/news"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-md transition-colors"
            >
              <Settings className="w-4 h-4" /> Bảng Quản Trị: Thêm / Chỉnh Sửa Bài Viết Tin Tức
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content & Filters */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-12 w-full">
        {/* Search & Category Filter Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10 pb-6 border-b border-slate-200">
          {/* Categories tab */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Tìm kiếm bài viết..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Articles Grid */}
        {filteredNews.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8">
            <Newspaper className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">
              Không tìm thấy bài viết phù hợp
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Vui lòng thử tìm kiếm với từ khóa khác hoặc chọn chuyên mục "Tất cả".
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredNews.map((article) => (
              <article
                key={article.id}
                className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="relative h-56 overflow-hidden bg-slate-100">
                    <img
                      src={article.thumbnail}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-white/95 text-emerald-800 backdrop-blur-xs shadow-xs">
                        {article.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center gap-4 text-xs text-slate-400 mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {article.publishedAt}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {article.readTimeMinutes} phút đọc
                      </span>
                      <span className="flex items-center gap-1 ml-auto">
                        <Eye className="w-3.5 h-3.5" />
                        {article.views}
                      </span>
                    </div>

                    <h2 className="text-base sm:text-lg font-black text-slate-900 group-hover:text-emerald-600 transition-colors line-clamp-2 leading-snug mb-2.5">
                      <Link to={`/news/${article.slug}`}>{article.title}</Link>
                    </h2>

                    <p className="text-xs sm:text-sm text-slate-500 line-clamp-3 leading-relaxed">
                      {article.excerpt}
                    </p>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-2 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img
                      src={article.author.avatar}
                      alt={article.author.name}
                      className="w-7 h-7 rounded-full object-cover"
                    />
                    <span className="text-xs font-semibold text-slate-700">
                      {article.author.name}
                    </span>
                  </div>

                  <Link
                    to={`/news/${article.slug}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 group-hover:text-emerald-800"
                  >
                    Đọc tiếp
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      <LandingFooter />
    </div>
  );
};
