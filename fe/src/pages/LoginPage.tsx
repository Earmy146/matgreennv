import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Compass,
  Eye,
  EyeOff,
  KeyRound,
  Lock,
  Mail,
  MapPin,
  Phone,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  User as UserIcon,
} from "lucide-react";
import { useAuthStore } from "@/stores/auth.store";
import { authApi } from "@/services/api";
import { BrandLogo } from "@/components/common/BrandLogo";

type AuthMode = "login" | "register" | "verify" | "forgot" | "reset";

const MODE_TITLES: Record<AuthMode, { title: string; subtitle: string }> = {
  login: {
    title: "Đăng nhập MatGreen",
    subtitle: "Kết nối cho – nhận và thanh lý vật liệu xây dựng tuần hoàn quanh vị trí của bạn.",
  },
  register: {
    title: "Tạo tài khoản mới",
    subtitle: "Tham gia mạng lưới tuần hoàn vật liệu xây dựng, tiết kiệm chi phí và bảo vệ đô thị.",
  },
  verify: {
    title: "Xác thực mã OTP",
    subtitle: "Nhập mã 6 chữ số đã được gửi tới hộp thư email của bạn để kích hoạt tài khoản.",
  },
  forgot: {
    title: "Khôi phục mật khẩu",
    subtitle: "Nhập email đã đăng ký để nhận mã xác thực đặt lại mật khẩu mới.",
  },
  reset: {
    title: "Đặt lại mật khẩu mới",
    subtitle: "Nhập mã OTP từ email và thiết lập mật khẩu mới an toàn cho tài khoản.",
  },
};

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const explicitRedirect = searchParams.get("redirect");

  const { setAuth } = useAuthStore();

  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [otp, setOtp] = useState("");
  const [resetPassword, setResetPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [resendCountdown, setResendCountdown] = useState(0);

  useEffect(() => {
    if (location.state && (location.state as any).message) {
      setErrorMsg((location.state as any).message);
    }
  }, [location.state]);

  useEffect(() => {
    if (resendCountdown <= 0) return;
    const timer = setTimeout(() => setResendCountdown((prev) => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendCountdown]);

  const clearMessages = () => {
    setErrorMsg(null);
    setSuccessMsg(null);
  };

  const resolveDestination = (role?: string) => {
    if (explicitRedirect) return explicitRedirect;
    if (role === "admin" || role === "moderator") return "/admin";
    return "/dashboard";
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();
    setLoading(true);
    try {
      const response = await authApi.login({ email, password });
      const data = response.data;

      if (data.needVerify) {
        setSuccessMsg(
          data.message || "Tài khoản chưa được kích hoạt. Mã OTP đã được gửi đến email của bạn."
        );
        setMode("verify");
        setResendCountdown(60);
        return;
      }

      if (data.user && data.token) {
        setAuth(data.user, data.token);
        setSuccessMsg("Đăng nhập thành công! Đang chuyển hướng...");
        setTimeout(() => navigate(resolveDestination(data.user.role)), 500);
      }
    } catch (err: any) {
      setErrorMsg(
        err.response?.data?.message ||
          "Đăng nhập thất bại. Vui lòng kiểm tra lại email hoặc mật khẩu."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();
    if (password !== confirmPassword) {
      setErrorMsg("Mật khẩu xác nhận không khớp. Vui lòng kiểm tra lại.");
      return;
    }
    setLoading(true);
    try {
      const response = await authApi.register({
        name,
        email,
        password,
        phone,
        address,
      });
      setSuccessMsg(
        response.message || "Mã OTP xác thực 6 số đã được gửi tới hòm thư email của bạn!"
      );
      setMode("verify");
      setResendCountdown(60);
    } catch (err: any) {
      setErrorMsg(
        err.response?.data?.message || "Đăng ký không thành công. Vui lòng kiểm tra lại thông tin."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();
    if (!otp || otp.trim().length !== 6) {
      setErrorMsg("Vui lòng nhập đúng mã OTP gồm 6 chữ số.");
      return;
    }
    setLoading(true);
    try {
      const response = await authApi.verifyEmail({
        email,
        otp: otp.trim(),
      });
      const data = response.data;
      if (data.user && data.token) {
        setAuth(data.user, data.token);
        setSuccessMsg("Xác thực thành công! Đang vào sàn MatGreen...");
        setTimeout(() => navigate(resolveDestination(data.user.role)), 600);
      } else {
        setSuccessMsg("Xác thực tài khoản thành công! Vui lòng đăng nhập.");
        setMode("login");
      }
    } catch (err: any) {
      setErrorMsg(
        err.response?.data?.message || "Mã OTP không hợp lệ hoặc đã hết hạn. Vui lòng thử lại."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendCountdown > 0 || !email) return;
    clearMessages();
    setLoading(true);
    try {
      const response = await authApi.resendOtp(email);
      setSuccessMsg(response.message || "Đã gửi lại mã OTP mới vào email của bạn.");
      setResendCountdown(60);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || "Không thể gửi lại mã OTP. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();
    setLoading(true);
    try {
      const response = await authApi.forgotPassword(email);
      setSuccessMsg(response.message || "Đã gửi mã OTP đặt lại mật khẩu vào email của bạn.");
      setMode("reset");
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || "Không thể gửi mã đặt lại mật khẩu.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();
    setLoading(true);
    try {
      const response = await authApi.resetPassword({
        email,
        otp: otp.trim(),
        newPassword: resetPassword,
      });
      setSuccessMsg(response.message || "Đặt lại mật khẩu thành công! Bạn có thể đăng nhập ngay.");
      setMode("login");
      setPassword("");
      setOtp("");
      setResetPassword("");
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || "Không thể đặt lại mật khẩu.");
    } finally {
      setLoading(false);
    }
  };

  const currentHeader = MODE_TITLES[mode];

  return (
    <div className="min-h-screen bg-slate-50 grid grid-cols-1 lg:grid-cols-12 font-sans">
      {/* Left Brand & Eco-Tech Showcase Panel (Desktop) */}
      <aside className="hidden lg:flex lg:col-span-5 xl:col-span-6 bg-slate-950 text-white p-10 xl:p-14 flex-col justify-between relative overflow-hidden">
        {/* Subtle Architectural Grid + Emerald Glow */}
        <div
          className="absolute inset-0 opacity-[0.07] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(to right, #34d399 1px, transparent 1px), linear-gradient(to bottom, #34d399 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="absolute -top-32 -left-24 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-24 w-96 h-96 bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex items-center justify-between">
          <Link to="/">
            <BrandLogo size="md" theme="dark" />
          </Link>
          <Link
            to="/materials"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-bold text-emerald-300 transition-colors"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Xem Kho Vật Liệu</span>
          </Link>
        </div>

        <div className="relative z-10 max-w-lg space-y-6 my-auto py-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-400/25 text-emerald-300 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Sàn Tuần Hoàn Vật Liệu Xây Dựng Thông Minh</span>
          </div>

          <h2 className="text-3xl xl:text-4xl font-black leading-tight tracking-tight text-white">
            Biến phế phẩm tháo dỡ thành{" "}
            <span className="text-emerald-400">nguồn vật tư giá trị</span> ngay quanh công trình.
          </h2>

          <p className="text-sm text-slate-300 leading-relaxed">
            Kết nối trực tiếp chủ nhà sắp tháo dỡ (Nhà A) với đội thầu và hộ dân cần gạch, sắt thép,
            cửa nhôm, xà bần tôn nền (Nhà B) theo tọa độ GPS thực tế.
          </p>

          <div className="space-y-3 pt-2">
            {[
              {
                icon: MapPin,
                title: "Định vị Radar bán kính chuẩn xác",
                desc: "Ghim trực tiếp trên bản đồ hoặc lấy GPS, ưu tiên nguồn cung gần nhất để giảm phí xe tải.",
              },
              {
                icon: Sparkles,
                title: "Trợ lý AI & Thị giác máy tính",
                desc: "Chụp ảnh đống vật liệu để AI tự nhận diện danh mục, ước tính khối lượng và gợi ý giá.",
              },
              {
                icon: ShieldCheck,
                title: "Hồ sơ uy tín & Giao dịch 2 chiều",
                desc: "Xác minh số điện thoại, đặt lịch bốc xếp và chấm sao uy tín sau mỗi chuyến bàn giao.",
              },
            ].map((feat) => {
              const Icon = feat.icon;
              return (
                <div
                  key={feat.title}
                  className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-white/5 border border-white/10"
                >
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">{feat.title}</div>
                    <div className="text-xs text-slate-400 mt-0.5 leading-relaxed">{feat.desc}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="relative z-10 text-xs text-slate-400 flex items-center justify-between">
          <span>© {new Date().getFullYear()} MatGreen Vietnam</span>
          <Link to="/" className="hover:text-white transition-colors">
            Về Trang Giới Thiệu →
          </Link>
        </div>
      </aside>

      {/* Right Auth Form Panel */}
      <main className="lg:col-span-7 xl:col-span-6 flex flex-col justify-between p-5 sm:p-8 lg:p-12">
        {/* Top Navigation Bar (Mobile & Quick Back) */}
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-emerald-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Về trang chủ</span>
          </Link>
          <div className="lg:hidden">
            <BrandLogo size="sm" />
          </div>
          <Link
            to="/materials"
            className="text-xs font-bold text-emerald-700 hover:underline"
          >
            Vào kho vật liệu →
          </Link>
        </div>

        <div className="w-full max-w-md mx-auto my-8">
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-lg shadow-slate-200/50">
            <div className="mb-6">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                {currentHeader.title}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1.5 leading-relaxed">
                {mode === "verify" && email ? (
                  <>
                    Nhập mã OTP 6 số vừa gửi tới{" "}
                    <strong className="text-emerald-700">{email}</strong>
                  </>
                ) : (
                  currentHeader.subtitle
                )}
              </p>
            </div>

            {errorMsg && (
              <div className="mb-5 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
                <div className="leading-relaxed font-medium">{errorMsg}</div>
              </div>
            )}

            {successMsg && (
              <div className="mb-5 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
                <div className="leading-relaxed font-medium">{successMsg}</div>
              </div>
            )}

            {/* MODE: LOGIN */}
            {mode === "login" && (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Email đăng nhập
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="email"
                      required
                      placeholder="nguyenvan@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50/50 focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-slate-700">Mật khẩu</label>
                    <button
                      type="button"
                      onClick={() => {
                        clearMessages();
                        setMode("forgot");
                      }}
                      className="text-xs font-semibold text-emerald-700 hover:underline cursor-pointer"
                    >
                      Quên mật khẩu?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50/50 focus:bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Đang đăng nhập...</span>
                    </>
                  ) : (
                    <>
                      <span>Đăng nhập ngay</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* MODE: FORGOT / RESET PASSWORD */}
            {(mode === "forgot" || mode === "reset") && (
              <form
                onSubmit={mode === "forgot" ? handleForgotPassword : handleResetPassword}
                className="space-y-4"
              >
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Email tài khoản
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="email"
                      required
                      placeholder="nguyenvan@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                {mode === "reset" && (
                  <>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Mã OTP 6 số trong email
                      </label>
                      <input
                        required
                        maxLength={6}
                        placeholder="Nhập 6 chữ số"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-bold tracking-widest text-center focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Mật khẩu mới (ít nhất 8 ký tự)
                      </label>
                      <div className="relative">
                        <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                        <input
                          type={showPassword ? "text" : "password"}
                          required
                          minLength={8}
                          placeholder="Nhập mật khẩu mới"
                          value={resetPassword}
                          onChange={(e) => setResetPassword(e.target.value)}
                          className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((v) => !v)}
                          className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                          tabIndex={-1}
                        >
                          {showPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-700 py-3 text-sm font-bold text-white disabled:opacity-60 cursor-pointer transition-colors"
                >
                  {loading
                    ? "Đang xử lý..."
                    : mode === "forgot"
                    ? "Gửi mã OTP khôi phục"
                    : "Xác nhận đổi mật khẩu"}
                </button>
              </form>
            )}

            {/* MODE: REGISTER */}
            {mode === "register" && (
              <form onSubmit={handleRegister} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Họ và tên / Tên đội thầu <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      placeholder="Nguyễn Văn A"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50/50 focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Địa chỉ Email <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="email"
                      required
                      placeholder="example@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50/50 focus:bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Mật khẩu <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        minLength={6}
                        placeholder="Tối thiểu 6 ký tự"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-9 pr-9 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50/50 focus:bg-white"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute right-2.5 top-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                        tabIndex={-1}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Nhập lại mật khẩu <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        required
                        minLength={6}
                        placeholder="Xác nhận lại"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className={`w-full pl-9 pr-9 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 bg-slate-50/50 focus:bg-white ${
                          confirmPassword && confirmPassword !== password
                            ? "border-rose-400 focus:ring-rose-300"
                            : "border-slate-200 focus:ring-emerald-500"
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword((v) => !v)}
                        className="absolute right-2.5 top-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                        tabIndex={-1}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Số điện thoại
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="tel"
                        placeholder="0988xxxxxx"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50/50 focus:bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Khu vực hoạt động
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        placeholder="Cầu Giấy, Hà Nội"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50/50 focus:bg-white"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Đang khởi tạo tài khoản...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Đăng ký & nhận mã OTP</span>
                    </>
                  )}
                </button>
              </form>
            )}

            {/* MODE: VERIFY OTP */}
            {mode === "verify" && (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div className="text-center bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <ShieldCheck className="w-9 h-9 text-emerald-600 mx-auto mb-1.5" />
                  <p className="text-xs text-slate-600">
                    Kiểm tra hộp thư đến hoặc mục Quảng cáo/Spam của:
                  </p>
                  <div className="font-bold text-emerald-700 text-sm mt-0.5">{email}</div>
                </div>

                <div>
                  <input
                    type="text"
                    maxLength={6}
                    required
                    autoFocus
                    placeholder="------"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    className="w-full py-3 text-center text-2xl font-black tracking-[10px] rounded-xl border-2 border-emerald-300 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100 focus:outline-none bg-white text-slate-800 placeholder:tracking-normal placeholder:font-normal"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || otp.length !== 6}
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Đang kích hoạt...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Kích hoạt tài khoản</span>
                    </>
                  )}
                </button>

                <div className="pt-1 text-center text-xs text-slate-500">
                  Chưa nhận được mã?{" "}
                  {resendCountdown > 0 ? (
                    <span className="text-slate-400 font-medium">
                      Gửi lại sau <strong className="text-emerald-600">{resendCountdown}s</strong>
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      disabled={loading}
                      className="text-emerald-700 font-bold hover:underline inline-flex items-center gap-1 cursor-pointer"
                    >
                      <RefreshCw className="w-3 h-3" /> Gửi lại mã OTP
                    </button>
                  )}
                </div>
              </form>
            )}

            {/* Mode Switcher Footer */}
            <div className="mt-6 pt-5 border-t border-slate-100 text-center text-xs text-slate-500">
              {mode === "login" && (
                <>
                  Chưa có tài khoản MatGreen?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      clearMessages();
                      setMode("register");
                    }}
                    className="text-emerald-700 font-bold hover:underline cursor-pointer"
                  >
                    Đăng ký miễn phí
                  </button>
                </>
              )}

              {mode === "register" && (
                <>
                  Đã có tài khoản?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      clearMessages();
                      setMode("login");
                    }}
                    className="text-emerald-700 font-bold hover:underline cursor-pointer"
                  >
                    Đăng nhập tại đây
                  </button>
                </>
              )}

              {(mode === "verify" || mode === "forgot" || mode === "reset") && (
                <button
                  type="button"
                  onClick={() => {
                    clearMessages();
                    setMode("login");
                  }}
                  className="text-slate-600 hover:text-emerald-700 font-semibold cursor-pointer"
                >
                  ← Quay lại màn hình Đăng nhập
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="text-center text-[11px] text-slate-400">
          Bảo mật xác thực OTP qua Email • Dữ liệu vị trí chỉ dùng để kết nối nguồn vật liệu gần bạn.
        </div>
      </main>
    </div>
  );
};
