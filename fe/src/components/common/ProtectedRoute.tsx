import React from "react";
import { Navigate, useLocation, Link } from "react-router-dom";
import { ShieldAlert, ArrowLeft, LogIn } from "lucide-react";
import { useAuthStore } from "@/stores/auth.store";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: "user" | "moderator" | "admin" | "superadmin";
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
}) => {
  const location = useLocation();
  const { user, isAuthenticated } = useAuthStore();

  // 1. Nếu chưa đăng nhập: chuyển hướng về trang login kèm redirect URL
  if (!isAuthenticated || !user) {
    return (
      <Navigate
        to={`/login?redirect=${encodeURIComponent(location.pathname)}`}
        replace
        state={{ message: "Vui lòng đăng nhập tài khoản để thực hiện tính năng này." }}
      />
    );
  }

  // 2. Nếu có yêu cầu quyền admin mà tài khoản không phải admin
  const roleLevels = { user: 0, moderator: 1, admin: 2, superadmin: 3 };
  if (requiredRole && roleLevels[user.role] < roleLevels[requiredRole]) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-6 text-center">
        <div className="max-w-md bg-white p-8 rounded-3xl border border-rose-200 shadow-xl space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
            <ShieldAlert className="w-9 h-9" />
          </div>
          <h2 className="text-xl font-black text-slate-900">
            Bạn Không Có Quyền Truy Cập
          </h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            Khu vực này yêu cầu tài khoản Quản trị viên hoặc Kiểm duyệt viên. Tài khoản hiện tại của bạn là{" "}
            <strong className="text-slate-800">
              "{user.name}" ({user.role === "admin" ? "Quản trị viên" : user.role === "moderator" ? "Kiểm duyệt viên" : "Thành viên"})
            </strong>.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-center">
            <Link
              to="/dashboard"
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs inline-flex items-center justify-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Về Bảng Điều Khiển
            </Link>
            <Link
              to="/login"
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs inline-flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/20 transition-colors"
            >
              <LogIn className="w-4 h-4" /> Đăng Nhập Tài Khoản Khác
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
