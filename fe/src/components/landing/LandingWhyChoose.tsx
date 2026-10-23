import React from "react";
import { Link } from "react-router-dom";
import { Check, Compass, ShieldCheck, TrendingDown, Leaf, ArrowRight } from "lucide-react";
import { useSiteConfigStore, DEFAULT_SITE_CONFIG } from "@/stores/site-config.store";

export const LandingWhyChoose: React.FC = () => {
  const { config } = useSiteConfigStore();
  const whyConfig = config?.homePage?.whyChoose || DEFAULT_SITE_CONFIG.homePage.whyChoose;

  const defaultIcons = [
    <Compass key="compass" className="w-5 h-5 text-emerald-400" />,
    <TrendingDown key="trend" className="w-5 h-5 text-amber-400" />,
    <Leaf key="leaf" className="w-5 h-5 text-emerald-400" />,
    <ShieldCheck key="shield" className="w-5 h-5 text-teal-400" />,
  ];

  const rawFeatures = whyConfig.items?.length
    ? whyConfig.items
    : DEFAULT_SITE_CONFIG.homePage.whyChoose.items;

  const features = rawFeatures.map((item, idx) => ({
    ...item,
    icon: defaultIcons[idx % defaultIcons.length],
  }));

  const bgImage = whyConfig.bgImageUrl || DEFAULT_SITE_CONFIG.homePage.whyChoose.bgImageUrl;

  return (
    <section className="relative py-24 lg:py-32 text-white overflow-hidden">
      {/* Background Parallax lớn (Lướt xuống ảnh nền giữ cố định và lộ dần) */}
      <div
        className="absolute inset-0 parallax-bg z-0"
        style={{
          backgroundImage: `url('${bgImage}')`,
        }}
      />

      {/* Lớp phủ Gradient làm dịu ảnh & tăng độ tương phản */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/92 via-slate-950/85 to-emerald-950/85 z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Cột Trái (5 Cột): Tiêu Đề & Lời Kêu Gọi */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <img
                src="/assets/images/shapes/why-choose-2-s-2.png"
                alt="Decorative leaf"
                className="mb-3 h-5 w-auto object-contain brightness-0 invert opacity-90"
              />
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 block mb-2 font-sans">
                {whyConfig.badge || "Lợi Thế Vượt Trội"}
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight font-display leading-tight">
                {whyConfig.title || (
                  <>
                    Vì Sao Hàng Ngàn <br />
                    <span className="text-emerald-400">Chủ Thầu Tin Chọn?</span>
                  </>
                )}
              </h2>
            </div>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
              {whyConfig.desc ||
                "Chúng tôi kết hợp sức mạnh của Bản đồ GIS định vị, Thuật toán tối ưu quãng đường và Trợ lý thị giác AI để giải quyết triệt để vấn đề rác thải xây dựng cồng kềnh tại Việt Nam."}
            </p>

            <div className="pt-2">
              <Link
                to="/dashboard"
                className="solox-btn solox-btn--emerald"
              >
                <span>Khám Phá Bản Đồ Radar</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
          </div>

          {/* Cột Phải (7 Cột): 4 Thẻ Tính Năng Kính Mờ (Glassmorphism) */}
          <div className="lg:col-span-7">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {features.map((item, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-3xl bg-white/10 backdrop-blur-md border border-white/15 hover:bg-white/15 transition-all duration-300 shadow-xl group"
                >
                  <div className="flex items-center gap-3.5 mb-3">
                    <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      {item.icon}
                    </div>
                    <h3 className="text-base font-bold text-white font-display leading-snug">
                      {item.title}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed font-normal">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LandingWhyChoose;
