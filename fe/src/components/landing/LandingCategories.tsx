import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Layers, Tag } from "lucide-react";

const categories = [
  {
    name: "Gạch & Bê Tông Tháo Dỡ",
    count: "128+ tin đăng",
    image: "https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?w=600&auto=format&fit=crop&q=80",
    description: "Gạch thẻ, gạch ống nguyên vẹn, bê tông đục tỉa làm bờ kè hoặc tôn nền móng.",
    queryCategory: "Gạch & Bê tông",
    popularTag: "Cho 0đ nhiều nhất",
  },
  {
    name: "Sắt Thép & Xà Gồ Kim Loại",
    count: "95+ tin đăng",
    image: "https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?w=600&auto=format&fit=crop&q=80",
    description: "Sắt hộp mạ kẽm, xà gồ thép C/Z, cốt thép phi 10-22 thu hồi từ dầm sàn.",
    queryCategory: "Sắt thép",
    popularTag: "Thanh lý giá hời",
  },
  {
    name: "Cửa & Khung Nhôm Kính",
    count: "64+ tin đăng",
    image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&auto=format&fit=crop&q=80",
    description: "Cửa nhôm Xingfa 4 cánh, cửa sổ lùa, cửa cuốn, kính cường lực 10mm còn mới.",
    queryCategory: "Cửa & Khung nhôm kính",
    popularTag: "Độ mới 85-95%",
  },
  {
    name: "Gỗ Cốp Pha & Ván Ép",
    count: "82+ tin đăng",
    image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&auto=format&fit=crop&q=80",
    description: "Ván phủ phim đổ bê tông, gỗ xà gồ thông, pallet gỗ làm xưởng hoặc nhà vườn.",
    queryCategory: "Gỗ & Ván cốp pha",
    popularTag: "Luân chuyển cao",
  },
  {
    name: "Cát Đá & Xà Bần San Lấp",
    count: "150+ tin đăng",
    image: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=600&auto=format&fit=crop&q=80",
    description: "Xà bần hạt trung, đá dăm lót đường, cát dư thừa sau khi hoàn thiện công trình.",
    queryCategory: "Cát & Đá tôn nền",
    popularTag: "Miễn phí tự xúc",
  },
  {
    name: "Thiết Bị Vệ Sinh & Hoàn Thiện",
    count: "48+ tin đăng",
    image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&auto=format&fit=crop&q=80",
    description: "Bồn cầu Inax/Toto, bồn nước Inox Sơn Hà, chậu rửa bát, gạch men tồn kho thừa.",
    queryCategory: "Thiết bị vệ sinh",
    popularTag: "Hàng chất lượng",
  },
];

export const LandingCategories: React.FC = () => {
  return (
    <section id="categories" className="py-20 lg:py-28 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-3">
              <Layers className="w-3.5 h-3.5 text-emerald-600" />
              Danh Mục Tiêu Biểu
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Kho Vật Liệu Tuần Hoàn Sẵn Có
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-2">
              Khám phá các danh mục vật tư công trình được trao đổi và thanh lý sôi động nhất trên sàn MatGreen.
            </p>
          </div>

          <Link
            to="/dashboard"
            className="mt-4 md:mt-0 inline-flex items-center gap-2 text-sm font-bold text-emerald-700 hover:text-emerald-800 transition-colors group"
          >
            Xem tất cả trên bản đồ Radar
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {categories.map((cat, idx) => (
            <Link
              key={idx}
              to={`/dashboard?category=${encodeURIComponent(cat.queryCategory)}`}
              className="group relative rounded-3xl overflow-hidden border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-end min-h-[320px] bg-slate-900"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/50 to-transparent" />

              <div className="relative z-10 p-6 text-white">
                <div className="flex items-center justify-between mb-2">
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/90 text-slate-950 backdrop-blur-xs">
                    <Tag className="w-3 h-3" /> {cat.popularTag}
                  </span>
                  <span className="text-xs text-slate-300 font-semibold">{cat.count}</span>
                </div>

                <h3 className="text-lg font-black tracking-tight group-hover:text-emerald-400 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-slate-300 line-clamp-2 mt-1.5 leading-relaxed font-normal">
                  {cat.description}
                </p>

                <div className="mt-4 pt-3 border-t border-white/15 flex items-center justify-between text-xs font-bold text-emerald-400 group-hover:text-emerald-300">
                  <span>Khám phá nguồn vật liệu</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
