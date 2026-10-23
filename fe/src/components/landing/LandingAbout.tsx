import React from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, ArrowRight, ShieldCheck, Sparkles, Building2 } from "lucide-react";

export const LandingAbout: React.FC = () => {
  const benefits = [
    "Tiết kiệm 100% chi phí đổ xà bần",
    "Minh bạch tọa độ vị trí công trình qua GPS",
    "Xác thực chéo ảnh hiện trường công trường",
    "Kết nối xe ba gác & xe tải chở hàng siêu tốc",
    "Trợ lý AI bóc tách khối lượng và phân loại",
    "Chung tay vì mục tiêu Net Zero & Giảm rác thải",
  ];

  return (
    <section id="about" className="py-20 lg:py-28 bg-stone-50 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Cột 1 (Col 5): Khung ảnh nghệ thuật Solox với hoa, viền và badge */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Hình ảnh chính bo góc nghệ thuật */}
              <div className="relative rounded-[40px] overflow-hidden shadow-2xl border-4 border-white bg-emerald-900/10 z-10">
                <img
                  src="https://images.unsplash.com/photo-1541888946425-d0fbb18f15f7?auto=format&fit=crop&w=1000&q=80"
                  alt="Công trình tái chế vật liệu MatGreen"
                  className="w-full h-[420px] sm:h-[480px] object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>

              {/* Badge thống kê góc dưới */}
              <div className="absolute -bottom-6 -right-4 sm:-bottom-8 sm:right-6 bg-white/95 backdrop-blur-md p-4 sm:p-5 rounded-3xl shadow-xl border border-stone-200 z-20 flex items-center gap-3.5 max-w-[240px]">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center shrink-0 text-emerald-700 font-black text-lg">
                  15k
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 leading-snug">
                    Tấn phế thải <br />
                    <span className="text-emerald-700 font-extrabold">Được tái sinh mỗi ngày</span>
                  </h4>
                </div>
              </div>
            </div>
          </div>

          {/* Cột 2 (Col 4): Nội dung giới thiệu cốt lõi */}
          <div className="lg:col-span-4 space-y-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
              Cân Bằng Sinh Thái & Kinh Tế
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 leading-tight font-display">
              Giải Pháp Tuần Hoàn <br />
              <span className="text-emerald-700">Tài Nguyên Xây Dựng Số 1</span>
            </h2>

            <p className="text-sm sm:text-base font-semibold text-slate-700 leading-relaxed">
              MatGreen sinh ra để nối liền khoảng cách giữa người thừa không biết bỏ đâu và người thiếu không biết tìm ở đâu.
            </p>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              Tại các đô thị lớn, hàng ngàn ngôi nhà đập đi mỗi ngày tạo ra lượng xà bần khổng lồ gây áp lực lên bãi rác và môi trường. Trong khi đó, ngay tại các phường xã lân cận, nhiều gia đình đang cần đôn nền, làm nhà tạm, lót sân mà phải mua cát đá mới với giá đắt đỏ. Chúng tôi ứng dụng công nghệ định vị và mạng lưới vận chuyển địa phương để giải quyết bài toán này trong 15 phút.
            </p>

            <div className="pt-2">
              <Link
                to="/about"
                className="solox-btn solox-btn--emerald"
              >
                <span>Tìm Hiểu Về MatGreen</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
          </div>

          {/* Cột 3 (Col 3): Danh sách Lợi ích & Chữ ký sáng lập */}
          <div className="lg:col-span-3 space-y-6 bg-white p-6 sm:p-7 rounded-3xl border border-stone-200 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 tracking-tight font-display">
              Lợi Ích Cốt Lõi
            </h3>

            <ul className="space-y-3">
              {benefits.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="font-medium leading-snug">{item}</span>
                </li>
              ))}
            </ul>

            {/* Khối chữ ký và Founder */}
            <div className="pt-5 border-t border-stone-100 flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
                alt="Founder MatGreen"
                className="w-12 h-12 rounded-full object-cover border-2 border-emerald-500/20"
              />
              <div>
                <span className="block text-sm font-bold text-slate-900 font-display">
                  Nguyễn Văn Quân
                </span>
                <span className="block text-[11px] text-emerald-700 font-semibold">
                  Đồng Sáng Lập & Kỹ Sư Hệ Thống MatGreen
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LandingAbout;
