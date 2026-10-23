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
import { NewsGridSkeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";

export const NewsPage: React.FC = () => {
  const { user } = useAuthStore();
  const { articles } = useNewsStore();
  const [selectedCategory, setSelectedCategory] = useState<string>("Tất cả");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isSearching, setIsSearching] = useState<boolean>(false);

  const categories = [
    "Tất cả",
    "Kinh Tế Tuần Hoàn",
    "Kinh Nghiệm Tháo Dỡ",
    "Vật Liệu Xanh",
    "Hướng Dẫn & Mẹo",
  ];

  const handleCategoryChange = (cat: string) => {
    setIsSearching(true);
    setSelectedCategory(cat);
    setTimeout(() => setIsSearching(false), 200);
  };

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    setIsSearching(true);
    setTimeout(() => setIsSearching(false), 200);
  };

  const handleResetFilters = () => {
    setSelectedCategory("Tất cả");
    setSearchQuery("");
  };

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

      {/* Page Header Banner phong cách Solox */}
      <section
        className="relative py-20 lg:py-24 bg-slate-950 text-white bg-cover bg-center overflow-hidden text-center"
        style={{ backgroundImage: "url('/assets/images/backgrounds/page-header-bg-1-1.jpg')" }}
      >
        <div className="absolute inset-0 bg-slate-950/75 backdrop-blur-xs" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <img
            src="/assets/images/shapes/page-header-s-1.png"
            alt="Page header shape"
            className="mx-auto mb-4 h-6 w-auto object-contain brightness-0 invert opacity-80"
          />
          <ul className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400 mb-3">
            <li><Link to="/" className="hover:underline text-slate-300">Trang Chủ</Link></li>
            <li>/</li>
            <li><span>Tin Tức</span></li>
          </ul>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white font-display tracking-tight">
            Tin Tức & Cẩm Nang Tái Sinh Vật Liệu
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm max-w-2xl mx-auto mt-3 leading-relaxed">
            Nơi chia sẻ kiến thức thực tế về tháo dỡ công trình, kỹ thuật thu hồi vật tư nguyên vẹn và các giải pháp xây dựng bền vững vì môi trường.
          </p>
          <div className="mt-5">
            <Link
              to="/admin/news"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-colors"
            >
              <Settings className="w-4 h-4" /> Bảng Quản Trị: Thêm & Chỉnh Sửa Bài Viết
            </Link>
          </div>
        </div>
      </section>

      {/* Main Content & Filters */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-12 w-full">
        {/* Search & Category Filter Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10 pb-6 border-b border-slate-200">
          {/* Categories tab */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
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
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Articles Grid / Skeleton / Empty State */}
        {isSearching ? (
          <NewsGridSkeleton count={6} />
        ) : filteredNews.length === 0 ? (
          <EmptyState
            icon={<Newspaper className="w-8 h-8 text-emerald-600 stroke-[1.75]" />}
            title="Không tìm thấy bài viết phù hợp"
            description="Không có cẩm nang hay bài viết nào khớp với chuyên mục hoặc từ khóa bạn vừa nhập. Hãy thử xóa bộ lọc hoặc tìm kiếm từ khóa ngắn gọn hơn."
            actionText="Xem tất cả bài viết"
            onAction={handleResetFilters}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fadeIn">
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
