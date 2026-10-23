import React from "react";
import { Clock, PhoneCall, Zap, ShieldCheck } from "lucide-react";

export const LandingOpening: React.FC = () => {
  return (
    <section className="py-6 bg-stone-100 relative z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Icon */}
            <div className="md:col-span-2 flex items-center justify-center md:justify-start">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Clock className="w-8 h-8 animate-pulse-slow" />
              </div>
            </div>

            {/* Tiêu đề & Cam kết */}
            <div className="md:col-span-4 text-center md:text-left">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 flex items-center justify-center md:justify-start gap-1 mb-1">
                <Zap className="w-3.5 h-3.5" /> Điều Phối Siêu Tốc
              </span>
              <h3 className="text-xl sm:text-2xl font-black tracking-tight font-display text-white">
                Thời Gian Tiếp Nhận & Hỗ Trợ
              </h3>
            </div>

            {/* Khung giờ 1 */}
            <div className="md:col-span-3 text-center md:text-left border-t md:border-t-0 md:border-l border-slate-800 pt-4 md:pt-0 md:pl-6">
              <span className="block text-xs text-slate-400 font-medium">Thứ Hai đến Thứ Bảy</span>
              <span className="block text-sm sm:text-base font-extrabold text-emerald-400 mt-0.5">
                07:00 Sáng – 19:00 Tối
              </span>
              <span className="block text-[11px] text-slate-400 mt-1 flex items-center justify-center md:justify-start gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> SLA phản hồi trong 15 phút
              </span>
            </div>

            {/* Khung giờ 2 & Hotline trực ban */}
            <div className="md:col-span-3 text-center md:text-left border-t md:border-t-0 md:border-l border-slate-800 pt-4 md:pt-0 md:pl-6">
              <span className="block text-xs text-slate-400 font-medium">Chủ Nhật & Hotline 24/7</span>
              <a
                href="tel:19008899"
                className="inline-flex items-center gap-1.5 text-sm sm:text-base font-extrabold text-amber-400 hover:text-amber-300 transition-colors mt-0.5"
              >
                <PhoneCall className="w-4 h-4 text-amber-400" /> 1900 8899 (Bấm phím 1)
              </a>
              <span className="block text-[11px] text-slate-400 mt-1">
                Hỗ trợ điều phối xe ba gác & xe tải
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LandingOpening;
