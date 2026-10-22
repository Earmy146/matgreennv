import React, { useState } from "react";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  Building,
  Truck,
  MessageCircle,
} from "lucide-react";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingFooter } from "@/components/landing/LandingFooter";

export const ContactPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        name: "",
        phone: "",
        email: "",
        subject: "",
        message: "",
      });
    }, 4000);
  };

  const offices = [
    {
      city: "Trụ Sở Hà Nội (Miền Bắc)",
      address: "Tòa nhà Sông Đà, Đường Phạm Hùng, Mỹ Đình, Nam Từ Liêm, Hà Nội",
      phone: "0988 776 655",
      email: "hanoi@matgreen.vn",
    },
    {
      city: "Chi Nhánh TP.HCM (Miền Nam)",
      address: "Đường Nguyễn Hữu Thọ, Phường Tân Hưng, Quận 7, TP. Hồ Chí Minh",
      phone: "0912 345 678",
      email: "hcm@matgreen.vn",
    },
    {
      city: "Chi Nhánh Đà Nẵng (Miền Trung)",
      address: "Đường Nguyễn Văn Linh, Quận Hải Châu, TP. Đà Nẵng",
      phone: "0905 112 233",
      email: "danang@matgreen.vn",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      <LandingHeader />

      {/* Header Banner */}
      <section className="bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950 text-white py-16 lg:py-24 px-4 sm:px-6 relative text-center">
        <div className="max-w-4xl mx-auto space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            Hỗ Trợ 24/7 Toàn Quốc
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Liên Hệ Với Đội Ngũ MatGreen
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Chúng tôi luôn lắng nghe và sẵn sàng hỗ trợ khảo sát công trình, điều phối xe vận chuyển vật liệu nhanh chóng trên toàn quốc.
          </p>
        </div>
      </section>

      {/* 3 Offices Cards */}
      <section className="py-16 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {offices.map((off, idx) => (
              <div
                key={idx}
                className="p-6 rounded-3xl bg-slate-50 border border-slate-200/80 space-y-3"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <Building className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">{off.city}</h3>
                <p className="text-xs text-slate-500 flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{off.address}</span>
                </p>
                <div className="pt-2 text-xs text-slate-600 space-y-1">
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-emerald-600" />
                    <strong>{off.phone}</strong>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{off.email}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Map Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Form */}
            <div className="lg:col-span-6 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
              <h2 className="text-2xl font-black text-slate-900 mb-2">
                Gửi Tin Nhắn Cho Chúng Tôi
              </h2>
              <p className="text-xs text-slate-500 mb-6">
                Chuyên viên tư vấn khu vực của MatGreen sẽ liên hệ lại qua điện thoại trong vòng 15 phút.
              </p>

              {submitted ? (
                <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3 animate-fadeIn">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                  <h4 className="text-sm font-bold text-emerald-900">
                    Cảm ơn bạn đã liên hệ!
                  </h4>
                  <p className="text-xs text-emerald-700">
                    Thông tin đã được ghi nhận. Chúng tôi sẽ gọi lại ngay theo số điện thoại đã cung cấp.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Họ và tên *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Nguyễn Văn A"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Số điện thoại *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="0988xxxxxx"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Tiêu đề yêu cầu
                    </label>
                    <input
                      type="text"
                      placeholder="VD: Cần dọn 5 xe xà bần tại Cầu Giấy..."
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Nội dung chi tiết
                    </label>
                    <textarea
                      rows={4}
                      required
                      placeholder="Mô tả cụ thể yêu cầu của bạn, địa chỉ công trình..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none font-normal"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                  >
                    <Send className="w-4 h-4" /> Gửi Yêu Cầu Hỗ Trợ
                  </button>
                </form>
              )}
            </div>

            {/* Interactive Map & Direct Emergency Help */}
            <div className="lg:col-span-6 space-y-6">
              <div className="bg-emerald-900 text-white p-7 rounded-3xl space-y-4 shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base">Cần Dọn Mặt Bằng Khẩn Cấp?</h3>
                    <p className="text-xs text-emerald-200">Đội xe ba gác & xe tải ben ứng trực</p>
                  </div>
                </div>
                <p className="text-xs text-emerald-100 leading-relaxed">
                  Nếu bạn đang bị thanh tra xây dựng nhắc nhở hoặc cần dọn gấp xà bần trong 2 giờ tới, hãy gọi ngay đường dây nóng khẩn cấp của chúng tôi:
                </p>
                <a
                  href="tel:19008899"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-emerald-950 font-black text-sm hover:bg-emerald-50 transition-colors"
                >
                  <Phone className="w-4 h-4 text-emerald-600" /> Gọi Hotline: 1900 8899
                </a>
              </div>

              {/* Map embed box */}
              <div className="rounded-3xl overflow-hidden border border-slate-200 shadow-sm h-72 bg-slate-200">
                <iframe
                  title="MatGreen Headquarters Map"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.4854124673826!2d105.78013407596958!3d21.013253280632296!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab54b9d0e2e5%3A0xb36b5ec63297a7e8!2zVMOyYSBuaMOgIFPDtG5nIMSQw6A!5e0!3m2!1svi!2s!4v1700000000000!5m2!1svi!2s"
                  className="w-full h-full border-0"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
};
