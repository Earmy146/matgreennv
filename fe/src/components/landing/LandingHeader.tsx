import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Recycle,
  Phone,
  Mail,
  MapPin,
  Menu,
  X,
  Compass,
  PlusCircle,
  LayoutDashboard,
  LogIn,
  Search,
  Shield,
} from "lucide-react";
import { useAuthStore } from "@/stores/auth.store";
import { useSiteConfigStore } from "@/stores/site-config.store";

export const LandingHeader: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useAuthStore();
  const { config } = useSiteConfigStore();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    setMobileMenuOpen(false);
    if (location.pathname !== "/") {
      navigate(`/#${sectionId}`);
      return;
    }
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="w-full relative z-50">
      {/* Top bar info */}
      <div className="bg-slate-900 text-slate-300 text-xs py-2 px-4 border-b border-slate-800 hidden md:block">
        <div className="max-w-[1400px] mx-auto px-2 sm:px-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
              <Phone className="w-3.5 h-3.5 text-emerald-400" /> Hotline: {config.contact?.hotline || "1900 8899 / 0988 776 655"}
            </span>
            <span className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-slate-400" /> {config.contact?.email || "hotro@matgreen.vn"}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400" /> {config.contact?.offices?.[0]?.address || "Kết nối toàn quốc (Hà Nội, TP.HCM, Đà Nẵng...)"}
            </span>
          </div>

          <div className="flex items-center gap-4">
            {isAuthenticated && user ? (
              <div className="flex items-center gap-3">
                <span className="text-slate-300">
                  Xin chào, <strong className="text-emerald-400">{user.name}</strong>
                </span>
                {user.role === "admin" || user.role === "moderator" ? (
                  <Link
                    to="/admin"
                    className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 font-bold border border-emerald-500/30 text-xs"
                  >
                    <Shield className="w-3.5 h-3.5 text-emerald-400" /> Cổng Quản Trị
                  </Link>
                ) : (
                  <Link
                    to="/dashboard"
                    className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-bold"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5" /> Bảng điều khiển
                  </Link>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1 text-slate-300 hover:text-emerald-400 transition-colors"
                >
                  <LogIn className="w-3.5 h-3.5" /> Đăng nhập / Đăng ký
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div
        className={`w-full transition-all duration-300 ${
          isScrolled
            ? "fixed top-0 left-0 bg-white/95 backdrop-blur-md shadow-md py-3"
            : "bg-white py-4 border-b border-slate-100"
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 sm:gap-3.5 group shrink-0">
            {config.general?.logoUrl ? (
              <div className="w-13 h-13 sm:w-14 sm:h-14 md:w-15 md:h-15 rounded-2xl bg-white border border-slate-200/90 p-1 flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 group-hover:shadow-md transition-all duration-300">
                <img
                  src={config.general.logoUrl}
                  alt={config.general.siteName || "MatGreen"}
                  className="w-full h-full object-contain rounded-xl"
                />
              </div>
            ) : (
              <div className="w-13 h-13 sm:w-14 sm:h-14 md:w-15 md:h-15 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-transform shrink-0">
                <Recycle className="w-7 h-7 sm:w-8 sm:h-8 animate-spin-slow" />
              </div>
            )}
            <div className="flex flex-col justify-center min-w-0 max-w-[180px] sm:max-w-[220px] md:max-w-[260px] xl:max-w-[300px]">
              <span className="text-lg sm:text-xl md:text-2xl font-black tracking-tight text-slate-900 block leading-tight truncate">
                {config.general?.siteName || (
                  <>Mat<span className="text-emerald-600">Green</span></>
                )}
              </span>
              <span
                className="text-[10px] sm:text-[10.5px] font-bold uppercase tracking-wider text-slate-500 block mt-1 truncate"
                title={config.general?.siteTagline || "Vật Liệu Tuần Hoàn"}
              >
                {config.general?.siteTagline || "Vật Liệu Tuần Hoàn"}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-3.5 xl:gap-6 2xl:gap-8 shrink-0">
            <Link
              to="/"
              className={`text-xs xl:text-sm font-bold whitespace-nowrap transition-colors ${
                location.pathname === "/"
                  ? "text-emerald-600 font-extrabold"
                  : "text-slate-700 hover:text-emerald-600"
              }`}
            >
              Trang Chủ
            </Link>
            <Link
              to="/about"
              className={`text-xs xl:text-sm font-bold whitespace-nowrap transition-colors ${
                location.pathname === "/about"
                  ? "text-emerald-600 font-extrabold"
                  : "text-slate-700 hover:text-emerald-600"
              }`}
            >
              Về MatGreen
            </Link>
            <Link
              to="/services"
              className={`text-xs xl:text-sm font-bold whitespace-nowrap transition-colors ${
                location.pathname === "/services"
                  ? "text-emerald-600 font-extrabold"
                  : "text-slate-700 hover:text-emerald-600"
              }`}
            >
              Dịch Vụ & Tính Năng
            </Link>
            <Link
              to="/materials"
              className={`text-xs xl:text-sm font-bold whitespace-nowrap transition-colors ${
                location.pathname === "/materials"
                  ? "text-emerald-600 font-extrabold"
                  : "text-slate-700 hover:text-emerald-600"
              }`}
            >
              Kho Vật Liệu
            </Link>
            <Link
              to="/news"
              className={`text-xs xl:text-sm font-bold whitespace-nowrap transition-colors ${
                location.pathname.startsWith("/news")
                  ? "text-emerald-600 font-extrabold"
                  : "text-slate-700 hover:text-emerald-600"
              }`}
            >
              Tin Tức & Cẩm Nang
            </Link>
            <Link
              to="/contact"
              className={`text-xs xl:text-sm font-bold whitespace-nowrap transition-colors ${
                location.pathname === "/contact"
                  ? "text-emerald-600 font-extrabold"
                  : "text-slate-700 hover:text-emerald-600"
              }`}
            >
              Liên Hệ
            </Link>
          </nav>

          {/* Action Buttons */}
          <div className="hidden sm:flex items-center gap-2 xl:gap-3 shrink-0">
            {isAuthenticated && (user?.role === "admin" || user?.role === "moderator") ? (
              <>
                <Link
                  to="/admin"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-md border border-slate-700"
                >
                  <Shield className="w-4 h-4 text-emerald-400" />
                  Cổng Quản Trị
                </Link>
                <Link
                  to="/materials"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-md shadow-emerald-600/20"
                >
                  <Compass className="w-4 h-4" />
                  Xem Sàn Vật Liệu
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/dashboard"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition-all shadow-xs"
                >
                  <Compass className="w-4 h-4 text-emerald-600" />
                  Bản Đồ Radar
                </Link>

                <Link
                  to="/post"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-md shadow-emerald-600/20 active:scale-98"
                >
                  <PlusCircle className="w-4 h-4" />
                  Đăng Tin Vật Liệu
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
              aria-label="Mở menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-slate-200 px-5 py-4 space-y-3 animate-fadeIn">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full py-2 font-bold text-slate-800 hover:text-emerald-600"
            >
              Trang Chủ
            </Link>
            <Link
              to="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full py-2 font-bold text-slate-800 hover:text-emerald-600"
            >
              Về MatGreen
            </Link>
            <Link
              to="/services"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full py-2 font-bold text-slate-800 hover:text-emerald-600"
            >
              Dịch Vụ & Tính Năng
            </Link>
            <Link
              to="/materials"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full py-2 font-bold text-slate-800 hover:text-emerald-600"
            >
              Kho Vật Liệu
            </Link>
            <Link
              to="/news"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full py-2 font-bold text-slate-800 hover:text-emerald-600"
            >
              Tin Tức & Cẩm Nang
            </Link>
            <Link
              to="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full py-2 font-bold text-slate-800 hover:text-emerald-600"
            >
              Liên Hệ
            </Link>

            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 text-center rounded-xl bg-slate-100 font-bold text-slate-800 text-xs flex items-center justify-center gap-1.5"
              >
                <Compass className="w-4 h-4 text-emerald-600" /> Vào Bản Đồ Radar GPS
              </Link>
              <Link
                to="/post"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 text-center rounded-xl bg-emerald-600 font-bold text-white text-xs flex items-center justify-center gap-1.5"
              >
                <PlusCircle className="w-4 h-4" /> Đăng Tin Cho / Bán Vật Liệu
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
