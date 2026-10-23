import React from "react";
import { Link } from "react-router-dom";
import { Calendar, ArrowRight, MessageSquare, User, Eye } from "lucide-react";
import { useNewsStore } from "@/stores/news.store";

export const LandingNewsSection: React.FC = () => {
  const { articles } = useNewsStore();
  // Lấy 3 bài viết mới nhất
  const latestArticles = articles.slice(0, 3);

  return (
    <section id="news" className="py-20 lg:py-28 bg-stone-50 relative z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header Solox Style */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <img
            src="/assets/images/shapes/sec-title-s-1.png"
            alt="Decorative"
            className="mx-auto mb-3 h-5 w-auto object-contain"
          />
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 block mb-2 font-sans">
            Cẩm Nang & Xu Hướng
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight font-display">
            Tin Tức & Bài Viết Mới Nhất
          </h2>
          <p className="mt-3 text-sm text-slate-600">
            Cập nhật xu hướng kinh tế tuần hoàn, kinh nghiệm tháo dỡ công trình và giải pháp xử lý phế phẩm xây dựng tối ưu.
          </p>
        </div>

        {/* 3-column Blog Grid matching blog-one in index-3.html */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {latestArticles.map((article) => {
            const dateObj = new Date(article.publishedAt);
            const day = dateObj.getDate().toString().padStart(2, "0");
            const month = `Tháng ${dateObj.getMonth() + 1}`;

            return (
              <article
                key={article.id}
                className="bg-white rounded-3xl overflow-hidden shadow-lg border border-stone-200 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between group"
              >
                {/* Thumbnail with Date Badge */}
                <div className="relative h-60 overflow-hidden bg-slate-200">
                  <img
                    src={article.thumbnail}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Solox Date Badge (blog-card__date) */}
                  <div className="absolute bottom-3 left-3 px-3 py-1.5 rounded-2xl bg-emerald-600 text-white text-center shadow-md">
                    <span className="block text-base font-black leading-none">{day}</span>
                    <span className="block text-[10px] font-bold uppercase tracking-wider leading-none mt-0.5">
                      {month}
                    </span>
                  </div>

                  {/* Category Pill */}
                  <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider">
                    {article.category}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Meta Row: Author & Views */}
                    <div className="flex items-center gap-4 text-xs text-slate-500 mb-3 pb-3 border-b border-stone-100">
                      <div className="flex items-center gap-2">
                        <img
                          src={article.author.avatar || "/assets/images/resources/about-author-1.png"}
                          alt={article.author.name}
                          className="w-6 h-6 rounded-full object-cover"
                        />
                        <span className="font-medium text-slate-700">{article.author.name}</span>
                      </div>
                      <div className="flex items-center gap-1 ml-auto text-slate-400">
                        <Eye className="w-3.5 h-3.5" />
                        <span>{article.views} lượt xem</span>
                      </div>
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight leading-snug line-clamp-2 group-hover:text-emerald-700 transition-colors font-display mb-2">
                      <Link to={`/news/${article.slug}`}>
                        {article.title}
                      </Link>
                    </h3>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed font-normal">
                      {article.excerpt}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-stone-100">
                    <Link
                      to={`/news/${article.slug}`}
                      className="inline-flex items-center text-xs font-bold text-emerald-700 hover:text-emerald-800 transition-colors group/link"
                    >
                      <span>Đọc bài viết chi tiết</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-1.5 group-hover/link:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link
            to="/news"
            className="solox-btn solox-btn--outline"
          >
            <span>Xem Tất Cả Bài Viết Trong Cẩm Nang</span>
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default LandingNewsSection;
