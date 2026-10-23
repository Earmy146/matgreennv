import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Compass, ArrowLeft, Home, Layers, ShieldCheck } from "lucide-react";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingFooter } from "@/components/landing/LandingFooter";

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      <LandingHeader />

      <main className="flex-1 flex items-center justify-center p-6 py-20 text-center">
        <div className="max-w-xl mx-auto space-y-6">
          <div className="relative inline-block">
            <div className="text-8xl sm:text-9xl font-black text-emerald-950/10 select-none font-display">
              404
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 rounded-3xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200/80 shadow-md">
                <Compass className="w-10 h-10 animate-spin-slow" />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Trang Bạn Tìm Kiếm Không Tồn Tại
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
              Đường dẫn này có thể đã thay đổi hoặc không có trong hệ thống MatGreen. Vui lòng kiểm tra lại URL hoặc chọn các liên kết bên dưới.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => navigate(-1)}
              className="px-5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 font-bold text-xs text-slate-700 flex items-center gap-2 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              Quay lại trang trước
            </button>

            <Link
              to="/"
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 font-bold text-xs text-white flex items-center gap-2 shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
            >
              <Home className="w-4 h-4" />
              Về Trang Chủ
            </Link>

            <Link
              to="/materials"
              className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 font-bold text-xs text-slate-800 flex items-center gap-2 shadow-xs transition-colors"
            >
              <Layers className="w-4 h-4 text-emerald-600" />
              Sàn Kho Vật Liệu
            </Link>
          </div>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
};
