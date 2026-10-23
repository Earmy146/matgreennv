import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Recycle,
  Gift,
  Coins,
  Compass,
  Cpu,
  Truck,
  ShieldCheck,
  Check,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { LandingServices } from "@/components/landing/LandingServices";
import { LandingWhyChoose } from "@/components/landing/LandingWhyChoose";
import { LandingOpening } from "@/components/landing/LandingOpening";
import { LandingBrands } from "@/components/landing/LandingBrands";
import { useSiteConfigStore, DEFAULT_SITE_CONFIG } from "@/stores/site-config.store";

export const ServicesPage: React.FC = () => {
  const { config } = useSiteConfigStore();
  const servicesPageConfig = config?.servicesPage || DEFAULT_SITE_CONFIG.servicesPage;
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const rawPackages = servicesPageConfig.packages?.items?.length
    ? servicesPageConfig.packages.items
    : DEFAULT_SITE_CONFIG.servicesPage.packages.items;

  const packages = rawPackages;

  const rawFaqs = servicesPageConfig.faqs?.items?.length
    ? servicesPageConfig.faqs.items
    : DEFAULT_SITE_CONFIG.servicesPage.faqs.items;

  const faqs = rawFaqs;

  const headerBg =
    servicesPageConfig.header?.bgImageUrl ||
    "https://images.unsplash.com/photo-1541888946425-d0fbb18f15f7?auto=format&fit=crop&w=1920&q=80";

  return (
    <div className="min-h-screen bg-stone-50 text-slate-800 flex flex-col font-sans">
      <LandingHeader />

      {/* Page Header Banner */}
      <section
        className="relative py-20 lg:py-24 bg-slate-950 text-white bg-cover bg-center overflow-hidden text-center"
        style={{
          backgroundImage: `url('${headerBg}')`,
        }}
      >
        <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 mb-4 border border-emerald-500/30">
            <Recycle className="w-6 h-6 animate-spin-slow" />
          </div>
          <ul className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400 mb-3">
            <li><Link to="/" className="hover:underline text-slate-300">Trang Chủ</Link></li>
            <li>/</li>
            <li><span>Dịch Vụ</span></li>
          </ul>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white font-display tracking-tight">
            {servicesPageConfig.header?.title || "Dịch Vụ & Giải Pháp Toàn Diện"}
          </h1>
          {servicesPageConfig.header?.subtitle && (
            <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-xl mx-auto">
              {servicesPageConfig.header.subtitle}
            </p>
          )}
        </div>
      </section>

      {/* 4 Dịch vụ cốt lõi với texture Solox */}
      <LandingServices />

      {/* Bảng phân hệ & Giải pháp phong cách Solox packages.html */}
      <section className="py-20 bg-white border-y border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 block mb-2 font-sans">
              Giải Pháp Cho Mọi Đối Tác
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 font-display tracking-tight">
              Lựa Chọn Vai Trò Của Bạn
            </h2>
            <p className="mt-3 text-sm text-slate-600">
              Dù bạn là người cần giải phóng mặt bằng, nhà thầu cần tiết kiệm chi phí hay tài xế vận tải, MatGreen đều có giải pháp tương ứng.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {packages.map((pkg, idx) => (
              <div
                key={idx}
                className={`rounded-3xl p-8 border flex flex-col justify-between transition-all duration-300 relative ${
                  pkg.highlight
                    ? "bg-stone-50 border-emerald-500 shadow-xl ring-2 ring-emerald-500/20"
                    : "bg-white border-stone-200 shadow-sm hover:shadow-xl"
                }`}
              >
                {pkg.badge && (
                  <div
                    className={`absolute -top-3.5 right-6 px-3.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      pkg.highlight
                        ? "bg-emerald-600 text-white shadow-sm"
                        : "bg-slate-900 text-white"
                    }`}
                  >
                    {pkg.badge}
                  </div>
                )}

                <div>
                  <h3 className="text-xl font-black text-slate-900 font-display mb-1">
                    {pkg.name}
                  </h3>
                  <p className="text-xs text-slate-500 mb-6 font-normal">
                    {pkg.target}
                  </p>

                  <div className="mb-6 pb-6 border-b border-stone-200">
                    <span className="text-3xl sm:text-4xl font-black text-slate-900 font-display">
                      {pkg.price}
                    </span>
                    <span className="text-xs text-slate-400 block mt-1">
                      {pkg.period}
                    </span>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {pkg.features.map((feat, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2.5 text-xs text-slate-700">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="font-medium leading-snug">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <Link
                    to={pkg.btnLink}
                    className={`w-full py-3.5 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm ${
                      pkg.highlight
                        ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                        : "bg-slate-900 hover:bg-slate-800 text-white"
                    }`}
                  >
                    <span>{pkg.btnText}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Banner Parallax lớn */}
      <LandingWhyChoose />

      {/* Thời gian tiếp nhận SLA */}
      <LandingOpening />

      {/* Câu hỏi thường gặp FAQs */}
      <section className="py-20 bg-stone-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 block mb-2 font-sans">
              Giải Đáp Thắc Mắc
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 font-display tracking-tight">
              Câu Hỏi Thường Gặp
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full text-left p-5 flex items-center justify-between gap-4 font-bold text-slate-800 text-sm hover:text-emerald-700 transition-colors cursor-pointer font-display"
                >
                  <span>{faq.q}</span>
                  {openFaq === idx ? (
                    <ChevronUp className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-5 text-xs text-slate-600 leading-relaxed border-t border-stone-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <LandingBrands />
      <LandingFooter />
    </div>
  );
};

export default ServicesPage;
