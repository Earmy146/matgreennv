import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Truck, Recycle, ShieldCheck, Hammer, Layers, Cpu } from "lucide-react";
import { useSiteConfigStore, DEFAULT_SITE_CONFIG } from "@/stores/site-config.store";

export const LandingServices: React.FC = () => {
  const { config } = useSiteConfigStore();
  const servicesConfig = config?.homePage?.services || DEFAULT_SITE_CONFIG.homePage.services;

  const icons = [
    <Truck key="truck" className="w-5 h-5 text-emerald-600" />,
    <Hammer key="hammer" className="w-5 h-5 text-amber-600" />,
    <Layers key="layers" className="w-5 h-5 text-emerald-600" />,
    <Cpu key="cpu" className="w-5 h-5 text-indigo-600" />,
    <Recycle key="recycle" className="w-5 h-5 text-teal-600" />,
    <ShieldCheck key="shield" className="w-5 h-5 text-emerald-600" />,
  ];

  const rawItems = servicesConfig.items?.length
    ? servicesConfig.items
    : DEFAULT_SITE_CONFIG.homePage.services.items;

  const services = rawItems.map((item, idx) => ({
    ...item,
    icon: icons[idx % icons.length],
  }));

  return (
    <section
      id="services"
      className="py-20 lg:py-28 bg-stone-100 relative"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header Solox Style */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <img
            src="/assets/images/shapes/sec-title-s-1.png"
            alt="Solox decorative icon"
            className="mx-auto mb-3 h-5 w-auto object-contain"
          />
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 block mb-2 font-sans">
            {servicesConfig.badge || "Dịch Vụ Tuần Hoàn Toàn Diện"}
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight font-display">
            {servicesConfig.title || "Giải Pháp MatGreen Cung Cấp"}
          </h2>
          <p className="mt-3 text-sm text-slate-600">
            {servicesConfig.desc ||
              "Hỗ trợ toàn diện từ khâu khảo sát, định vị GPS, bóc tách khối lượng đến điều phối đội xe vận chuyển tận chân công trình."}
          </p>
        </div>


        {/* Services Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl overflow-hidden shadow-lg border border-stone-200 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between group"
            >
              {/* Image & Floating Icon */}
              <div className="relative h-52 overflow-hidden bg-slate-200">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-3.5 right-3.5 px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-[10px] font-bold text-white uppercase tracking-wider">
                  {item.tag}
                </div>
                {/* Floating Circle Icon */}
                <div className="absolute -bottom-6 left-6 w-12 h-12 rounded-2xl bg-white shadow-lg border border-stone-100 flex items-center justify-center z-10 group-hover:scale-110 transition-transform duration-300">
                  {item.icon}
                </div>
              </div>

              {/* Content */}
              <div className="p-6 pt-9 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 tracking-tight leading-snug font-display group-hover:text-emerald-700 transition-colors">
                    {item.title}
                  </h3>

                  {/* Decorative divider wave shape */}
                  <img
                    src="/assets/images/shapes/service-card-two-s-1.png"
                    alt="Divider"
                    className="my-3 h-2 w-auto opacity-60"
                  />

                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    {item.desc}
                  </p>
                </div>

                <div className="pt-5 mt-5 border-t border-stone-100">
                  <Link
                    to={item.link}
                    className="inline-flex items-center text-xs font-bold text-emerald-700 hover:text-emerald-800 transition-colors group/link"
                  >
                    <span>Khám phá ngay</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1.5 group-hover/link:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LandingServices;
