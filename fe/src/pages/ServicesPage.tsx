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

export const ServicesPage: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const packages = [
    {
      name: "Gia Chủ / Cá Nhân (Nhà A)",
      target: "Dành cho nhà sắp sửa chữa, đập phá",
      price: "0đ",
      period: "Miễn phí vĩnh viễn",
      badge: "Phổ Biến Nhất",
      highlight: true,
      features: [
        "Đăng tin cho tặng / thanh lý không giới hạn",
        "Tự động định vị GPS công trình chính xác",
        "Trợ lý AI bóc tách khối lượng tự động",
        "Hiển thị trên bản đồ Radar bán kính",
        "Chat thời gian thực & gọi điện trực tiếp",
      ],
      btnText: "Đăng Tin Miễn Phí",
      btnLink: "/post",
    },
    {
      name: "Nhà Thầu / Đội Thợ (Nhà B)",
      target: "Dành cho đội thi công, hoàn thiện",
      price: "0đ",
      period: "Miễn phí trải nghiệm",
      badge: "Tiết Kiệm Chi Phí",
      highlight: false,
      features: [
        "Quét radar tìm vật liệu trong bán kính 20km",
        "Lọc danh mục gạch, sắt thép, gỗ, cát đá",
        "Lưu tin yêu thích để theo dõi công trình",
        "Xem ảnh hiện trường đã kiểm định GPS",
        "Nhận thông báo khi có nguồn cung mới",
      ],
      btnText: "Mở Radar Quét Ngay",
      btnLink: "/dashboard",
    },
    {
      name: "Đội Xe / Đối Tác Logistics",
      target: "Dành cho tài xế xe tải & ba gác",
      price: "Liên hệ",
      period: "Hợp tác đối tác",
      badge: "Thu Nhập Cao",
      highlight: false,
      features: [
        "Nhận đơn chở hàng cự ly ngắn 3-10km",
        "Hỗ trợ ghép chuyến tăng thu nhập mỗi ngày",
        "Tích hợp danh bạ đội xe trên hệ thống",
        "Quyền lợi đối tác vận chuyển ưu tiên",
      ],
      btnText: "Đăng Ký Đội Xe",
      btnLink: "/contact",
    },
  ];

  const faqs = [
    {
      q: "Đăng tin cho tặng vật liệu (Nhà A) có mất phí dịch vụ không?",
      a: "Hoàn toàn miễn phí 100%. MatGreen không thu bất kỳ khoản phí nào khi bạn đăng tin cho tặng xà bần hoặc thanh lý vật liệu cũ.",
    },
    {
      q: "Ai sẽ là người chịu trách nhiệm vận chuyển vật liệu?",
      a: "Thông thường, bên nhận (Nhà B) hoặc đội thợ sẽ tự điều xe ba gác, xe tải đến bốc dỡ và chở đi theo thỏa thuận trực tiếp giữa 2 bên.",
    },
    {
      q: "Làm sao để biết vật liệu đăng trên sàn có thật hay không?",
      a: "MatGreen yêu cầu mọi bài đăng phải có ảnh chụp thực tế tại công trình (được lưu trữ trên Cloudinary), kèm tọa độ GPS và số điện thoại, Zalo chính chủ.",
    },
    {
      q: "Trợ lý AI bóc tách khối lượng có chính xác không?",
      a: "Mô hình AI của MatGreen được huấn luyện dựa trên định mức xây dựng Việt Nam, độ chính xác đạt khoảng 85-92% đối với các công trình nhà phố, nhà cấp 4 và biệt thự.",
    },
  ];

  return (
    <div className="min-h-screen bg-stone-50 text-slate-800 flex flex-col font-sans">
      <LandingHeader />

      {/* Page Header Banner */}
      <section
        className="relative py-20 lg:py-24 bg-slate-950 text-white bg-cover bg-center overflow-hidden text-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1541888946425-d0fbb18f15f7?auto=format&fit=crop&w=1920&q=80')",
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
            Dịch Vụ & Giải Pháp Toàn Diện
          </h1>
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
