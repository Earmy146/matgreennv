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
import { LandingStats } from "@/components/landing/LandingStats";
import { LandingTestimonials } from "@/components/landing/LandingTestimonials";

export const AboutPage: React.FC = () => {
  const steps = [
    {
      num: "01",
      title: "Chụp Ảnh & Định Vị Công Trình",
      desc: "Gia chủ hoặc đội thợ nhà A chụp 2-3 tấm ảnh đống vật liệu thừa, chọn vị trí GPS trên bản đồ và ghi số điện thoại liên hệ.",
    },
    {
      num: "02",
      title: "AI Bóc Tách & Quét Bán Kính",
      desc: "Hệ thống tự động phân loại xà bần, gạch, sắt thép và kích hoạt radar thông báo đến các nhà thầu trong bán kính 3-10km.",
    },
    {
      num: "03",
      title: "Kết Nối Đôi Bên Trực Tiếp",
      desc: "Nhà B xem ảnh thực tế, thỏa thuận qua điện thoại/Zalo và điều xe ba gác hoặc xe tải đến chở vật liệu theo lịch hẹn.",
    },
    {
      num: "04",
      title: "Giải Phóng Mặt Bằng 0 Đồng",
      desc: "Mặt bằng nhà A được dọn sạch tinh tươm mà không mất phí đổ rác. Nhà B có vật liệu tôn nền giá rẻ, môi trường xanh sạch.",
    },
  ];

  const team = [
    {
      name: "Nguyễn Văn Quân",
      role: "Nhà Sáng Lập & Kiến Trúc Sư Hệ Thống",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
      bio: "10 năm kinh nghiệm quản lý thi công công trình dân dụng & đam mê công nghệ Net Zero.",
    },
    {
      name: "TS. Lê Hoàng Mai",
      role: "Cố Vấn Khoa Học & Kinh Tế Tuần Hoàn",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80",
      bio: "Chuyên gia nghiên cứu tái chế phế phẩm xây dựng tại Viện Vật Liệu Xây Dựng.",
    },
    {
      name: "Vũ Hải Đăng",
      role: "Trưởng Nhóm Kỹ Thuật AI & GIS Maps",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80",
      bio: "Chuyên gia phát triển thuật toán định vị không gian và thị giác máy tính bóc tách kết cấu.",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      <LandingHeader />

      {/* Page Header Banner */}
      <section className="bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950 text-white py-16 lg:py-24 px-4 sm:px-6 relative overflow-hidden text-center">
        <div className="max-w-4xl mx-auto relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <Leaf className="w-3.5 h-3.5" /> Về MatGreen
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Giải Cứu Hàng Triệu Tấn Vật Liệu Tháo Dỡ Khỏi Các Bãi Chôn Lấp
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Chúng tôi tin rằng trong xây dựng, không có khái niệm "rác thải". Mọi viên gạch, thanh sắt, khối xà bần đều là tài nguyên giá trị nếu được đưa đến đúng công trình đang cần.
          </p>
        </div>
      </section>

      {/* Origin Story Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 relative">
              <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-100">
                <img
                  src="https://images.unsplash.com/photo-1541888946425-d0fbb186156f?w=800&auto=format&fit=crop&q=80"
                  alt="Công trình xây dựng xanh"
                  className="w-full h-[400px] object-cover"
                />
              </div>
            </div>

            <div className="lg:col-span-6 space-y-5">
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest block">
                Câu Chuyện Khởi Nguồn
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-snug">
                Nỗi Trăn Trở Từ Hàng Ngàn Đống Xà Bần Bị Đổ Trộm Ra Ven Đường
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed">
                Tại Việt Nam, mỗi năm phát sinh hơn <strong>12 triệu tấn</strong> phế thải rắn xây dựng. Chi phí vận chuyển xà bần rất đắt đỏ, khiến nhiều đội thợ phải lén lút đổ trộm ra kênh rạch, bãi đất trống gây ô nhiễm môi trường nghiêm trọng.
              </p>
              <p className="text-slate-600 text-sm leading-relaxed">
                Trong khi đó, ở các khu vực ngoại thành hoặc công trình lân cận, người dân phải chi hàng chục triệu đồng để mua cát đá san lấp mới. <strong>MatGreen</strong> ra đời như chiếc cầu nối thông minh, số hóa quá trình trao đổi để biến bài toán đau đầu thành cơ hội tiết kiệm đôi bên.
              </p>

              <div className="pt-2 flex items-center gap-6">
                <div>
                  <span className="text-2xl font-black text-emerald-700 block">70%</span>
                  <span className="text-xs text-slate-500 font-semibold">Giảm chi phí vật tư tôn nền</span>
                </div>
                <div className="w-px h-10 bg-slate-200" />
                <div>
                  <span className="text-2xl font-black text-emerald-700 block">0 Đồng</span>
                  <span className="text-xs text-slate-500 font-semibold">Chi phí dọn dẹp mặt bằng tháo dỡ</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4-Step Process Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest block mb-2">
              Quy Trình Hoạt Động
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              4 Bước Đơn Giản Để Tuần Hoàn Vật Liệu
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, idx) => (
              <div
                key={idx}
                className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:shadow-lg transition-all duration-300 relative group"
              >
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 font-black text-lg flex items-center justify-center mb-5 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  {step.num}
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2 leading-snug">
                  {step.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed font-normal">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Live Stats */}
      <LandingStats />

      {/* Team Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-3">
              <Users className="w-3.5 h-3.5" /> Đội Ngũ Tiên Phong
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Những Người Xây Dựng MatGreen
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-2">
              Kết hợp giữa các kỹ sư xây dựng thực chiến và đội ngũ phát triển công nghệ cao vì môi trường.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((m, idx) => (
              <div
                key={idx}
                className="bg-slate-50 rounded-3xl overflow-hidden border border-slate-200/80 text-center p-6 space-y-4 hover:-translate-y-1 transition-all duration-300 shadow-xs hover:shadow-md"
              >
                <img
                  src={m.image}
                  alt={m.name}
                  className="w-24 h-24 rounded-full object-cover mx-auto border-4 border-emerald-500"
                />
                <div>
                  <h3 className="font-bold text-slate-900 text-base">{m.name}</h3>
                  <span className="text-xs text-emerald-700 font-semibold block mt-0.5">
                    {m.role}
                  </span>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                    {m.bio}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <LandingTestimonials />

      <LandingFooter />
    </div>
  );
};
