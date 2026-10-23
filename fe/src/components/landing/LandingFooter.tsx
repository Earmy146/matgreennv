import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Send,
  Phone,
  Mail,
  MapPin,
  Clock,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Recycle,
  Sparkles,
  ShieldCheck,
} from "lucide-react";

export const LandingFooter: React.FC = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  return (
    <footer className="bg-slate-950 text-slate-300 relative overflow-hidden border-t border-slate-900">
      {/* Background Shape Pattern */}
      <div
        className="absolute inset-0 bg-repeat opacity-10 pointer-events-none"
        style={{ backgroundImage: "url('/assets/images/shapes/footer-bg-1-1.png')" }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          {/* Cột 1 (4 Cột): Logo & Newsletter */}
          <div className="lg:col-span-4 space-y-5">
            <Link to="/" className="inline-flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
                <Recycle className="w-6 h-6 animate-spin-slow" />
              </div>
              <span className="text-2xl font-black tracking-tight text-white font-display">
                Mat<span className="text-emerald-400">Green</span>
              </span>
            </Link>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Nền tảng công nghệ tiên phong tuần hoàn vật liệu xây dựng tháo dỡ tại Việt Nam. Kết nối cung cầu theo bán kính định vị GPS, giảm thiểu phế thải đô thị.
            </p>

            {/* Newsletter Subscription Form */}
            <form onSubmit={handleSubscribe} className="relative max-w-sm pt-2">
              <input
                type="email"
                placeholder="Nhập email nhận bản tin tuần hoàn..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-2xl bg-white/10 border border-white/15 text-white placeholder:text-slate-500 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400 pr-12"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-3.5 w-9 h-9 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center transition-all cursor-pointer shadow-sm active:scale-95"
                title="Đăng ký nhận tin"
              >
                <Send className="w-4 h-4" />
              </button>
              {subscribed && (
                <span className="block mt-2 text-[11px] font-bold text-emerald-400">
                  Cảm ơn bạn đã đăng ký nhận bản tin MatGreen!
                </span>
              )}
            </form>
          </div>

          {/* Cột 2 (2 Cột): Liên kết nhanh */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-display">
              Liên Kết
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link to="/about" className="hover:text-emerald-400 transition-colors">
                  Về chúng tôi
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-emerald-400 transition-colors">
                  Dịch vụ tuần hoàn
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-emerald-400 transition-colors">
                  Bản đồ Radar GPS
                </Link>
              </li>
              <li>
                <Link to="/news" className="hover:text-emerald-400 transition-colors">
                  Cẩm nang tin tức
                </Link>
              </li>
              <li>
                <Link to="/ai-advisor" className="hover:text-emerald-400 transition-colors">
                  Trợ lý AI Advisor
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-emerald-400 transition-colors">
                  Liên hệ hỗ trợ
                </Link>
              </li>
            </ul>
          </div>

          {/* Cột 3 (3 Cột): Thông tin liên hệ */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-display">
              Liên Hệ Trực Tiếp
            </h4>
            <ul className="space-y-3 text-xs text-slate-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Trụ sở chính: Tầng 8, Tòa Nhà Innovation, Cầu Giấy, Hà Nội</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href="tel:19008899" className="hover:text-emerald-400 transition-colors font-bold text-white">
                  1900 8899 / 0988 776 655
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href="mailto:hotro@matgreen.vn" className="hover:text-emerald-400 transition-colors">
                  hotro@matgreen.vn
                </a>
              </li>
            </ul>
          </div>

          {/* Cột 4 (3 Cột): Thời gian làm việc & Mạng xã hội */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-display">
              Thời Gian Hoạt Động
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Thứ Hai – Thứ Bảy: <strong>07:00 – 19:00</strong> <br />
              Chủ Nhật & Ngày Lễ: <strong>08:00 – 16:00</strong> <br />
              Hệ thống website & Radar định vị hoạt động <strong>24/7</strong>.
            </p>

            <div className="pt-2">
              <h5 className="text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-2.5">
                Kết Nối Cộng Đồng
              </h5>
              <div className="flex items-center gap-2.5">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-xl bg-white/10 hover:bg-emerald-600 text-white flex items-center justify-center transition-colors"
                >
                  <Facebook className="w-4 h-4" />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-xl bg-white/10 hover:bg-emerald-600 text-white flex items-center justify-center transition-colors"
                >
                  <Twitter className="w-4 h-4" />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-xl bg-white/10 hover:bg-emerald-600 text-white flex items-center justify-center transition-colors"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-xl bg-white/10 hover:bg-emerald-600 text-white flex items-center justify-center transition-colors"
                >
                  <Youtube className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar Copyright */}
        <div className="mt-12 pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} MatGreen. Nền tảng kết nối tái sử dụng vật liệu xây dựng và tuần hoàn phế liệu.</p>
          <div className="flex items-center gap-6">
            <Link to="/about" className="hover:text-emerald-400 transition-colors">
              Chính sách bảo mật
            </Link>
            <Link to="/about" className="hover:text-emerald-400 transition-colors">
              Điều khoản sử dụng
            </Link>
            <Link to="/contact" className="hover:text-emerald-400 transition-colors">
              Hỗ trợ kỹ thuật
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;
