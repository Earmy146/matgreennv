import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Recycle,
  Gift,
  Coins,
  Compass,
  Cpu,
  Truck,
  ShieldCheck,
  Check,
  X,
  ChevronDown,
  ChevronUp,
  ArrowRight,
} from "lucide-react";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingFooter } from "@/components/landing/LandingFooter";

export const ServicesPage: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: "Đăng tin cho tặng vật liệu (Nhà A) có mất phí dịch vụ không?",
      a: "Hoàn toàn miễn phí 100%. MatGreen không thu bất kỳ khoản phí nào khi bạn đăng tin cho tặng xà bần hoặc thanh lý vật liệu cũ.",
    },
    {
      q: "Ai sẽ là người chịu trách nhiệm vận chuyển vật liệu?",
      a: "Thông thường, bên nhận (Nhà B) hoặc đội thợ sẽ tự điều xe ba gác, xe tải đến bốc dỡ và chở đi theo thỏa thuận trực tiếp giữa 2 bên.",
    },
    {
      q: "Làm sao để biết vật liệu đăng trên sàn có thật hay không?",
      a: "MatGreen yêu cầu mọi bài đăng phải có ảnh chụp thực tế tại công trình (được lưu trữ trên Cloudinary), kèm số điện thoại, Zalo chính chủ và khung giờ tiện ghé xem.",
    },
    {
      q: "Trợ lý AI bóc tách khối lượng có chính xác không?",
      a: "Mô hình AI của MatGreen được huấn luyện dựa trên định mức xây dựng Việt Nam, độ chính xác đạt khoảng 85-92% đối với các công trình nhà phố, nhà cấp 4 và biệt thự.",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      <LandingHeader />

      {/* Header Banner */}
      <section className="bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950 text-white py-16 lg:py-24 px-4 sm:px-6 relative text-center">
        <div className="max-w-4xl mx-auto space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            Hệ Sinh Thái Toàn Diện
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Dịch Vụ Tuần Hoàn Vật Liệu Xây Dựng Số 1
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Giải pháp đồng bộ từ khâu bóc tách công trình, định vị vệ tinh GPS, kết nối xe vận tải đến sàn giao dịch cho nhận minh bạch.
          </p>
        </div>
      </section>

      {/* 6 Target Audiences Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest block mb-2">
              Dành Cho Mọi Đối Tượng
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Chúng Tôi Phục Vụ Ai?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* 1 */}
            <div className="p-7 rounded-3xl bg-slate-50 border border-slate-200/80 space-y-3 hover:shadow-lg transition-all">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <Gift className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Gia Chủ Tháo Dỡ (Nhà A)</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Đăng tin xà bần, gạch vỡ cần giải phóng gấp. Đội ngũ người nhận sẽ tự điều xe đến dọn sạch mà không tốn 1 đồng chi phí bãi thải.
              </p>
              <Link to="/post" className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:underline pt-2">
                Đăng tin cho vật liệu ngay <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* 2 */}
            <div className="p-7 rounded-3xl bg-slate-50 border border-slate-200/80 space-y-3 hover:shadow-lg transition-all">
              <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
                <Coins className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Người Cần Vật Tư (Nhà B)</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Quét bản đồ tìm gạch xây, xà bần tôn nền, cửa nhôm kính, cốt thép cách công trình bạn vài km, tiết kiệm tới 70% chi phí mua mới.
              </p>
              <Link to="/dashboard" className="inline-flex items-center gap-1 text-xs font-bold text-teal-700 hover:underline pt-2">
                Quét tìm trên Radar GPS <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* 3 */}
            <div className="p-7 rounded-3xl bg-slate-50 border border-slate-200/80 space-y-3 hover:shadow-lg transition-all">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                <Truck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Đội Xe Vận Tải & Xe Ba Gác</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Nhận thông báo chuyến hàng chở phế liệu ngay tại khu vực hoạt động, tăng thu nhập hàng ngày từ các chuyến xe vận chuyển trung chuyển.
              </p>
              <Link to="/contact" className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 hover:underline pt-2">
                Đăng ký đội xe hợp tác <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* 4 */}
            <div className="p-7 rounded-3xl bg-slate-50 border border-slate-200/80 space-y-3 hover:shadow-lg transition-all">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Trí Tuệ Nhân Tạo (AI) Thẩm Định</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Ước tính khối lượng xà bần, sắt thép phế liệu và đề xuất phương án thu hồi tài chính tối ưu chỉ bằng vài dòng mô tả công trình.
              </p>
              <Link to="/ai-advisor" className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:underline pt-2">
                Trải nghiệm AI Advisor <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* 5 */}
            <div className="p-7 rounded-3xl bg-slate-50 border border-slate-200/80 space-y-3 hover:shadow-lg transition-all">
              <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Đội Thợ Tháo Dỡ Chuyên Nghiệp</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Tiếp cận các công trình cần đập phá nhà, nhận việc liên tục và thanh lý vật tư tháo dỡ nhanh gọn không bị ứ đọng kho bãi.
              </p>
              <Link to="/contact" className="inline-flex items-center gap-1 text-xs font-bold text-teal-700 hover:underline pt-2">
                Gia nhập mạng lưới thợ <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* 6 */}
            <div className="p-7 rounded-3xl bg-slate-50 border border-slate-200/80 space-y-3 hover:shadow-lg transition-all">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Doanh Nghiệp & Dự Án Bền Vững</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Thực hiện cam kết tiêu chuẩn ESG, kinh tế tuần hoàn và cắt giảm dấu chân carbon CO2 cho các công trình chứng nhận công trình xanh.
              </p>
              <Link to="/news" className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:underline pt-2">
                Tìm hiểu báo cáo ESG <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest block mb-2">
              So Sánh Thực Tế
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Tự Đổ Xà Bần vs Qua Sàn MatGreen
            </h2>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-md overflow-hidden">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-900 text-white font-bold">
                <tr>
                  <th className="py-4 px-6">Tiêu chí so sánh</th>
                  <th className="py-4 px-6 text-rose-300">Cách làm truyền thống</th>
                  <th className="py-4 px-6 text-emerald-400">Qua Sàn MatGreen</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="py-4 px-6 font-bold text-slate-800">Chi phí xử lý mặt bằng</td>
                  <td className="py-4 px-6 text-rose-600 font-semibold">Tốn 300K - 1.5M / chuyến xe</td>
                  <td className="py-4 px-6 text-emerald-700 font-bold">0 Đồng (Bên nhận tự chở)</td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-bold text-slate-800">Thời gian tìm người dọn</td>
                  <td className="py-4 px-6 text-slate-500">Mất 2-4 ngày hỏi người quen</td>
                  <td className="py-4 px-6 text-emerald-700 font-bold">15 - 60 phút qua Radar GPS</td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-bold text-slate-800">Thanh lý cửa, sắt thép cũ</td>
                  <td className="py-4 px-6 text-slate-500">Bị ép giá bán phế liệu vụn</td>
                  <td className="py-4 px-6 text-emerald-700 font-bold">Bán đúng giá trị tái sử dụng</td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-bold text-slate-800">Tác động môi trường</td>
                  <td className="py-4 px-6 text-rose-600">Đổ trộm, chôn lấp, ô nhiễm</td>
                  <td className="py-4 px-6 text-emerald-700 font-bold">Tuần hoàn 100%, giảm CO2</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest block mb-2">
              Hỏi Đáp
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Câu Hỏi Thường Gặp
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200 overflow-hidden bg-slate-50/50"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full py-4 px-5 text-left font-bold text-sm text-slate-800 flex items-center justify-between cursor-pointer"
                >
                  <span>{faq.q}</span>
                  {openFaq === idx ? (
                    <ChevronUp className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-4 text-xs text-slate-600 leading-relaxed font-normal border-t border-slate-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
};
