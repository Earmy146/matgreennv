import React from "react";
import { Recycle, Building2, Leaf, ThumbsUp } from "lucide-react";

const stats = [
  {
    icon: Recycle,
    value: "5,850+",
    unit: "Tấn",
    label: "Vật Liệu Đã Tuần Hoàn",
    description: "Gạch vỡ, bê tông san lấp, sắt thép, xà gồ được tái sử dụng",
  },
  {
    icon: Building2,
    value: "1,420+",
    unit: "Công trình",
    label: "Kết Nối Thành Công",
    description: "Giữa nhà thầu phá dỡ và các hộ gia đình xây dựng lân cận",
  },
  {
    icon: Leaf,
    value: "450+",
    unit: "Tấn CO2",
    label: "Cắt Giảm Phát Thải",
    description: "Nhờ giảm thiểu rác chôn lấp và quãng đường xe chạy",
  },
  {
    icon: ThumbsUp,
    value: "99.2%",
    unit: "Hài lòng",
    label: "Đánh Giá 5 Sao",
    description: "Về tính minh bạch, tốc độ dọn mặt bằng và độ tin cậy",
  },
];

export const LandingStats: React.FC = () => {
  return (
    <section className="py-16 bg-gradient-to-r from-emerald-800 to-teal-900 text-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6 text-center">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="space-y-2 p-4">
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-emerald-300 mx-auto mb-3 shadow-inner">
                  <Icon className="w-6 h-6" />
                </div>
                <div className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
                  {stat.value}
                </div>
                <div className="text-sm font-bold text-emerald-200 uppercase tracking-wider">
                  {stat.label}
                </div>
                <p className="text-xs text-slate-300 max-w-[200px] mx-auto leading-relaxed">
                  {stat.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
