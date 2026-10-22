import React from "react";
import { Link } from "react-router-dom";
import {
  Recycle,
  CheckCircle2,
  ArrowRight,
  Leaf,
  Coins,
  MapPin,
  Sparkles,
} from "lucide-react";

export const LandingAbout: React.FC = () => {
  return (
    <section id="about" className="py-20 lg:py-28 bg-white relative overflow-hidden">
      {/* Background soft shapes */}
      <div className="absolute top-1/2 -right-40 w-80 h-80 bg-emerald-50 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 -left-40 w-80 h-80 bg-teal-50 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Visual Showcase & Badges */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
              <img
                src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&auto=format&fit=crop&q=80"
                alt="Công trình tháo dỡ và tái sử dụng vật liệu"
                className="w-full h-[420px] object-cover hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

              <div className="absolute bottom-6 left-6 right-6 text-white">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest block mb-1">
                  Mô hình 2 Chiều
                </span>
                <p className="text-lg font-black leading-snug">
                  "Không có phế liệu bỏ đi, chỉ có tài nguyên đặt sai chỗ"
                </p>
              </div>
            </div>

            {/* Floating badge */}
            <div className="absolute -bottom-6 -right-4 sm:right-6 bg-slate-900 text-white p-5 rounded-2xl shadow-xl border border-slate-800 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500 flex items-center justify-center text-slate-950">
                <Recycle className="w-7 h-7" />
              </div>
              <div>
                <span className="text-2xl font-black text-emerald-400 block leading-none">
                  100%
                </span>
                <span className="text-xs text-slate-300 font-medium">
                  Kết nối trực tiếp gia chủ & nhà thầu
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Narrative & Values */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
              <Leaf className="w-3.5 h-3.5 text-emerald-600" />
              Về Nền Tảng MatGreen
            </div>

            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
              Giải Pháp Số Hóa Kết Nối Nguồn Vật Liệu Tháo Dỡ Đầu Tiên Tại Việt Nam
            </h2>

            <p className="text-slate-600 text-base leading-relaxed">
              Mỗi ngày có hàng ngàn ngôi nhà, công trình cũ được đập phá và cải tạo. <strong>Nhà A</strong> phải chi rất nhiều tiền để thuê xe ba gác, xe tải chở xà bần, gạch vỡ, cửa gỗ, xà gồ đi vứt. Trong khi đó, ngay gần đó, <strong>Nhà B</strong> đang xây móng, làm đường hoặc dựng nhà xưởng lại đang đỏ mắt tìm kiếm nguồn vật liệu giá rẻ để san lấp và tái sử dụng.
            </p>

            <p className="text-slate-600 text-base leading-relaxed">
              <strong>MatGreen</strong> ra đời để giải quyết triệt để nút thắt này bằng công nghệ bản đồ số: quét bán kính GPS thực tế, cung cấp bằng chứng ảnh chụp rõ ràng và ứng dụng AI phân loại khối lượng.
            </p>

            {/* 4 Pillars of Value */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-emerald-200 transition-colors">
                <div className="flex items-center gap-2.5 mb-2">
                  <Coins className="w-5 h-5 text-emerald-600" />
                  <h3 className="font-bold text-slate-900 text-sm">Tiết Kiệm Chi Phí Cực Lớn</h3>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Nhà A tiết kiệm chi phí bốc dỡ xà bần, Nhà B nhận vật liệu 0đ hoặc mua thanh lý rẻ hơn 50-70%.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-emerald-200 transition-colors">
                <div className="flex items-center gap-2.5 mb-2">
                  <MapPin className="w-5 h-5 text-emerald-600" />
                  <h3 className="font-bold text-slate-900 text-sm">Tối Ưu Cự Ly Vận Chuyển</h3>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Lọc bán kính GPS từ 1km đến 50km, chỉ hiển thị các nguồn vật liệu quanh bạn giúp giảm phí xe cộ.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-emerald-200 transition-colors">
                <div className="flex items-center gap-2.5 mb-2">
                  <Sparkles className="w-5 h-5 text-emerald-600" />
                  <h3 className="font-bold text-slate-900 text-sm">Trợ Lý AI Thẩm Định</h3>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Tự động ước tính khối lượng sắt vụn, gạch, gỗ và gợi ý giá hợp lý theo mô tả công trình.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-emerald-200 transition-colors">
                <div className="flex items-center gap-2.5 mb-2">
                  <Leaf className="w-5 h-5 text-emerald-600" />
                  <h3 className="font-bold text-slate-900 text-sm">Bảo Vệ Môi Trường Xanh</h3>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Hạn chế tối đa rác thải xây dựng đổ trộm ra sông hồ, giảm thiểu phát thải khí carbon CO2.
                </p>
              </div>
            </div>

            <div className="pt-2">
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 text-sm font-bold text-emerald-700 hover:text-emerald-800 transition-colors group"
              >
                Khám phá bản đồ vật liệu ngay hôm nay
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
