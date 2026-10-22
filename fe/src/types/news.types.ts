export interface NewsArticle {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: "Kinh Tế Tuần Hoàn" | "Kinh Nghiệm Tháo Dỡ" | "Vật Liệu Xanh" | "Hướng Dẫn & Mẹo";
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  publishedAt: string;
  thumbnail: string;
  bannerImage?: string;
  views: number;
  readTimeMinutes: number;
  tags: string[];
  isFeatured?: boolean;
}
