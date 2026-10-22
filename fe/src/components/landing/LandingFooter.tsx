import React from "react";
import { Link } from "react-router-dom";
import {
  Recycle,
  Phone,
  Mail,
  MapPin,
  ArrowUp,
  Facebook,
  Youtube,
  Globe,
  ShieldCheck,
  Heart,
} from "lucide-react";

export const LandingFooter: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-900 relative">
      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Col 1 & 2: Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="inline-flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-600/20">
                <Recycle className="w-6 h-6" />
              </div>
              <span className="text-2xl font-black tracking-tight text-white">
                Mat<span className="text-emerald-500">Green</span>
              </span>
            </Link>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm">
              Nền tảng công nghệ số tiên phong kết nối nguồn vật liệu thừa từ các công trình đập phá, tháo dỡ với người có nhu cầu xung quanh bạn theo bán kính GPS thực tế.
            </p>

            <div className="pt-2 flex items-center gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-white/5 hover:bg-emerald-600 hover:text-white flex items-center justify-center transition-colors"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-white/5 hover:bg-emerald-600 hover:text-white flex items-center justify-center transition-colors"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a
                href="https://matgreen.vn"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-white/5 hover:bg-emerald-600 hover:text-white flex items-center justify-center transition-colors"
              >
                <Globe className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 3: Navigation */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Về MatGreen
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <a href="#about" className="hover:text-emerald-400 transition-colors">
                  Giới thiệu nền tảng
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-emerald-400 transition-colors">
                  Mô hình tuần hoàn 2 chiều
                </a>
              </li>
              <li>
                <Link to="/news" className="hover:text-emerald-400 transition-colors">
                  Tin tức & Kiến thức
                </Link>
              </li>
              <li>
                <a href="#contact" className="hover:text-emerald-400 transition-colors">
                  Liên hệ hợp tác
                </a>
              </li>
              <li>
                <span className="text-slate-500">Mục tiêu Net Zero 2050</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Services */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Tính Năng Nổi Bật
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/dashboard" className="hover:text-emerald-400 transition-colors">
                  Radar GPS Quét Bán Kính
                </Link>
              </li>
              <li>
                <Link to="/post" className="hover:text-emerald-400 transition-colors">
                  Đăng tin Nhà Đập Phá (Cho/Bán)
                </Link>
              </li>
              <li>
                <Link to="/ai-advisor" className="hover:text-emerald-400 transition-colors">
                  Trợ lý AI Bóc Tách Khối Lượng
                </Link>
              </li>
              <li>
                <Link to="/dashboard?type=cho_tang" className="hover:text-emerald-400 transition-colors">
                  Vật Liệu Miễn Phí (0đ)
                </Link>
              </li>
              <li>
                <Link to="/dashboard?type=can_ban" className="hover:text-emerald-400 transition-colors">
                  Thanh Lý Sắt Thép & Cửa Cũ
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 5: Contact Info */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Hỗ Trợ Nhanh
            </h4>
            <ul className="space-y-3 text-xs">
              <li className="flex items-start gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>1900 8899 / 0988 776 655</span>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>hotro@matgreen.vn</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Mỹ Đình, Nam Từ Liêm, Hà Nội</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-900 py-6 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p className="text-slate-500 text-center sm:text-left">
            © {new Date().getFullYear()} MatGreen. Nền tảng kết nối tái chế vật liệu xây dựng tháo dỡ vì môi trường xanh.
          </p>

          <div className="flex items-center gap-4">
            <span className="text-slate-500 inline-flex items-center gap-1">
              Phát triển với <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> cho kinh tế tuần hoàn
            </span>

            <button
              onClick={scrollToTop}
              className="w-8 h-8 rounded-lg bg-white/5 hover:bg-emerald-600 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              title="Về đầu trang"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
