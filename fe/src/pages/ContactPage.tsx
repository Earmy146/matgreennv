import React, { useState } from "react";
import { Link } from "react-router-dom";
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
  Recycle,
} from "lucide-react";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { LandingOpening } from "@/components/landing/LandingOpening";
import { LandingBrands } from "@/components/landing/LandingBrands";
import { useSiteConfigStore } from "@/stores/site-config.store";

export const ContactPage: React.FC = () => {
  const { config } = useSiteConfigStore();
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

  const offices = config?.contact?.offices?.length
    ? config.contact.offices
    : [
        {
          city: "Trụ Sở Hà Nội (Miền Bắc)",
          address: "Tòa Nhà Innovation, Cầu Giấy, Hà Nội",
          phone: "0988 776 655",
          email: "hanoi@matgreen.vn",
        },
        {
          city: "Chi Nhánh TP.HCM (Miền Nam)",
          address: "Đường Nguyễn Hữu Thọ, Quận 7, TP. Hồ Chí Minh",
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
    <div className="min-h-screen bg-stone-50 text-slate-800 flex flex-col font-sans">
      <LandingHeader />

      {/* Page Header Banner phong cách Solox */}
      <section
        className="relative py-20 lg:py-24 bg-slate-950 text-white bg-cover bg-center overflow-hidden text-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1541888946425-d0fbb1861593?auto=format&fit=crop&w=1600&q=80')",
        }}
      >
        <div className="absolute inset-0 bg-slate-950/75 backdrop-blur-xs" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 mb-4 border border-emerald-500/30">
            <Recycle className="w-6 h-6 animate-spin-slow" />
          </div>
          <ul className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400 mb-3">
            <li><Link to="/" className="hover:underline text-slate-300">Trang Chủ</Link></li>
            <li>/</li>
            <li><span>Liên Hệ</span></li>
          </ul>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white font-display tracking-tight">
            Liên Hệ Đội Ngũ MatGreen
          </h1>
        </div>
      </section>

      {/* SLA tiếp nhận nhanh */}
      <LandingOpening />

      {/* Contact Form & 3 Văn phòng */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Cột 1 (7 Cột): Form liên hệ */}
            <div className="lg:col-span-7 bg-stone-50 p-8 sm:p-10 rounded-3xl border border-stone-200 shadow-sm">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 block mb-2 font-sans">
                Gửi Tin Nhắn Cho Chúng Tôi
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-display mb-4">
                Bạn Cần Hỗ Trợ Gì Hôm Nay?
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mb-8 leading-relaxed">
                Dù bạn cần điều xe bốc dỡ xà bần gấp, hỗ trợ định vị GPS hay muốn trở thành đối tác logistics, hãy để lại thông tin để kỹ thuật viên liên hệ trong 15 phút.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Họ và tên *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="VD: Nguyễn Văn A"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-white border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Số điện thoại / Zalo *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="VD: 0988 776 655"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-white border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      placeholder="ban@gmail.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-white border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Nhu cầu hỗ trợ
                    </label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl bg-white border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                    >
                      <option value="">Chọn nhu cầu của bạn</option>
                      <option value="Hỗ trợ dọn xà bần gấp">Hỗ trợ dọn xà bần gấp (Nhà A)</option>
                      <option value="Cần tìm vật liệu tôn nền">Cần tìm vật liệu tôn nền (Nhà B)</option>
                      <option value="Đăng ký tài xế / xe tải">Đăng ký tài xế / xe tải vận chuyển</option>
                      <option value="Hợp tác đối tác doanh nghiệp">Hợp tác đối tác doanh nghiệp</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Nội dung chi tiết
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Mô tả hiện trạng công trình, địa chỉ hoặc khối lượng vật liệu cần giải quyết..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <button
                  type="submit"
                  className="solox-btn solox-btn--emerald w-full shadow-md text-sm cursor-pointer active:scale-98"
                >
                  <Send className="w-4 h-4 mr-2" />
                  <span>Gửi Yêu Cầu Hỗ Trợ Ngay</span>
                </button>

                {submitted && (
                  <div className="p-3.5 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Cảm ơn bạn! Đội ngũ điều phối MatGreen sẽ liên hệ lại ngay trong 15 phút.
                  </div>
                )}
              </form>
            </div>

            {/* Cột 2 (5 Cột): Danh sách 3 văn phòng & Google Maps */}
            <div className="lg:col-span-5 space-y-6">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 block mb-1 font-sans">
                Mạng Lưới Chi Nhánh
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 font-display">
                Hiện Diện Tại 3 Miền
              </h3>

              <div className="space-y-4">
                {offices.map((off, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-stone-50 border border-stone-200 hover:border-emerald-500 transition-all shadow-xs"
                  >
                    <h4 className="text-sm font-bold text-slate-900 font-display mb-1 flex items-center gap-2">
                      <Building className="w-4 h-4 text-emerald-600" />
                      {off.city}
                    </h4>
                    <p className="text-xs text-slate-600 mb-2 flex items-start gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <span>{off.address}</span>
                    </p>
                    <div className="flex items-center gap-4 text-xs font-bold text-emerald-700 pt-2 border-t border-stone-200/60">
                      <a href={`tel:${off.phone}`} className="flex items-center gap-1 hover:underline">
                        <Phone className="w-3.5 h-3.5" /> {off.phone}
                      </a>
                      <a href={`mailto:${off.email}`} className="flex items-center gap-1 hover:underline text-slate-500">
                        <Mail className="w-3.5 h-3.5" /> {off.email}
                      </a>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bản đồ định vị Google Maps */}
              <div className="rounded-2xl overflow-hidden shadow-md border border-stone-200 h-56 bg-slate-100">
                <iframe
                  title="Bản đồ MatGreen"
                  src={
                    config?.contact?.mapEmbedUrl &&
                    !config.contact.mapEmbedUrl.includes("!3m") &&
                    !config.contact.mapEmbedUrl.includes("pb=")
                      ? config.contact.mapEmbedUrl
                      : "https://maps.google.com/maps?q=C%E1%BA%A7u%20Gi%E1%BA%A5y%2C%20H%C3%A0%20N%E1%BB%99i%2C%20Vi%E1%BB%87t%20Nam&t=&z=15&ie=UTF8&iwloc=&output=embed"
                  }
                  className="w-full h-full border-0"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <LandingBrands />
      <LandingFooter />
    </div>
  );
};

export default ContactPage;
