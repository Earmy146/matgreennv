import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Gift, Coins, Sparkles, Building2, Truck } from "lucide-react";

export const LandingOffers: React.FC = () => {
  return (
    <section className="py-12 bg-stone-50 relative z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Card 1: Nhận Vật Liệu 0đ */}
          <div
            className="relative rounded-3xl overflow-hidden p-8 sm:p-12 shadow-xl bg-cover bg-center border border-stone-200 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 group"
            style={{ backgroundImage: "url('/assets/images/backgrounds/offer-1-1-bg.png')" }}
          >
            {/* Background shape */}
            <img
              src="/assets/images/shapes/offer-s-1-1.png"
              alt="Decorative shape"
              className="absolute right-0 bottom-0 max-w-[200px] sm:max-w-[260px] pointer-events-none opacity-85 group-hover:scale-105 transition-transform duration-500"
            />

            <div className="relative z-10 max-w-md">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-600 text-white text-xs font-extrabold uppercase tracking-wider mb-4 shadow-sm">
                <Gift className="w-3.5 h-3.5" />
                Miễn Phí 100% (0đ)
              </div>

              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-snug mb-3 font-display">
                Nhận Vật Liệu Thừa <br />
                <span className="text-emerald-700">Cho & Tặng Công Trình</span>
              </h3>

              <p className="text-xs sm:text-sm text-slate-600 mb-6 leading-relaxed">
                Hàng ngàn tấn xà bần, gạch cũ nguyên vẹn, ván cốp pha và đất đá tôn nền từ các công trình đập phá đang chờ bạn đến chở miễn phí.
              </p>

              <div className="flex flex-wrap items-center gap-3">
                <Link
                  to="/dashboard?type=free"
                  className="solox-btn solox-btn--emerald group-hover:shadow-emerald-600/30"
                >
                  <span>Tìm Tin Cho Tặng Gần Bạn</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
                <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-emerald-600" /> Tự điều xe chở
                </span>
              </div>
            </div>
          </div>

          {/* Card 2: Thanh Lý Dọn Kho */}
          <div
            className="relative rounded-3xl overflow-hidden p-8 sm:p-12 shadow-xl bg-cover bg-center border border-stone-200 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 group"
            style={{ backgroundImage: "url('/assets/images/backgrounds/offer-1-2-bg.png')" }}
          >
            {/* Background shape */}
            <img
              src="/assets/images/shapes/offer-s-1-1.png"
              alt="Decorative shape"
              className="absolute right-0 bottom-0 max-w-[200px] sm:max-w-[260px] pointer-events-none opacity-85 group-hover:scale-105 transition-transform duration-500"
            />

            <div className="relative z-10 max-w-md">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-600 text-white text-xs font-extrabold uppercase tracking-wider mb-4 shadow-sm">
                <Coins className="w-3.5 h-3.5" />
                Tiết Kiệm Tới 40%
              </div>

              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-snug mb-3 font-display">
                Thanh Lý Dọn Kho <br />
                <span className="text-amber-700">Giải Phóng Mặt Bằng Siêu Tốc</span>
              </h3>

              <p className="text-xs sm:text-sm text-slate-600 mb-6 leading-relaxed">
                Dành cho Nhà A (chủ thầu, gia chủ sắp đập phá nhà): Đăng tin trong 2 phút để thu hồi vốn từ sắt thép, cửa nhôm kính, tôn lợp và gỗ cũ.
              </p>

              <div className="flex flex-wrap items-center gap-3">
                <Link
                  to="/post"
                  className="solox-btn solox-btn--dark"
                >
                  <Building2 className="w-4 h-4 mr-2 text-emerald-400" />
                  <span>Đăng Tin Công Trình Ngay</span>
                </Link>
                <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" /> Không tốn phí đăng
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LandingOffers;
