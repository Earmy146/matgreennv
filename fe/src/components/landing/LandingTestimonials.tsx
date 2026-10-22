import React from "react";
import { Star, Quote, MessageSquare } from "lucide-react";

const testimonials = [
  {
    name: "Anh Hoàng Long",
    role: "Chủ thầu thi công & tháo dỡ (Cầu Giấy, Hà Nội)",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    content:
      "Công trình của tôi có gần 40 khối gạch vỡ và xà bần cần dọn gấp để đào móng. Nếu thuê xe ben chở ra bãi thải phải mất hơn 12 triệu. Tôi đăng lên MatGreen tặng 0đ, chỉ 2 tiếng sau đã có chủ công trình cách đó 3km liên hệ xin toàn bộ để tôn nền xưởng. Cả hai bên đều hài lòng tuyệt đối!",
    rating: 5,
    tag: "Bên Cho (Nhà A)",
  },
  {
    name: "Bác Quốc Tuấn",
    role: "Gia chủ cải tạo nhà vườn (Hòa Lạc, Hà Nội)",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
    content:
      "Tôi làm nhà vườn cần nhiều xà gồ thép và cửa nhôm kính. Mua mới thì chi phí đội lên quá cao. Nhờ quét radar bán kính 10km trên MatGreen, tôi mua lại được toàn bộ hệ cửa Xingfa và vì kèo thép của một nhà đang đập đi với giá rẻ chưa tới 35% giá thị trường.",
    rating: 5,
    tag: "Bên Nhận (Nhà B)",
  },
  {
    name: "KTS. Đặng Minh Châu",
    role: "Kiến trúc sư Bền vững (TP. Hồ Chí Minh)",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    content:
      "Vật liệu xây dựng nặng và cồng kềnh, nên việc MatGreen định vị theo bán kính GPS gần nhất là cốt lõi để kinh tế tuần hoàn thành công. Trợ lý AI ước lượng khối lượng cũng rất chính xác, giúp khách hàng của tôi không bị các đội tháo dỡ ép giá phế liệu.",
    rating: 5,
    tag: "Chuyên Gia Kiến Trúc",
  },
];

export const LandingTestimonials: React.FC = () => {
  return (
    <section className="py-20 lg:py-28 bg-slate-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-3">
            <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
            Cộng Đồng Nói Gì Về Chúng Tôi
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Những Câu Chuyện Kết Nối Thực Tế
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-2">
            Hàng ngàn gia chủ và nhà thầu đã giảm được hàng chục triệu đồng chi phí nhờ MatGreen.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex text-amber-400 gap-1">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                    {item.tag}
                  </span>
                </div>

                <Quote className="w-8 h-8 text-emerald-200 mb-2" />

                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-6 italic">
                  "{item.content}"
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <img
                  src={item.avatar}
                  alt={item.name}
                  className="w-11 h-11 rounded-full object-cover border-2 border-emerald-500"
                />
                <div>
                  <h3 className="font-bold text-slate-900 text-sm leading-snug">{item.name}</h3>
                  <p className="text-[11px] text-slate-400">{item.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
