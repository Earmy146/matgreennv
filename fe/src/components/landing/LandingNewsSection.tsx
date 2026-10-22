import React from "react";
import { Link } from "react-router-dom";
import { Newspaper, Calendar, Clock, ArrowRight, User } from "lucide-react";
import { useNewsStore } from "@/stores/news.store";

export const LandingNewsSection: React.FC = () => {
  const { articles } = useNewsStore();
  // Lấy 3 bài viết mới nhất
  const featuredNews = articles.slice(0, 3);

  return (
    <section id="news" className="py-20 lg:py-28 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-3">
              <Newspaper className="w-3.5 h-3.5 text-emerald-600" />
              Góc Kiến Thức & Xu Hướng
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Tin Tức & Cẩm Nang Xây Dựng Xanh
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-2">
              Cập nhật kinh nghiệm tháo dỡ công trình, xu hướng kinh tế tuần hoàn và mẹo tận dụng vật tư cũ hiệu quả.
            </p>
          </div>

          <Link
            to="/news"
            className="mt-4 md:mt-0 inline-flex items-center gap-2 text-sm font-bold text-emerald-700 hover:text-emerald-800 transition-colors group"
          >
            Xem tất cả bài viết
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredNews.map((article) => (
            <article
              key={article.id}
              className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Thumbnail */}
                <div className="relative h-52 overflow-hidden bg-slate-100">
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

                {/* Article Info */}
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
                  </div>

                  <h3 className="text-base sm:text-lg font-black text-slate-900 group-hover:text-emerald-600 transition-colors line-clamp-2 leading-snug mb-2.5">
                    <Link to={`/news/${article.slug}`}>{article.title}</Link>
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-500 line-clamp-3 leading-relaxed">
                    {article.excerpt}
                  </p>
                </div>
              </div>

              {/* Author and Action */}
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
      </div>
    </section>
  );
};
