import React from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, Compass, ArrowRight, Eye } from "lucide-react";

export const LandingGallery: React.FC = () => {
  const galleryItems = [
    {
      image: "/assets/images/gallery/gallery-2-1.jpg",
      title: "Công trình tháo dỡ nhà phố Hoàng Mai",
      tag: "Thu hồi gạch cổ",
    },
    {
      image: "/assets/images/gallery/gallery-2-2.jpg",
      title: "Bốc dỡ sắt hộp & xà gồ C tại Cầu Giấy",
      tag: "Tái sử dụng thép",
    },
    {
      image: "/assets/images/gallery/gallery-2-3.jpg",
      title: "Tập kết cửa nhôm Xingfa còn mới 95%",
      tag: "Thanh lý cửa",
    },
    {
      image: "/assets/images/gallery/gallery-2-4.jpg",
      title: "Điều xe tải chở ván cốp pha tôn móng",
      tag: "Logistics xanh",
    },
  ];

  return (
    <section className="py-16 bg-white overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Cột 1 (8 Cột): 4 ảnh công trình thực tế */}
          <div className="lg:col-span-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 h-full">
              {galleryItems.map((item, idx) => (
                <div
                  key={idx}
                  className="relative rounded-3xl overflow-hidden shadow-lg border border-stone-200 group h-64 sm:h-72"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-300" />
                  
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full bg-emerald-600/90 text-white text-[10px] font-bold uppercase tracking-wider backdrop-blur-md">
                      {item.tag}
                    </span>
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    <h4 className="text-sm font-bold text-white font-display leading-snug">
                      {item.title}
                    </h4>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cột 2 (4 Cột): Khung Thông Tin Niềm Tin Solox */}
          <div className="lg:col-span-4 flex">
            <div
              className="w-full rounded-3xl p-8 sm:p-10 flex flex-col justify-between text-white bg-cover bg-center shadow-xl border border-stone-800 relative overflow-hidden"
              style={{ backgroundImage: "url('/assets/images/shapes/gallery-info-bg.jpg')" }}
            >
              <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs" />

              <div className="relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mb-6">
                  <img
                    src="/assets/images/shapes/gallery-icon.png"
                    alt="Gallery icon"
                    className="w-8 h-8 object-contain"
                  />
                </div>

                <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 block mb-2 font-sans">
                  Minh Bạch Hiện Trường 100%
                </span>

                <h3 className="text-2xl sm:text-3xl font-black leading-snug font-display text-white mb-4">
                  Thư Viện Công Trình <br />
                  <span className="text-emerald-400">Đã Kết Nối Thành Công</span>
                </h3>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                  Mỗi hình ảnh trên MatGreen đều được đính kèm tọa độ GPS và thời điểm chụp thực tế tại công trường. Nói không với ảnh mạng và tin ảo.
                </p>
              </div>

              <div className="relative z-10 pt-8 mt-8 border-t border-white/15">
                <Link
                  to="/dashboard"
                  className="solox-btn solox-btn--emerald w-full"
                >
                  <Compass className="w-4 h-4 mr-2" />
                  <span>Xem Trên Bản Đồ Radar</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LandingGallery;
