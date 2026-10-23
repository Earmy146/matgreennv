import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Truck, Recycle, ShieldCheck, Hammer, Layers, Cpu } from "lucide-react";

export const LandingServices: React.FC = () => {
  const services = [
    {
      title: "Điều Phối Xà Bần & Tôn Nền",
      desc: "Giải phóng hàng trăm tấn gạch vỡ, bê tông và vữa cũ từ công trình đập phá đến các dự án san lấp mặt bằng trong bán kính 5km.",
      image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=800&q=80",
      icon: <Truck className="w-5 h-5 text-emerald-600" />,
      tag: "Miễn Phí / Giá Rẻ",
      link: "/dashboard?category=Gạch & Bê tông",
    },
    {
      title: "Thu Hồi Nhôm Kính & Sắt Thép",
      desc: "Bảo toàn nguyên vẹn khung cửa nhôm Xingfa, cửa sắt lùa và xà gồ thép chữ C để gia chủ thu hồi vốn tới 40% chi phí tháo dỡ.",
      image: "https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80",
      icon: <Hammer className="w-5 h-5 text-amber-600" />,
      tag: "Thanh Lý Thu Vốn",
      link: "/dashboard?category=Sắt thép",
    },
    {
      title: "Tái Sinh Gỗ Cốp Pha & Ván Sàn",
      desc: "Gỗ cốp pha phủ phim, xà gồ gỗ thông và ván ép còn tái sử dụng được luân chuyển ngay cho các đội thợ làm nhà tạm, bồn cây.",
      image: "https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?auto=format&fit=crop&w=800&q=80",
      icon: <Layers className="w-5 h-5 text-emerald-600" />,
      tag: "Tuần Hoàn Gỗ",
      link: "/dashboard?category=Gỗ & Ván cốp pha",
    },
    {
      title: "Trợ Lý Bóc Tách Tự Động AI",
      desc: "Chụp một bức ảnh công trường đập phá, AI Advisor sẽ tự động nhận diện chủng loại vật liệu, ước tính khối lượng và gợi ý giá thanh lý.",
      image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
      icon: <Cpu className="w-5 h-5 text-indigo-600" />,
      tag: "Công Nghệ Độc Quyền",
      link: "/ai-advisor",
    },
  ];

  return (
    <section
      id="services"
      className="py-20 lg:py-28 bg-stone-100 relative"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header Solox Style */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <img
            src="/assets/images/shapes/sec-title-s-1.png"
            alt="Solox decorative icon"
            className="mx-auto mb-3 h-5 w-auto object-contain"
          />
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 block mb-2 font-sans">
            Dịch Vụ Tuần Hoàn Toàn Diện
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight font-display">
            Giải Pháp MatGreen Cung Cấp
          </h2>
          <p className="mt-3 text-sm text-slate-600">
            Hỗ trợ toàn diện từ khâu khảo sát, định vị GPS, bóc tách khối lượng đến điều phối đội xe vận chuyển tận chân công trình.
          </p>
        </div>

        {/* Services Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl overflow-hidden shadow-lg border border-stone-200 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between group"
            >
              {/* Image & Floating Icon */}
              <div className="relative h-52 overflow-hidden bg-slate-200">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-3.5 right-3.5 px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-[10px] font-bold text-white uppercase tracking-wider">
                  {item.tag}
                </div>
                {/* Floating Circle Icon */}
                <div className="absolute -bottom-6 left-6 w-12 h-12 rounded-2xl bg-white shadow-lg border border-stone-100 flex items-center justify-center z-10 group-hover:scale-110 transition-transform duration-300">
                  {item.icon}
                </div>
              </div>

              {/* Content */}
              <div className="p-6 pt-9 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 tracking-tight leading-snug font-display group-hover:text-emerald-700 transition-colors">
                    {item.title}
                  </h3>

                  {/* Decorative divider wave shape */}
                  <img
                    src="/assets/images/shapes/service-card-two-s-1.png"
                    alt="Divider"
                    className="my-3 h-2 w-auto opacity-60"
                  />

                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    {item.desc}
                  </p>
                </div>

                <div className="pt-5 mt-5 border-t border-stone-100">
                  <Link
                    to={item.link}
                    className="inline-flex items-center text-xs font-bold text-emerald-700 hover:text-emerald-800 transition-colors group/link"
                  >
                    <span>Khám phá ngay</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1.5 group-hover/link:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LandingServices;
