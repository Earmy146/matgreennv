import React from "react";
import { Link } from "react-router-dom";
import { Sparkles, Brain, ArrowRight, CheckCircle2, Zap, ShieldCheck } from "lucide-react";

export const LandingAiAdvisor: React.FC = () => {
  return (
    <section className="py-20 lg:py-24 bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 text-white relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-bold tracking-wide uppercase">
              <Zap className="w-3.5 h-3.5" />
              Công Nghệ Độc Quyền
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              Trợ Lý AI Bóc Tách Khối Lượng & Thẩm Định Công Trình
            </h2>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Bạn sắp phá dỡ một ngôi nhà cấp 4 cũ 60m² hay biệt thự 3 tầng nhưng không biết sẽ phát sinh bao nhiêu khối xà bần, thu hồi được bao nhiêu tấn sắt thép và bán được bao nhiêu tiền?
            </p>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              <strong>MatGreen AI Advisor</strong> được huấn luyện bằng cơ sở dữ liệu định mức xây dựng Việt Nam. Chỉ cần nhập mô tả hoặc địa chỉ công trình, AI sẽ tự động phân tích và đưa ra kế hoạch tái sử dụng tối ưu nhất.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-sm text-slate-200">
                  <strong>Dự toán số khối xà bần & số chuyến xe:</strong> Tính chính xác lượng xà bần cần vận chuyển để chủ động thuê xe hoặc tìm công trình san lấp.
                </span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-sm text-slate-200">
                  <strong>Ước tính khối lượng thép & phế liệu:</strong> Thống kê sắt sàn, xà gồ, cửa nhôm và ước lượng số tiền gia chủ có thể thu hồi.
                </span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-sm text-slate-200">
                  <strong>Gợi ý phương án tháo dỡ an toàn:</strong> Hướng dẫn tháo cửa, khung sắt nguyên vẹn để bán được giá gấp 3 lần bán sắt vụn.
                </span>
              </div>
            </div>

            <div className="pt-4">
              <Link
                to="/ai-advisor"
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-600 hover:to-teal-500 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/25 transition-all active:scale-98"
              >
                <Brain className="w-5 h-5 text-slate-950" />
                Trải Nghiệm AI Bóc Tách Ngay
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Right AI Preview Card */}
          <div className="lg:col-span-5">
            <div className="bg-slate-900/90 backdrop-blur-xl border border-emerald-500/30 rounded-3xl p-6 sm:p-7 shadow-2xl relative">
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                    AI
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white leading-none">MatGreen Advisor</h3>
                    <span className="text-[10px] text-emerald-400">Analysis Preview</span>
                  </div>
                </div>
                <span className="text-[10px] bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 px-2.5 py-1 rounded-full font-semibold">
                  Tự Động Bóc Tách
                </span>
              </div>

              {/* Sample output simulated */}
              <div className="space-y-3.5 text-xs">
                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-slate-400 block text-[11px] mb-1">Mô tả đầu vào:</span>
                  <p className="text-white font-medium italic">
                    "Nhà cấp 4 diện tích 70m2, mái tôn, tường gạch 20cm, có 4 bộ cửa nhôm kính cần đập bỏ giải phóng mặt bằng."
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-emerald-950/50 border border-emerald-500/30">
                    <span className="text-emerald-400 text-[11px] block font-semibold">Xà bần dự kiến</span>
                    <strong className="text-lg text-white block">~ 28 m³</strong>
                    <span className="text-[10px] text-slate-300">Khoảng 5 chuyến xe tải 5T</span>
                  </div>
                  <div className="p-3 rounded-xl bg-teal-950/50 border border-teal-500/30">
                    <span className="text-teal-400 text-[11px] block font-semibold">Sắt thép & Xà gồ</span>
                    <strong className="text-lg text-white block">~ 650 kg</strong>
                    <span className="text-[10px] text-slate-300">Giá trị thu hồi ~ 7.5 triệu</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                  <div>
                    <span className="text-slate-400 text-[11px] block">Gạch thẻ tái sử dụng</span>
                    <span className="font-bold text-white">~ 4,500 viên nguyên vẹn</span>
                  </div>
                  <span className="text-xs font-bold text-emerald-400">Tặng 0đ dọn nhanh</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-white/10 text-center">
                <span className="text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Độ chính xác bóc tách ~ 92% theo chuẩn Bộ Xây Dựng
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
