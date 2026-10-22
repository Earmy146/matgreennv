import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Compass,
  ArrowRight,
  Sparkles,
  MapPin,
  CheckCircle2,
  Recycle,
  Building2,
  Truck,
  ShieldCheck,
} from "lucide-react";

export const LandingHero: React.FC = () => {
  const navigate = useNavigate();
  const [searchRadius, setSearchRadius] = useState<number>(10);
  const [searchCategory, setSearchCategory] = useState<string>("all");
  const [searchKeyword, setSearchKeyword] = useState<string>("");

  const handleQuickSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = new URLSearchParams();
    if (searchRadius) query.set("radius", searchRadius.toString());
    if (searchCategory && searchCategory !== "all") query.set("category", searchCategory);
    if (searchKeyword.trim()) query.set("search", searchKeyword.trim());

    navigate(`/dashboard?${query.toString()}`);
  };

  return (
    <section id="hero" className="relative bg-gradient-to-b from-slate-950 via-slate-900 to-emerald-950 text-white overflow-hidden pt-12 pb-24 md:pt-16 md:pb-32">
      {/* Decorative Glow & Geometry Elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(#10b981 1px, transparent 1px), radial-gradient(#10b981 1px, #0f172a 1px)",
          backgroundSize: "40px 40px",
          backgroundPosition: "0 0, 20px 20px",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Heading & Introduction */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              Sàn Tuần Hoàn Vật Liệu Xây Dựng Số 1 Việt Nam
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15]">
              Biến <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">Vật Liệu Tháo Dỡ</span> Thành Tài Nguyên Tái Sinh
            </h1>

            <p className="text-slate-300 text-sm sm:text-base md:text-lg max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Kết nối trực tiếp <strong>Nhà A</strong> (cần giải phóng mặt bằng, thừa xà bần, gạch, sắt thép tháo dỡ) với <strong>Nhà B</strong> (đang xây dựng cần mua rẻ hoặc nhận vật liệu miễn phí) theo <span className="text-emerald-400 font-semibold">bán kính định vị GPS</span> gần bạn nhất.
            </p>

            {/* Quick highlights */}
            <div className="grid grid-cols-3 gap-3 pt-2 max-w-lg mx-auto lg:mx-0">
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Cho nhận 0đ & Thanh lý</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Radar GPS bán kính</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>AI bóc tách tự động</span>
              </div>
            </div>

            {/* CTA action buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-4">
              <button
                onClick={() => navigate("/dashboard")}
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-slate-950 font-black text-sm transition-all shadow-lg shadow-emerald-500/25 flex items-center gap-2 active:scale-98 cursor-pointer"
              >
                <Compass className="w-4 h-4 text-slate-950" />
                Mở Radar Quét Quanh Bạn
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => navigate("/post")}
                className="px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-bold text-sm transition-all flex items-center gap-2 active:scale-98 cursor-pointer"
              >
                <Building2 className="w-4 h-4 text-emerald-400" />
                Đăng Tin Nhà Đập Phá (Cho/Bán)
              </button>
            </div>
          </div>

          {/* Right Column: Interactive Quick Search Box & Live Status */}
          <div className="lg:col-span-5">
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 sm:p-8 rounded-3xl shadow-2xl relative">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/15">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                    Radar Thời Gian Thực
                  </span>
                </div>
                <span className="text-[11px] text-slate-300 bg-white/10 px-2.5 py-1 rounded-full">
                  GPS Active
                </span>
              </div>

              <h2 className="text-xl font-bold mb-4 text-white">
                Tìm Nguồn Vật Liệu Tháo Dỡ Quanh Bạn
              </h2>

              <form onSubmit={handleQuickSearch} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Từ khóa tìm kiếm
                  </label>
                  <input
                    type="text"
                    placeholder="VD: Gạch cũ, sắt phi 16, cửa nhôm, xà gồ..."
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                      Bán kính quét
                    </label>
                    <select
                      value={searchRadius}
                      onChange={(e) => setSearchRadius(Number(e.target.value))}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-white/20 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 cursor-pointer"
                    >
                      <option value={3}>Bán kính 3 km</option>
                      <option value={5}>Bán kính 5 km</option>
                      <option value={10}>Bán kính 10 km (Chuẩn)</option>
                      <option value={20}>Bán kính 20 km</option>
                      <option value={50}>Bán kính 50 km</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                      Loại danh mục
                    </label>
                    <select
                      value={searchCategory}
                      onChange={(e) => setSearchCategory(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-white/20 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 cursor-pointer"
                    >
                      <option value="all">Tất cả vật liệu</option>
                      <option value="Gạch & Bê tông">Gạch & Bê tông</option>
                      <option value="Sắt thép">Sắt thép xà gồ</option>
                      <option value="Cửa & Khung nhôm kính">Cửa & Nhôm kính</option>
                      <option value="Gỗ & Ván cốp pha">Gỗ cốp pha</option>
                      <option value="Cát & Đá tôn nền">Cát đá san lấp</option>
                      <option value="Thiết bị vệ sinh">Thiết bị hoàn thiện</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  <Compass className="w-4 h-4" /> Quét Tìm Vật Liệu Ngay
                </button>
              </form>

              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Miễn phí đăng tin
                </span>
                <span className="flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-emerald-400" /> Hỗ trợ xe ba gác
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
