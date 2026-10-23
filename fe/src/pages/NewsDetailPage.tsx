import React, { useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Calendar,
  Clock,
  Eye,
  ArrowLeft,
  Share2,
  Tag,
  Building2,
  Compass,
  ArrowRight,
  User,
} from "lucide-react";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { useNewsStore } from "@/stores/news.store";
import { useSiteConfigStore } from "@/stores/site-config.store";

export const NewsDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { articles, getArticleBySlugOrId, incrementViews } = useNewsStore();
  const { config } = useSiteConfigStore();

  const headerBg =
    config.newsPage?.header?.bgImageUrl || "/assets/images/backgrounds/page-header-bg-1-1.jpg";

  const article = getArticleBySlugOrId(id || "");

  useEffect(() => {
    if (article) {
      incrementViews(article.id);
    }
  }, [article?.id]);

  if (!article) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
        <LandingHeader />
        <main className="flex-1 max-w-4xl mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-black text-slate-800 mb-2">
            Không tìm thấy bài viết
          </h1>
          <p className="text-slate-500 text-sm mb-6">
            Bài viết bạn đang tìm kiếm có thể đã bị xóa hoặc đường dẫn không chính xác.
          </p>
          <Link
            to="/news"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs"
          >
            <ArrowLeft className="w-4 h-4" /> Quay lại danh sách tin tức
          </Link>
        </main>
        <LandingFooter />
      </div>
    );
  }

  // Lấy các bài viết khác làm bài viết liên quan
  const relatedArticles = articles
    .filter((item) => item.id !== article.id)
    .slice(0, 2);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      <LandingHeader />

      {/* Solox Page Header Banner */}
      <section className="relative py-16 lg:py-20 bg-slate-900 text-white overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-25"
          style={{ backgroundImage: `url('${headerBg}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/90 via-slate-900/80 to-slate-900/90" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <span className="text-emerald-400 font-serif italic text-base sm:text-lg tracking-wider">
            {article.category}
          </span>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black mt-2 tracking-tight leading-snug max-w-3xl mx-auto">
            {article.title}
          </h1>
          <div className="flex items-center justify-center gap-2 text-xs text-slate-300 mt-4 font-medium flex-wrap">
            <Link to="/" className="hover:text-emerald-400">Trang chủ</Link>
            <span>/</span>
            <Link to="/news" className="hover:text-emerald-400">Tin tức</Link>
            <span>/</span>
            <span className="text-emerald-400">Chi tiết bài viết</span>
          </div>
        </div>
      </section>

      <main className="flex-1 py-10 lg:py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-sm mb-8">
            <div className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 mb-4">
              {article.category}
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight mb-4">
              {article.title}
            </h1>

            <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-slate-100 text-xs text-slate-500">
              <div className="flex items-center gap-3">
                <img
                  src={article.author.avatar}
                  alt={article.author.name}
                  className="w-10 h-10 rounded-full object-cover border border-emerald-500"
                />
                <div>
                  <strong className="block text-slate-900 text-sm leading-snug">
                    {article.author.name}
                  </strong>
                  <span className="text-[11px] text-slate-400">
                    {article.author.role}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  {article.publishedAt}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  {article.readTimeMinutes} phút đọc
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5 text-slate-400" />
                  {article.views} lượt xem
                </span>
              </div>
            </div>

            {/* Banner Image */}
            <div className="mt-6 rounded-2xl overflow-hidden">
              <img
                src={article.bannerImage || article.thumbnail}
                alt={article.title}
                className="w-full max-h-[460px] object-cover"
              />
            </div>

            {/* Lead Excerpt */}
            <div className="mt-6 p-4 rounded-2xl bg-emerald-50/60 border-l-4 border-emerald-600 text-slate-700 text-sm font-medium leading-relaxed italic">
              {article.excerpt}
            </div>

            {/* Main Content Body */}
            <div className="mt-8 space-y-4 text-slate-700 text-sm sm:text-base leading-relaxed whitespace-pre-line font-normal">
              {article.content}
            </div>

            {/* Tags */}
            <div className="mt-10 pt-6 border-t border-slate-100 flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-slate-500 flex items-center gap-1 mr-2">
                <Tag className="w-3.5 h-3.5" /> Từ khóa:
              </span>
              {article.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-lg bg-slate-100 text-slate-600 text-xs font-medium"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* CTA Box: You have demolition materials? */}
          <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white rounded-3xl p-8 shadow-xl mb-12 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center sm:text-left">
              <h3 className="text-xl font-bold">
                Bạn Có Công Trình Cần Đập Phá Hay Thừa Vật Liệu?
              </h3>
              <p className="text-xs sm:text-sm text-emerald-100 max-w-md">
                Đăng tin ngay lên MatGreen hoàn toàn miễn phí. Hàng trăm nhà thầu và người dân quanh bạn sẽ đến thu gom giúp bạn!
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <Link
                to="/post"
                className="px-5 py-3 rounded-xl bg-white text-emerald-950 font-bold text-xs shadow-md hover:bg-emerald-50 transition-colors"
              >
                Đăng Tin Cho / Bán Ngay
              </Link>
            </div>
          </div>

          {/* Related Articles */}
          {relatedArticles.length > 0 && (
            <div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight mb-6">
                Bài Viết Liên Quan Khác
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {relatedArticles.map((rel) => (
                  <Link
                    key={rel.id}
                    to={`/news/${rel.slug}`}
                    className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex gap-4 group"
                  >
                    <img
                      src={rel.thumbnail}
                      alt={rel.title}
                      className="w-24 h-24 rounded-xl object-cover shrink-0"
                    />
                    <div className="flex flex-col justify-between">
                      <span className="text-[11px] font-bold text-emerald-600">
                        {rel.category}
                      </span>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-emerald-600 line-clamp-2 leading-snug">
                        {rel.title}
                      </h4>
                      <span className="text-[11px] text-slate-400">
                        {rel.publishedAt}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <LandingFooter />
    </div>
  );
};
