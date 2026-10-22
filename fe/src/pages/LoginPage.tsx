import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Recycle, Lock, Mail, User as UserIcon } from "lucide-react";
import { useAuthStore } from "@/stores/auth.store";

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate login
    setAuth(
      {
        id: "user-123",
        name: name || "Nguyễn Văn Quân",
        email: email || "user@matgreen.vn",
        phone: "0988776655",
        address: "Hà Nội",
        role: "user",
      },
      "fake_jwt_token_for_matgreen_mvp"
    );
    navigate("/");
  };

  return (
    <div className="max-w-md mx-auto py-8">
      <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white mx-auto mb-3 shadow-md">
            <Recycle className="w-7 h-7" />
          </div>
          <h1 className="text-xl font-black text-slate-900">
            {isRegister ? "Đăng Ký Tài Khoản MatGreen" : "Đăng Nhập MatGreen"}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Kết nối cộng đồng cho nhận và tái sử dụng vật liệu tháo dỡ
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Họ và tên
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  placeholder="Nguyễn Văn A"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                placeholder="you@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Mật khẩu
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all active:scale-98"
          >
            {isRegister ? "Đăng Ký Ngay" : "Đăng Nhập"}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-500">
          {isRegister ? "Đã có tài khoản? " : "Chưa có tài khoản? "}
          <button
            onClick={() => setIsRegister(!isRegister)}
            className="text-emerald-700 font-bold hover:underline"
          >
            {isRegister ? "Đăng nhập tại đây" : "Đăng ký miễn phí"}
          </button>
        </div>
      </div>
    </div>
  );
};
