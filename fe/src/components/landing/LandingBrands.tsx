import React from "react";
import { Building2, ShieldCheck } from "lucide-react";
import { useSiteConfigStore } from "@/stores/site-config.store";

export const LandingBrands: React.FC = () => {
  const { config } = useSiteConfigStore();
  const rawPartners = config?.partners?.length
    ? config.partners
    : [
        {
          name: "Hiệp Hội Bê Tông & Tái Chế Việt Nam",
          logo: "https://images.unsplash.com/photo-1541888946425-d0fbb1861593?auto=format&fit=crop&w=200&q=80",
        },
        {
          name: "Tập Đoàn Hạ Tầng Đô Thị Xanh",
          logo: "https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&w=200&q=80",
        },
        {
          name: "Tổng Công Ty Vận Tải Công Trình 24/7",
          logo: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=200&q=80",
        },
        {
          name: "Liên Minh Thầu Phá Dỡ & Tôn Nền",
          logo: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=200&q=80",
        },
        {
          name: "Mạng Lưới Thợ Xây Dựng Miền Bắc",
          logo: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=200&q=80",
        },
        {
          name: "Viện Nghiên Cứu Vật Liệu Xanh Eco",
          logo: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=200&q=80",
        },
      ];

  // Nhân đôi mảng để tạo hiệu ứng Infinite Carousel cuộn vô tận
  const carouselPartners = [...rawPartners, ...rawPartners, ...rawPartners];
  const headline =
    config?.partnersHeadline ||
    "Được Đồng Hành & Tin Cậy Bởi Hơn 500+ Nhà Thầu & Đơn Vị Tái Chế";

  return (
    <div className="py-12 bg-white border-y border-stone-200 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-6 text-center">
        <p className="text-xs font-bold uppercase tracking-widest text-emerald-800 font-sans flex items-center justify-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>{headline}</span>
        </p>
      </div>

      {/* Mask làm mờ 2 bên viền để tạo hiệu ứng mượt mà */}
      <div className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <div className="animate-marquee flex items-center gap-6 py-2">
          {carouselPartners.map((b, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-stone-50 border border-stone-200 hover:border-emerald-500 hover:bg-emerald-50/50 hover:shadow-md transition-all duration-300 shrink-0 group cursor-default select-none"
              title={b.name}
            >
              <div className="w-9 h-9 rounded-xl overflow-hidden bg-white border border-stone-200 shrink-0 flex items-center justify-center p-1">
                {b.logo ? (
                  <img
                    src={b.logo}
                    alt={b.name}
                    className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                ) : (
                  <Building2 className="w-5 h-5 text-emerald-600" />
                )}
              </div>
              <span className="text-xs font-bold text-slate-700 group-hover:text-emerald-800 transition-colors whitespace-nowrap">
                {b.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LandingBrands;
