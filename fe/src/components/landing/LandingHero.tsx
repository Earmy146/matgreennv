import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Compass,
  ArrowRight,
  Sparkles,
  MapPin,
  CheckCircle2,
  Building2,
  Play,
  Truck,
  ShieldCheck,
  Search,
} from "lucide-react";

export const LandingHero: React.FC = () => {
  const navigate = useNavigate();
  const [searchRadius, setSearchRadius] = useState<number>(10);
  const [searchCategory, setSearchCategory] = useState<string>("all");
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  const handleQuickSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = new URLSearchParams();
    if (searchRadius) query.set("radius", searchRadius.toString());
    if (searchCategory && searchCategory !== "all") query.set("category", searchCategory);
    if (searchKeyword.trim()) query.set("search", searchKeyword.trim());

    navigate(`/dashboard?${query.toString()}`);
  };

  return (
    <section className="relative bg-stone-100 overflow-hidden pt-12 pb-20 lg:pt-16 lg:pb-28">
      {/* Background shape pattern từ Solox index-3.html (slider-3-bg-1.png) */}
      <div
        className="absolute inset-0 bg-cover bg-center pointer-events-none opacity-40 z-0"
        style={{ backgroundImage: "url('/assets/images/shapes/slider-3-bg-1.png')" }}
      />

      {/* Decorative floating shapes bên trái và phải (slider-3-shape-1 & 2) */}
      <img
        src="/assets/images/shapes/slider-3-shape-2.png"
        alt="Decorative shape"
        className="absolute top-10 left-0 max-w-[150px] sm:max-w-[220px] pointer-events-none opacity-80 z-0 animate-float"
      />
      <img
        src="/assets/images/shapes/slider-3-shape-1.png"
        alt="Decorative shape"
        className="absolute bottom-10 right-0 max-w-[150px] sm:max-w-[220px] pointer-events-none opacity-80 z-0"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Cột Trái (7 Cột): Giới thiệu & Khẩu hiệu */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-600/10 border border-emerald-600/25 text-emerald-800 text-xs font-bold tracking-wide uppercase shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
              Sàn Tuần Hoàn Vật Liệu Xây Dựng Số 1 Việt Nam
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.12] font-display">
              Khám Phá Nơi Biến <br />
              <span className="text-emerald-700">Vật Liệu Tháo Dỡ</span> Thành Tài Nguyên Tái Sinh
            </h1>

            <p className="text-slate-600 text-sm sm:text-base md:text-lg max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Kết nối trực tiếp <strong>Nhà A</strong> (cần giải phóng mặt bằng, thừa xà bần, gạch, sắt thép tháo dỡ) với <strong>Nhà B</strong> (đang xây dựng cần mua rẻ hoặc nhận vật liệu miễn phí) theo <span className="text-emerald-700 font-bold">bán kính định vị GPS</span> gần bạn nhất.
            </p>

            {/* Quick check highlights */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-2 max-w-lg mx-auto lg:mx-0">
              <div className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Cho nhận 0đ & Bán rẻ</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Radar GPS bán kính</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>AI bóc tách tự động</span>
              </div>
            </div>

            {/* Quick Form Search Bar ngay trên Hero */}
            <form onSubmit={handleQuickSearch} className="bg-white p-3 rounded-2xl shadow-xl border border-stone-200 flex flex-col sm:flex-row gap-2 max-w-2xl">
              <div className="flex-1 flex items-center gap-2 px-3 py-2 bg-stone-50 rounded-xl border border-stone-200">
                <Search className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Tìm gạch cũ, sắt thép, cửa nhôm, xà gồ..."
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  className="w-full bg-transparent text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={searchRadius}
                  onChange={(e) => setSearchRadius(Number(e.target.value))}
                  className="px-3 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs font-bold text-slate-700 focus:outline-none cursor-pointer"
                >
                  <option value={3}>3 km quanh đây</option>
                  <option value={5}>5 km</option>
                  <option value={10}>10 km (Chuẩn)</option>
                  <option value={20}>20 km</option>
                </select>

                <button
                  type="submit"
                  className="solox-btn solox-btn--emerald px-5 py-2.5 whitespace-nowrap shadow-sm text-xs cursor-pointer active:scale-95"
                >
                  <Compass className="w-4 h-4 mr-1.5" /> Quét Ngay
                </button>
              </div>
            </form>

            {/* CTA action buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={() => navigate("/dashboard")}
                className="solox-btn solox-btn--emerald shadow-lg shadow-emerald-600/25 flex items-center gap-2 cursor-pointer"
              >
                <Compass className="w-4 h-4" />
                <span>Mở Bản Đồ Radar GPS</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => navigate("/post")}
                className="solox-btn solox-btn--outline flex items-center gap-2 cursor-pointer"
              >
                <Building2 className="w-4 h-4 text-emerald-700" />
                <span>Đăng Tin Công Trình (Cho / Bán)</span>
              </button>
            </div>
          </div>

          {/* Cột Phải (5 Cột): Thumb nghệ thuật Solox với viền hoa văn, lá trang trí & vòng chữ xoay */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="relative max-w-[340px] sm:max-w-[420px] w-full">
              {/* Hình ảnh chính bo góc nghệ thuật Solox (slider-3-1.jpg) */}
              <div className="relative rounded-[48px] overflow-hidden shadow-2xl border-4 border-white bg-emerald-950/20 z-10">
                <img
                  src="https://res.cloudinary.com/dwcuijzvd/image/upload/v1792728315/finance-lite/banners/mat-mvkg5f9e-80722a7f09b5.jpg"
                  alt="Tuần hoàn vật liệu xây dựng MatGreen"
                  className="w-full h-[400px] sm:h-[480px] object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>

              {/* Viền hoa văn nghệ thuật Solox (slider-3-shape-3.png) */}
              <img
                src="/assets/images/shapes/slider-3-shape-3.png"
                alt="Decorative frame"
                className="absolute -top-6 -left-6 w-full h-full pointer-events-none z-0 opacity-80"
              />

              {/* Lá trang trí số 1 (slider-3-shape-4.png) */}
              <img
                src="/assets/images/shapes/slider-3-shape-4.png"
                alt="Leaf 1"
                className="absolute -top-8 -left-8 w-20 h-20 sm:w-24 sm:h-24 object-contain pointer-events-none z-20 animate-float"
              />

              {/* Lá trang trí số 2 (slider-3-shape-5.png) */}
              <img
                src="/assets/images/shapes/slider-3-shape-5.png"
                alt="Leaf 2"
                className="absolute bottom-10 -right-6 w-16 h-16 sm:w-20 sm:h-20 object-contain pointer-events-none z-20"
              />

              {/* Bông hoa Solox (slider-3-shape-6.png) */}
              <img
                src="/assets/images/shapes/slider-3-shape-6.png"
                alt="Flower"
                className="absolute -bottom-6 -left-4 w-20 h-20 sm:w-24 sm:h-24 object-contain pointer-events-none z-20 animate-spin-slow"
              />

              {/* Vòng chữ xoay nghệ thuật quanh nút Play (Curved Circle Solox) */}
              <div className="absolute -bottom-6 -right-6 sm:-bottom-8 sm:-right-8 w-32 h-32 sm:w-36 sm:h-36 z-30 flex items-center justify-center">
                {/* SVG Vòng chữ xoay tròn liên tục */}
                <svg
                  className="absolute inset-0 w-full h-full animate-spin-slow pointer-events-none"
                  viewBox="0 0 100 100"
                >
                  <path
                    id="circlePathHero"
                    d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
                    fill="none"
                  />
                  <text className="text-[9.5px] font-black uppercase tracking-[2.5px] fill-emerald-800">
                    <textPath href="#circlePathHero" startOffset="0%">
                      • MATGREEN TUẦN HOÀN • XÂY DỰNG XANH 
                    </textPath>
                  </text>
                </svg>

                {/* Nút Play trung tâm */}
                <button
                  type="button"
                  onClick={() => setIsVideoModalOpen(true)}
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-xl shadow-emerald-600/40 flex items-center justify-center transition-all cursor-pointer hover:scale-110 active:scale-95 z-40"
                  title="Xem video giới thiệu MatGreen"
                >
                  <Play className="w-5 h-5 ml-1 fill-white" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Video Modal Popup */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-3xl overflow-hidden max-w-3xl w-full border border-white/20 shadow-2xl relative">
            <div className="p-4 flex items-center justify-between border-b border-white/10">
              <strong className="text-white text-sm">Video Giới Thiệu Giải Pháp MatGreen</strong>
              <button
                type="button"
                onClick={() => setIsVideoModalOpen(false)}
                className="text-slate-400 hover:text-white px-2 py-1 rounded-lg text-sm font-bold"
              >
                ✕ Đóng
              </button>
            </div>
            <div className="aspect-video w-full">
              <iframe
                className="w-full h-full"
                src="https://www.youtube-nocookie.com/embed/h9MbznbxlLc?autoplay=1"
                title="MatGreen Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default LandingHero;
