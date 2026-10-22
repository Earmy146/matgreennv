import { create } from "zustand";
import type { NewsArticle } from "@/types/news.types";
import { initialNewsList } from "@/data/news.data";

interface NewsStore {
  articles: NewsArticle[];
  getArticleBySlugOrId: (slugOrId: string) => NewsArticle | undefined;
  addArticle: (article: Omit<NewsArticle, "id" | "views" | "publishedAt">) => void;
  updateArticle: (id: string, data: Partial<NewsArticle>) => void;
  deleteArticle: (id: string) => void;
  incrementViews: (id: string) => void;
}

const STORAGE_KEY = "matgreen_news_articles";

const loadStoredArticles = (): NewsArticle[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error("Lỗi khi tải danh sách tin tức từ localStorage", e);
  }
  return initialNewsList;
};

export const useNewsStore = create<NewsStore>((set, get) => ({
  articles: loadStoredArticles(),

  getArticleBySlugOrId: (slugOrId: string) => {
    return get().articles.find(
      (a) => a.slug === slugOrId || a.id === slugOrId
    );
  },

  addArticle: (data) => {
    const newArticle: NewsArticle = {
      ...data,
      id: `news-${Date.now()}`,
      publishedAt: new Date().toISOString().split("T")[0],
      views: 0,
    };
    set((state) => {
      const updated = [newArticle, ...state.articles];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return { articles: updated };
    });
  },

  updateArticle: (id, data) => {
    set((state) => {
      const updated = state.articles.map((item) =>
        item.id === id ? { ...item, ...data } : item
      );
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return { articles: updated };
    });
  },

  deleteArticle: (id) => {
    set((state) => {
      const updated = state.articles.filter((item) => item.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return { articles: updated };
    });
  },

  incrementViews: (id) => {
    set((state) => {
      const updated = state.articles.map((item) =>
        item.id === id ? { ...item, views: item.views + 1 } : item
      );
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return { articles: updated };
    });
  },
}));
