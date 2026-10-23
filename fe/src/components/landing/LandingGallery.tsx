import React from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, Compass, ArrowRight, Eye } from "lucide-react";
import { useSiteConfigStore, DEFAULT_SITE_CONFIG } from "@/stores/site-config.store";

export const LandingGallery: React.FC = () => {
  const { config } = useSiteConfigStore();
  const gallery = config?.homePage?.gallery || DEFAULT_SITE_CONFIG.homePage.gallery;

  const galleryItems = gallery.items?.length
    ? gallery.items
    : DEFAULT_SITE_CONFIG.homePage.gallery.items;

  return (
    <section className="py-16 bg-white overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Cột 1 (8 Cột): 4 ảnh công trình thực tế */}
          <div className="lg:col-span-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 h-full">
              {galleryItems.map((item, idx) => (
                <div
                  key={idx}
                  className="relative rounded-3xl overflow-hidden shadow-lg border border-stone-200 group h-64 sm:h-72"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-300" />
                  
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full bg-emerald-600/90 text-white text-[10px] font-bold uppercase tracking-wider backdrop-blur-md">
                      {item.tag}
                    </span>
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    <h4 className="text-sm font-bold text-white font-display leading-snug">
                      {item.title}
                    </h4>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cột 2 (4 Cột): Khung Thông Tin Niềm Tin */}
          <div className="lg:col-span-4 flex">
            <div className="w-full rounded-3xl p-8 sm:p-10 flex flex-col justify-between text-white bg-gradient-to-br from-slate-900 via-slate-950 to-emerald-950 shadow-xl border border-slate-800 relative overflow-hidden">
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mb-6 text-emerald-400">
                  <ShieldCheck className="w-8 h-8" />
                </div>

                <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 block mb-2 font-sans">
                  {gallery.badge || "Minh Bạch Hiện Trường 100%"}
                </span>

                <h3 className="text-2xl sm:text-3xl font-black leading-snug font-display text-white mb-4">
                  {gallery.title || (
                    <>
                      Thư Viện Công Trình <br />
                      <span className="text-emerald-400">Đã Kết Nối Thành Công</span>
                    </>
                  )}
                </h3>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                  {gallery.desc ||
                    "Mỗi hình ảnh trên MatGreen đều được đính kèm tọa độ GPS và thời điểm chụp thực tế tại công trường. Nói không với ảnh mạng và tin ảo."}
                </p>
              </div>

              <div className="relative z-10 pt-8 mt-8 border-t border-white/15">
                <Link
                  to="/dashboard"
                  className="solox-btn solox-btn--emerald w-full"
                >
                  <Compass className="w-4 h-4 mr-2" />
                  <span>Xem Trên Bản Đồ Radar</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LandingGallery;

