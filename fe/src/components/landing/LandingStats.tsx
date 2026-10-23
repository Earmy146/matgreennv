import React from "react";
import { MapPin, Recycle, Building2, Smile, Award } from "lucide-react";
import { useSiteConfigStore, DEFAULT_SITE_CONFIG } from "@/stores/site-config.store";

export const LandingStats: React.FC = () => {
  const { config } = useSiteConfigStore();
  const statsConfig = config?.homePage?.stats || DEFAULT_SITE_CONFIG.homePage.stats;

  const defaultIcons = [
    <MapPin key="map" className="w-8 h-8 text-emerald-400" />,
    <Recycle key="recycle" className="w-8 h-8 text-emerald-400" />,
    <Building2 key="build" className="w-8 h-8 text-emerald-400" />,
    <Smile key="smile" className="w-8 h-8 text-amber-400" />,
  ];

  const rawStats = statsConfig.items?.length
    ? statsConfig.items
    : DEFAULT_SITE_CONFIG.homePage.stats.items;

  const stats = rawStats.map((item, idx) => ({
    ...item,
    icon: defaultIcons[idx % defaultIcons.length],
  }));

  const bgImage = statsConfig.bgImageUrl || DEFAULT_SITE_CONFIG.homePage.stats.bgImageUrl;

  return (
    <section
      className="py-16 bg-slate-950 text-white bg-cover bg-center relative overflow-hidden"
      style={{ backgroundImage: `url('${bgImage}')` }}
    >
      <div className="absolute inset-0 bg-slate-950/75 backdrop-blur-xs" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {stats.map((item, idx) => (
            <div
              key={idx}
              className="p-6 rounded-3xl bg-white/5 border border-white/10 text-center hover:bg-white/10 transition-all duration-300 flex flex-col items-center group"
            >
              <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                {item.icon}
              </div>
              <h3 className="text-3xl sm:text-4xl md:text-5xl font-black text-white font-display tracking-tight text-emerald-400">
                {item.num}
              </h3>
              <p className="text-xs sm:text-sm font-bold text-white mt-2">
                {item.label}
              </p>
              <span className="text-[11px] text-slate-400 mt-1">
                {item.sub}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LandingStats;

