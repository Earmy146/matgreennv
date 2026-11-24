import React, { useEffect, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Calendar,
  Clock,
  Eye,
  ArrowLeft,
  Share2,
  Tag,
} from "lucide-react";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { sanitizeHtml } from "@/components/common/SafeHtmlContent";
import { useNewsStore } from "@/stores/news.store";
import { toast } from "@/stores/toast.store";

export const NewsDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { articles, getArticleBySlugOrId, incrementViews } = useNewsStore();

  const article = getArticleBySlugOrId(id || "");

  useEffect(() => {
    if (article) {
      incrementViews(article.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [article?.id]);

  const safeHtml = useMemo(() => {
    if (!article?.content) return "";
    return sanitizeHtml(article.content);
  }, [article?.content]);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Đã sao chép đường dẫn bài viết!");
    } catch {
      toast.info("Hãy sao chép đường dẫn trên thanh địa chỉ trình duyệt.");
    }
  };

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

  const relatedArticles = articles
    .filter((item) => item.id !== article.id)
    .slice(0, 2);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      <LandingHeader />

      {/* Compact Breadcrumb Bar (No duplicate H1) */}
      <div className="bg-white border-b border-slate-200/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-500 min-w-0">
            <Link to="/news" className="inline-flex items-center gap-1 font-bold text-emerald-700 hover:underline shrink-0">
              <ArrowLeft className="w-3.5 h-3.5" /> Cẩm nang
            </Link>
            <span>/</span>
            <span className="truncate text-slate-600 font-medium">{article.category}</span>
          </div>

          <button
            type="button"
            onClick={() => void handleShare()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 font-bold text-slate-700 cursor-pointer shrink-0"
          >
            <Share2 className="w-3.5 h-3.5" /> Chia sẻ
          </button>
        </div>
      </div>

      <main className="flex-1 py-8 lg:py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <article className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-sm mb-8">
            <div className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/70 mb-4">
              {article.category}
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight mb-5">
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
            <div className="mt-6 rounded-2xl overflow-hidden bg-slate-100">
              <img
                src={article.bannerImage || article.thumbnail}
                alt={article.title}
                className="w-full max-h-[460px] object-cover"
              />
            </div>

            {/* Lead Excerpt */}
            <div className="mt-6 p-4 rounded-2xl bg-emerald-50/60 border-l-4 border-emerald-600 text-slate-700 text-sm font-medium leading-relaxed">
              {article.excerpt}
            </div>

            {/* Sanitized Rich Text Body */}
            <div
              className="mt-8 news-rich-text font-normal"
              dangerouslySetInnerHTML={{ __html: safeHtml }}
            />

            {/* Tags */}
            {article.tags?.length > 0 && (
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
            )}
          </article>

          {/* CTA Box */}
          <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white rounded-3xl p-8 shadow-xl mb-12 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center sm:text-left">
              <h3 className="text-xl font-bold">
                Bạn Có Công Trình Cần Đập Phá Hay Thừa Vật Liệu?
              </h3>
              <p className="text-xs sm:text-sm text-emerald-100 max-w-md">
                Đăng tin ngay lên MatGreen hoàn toàn miễn phí. Nhà thầu và hộ dân quanh bạn sẽ đến thu gom nhanh chóng!
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
