import React from "react";
import { Link } from "react-router-dom";
import { Star, MapPin, Eye, Heart, ArrowRight, CheckCircle2 } from "lucide-react";

export const LandingProducts: React.FC = () => {
  const products = [
    {
      id: "mat-prod-1",
      title: "Gạch Đỏ Đặc Cũ Tháo Dỡ Nhà Phố",
      category: "Gạch & Bê tông",
      price: "0đ (Cho Tặng)",
      isFree: true,
      unit: "viên",
      distance: "1.2 km",
      address: "Đống Đa, Hà Nội",
      image: "https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&w=600&q=80",
      rating: 5,
    },
    {
      id: "mat-prod-2",
      title: "Sắt Hộp 40x80 & Xà Gồ Mạ Kẽm 1.8mm",
      category: "Sắt thép",
      price: "45.000đ",
      isFree: false,
      unit: "cây",
      distance: "2.8 km",
      address: "Thanh Xuân, Hà Nội",
      image: "https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=600&q=80",
      rating: 5,
    },
    {
      id: "mat-prod-3",
      title: "Bộ Cửa Đi Nhôm Kính Xingfa 4 Cánh",
      category: "Cửa & Nhôm kính",
      price: "1.800.000đ",
      isFree: false,
      unit: "bộ",
      distance: "3.5 km",
      address: "Cầu Giấy, Hà Nội",
      image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=600&q=80",
      rating: 5,
    },
    {
      id: "mat-prod-4",
      title: "Ván Cốp Pha Phủ Phim 15mm Còn Đẹp",
      category: "Gỗ & Ván sàn",
      price: "60.000đ",
      isFree: false,
      unit: "tấm",
      distance: "4.1 km",
      address: "Nam Từ Liêm, Hà Nội",
      image: "https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?auto=format&fit=crop&w=600&q=80",
      rating: 5,
    },
  ];

  return (
    <section className="py-20 bg-stone-50 relative z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Title Solox Style */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <img
            src="/assets/images/shapes/sec-title-s-1.png"
            alt="Solox decorative icon"
            className="mx-auto mb-3 h-5 w-auto object-contain"
          />
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 block mb-2 font-sans">
            Nguồn Cung Cập Nhật Mới Nhất
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight font-display">
            Vật Liệu Đang Chờ Bốc Dỡ
          </h2>
          <p className="mt-3 text-sm text-slate-600">
            Xem nhanh các lô vật liệu tháo dỡ còn nguyên vẹn trong khu vực bạn sinh sống và làm việc.
          </p>
        </div>

        {/* 4-column Product Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7">
          {products.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl overflow-hidden shadow-md border border-stone-200 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between group"
            >
              {/* Product Image + Floating Actions */}
              <div className="relative h-56 overflow-hidden bg-slate-100">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Distance Badge */}
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-emerald-400" />
                  Cách {item.distance}
                </div>

                {/* Free Badge */}
                {item.isFree && (
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-emerald-600 text-white text-[10px] font-black uppercase tracking-wider shadow-sm">
                    Tặng 0đ
                  </div>
                )}

                {/* Action Buttons overlay (heart & eye) */}
                <div className="absolute bottom-3 right-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Link
                    to="/dashboard"
                    className="w-9 h-9 rounded-full bg-white shadow-md flex items-center justify-center text-slate-700 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
                    title="Xem chi tiết"
                  >
                    <Eye className="w-4 h-4" />
                  </Link>
                  <Link
                    to="/saved"
                    className="w-9 h-9 rounded-full bg-white shadow-md flex items-center justify-center text-slate-700 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Lưu tin"
                  >
                    <Heart className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* Product Content */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  {/* Rating Stars */}
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                    ))}
                    <span className="text-[10px] text-slate-400 ml-1 font-medium">(Đã kiểm định)</span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 tracking-tight leading-snug line-clamp-2 group-hover:text-emerald-700 transition-colors font-display">
                    {item.title}
                  </h3>

                  <div className="mt-1 text-[11px] text-slate-500 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                    <span className="truncate">{item.address}</span>
                  </div>

                  {/* Price Tag */}
                  <div className="mt-3 text-base font-extrabold text-amber-600">
                    {item.price} {!item.isFree && <span className="text-xs text-slate-400 font-normal">/ {item.unit}</span>}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-stone-100">
                  <Link
                    to="/dashboard"
                    className="w-full py-2.5 rounded-xl bg-stone-100 hover:bg-emerald-600 hover:text-white text-slate-700 text-xs font-bold transition-all duration-300 flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <span>Xem vị trí & Liên hệ</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link
            to="/dashboard"
            className="solox-btn solox-btn--outline"
          >
            <span>Khám Phá Toàn Bộ Vật Liệu Trên Radar</span>
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default LandingProducts;
