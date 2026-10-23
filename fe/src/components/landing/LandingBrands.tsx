import React from "react";

export const LandingBrands: React.FC = () => {
  const brands = [
    { name: "Đại lý Xây Dựng Số 1", logo: "/assets/images/resources/brand-1-1.png" },
    { name: "Hiệp Hội Tái Chế Xanh", logo: "/assets/images/resources/brand-2-1.png" },
    { name: "Nhà Thầu Vận Tải Đô Thị", logo: "/assets/images/resources/brand-3-1.png" },
    { name: "Vật Liệu Tháo Dỡ Hà Nội", logo: "/assets/images/resources/brand-3-2.png" },
    { name: "Mạng Lưới Thợ Xây Việt", logo: "/assets/images/resources/brand-3-3.png" },
    { name: "Công Nghệ Net Zero Eco", logo: "/assets/images/resources/brand-3-4.png" },
    { name: "Logistics Xây Dựng 24/7", logo: "/assets/images/resources/brand-3-5.png" },
  ];

  return (
    <div className="py-10 bg-white border-y border-stone-200 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <p className="text-center text-xs font-bold uppercase tracking-widest text-slate-400 mb-6 font-sans">
          Được Đồng Hành & Tin Cậy Bởi Hơn 500+ Nhà Thầu & Đơn Vị Tái Chế
        </p>

        {/* Marquee / Brand Grid */}
        <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 lg:gap-16 opacity-70 grayscale hover:grayscale-0 transition-all duration-300">
          {brands.map((b, idx) => (
            <div
              key={idx}
              className="h-10 sm:h-12 flex items-center justify-center hover:scale-110 transition-transform duration-300"
              title={b.name}
            >
              <img
                src={b.logo}
                alt={b.name}
                className="max-h-full max-w-[120px] object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LandingBrands;
