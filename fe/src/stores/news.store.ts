import { create } from "zustand";
import type { NewsArticle } from "@/types/news.types";
import { initialNewsList } from "@/data/news.data";
import { articlesApi } from "@/services/api";

interface NewsStore {
  articles: NewsArticle[];
  isLoading: boolean;
  getArticleBySlugOrId: (slugOrId: string) => NewsArticle | undefined;
  fetchArticles: () => Promise<void>;
  addArticle: (article: Omit<NewsArticle, "id" | "views" | "publishedAt">) => Promise<void>;
  updateArticle: (id: string, data: Partial<NewsArticle>) => Promise<void>;
  deleteArticle: (id: string) => Promise<void>;
  incrementViews: (id: string) => Promise<void>;
}

const STORAGE_KEY = "matgreen_news_articles";
const STORAGE_VERSION_KEY = "matgreen_news_version";
const CURRENT_VERSION = "v3_richtext_html";

const isRawMarkdown = (content: string): boolean => {
  if (!content) return false;
  return content.includes("###") || content.includes("- **") || !content.includes("<p>");
};

const loadStoredArticles = (): NewsArticle[] => {
  try {
    const version = localStorage.getItem(STORAGE_VERSION_KEY);
    const stored = localStorage.getItem(STORAGE_KEY);

    if (version === CURRENT_VERSION && stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Kiểm tra xem có bài viết nào còn sót markdown thô không
        const hasMarkdown = parsed.some((a) => isRawMarkdown(a.content));
        if (!hasMarkdown) {
          return parsed;
        }
      }
    }

    // Nếu là phiên bản cũ hoặc chứa markdown thô chưa format rich text, tự động nạp danh sách rich text mới
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialNewsList));
    localStorage.setItem(STORAGE_VERSION_KEY, CURRENT_VERSION);
    return initialNewsList;
  } catch (e) {
    console.error("Lỗi khi tải danh sách tin tức từ localStorage", e);
    return initialNewsList;
  }
};

export const useNewsStore = create<NewsStore>((set, get) => ({
  articles: loadStoredArticles(),
  isLoading: false,

  fetchArticles: async () => {
    try {
      set({ isLoading: true });
      const apiArticles = await articlesApi.getAll();
      if (Array.isArray(apiArticles) && apiArticles.length > 0) {
        // Đảm bảo mapping _id thành id nếu backend trả về mongoose document
        const normalized = apiArticles.map((item: any) => ({
          ...item,
          id: item.id || item._id?.toString() || item.slug,
        }));
        set({ articles: normalized, isLoading: false });
        localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
        localStorage.setItem(STORAGE_VERSION_KEY, CURRENT_VERSION);
        return;
      }
    } catch (err) {
      // Backend có thể offline hoặc đang dev, fallback dùng local
      console.warn("Dùng dữ liệu tin tức cục bộ Rich Text (API chưa kết nối):", err);
    } finally {
      set({ isLoading: false });
    }
  },

  getArticleBySlugOrId: (slugOrId: string) => {
    return get().articles.find(
      (a) => a.slug === slugOrId || a.id === slugOrId
    );
  },

  addArticle: async (data) => {
    const newArticle: NewsArticle = {
      ...data,
      id: `news-${Date.now()}`,
      publishedAt: new Date().toISOString().split("T")[0],
      views: 0,
    };

    try {
      const created = await articlesApi.create(data);
      if (created) {
        newArticle.id = (created as any)._id || created.id || newArticle.id;
      }
    } catch (e) {
      console.warn("Lưu bài viết vào API thất bại, lưu cục bộ:", e);
    }

    set((state) => {
      const updated = [newArticle, ...state.articles];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return { articles: updated };
    });
  },

  updateArticle: async (id, data) => {
    try {
      await articlesApi.update(id, data);
    } catch (e) {
      console.warn("Cập nhật bài viết qua API thất bại, lưu cục bộ:", e);
    }

    set((state) => {
      const updated = state.articles.map((item) =>
        item.id === id ? { ...item, ...data } : item
      );
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return { articles: updated };
    });
  },

  deleteArticle: async (id) => {
    try {
      await articlesApi.delete(id);
    } catch (e) {
      console.warn("Xóa bài viết qua API thất bại, xóa cục bộ:", e);
    }

    set((state) => {
      const updated = state.articles.filter((item) => item.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return { articles: updated };
    });
  },

  incrementViews: async (id) => {
    try {
      await articlesApi.incrementViews(id);
    } catch {
      // Bỏ qua lỗi tăng view
    }

    set((state) => {
      const updated = state.articles.map((item) =>
        item.id === id ? { ...item, views: item.views + 1 } : item
      );
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return { articles: updated };
    });
  },
}));

// Tự động thử sync từ API khi app nạp
if (typeof window !== "undefined") {
  useNewsStore.getState().fetchArticles();
}
