import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import {
  Recycle,
  Lock,
  Mail,
  User as UserIcon,
  Phone,
  MapPin,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  RefreshCw,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useAuthStore } from "@/stores/auth.store";
import { authApi } from "@/services/api";

type AuthMode = "login" | "register" | "verify" | "forgot" | "reset";

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const redirectTarget = searchParams.get("redirect") || "/dashboard";

  const { setAuth } = useAuthStore();

  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [otp, setOtp] = useState("");
  const [resetPassword, setResetPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Hiển thị thông báo nếu bị chuyển hướng từ Protected Route
  useEffect(() => {
    if (location.state && (location.state as any).message) {
      setErrorMsg((location.state as any).message);
    }
  }, [location.state]);

  // Bộ đếm ngược thời gian gửi lại mã OTP (60s)
  const [resendCountdown, setResendCountdown] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendCountdown > 0) {
      timer = setTimeout(() => {
        setResendCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCountdown]);

  const clearMessages = () => {
    setErrorMsg(null);
    setSuccessMsg(null);
  };

  // Xử lý Đăng Nhập
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();
    setLoading(true);

    try {
      const response = await authApi.login({ email, password });
      const data = response.data;

      // Trường hợp tài khoản chưa xác thực qua Gmail
      if (data.needVerify) {
        setSuccessMsg(
          data.message || "Tài khoản chưa được kích hoạt. Mã OTP đã được gửi đến Gmail của bạn."
        );
        setMode("verify");
        setResendCountdown(60);
        return;
      }

      if (data.user && data.token) {
        setAuth(data.user, data.token);
        setSuccessMsg("Đăng nhập thành công! Đang chuyển hướng...");

        // Phân tách luồng chuyển hướng:
        // Admin / Moderator tự động chuyển vào Cổng Quản Trị /admin
        // Người dùng thường tự động chuyển vào Bảng Điều Khiển /dashboard
        const explicitRedirect = searchParams.get("redirect");
        const destination = explicitRedirect
          ? explicitRedirect
          : data.user.role === "admin" || data.user.role === "moderator"
          ? "/admin"
          : "/dashboard";

        setTimeout(() => navigate(destination), 800);
      }
    } catch (err: any) {
      setErrorMsg(
        err.response?.data?.message || "Đăng nhập thất bại. Vui lòng kiểm tra lại email hoặc mật khẩu."
      );
    } finally {
      setLoading(false);
    }
  };

  // Xử lý Đăng Ký
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();
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
        response.message || "Mã OTP xác thực 6 số đã được gửi tới hòm thư Gmail của bạn!"
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

  // Xử lý Xác thực OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();

    if (!otp || otp.trim().length !== 6) {
      setErrorMsg("Vui lòng nhập đúng mã OTP gồm 6 chữ số");
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
        setSuccessMsg("Xác thực Gmail thành công! Đang đăng nhập...");
        setTimeout(() => navigate("/"), 1000);
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

  // Xử lý Gửi lại mã OTP
  const handleResendOtp = async () => {
    if (resendCountdown > 0 || !email) return;

    clearMessages();
    setLoading(true);

    try {
      const response = await authApi.resendOtp(email);
      setSuccessMsg(response.message || "Đã gửi lại mã OTP mới vào Gmail của bạn.");
      setResendCountdown(60);
    } catch (err: any) {
      setErrorMsg(
        err.response?.data?.message || "Không thể gửi lại mã OTP. Vui lòng thử lại sau."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault(); clearMessages(); setLoading(true);
    try {
      const response = await authApi.forgotPassword(email);
      setSuccessMsg(response.message); setMode("reset");
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || "Không thể gửi mã đặt lại mật khẩu");
    } finally { setLoading(false); }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault(); clearMessages(); setLoading(true);
    try {
      const response = await authApi.resetPassword({ email, otp, newPassword: resetPassword });
      setSuccessMsg(response.message); setMode("login"); setPassword(""); setOtp(""); setResetPassword("");
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || "Không thể đặt lại mật khẩu");
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-10 px-4">
      <div className="w-full max-w-md">
        {/* Card Header & Brand */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-8 shadow-xl shadow-slate-200/50 relative overflow-hidden backdrop-blur-xl">
          {/* Subtle Glow Background Decoration */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-100 rounded-full blur-3xl opacity-60 pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-teal-100 rounded-full blur-3xl opacity-60 pointer-events-none" />

          <div className="text-center mb-6 relative">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white mb-3 shadow-lg shadow-emerald-500/25">
              <Recycle className="w-8 h-8 animate-pulse" />
            </div>

            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              {mode === "login" && "Đăng Nhập MatGreen"}
              {mode === "register" && "Tạo Tài Khoản Mới"}
              {mode === "verify" && "Xác Thực Tài Khoản"}
            </h1>

            <p className="text-xs text-slate-500 mt-1.5 max-w-xs mx-auto">
              {mode === "login" &&
                "Nền tảng kết nối tái sử dụng vật liệu xây dựng và phế phẩm tháo dỡ công trình"}
              {mode === "register" &&
                "Tham gia mạng lưới tuần hoàn phế liệu, vừa tiết kiệm vừa bảo vệ môi trường"}
              {mode === "verify" && (
                <span>
                  Nhập mã OTP 6 số đã được gửi qua email tới{" "}
                  <strong className="text-emerald-700 font-semibold">{email}</strong>
                </span>
              )}
            </p>
          </div>

          {/* Alert Messages */}
          {errorMsg && (
            <div className="mb-5 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5 animate-fadeIn">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
              <div className="leading-relaxed font-medium">{errorMsg}</div>
            </div>
          )}

          {successMsg && (
            <div className="mb-5 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2.5 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
              <div className="leading-relaxed font-medium">{successMsg}</div>
            </div>
          )}

          {/* MODE: LOGIN */}
          {mode === "login" && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Địa chỉ Gmail
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    required
                    placeholder="nguyenvan@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all bg-slate-50/50 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Mật khẩu
                  </label>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all bg-slate-50/50 focus:bg-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-sm shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 active:scale-98 disabled:opacity-60 cursor-pointer"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Đang đăng nhập...
                  </>
                ) : (
                  <>
                    Đăng Nhập Ngay
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {(mode === "forgot" || mode === "reset") && (
            <form onSubmit={mode === "forgot" ? handleForgotPassword : handleResetPassword} className="space-y-4">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Email tài khoản
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm" />
              </label>
              {mode === "reset" && <>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">OTP gửi qua email
                  <input required value={otp} onChange={(e) => setOtp(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm" />
                </label>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Mật khẩu mới
                  <input type="password" required minLength={8} value={resetPassword} onChange={(e) => setResetPassword(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm" />
                </label>
              </>}
              <button disabled={loading} className="w-full rounded-xl bg-emerald-600 py-3 text-sm font-bold text-white disabled:opacity-60">{loading ? "Đang xử lý..." : mode === "forgot" ? "Gửi mã OTP" : "Đặt lại mật khẩu"}</button>
            </form>
          )}

          {/* MODE: REGISTER */}
          {mode === "register" && (
            <form onSubmit={handleRegister} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Họ và tên <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    placeholder="Nguyễn Văn A"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all bg-slate-50/50 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Địa chỉ Gmail <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    required
                    placeholder="example@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all bg-slate-50/50 focus:bg-white"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Mã OTP kích hoạt tài khoản sẽ được gửi qua Gmail này
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Mật khẩu <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    required
                    placeholder="Ít nhất 6 ký tự"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all bg-slate-50/50 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Số điện thoại
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                    <input
                      type="tel"
                      placeholder="0988xxxxxx"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all bg-slate-50/50 focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Khu vực / Quận Huyện
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                    <input
                      type="text"
                      placeholder="Cầu Giấy, Hà Nội"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all bg-slate-50/50 focus:bg-white"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-3 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-sm shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 active:scale-98 disabled:opacity-60 cursor-pointer"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Đang khởi tạo tài khoản...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Đăng Ký & Nhận Mã OTP Gmail
                  </>
                )}
              </button>
            </form>
          )}

          {/* MODE: VERIFY OTP */}
          {mode === "verify" && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="text-center bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <ShieldCheck className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
                <p className="text-xs text-slate-600 font-medium">
                  Vui lòng kiểm tra hộp thư đến (hoặc mục Spam/Quảng cáo) của:
                </p>
                <div className="font-bold text-emerald-700 text-sm mt-0.5">{email}</div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 text-center">
                  Nhập mã xác thực 6 số (OTP)
                </label>
                <input
                  type="text"
                  maxLength={6}
                  required
                  autoFocus
                  placeholder="------"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  className="w-full py-3 text-center text-2xl font-black tracking-[10px] rounded-xl border-2 border-emerald-300 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100 focus:outline-none transition-all bg-white text-slate-800 placeholder:tracking-normal placeholder:font-normal"
                />
              </div>

              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-sm shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 active:scale-98 disabled:opacity-60 cursor-pointer"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Đang kích hoạt...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    Kích Hoạt & Bắt Đầu Ngay
                  </>
                )}
              </button>

              {/* Resend OTP */}
              <div className="pt-2 text-center text-xs text-slate-500">
                Chưa nhận được mã OTP?{" "}
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

          {/* Bottom Switcher */}
          <div className="mt-6 pt-5 border-t border-slate-100 text-center text-xs text-slate-500">
            {mode === "login" && (
              <>
                Chưa có tài khoản?{" "}
                <button
                  type="button"
                  onClick={() => {
                    clearMessages();
                    setMode("register");
                  }}
                  className="text-emerald-700 font-bold hover:underline cursor-pointer"
                >
                  Đăng ký miễn phí ngay
                </button>
                <button type="button" onClick={() => { clearMessages(); setMode("forgot"); }} className="block mx-auto mt-3 text-emerald-700 font-semibold hover:underline">
                  Quên mật khẩu?
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

            {mode === "verify" && (
              <button
                type="button"
                onClick={() => {
                  clearMessages();
                  setMode("login");
                }}
                className="text-slate-500 hover:text-slate-700 font-medium cursor-pointer"
              >
                Quay lại màn hình Đăng nhập
              </button>
            )}
          </div>
        </div>

        {/* Feature Highlights beneath */}
        <div className="mt-6 grid grid-cols-3 gap-3 text-center text-xs text-slate-500">
          <div className="p-2.5 rounded-xl bg-white/70 border border-slate-200/50 backdrop-blur-sm">
            <span className="font-bold text-emerald-700 block text-sm">Bán kính GPS</span>
            Tìm kiếm gần bạn
          </div>
          <div className="p-2.5 rounded-xl bg-white/70 border border-slate-200/50 backdrop-blur-sm">
            <span className="font-bold text-emerald-700 block text-sm">Gmail OTP</span>
            Bảo mật tin cậy
          </div>
          <div className="p-2.5 rounded-xl bg-white/70 border border-slate-200/50 backdrop-blur-sm">
            <span className="font-bold text-emerald-700 block text-sm">AI Bóc Tách</span>
            Phân loại tự động
          </div>
        </div>
      </div>
    </div>
  );
};
