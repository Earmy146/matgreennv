import React, { useState } from "react";
import { Star, ChevronLeft, ChevronRight, Quote, CheckCircle2 } from "lucide-react";

export const LandingTestimonials: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const testimonials = [
    {
      name: "Kỹ sư Trần Mạnh Cường",
      role: "Chỉ huy trưởng dự án Biệt Thự Vườn Cầu Giấy",
      quote:
        "Tôi đập căn nhà cấp 4 cũ thừa hơn 6 xe tải gạch đỏ đặc và xà bần. Đăng lên MatGreen lúc 9h sáng thì đến 11h trưa đã có một đội thợ đang làm đường cách 2km điều xe tải đến bốc sạch sẽ. Vừa không mất đồng phí đổ phế thải nào, vừa bàn giao mặt bằng đúng tiến độ!",
      rating: 5,
      thumb1: "/assets/images/resources/testi-3-1.jpg",
      thumb2: "/assets/images/resources/testi-3-2.jpg",
    },
    {
      name: "Anh Hoàng Văn Tuấn",
      role: "Chủ thầu thi công nhà phố Hoàng Mai",
      quote:
        "Tôi mua được hơn 30 cây sắt hộp 40x80 và 8 bộ cửa nhôm kính Xingfa của một ngôi nhà sắp cải tạo với giá chỉ bằng một nửa hàng mới. Cửa còn nguyên vẹn, sơn còn bóng loáng. MatGreen thực sự là cứu cánh giúp tiết kiệm ngân sách xây dựng!",
      rating: 5,
      thumb1: "/assets/images/resources/testi-3-2.jpg",
      thumb2: "/assets/images/resources/testi-3-1.jpg",
    },
    {
      name: "Bác Ba Thợ Nề",
      role: "Đội trưởng đội thợ hoàn thiện Thanh Xuân",
      quote:
        "Trước đây nhận được tin báo gạch cũ toàn phải gọi điện hỏi quanh các bãi. Giờ mở bản đồ MatGreen ra là thấy ngay điểm nào gần, có ảnh thật, số điện thoại chủ nhà bấm gọi trực tiếp rất tiện lợi.",
      rating: 5,
      thumb1: "/assets/images/resources/testi-3-1.jpg",
      thumb2: "/assets/images/resources/testi-3-2.jpg",
    },
  ];

  const current = testimonials[activeIndex];

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  return (
    <section
      className="py-20 lg:py-28 bg-stone-100 bg-cover bg-center relative overflow-hidden"
      style={{ backgroundImage: "url('/assets/images/shapes/testimonial-bg-3.jpg')" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Cột 1 (4 Cột): Tiêu đề và nút điều hướng */}
          <div className="lg:col-span-4 space-y-5">
            <div>
              <img
                src="/assets/images/shapes/sec-title-s-1.png"
                alt="Decorative"
                className="mb-3 h-5 w-auto object-contain"
              />
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 block mb-2 font-sans">
                Đánh Giá Thực Tế
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight font-display">
                Khách Hàng Nói Gì Về MatGreen?
              </h2>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              Niềm tin được xây dựng từ hàng ngàn chuyến xe vận chuyển thực tế kết nối đôi bên Nhà A và Nhà B an toàn, văn minh.
            </p>

            {/* Carousel Navigation Buttons */}
            <div className="flex items-center gap-3 pt-4">
              <button
                type="button"
                onClick={handlePrev}
                className="w-12 h-12 rounded-full border-2 border-stone-300 bg-white text-slate-700 hover:border-emerald-600 hover:bg-emerald-600 hover:text-white transition-all flex items-center justify-center shadow-sm cursor-pointer active:scale-95"
                title="Đánh giá trước"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="w-12 h-12 rounded-full border-2 border-stone-300 bg-white text-slate-700 hover:border-emerald-600 hover:bg-emerald-600 hover:text-white transition-all flex items-center justify-center shadow-sm cursor-pointer active:scale-95"
                title="Đánh giá tiếp"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Cột 2 (8 Cột): Thẻ Testimonial Nghệ Thuật Solox */}
          <div className="lg:col-span-8">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-white p-6 sm:p-10 rounded-3xl shadow-xl border border-stone-200 relative">
              {/* Nội dung đánh giá */}
              <div className="md:col-span-8 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="text-lg font-bold text-slate-900 font-display">
                        {current.name}
                      </h4>
                      <span className="text-xs text-emerald-700 font-semibold">
                        {current.role}
                      </span>
                    </div>
                    {/* Stars */}
                    <div className="flex items-center gap-1">
                      {[...Array(current.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed italic">
                    "{current.quote}"
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-stone-100 flex items-center gap-2 text-xs text-emerald-700 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Giao dịch đã xác thực qua MatGreen
                </div>
              </div>

              {/* Hình ảnh đại diện kép phong cách Solox */}
              <div className="md:col-span-4 flex flex-col items-center justify-center relative">
                <div className="relative w-40 h-48 sm:w-44 sm:h-52">
                  {/* Thumb 1 */}
                  <div className="w-32 h-36 rounded-2xl overflow-hidden shadow-lg border-2 border-white absolute top-0 left-0 z-10">
                    <img
                      src={current.thumb1}
                      alt={current.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {/* Thumb 2 */}
                  <div className="w-24 h-28 rounded-2xl overflow-hidden shadow-md border-2 border-white absolute bottom-0 right-0 z-20">
                    <img
                      src={current.thumb2}
                      alt="Công trình"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {/* Flower decoration shape */}
                  <img
                    src="/assets/images/shapes/testi-3-flower.png"
                    alt="Flower shape"
                    className="w-16 h-16 object-contain absolute -bottom-3 -left-3 z-30 animate-float pointer-events-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LandingTestimonials;
