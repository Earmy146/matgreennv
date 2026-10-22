import React from "react";
import { Link } from "react-router-dom";
import {
  Gift,
  Coins,
  Compass,
  Cpu,
  Truck,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

const services = [
  {
    icon: Gift,
    title: "Cho Nhận Miễn Phí (0đ)",
    subtitle: "Dọn dẹp mặt bằng 0 đồng",
    description:
      "Gia chủ nhà A có xà bần, gạch vỡ, ngói cũ cần dọn gấp. Đăng tin tặng 0đ để các công trình san lấp quanh bạn tự điều xe đến bốc dỡ miễn phí.",
    badge: "Tiết kiệm 100%",
    link: "/dashboard?type=cho_tang",
  },
  {
    icon: Coins,
    title: "Thanh Lý Vật Tư Cũ Giá Rẻ",
    subtitle: "Thu hồi vốn đầu tư",
    description:
      "Cửa nhôm kính, sắt hộp, xà gồ thép, ván cốp pha, thiết bị vệ sinh còn mới 70-90% từ các công trình cải tạo được thanh lý với giá chỉ bằng 30-50% giá mới.",
    badge: "Giá siêu tốt",
    link: "/dashboard?type=can_ban",
  },
  {
    icon: Compass,
    title: "Radar GPS Quét Quanh Bạn",
    subtitle: "Tối ưu cước xe vận chuyển",
    description:
      "Công nghệ định vị vệ tinh tự động quét theo bán kính/đường kính tùy chỉnh (3km, 5km, 10km, 20km). Chỉ hiển thị vật liệu gần bạn nhất để giảm tối đa chi phí vận tải.",
    badge: "Định vị tức thì",
    link: "/dashboard",
  },
  {
    icon: Cpu,
    title: "Trí Tuệ Nhân Tạo (AI) Bóc Tách",
    subtitle: "Thẩm định khối lượng tự động",
    description:
      "Chỉ cần nhập mô tả diện tích nhà cũ sắp đập phá, AI Advisor sẽ phân tích khối lượng xà bần, cốt thép, số viên gạch thu hồi và dự toán giá trị kinh tế.",
    badge: "Công nghệ AI",
    link: "/ai-advisor",
  },
  {
    icon: Truck,
    title: "Kết Nối Xe Ba Gác & Xe Tải",
    subtitle: "Vận chuyển nhanh chóng",
    description:
      "Hệ thống cung cấp danh bạ các đội xe ba gác, xe ben tự đổ 1.5 - 5 tấn chuyên vận chuyển xà bần tại từng khu vực, nhận xe sau 15-30 phút.",
    badge: "Hỗ trợ 24/7",
    link: "/contact",
  },
  {
    icon: ShieldCheck,
    title: "Xác Thực Ảnh Chụp & Liên Hệ Trực Tiếp",
    subtitle: "Minh bạch tuyệt đối",
    description:
      "Mọi bài đăng đều đính kèm ảnh chụp thực tế tải lên Cloudinary cùng số điện thoại, Zalo chính chủ, khung giờ tiện ghé xem công trình.",
    badge: "100% Chính chủ",
    link: "/dashboard",
  },
];

export const LandingServices: React.FC = () => {
  return (
    <section id="services" className="py-20 lg:py-28 bg-slate-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-3">
            Dịch Vụ & Tiện Ích
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Các Tính Năng Đột Phá Tại MatGreen
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-3">
            Nền tảng được tối ưu hóa toàn diện để giải quyết mọi rào cản trong việc tháo dỡ, vận chuyển và tái sử dụng vật liệu xây dựng.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {services.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-3xl p-7 border border-slate-200/80 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300 shadow-sm">
                      <Icon className="w-7 h-7" />
                    </div>
                    <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-600 group-hover:bg-emerald-50 group-hover:text-emerald-700 transition-colors">
                      {item.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-black text-slate-900 group-hover:text-emerald-600 transition-colors">
                    {item.title}
                  </h3>
                  <div className="text-xs font-semibold text-emerald-600 mb-3">
                    {item.subtitle}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-100">
                  <Link
                    to={item.link}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 group-hover:text-emerald-600 transition-colors"
                  >
                    Xem chi tiết tính năng
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
