import React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Eye, Heart, MapPin, Tag } from "lucide-react";
import { useSiteConfigStore } from "@/stores/site-config.store";
import { materialsApi } from "@/services/api";
import { CATEGORY_LABELS, formatCurrency } from "@/lib/utils";

export const LandingProducts: React.FC = () => {
  const { config } = useSiteConfigStore();
  const productsConfig = config.homePage?.products;

  const { data: liveData } = useQuery({
    queryKey: ["landing-live-materials"],
    queryFn: () => materialsApi.getAll({ limit: 4 }),
    staleTime: 60000,
    retry: 1,
  });

  const liveItems = liveData?.items || [];

  const badge = productsConfig?.badge || "Nguồn Cung Cập Nhật Mới Nhất";
  const title = productsConfig?.title || "Vật Liệu Đang Chờ Bốc Dỡ";
  const desc =
    productsConfig?.desc ||
    "Xem nhanh các lô vật liệu tháo dỡ thực tế đang mở cho tặng hoặc thanh lý trên sàn MatGreen.";

  const fallbackProducts = productsConfig?.items?.length
    ? productsConfig.items
    : [
        {
          id: "fallback-1",
          title: "Gạch Đỏ Đặc Cũ Tháo Dỡ Nhà Phố",
          category: "Gạch, ngói cũ",
          price: "0đ (Cho Tặng)",
          isFree: true,
          unit: "viên",
          address: "Đống Đa, Hà Nội",
          image: "https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&w=600&q=80",
        },
        {
          id: "fallback-2",
          title: "Sắt Hộp 40x80 & Xà Gồ Mạ Kẽm",
          category: "Sắt thép cũ",
          price: "45.000đ",
          isFree: false,
          unit: "cây",
          address: "Thanh Xuân, Hà Nội",
          image: "https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=600&q=80",
        },
      ];

  const cards =
    liveItems.length > 0
      ? liveItems.map((m) => ({
          id: m._id,
          href: `/materials/${m._id}`,
          title: m.title,
          category: CATEGORY_LABELS[m.category] || "Vật liệu khác",
          price: formatCurrency(m.price),
          isFree: m.type === "free",
          unit: m.unit,
          address: m.location?.address || "Đang cập nhật",
          image: m.images?.[0] || "",
          isReal: true,
        }))
      : fallbackProducts.map((p: any, idx: number) => ({
          id: p.id || `fb-${idx}`,
          href: "/materials",
          title: p.title,
          category: p.category,
          price: p.price,
          isFree: Boolean(p.isFree),
          unit: p.unit,
          address: p.address,
          image: p.image,
          isReal: false,
        }));

  return (
    <section className="py-20 bg-stone-50 relative z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-flex items-center px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-3">
            {badge}
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
            {title}
          </h2>
          <p className="mt-3 text-sm text-slate-600">{desc}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl overflow-hidden shadow-sm border border-stone-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
            >
              <Link to={item.href} className="relative h-52 overflow-hidden bg-slate-100 block">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 text-xs gap-1">
                    <Tag className="w-7 h-7 stroke-1" />
                    <span>Vật liệu MatGreen</span>
                  </div>
                )}

                <div className="absolute top-3 left-3">
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider text-white shadow-sm ${
                      item.isFree ? "bg-emerald-600" : "bg-amber-500"
                    }`}
                  >
                    {item.isFree ? "Tặng 0đ" : "Thanh lý"}
                  </span>
                </div>

                <div className="absolute bottom-3 right-3 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center text-slate-700">
                    <Eye className="w-4 h-4" />
                  </span>
                  <span className="w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center text-rose-500">
                    <Heart className="w-4 h-4" />
                  </span>
                </div>
              </Link>

              <div className="p-5 flex-1 flex flex-col justify-between gap-3">
                <div>
                  <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">
                    {item.category}
                  </span>
                  <Link
                    to={item.href}
                    className="block mt-1 font-bold text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-2 text-sm leading-snug"
                  >
                    {item.title}
                  </Link>
                  <div className="mt-2 flex items-center gap-1 text-xs text-slate-500">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="truncate">{item.address}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <span
                    className={`font-extrabold text-sm ${
                      item.isFree ? "text-emerald-600" : "text-amber-600"
                    }`}
                  >
                    {item.price}
                    {!item.isFree && item.unit ? ` / ${item.unit}` : ""}
                  </span>
                  <Link
                    to={item.href}
                    className="text-xs font-bold text-slate-700 hover:text-emerald-700 inline-flex items-center gap-1"
                  >
                    Xem <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            to="/materials"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-slate-900 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-colors"
          >
            <span>Khám Phá Toàn Bộ Kho Vật Liệu</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};
