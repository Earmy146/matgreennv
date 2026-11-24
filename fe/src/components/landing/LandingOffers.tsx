import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Gift, Coins, Sparkles, Building2, Truck } from "lucide-react";
import { useSiteConfigStore } from "@/stores/site-config.store";

export const LandingOffers: React.FC = () => {
  const { config } = useSiteConfigStore();
  const offers = config.homePage?.offers;

  const card1 = offers?.card1 || {
    badge: "Miễn Phí 100% (0đ)",
    title: "Nhận Vật Liệu Thừa Cho & Tặng Công Trình",
    desc: "Hàng ngàn tấn xà bần, gạch cũ nguyên vẹn, ván cốp pha và đất đá tôn nền từ các công trình đập phá đang chờ bạn đến chở miễn phí.",
    buttonText: "Tìm Tin Cho Tặng Gần Bạn",
    buttonLink: "/dashboard?type=free",
    subText: "Tự điều xe chở",
  };

  const card2 = offers?.card2 || {
    badge: "Tiết Kiệm Tới 40%",
    title: "Thanh Lý Kho & Thu Hồi Vốn Tháo Dỡ",
    desc: "Sắt hộp, xà gồ thép, cửa nhôm kính Xingfa và thiết bị vệ sinh tháo dỡ còn đẹp 85-95% với mức giá chỉ bằng một nửa vật liệu mới.",
    buttonText: "Xem Vật Tư Thanh Lý",
    buttonLink: "/dashboard?type=sell",
    subText: "Bốc dỡ ngay tại bãi",
  };

  return (
    <section className="py-14 bg-white relative z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Card 1: Nhận Vật Liệu 0đ */}
          <div className="relative rounded-3xl overflow-hidden p-8 sm:p-10 shadow-lg bg-gradient-to-br from-emerald-50 via-white to-teal-50/70 border border-emerald-200/80 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group">
            <div className="absolute -right-12 -bottom-12 w-52 h-52 rounded-full bg-emerald-500/10 blur-2xl pointer-events-none" />
            <Gift className="absolute right-6 bottom-6 w-28 h-28 text-emerald-600/[0.07] pointer-events-none group-hover:scale-110 transition-transform duration-500" />

            <div className="relative z-10 max-w-md">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-600 text-white text-xs font-extrabold uppercase tracking-wider mb-4 shadow-xs">
                <Gift className="w-3.5 h-3.5" />
                {card1.badge}
              </div>

              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-snug mb-3 font-display">
                {card1.title}
              </h3>

              <p className="text-xs sm:text-sm text-slate-600 mb-6 leading-relaxed">
                {card1.desc}
              </p>

              <div className="flex flex-wrap items-center gap-3">
                <Link
                  to={card1.buttonLink || "/dashboard?type=free"}
                  className="solox-btn solox-btn--emerald group-hover:shadow-emerald-600/30"
                >
                  <span>{card1.buttonText}</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
                {card1.subText && (
                  <span className="text-xs text-slate-600 font-semibold flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5 text-emerald-600" /> {card1.subText}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Card 2: Thanh Lý Dọn Kho */}
          <div className="relative rounded-3xl overflow-hidden p-8 sm:p-10 shadow-lg bg-gradient-to-br from-amber-50/80 via-white to-slate-50 border border-amber-200/80 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group">
            <div className="absolute -right-12 -bottom-12 w-52 h-52 rounded-full bg-amber-500/10 blur-2xl pointer-events-none" />
            <Coins className="absolute right-6 bottom-6 w-28 h-28 text-amber-600/[0.07] pointer-events-none group-hover:scale-110 transition-transform duration-500" />

            <div className="relative z-10 max-w-md">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-600 text-white text-xs font-extrabold uppercase tracking-wider mb-4 shadow-xs">
                <Coins className="w-3.5 h-3.5" />
                {card2.badge}
              </div>

              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-snug mb-3 font-display">
                {card2.title}
              </h3>

              <p className="text-xs sm:text-sm text-slate-600 mb-6 leading-relaxed">
                {card2.desc}
              </p>

              <div className="flex flex-wrap items-center gap-3">
                <Link
                  to={card2.buttonLink || "/post"}
                  className="solox-btn solox-btn--dark"
                >
                  <Building2 className="w-4 h-4 mr-2 text-emerald-400" />
                  <span>{card2.buttonText}</span>
                </Link>
                {card2.subText && (
                  <span className="text-xs text-slate-600 font-semibold flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" /> {card2.subText}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LandingOffers;
