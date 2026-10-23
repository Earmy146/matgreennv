import React from "react";
import { Link } from "react-router-dom";
import {
  Recycle,
  Leaf,
  Target,
  Award,
  Users,
  Compass,
  ArrowRight,
  ShieldCheck,
  Building2,
  CheckCircle2,
} from "lucide-react";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { LandingWhyChoose } from "@/components/landing/LandingWhyChoose";
import { LandingStats } from "@/components/landing/LandingStats";
import { LandingTestimonials } from "@/components/landing/LandingTestimonials";
import { LandingBrands } from "@/components/landing/LandingBrands";
import { useSiteConfigStore, DEFAULT_SITE_CONFIG } from "@/stores/site-config.store";

export const AboutPage: React.FC = () => {
  const { config } = useSiteConfigStore();
  const aboutPageConfig = config?.aboutPage || DEFAULT_SITE_CONFIG.aboutPage;

  const steps = aboutPageConfig.steps?.items?.length
    ? aboutPageConfig.steps.items
    : DEFAULT_SITE_CONFIG.aboutPage.steps.items;

  const team = config?.teamMembers?.length
    ? config.teamMembers
    : DEFAULT_SITE_CONFIG.teamMembers;

  const headerBg = aboutPageConfig.header?.bgImageUrl || DEFAULT_SITE_CONFIG.aboutPage.header.bgImageUrl;
  const storyImage1 = aboutPageConfig.story?.image1 || DEFAULT_SITE_CONFIG.aboutPage.story.image1;
  const storyImage2 = aboutPageConfig.story?.image2 || DEFAULT_SITE_CONFIG.aboutPage.story.image2;

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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 mb-4 border border-emerald-500/30">
            <Recycle className="w-6 h-6 animate-spin-slow" />
          </div>
          <ul className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400 mb-3">
            <li><Link to="/" className="hover:underline text-slate-300">Trang Chủ</Link></li>
            <li>/</li>
            <li><span>Về Chúng Tôi</span></li>
          </ul>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white font-display tracking-tight">
            {aboutPageConfig.header?.title || "Về Dự Án MatGreen"}
          </h1>
          {aboutPageConfig.header?.subtitle && (
            <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-xl mx-auto">
              {aboutPageConfig.header.subtitle}
            </p>
          )}
        </div>
      </section>

      {/* Section 1: Câu chuyện sáng lập & why-choose-two phong cách Solox */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Ảnh kép nghệ thuật */}
            <div className="lg:col-span-6 relative">
              <div className="relative mx-auto max-w-lg">
                <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                  <img
                    src={storyImage1}
                    alt={aboutPageConfig.story?.title || "Công trình xây dựng tuần hoàn MatGreen"}
                    className="w-full h-80 sm:h-96 object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="absolute -bottom-8 -right-4 sm:-right-8 w-48 sm:w-60 rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-900">
                  <img
                    src={storyImage2}
                    alt="Kỹ sư kiểm định hiện trường"
                    className="w-full h-36 sm:h-44 object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>
            </div>

            {/* Nội dung */}
            <div className="lg:col-span-6 space-y-5">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
                <Leaf className="w-3.5 h-3.5 text-emerald-700" />
                {aboutPageConfig.story?.badge || "Sứ Mệnh Xanh"}
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 font-display tracking-tight leading-tight">
                {aboutPageConfig.story?.title || "Tái Sinh Tài Nguyên Tháo Dỡ Vì Một Đô Thị Không Rác Thải"}
              </h2>
              <p className="text-sm font-semibold text-slate-700 leading-relaxed">
                {aboutPageConfig.story?.desc1 ||
                  "Mỗi năm tại Việt Nam có hàng chục triệu tấn vật liệu xây dựng bị chôn lấp lãng phí, trong khi hàng ngàn công trình khác lại khai thác cạn kiệt tài nguyên mới."}
              </p>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                {aboutPageConfig.story?.desc2 ||
                  "MatGreen ra đời từ mong muốn ứng dụng công nghệ định vị bán kính để biến 'rác của người này thành vàng của người khác'. Chúng tôi giúp các gia chủ sắp đập phá nhà tìm được những người đang cần vật liệu ngay trong khu vực lân cận, giúp tiết kiệm chi phí bốc dỡ và bảo vệ cảnh quan đô thị."}
              </p>
              <div className="pt-2">
                <Link to="/dashboard" className="solox-btn solox-btn--emerald">
                  <span>Trải Nghiệm Radar Ngay</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Quy trình 4 bước */}
      <section className="py-20 bg-stone-100 border-y border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 block mb-2 font-sans">
              Quy Trình Hoạt Động
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 font-display tracking-tight">
              Tuần Hoàn Vật Liệu Trong 4 Bước
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((st, i) => (
              <div
                key={i}
                className="bg-white p-7 rounded-3xl border border-stone-200 shadow-sm hover:shadow-xl transition-all duration-300 relative group"
              >
                <div className="text-4xl font-black text-emerald-700/20 font-display mb-4 group-hover:text-emerald-700 transition-colors">
                  {st.num}
                </div>
                <h3 className="text-base font-bold text-slate-900 font-display leading-snug mb-2">
                  {st.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  {st.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3: Đội ngũ chuyên gia (Team One phong cách Solox) */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 block mb-2 font-sans">
              Đội Ngũ Phát Triển
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 font-display tracking-tight">
              Những Người Đứng Sau MatGreen
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((m, idx) => (
              <div
                key={idx}
                className="bg-stone-50 rounded-3xl overflow-hidden border border-stone-200 shadow-sm hover:shadow-xl transition-all duration-300 group text-center"
              >
                <div className="h-64 overflow-hidden bg-slate-200">
                  <img
                    src={m.image}
                    alt={m.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-slate-900 font-display group-hover:text-emerald-700 transition-colors">
                    {m.name}
                  </h3>
                  <span className="block text-xs font-semibold text-emerald-700 mb-2">
                    {m.role}
                  </span>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {m.bio}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 4: Parallax Why Choose Us */}
      <LandingWhyChoose />

      {/* Section 5: Funfacts Stats */}
      <LandingStats />

      {/* Section 6: Testimonials & Brands */}
      <LandingTestimonials />
      <LandingBrands />

      <LandingFooter />
    </div>
  );
};

export default AboutPage;
