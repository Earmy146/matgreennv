import React from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  Award,
  Calendar,
  CheckCircle2,
  Loader2,
  MapPin,
  MessageSquare,
  Package,
  Pencil,
  ShieldCheck,
  Star,
} from "lucide-react";
import { authApi } from "@/services/api";
import { useAuthStore } from "@/stores/auth.store";
import { MaterialCard } from "@/features/materials/MaterialCard";
import { formatRelativeTime } from "@/lib/utils";

const ROLE_BADGE: Record<string, { label: string; cls: string }> = {
  admin: { label: "Quản trị viên", cls: "bg-slate-900 text-emerald-300" },
  superadmin: { label: "Quản trị cấp cao", cls: "bg-slate-900 text-emerald-300" },
  moderator: { label: "Kiểm duyệt viên", cls: "bg-indigo-50 text-indigo-700 border border-indigo-200" },
  user: { label: "Thành viên cộng đồng", cls: "bg-slate-100 text-slate-700" },
};

export const PublicProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user: currentUser } = useAuthStore();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["public-profile", id],
    queryFn: async () => (await authApi.publicProfile(id as string)).data,
    enabled: Boolean(id),
    retry: 1,
  });

  if (isLoading) {
    return (
      <div className="py-20 flex justify-center text-emerald-700">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="max-w-4xl mx-auto py-8 space-y-4">
        <Link
          to="/materials"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-emerald-700"
        >
          <ArrowLeft className="w-4 h-4" /> Quay lại kho vật liệu
        </Link>
        <div className="rounded-3xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-800">
          Không tìm thấy hồ sơ người dùng này hoặc tài khoản không còn hoạt động.
        </div>
      </div>
    );
  }

  const { user: profile, stats, reviews, activeMaterials } = data;
  const isMe = Boolean(currentUser?.id && currentUser.id === String(profile.id));
  const roleBadge = ROLE_BADGE[profile.role] || ROLE_BADGE.user;

  return (
    <div className="max-w-5xl mx-auto py-2 space-y-6">
      <Link
        to="/materials"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-emerald-700"
      >
        <ArrowLeft className="w-4 h-4" /> Quay lại kho vật liệu
      </Link>

      {/* Top Identity Banner */}
      <section className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-7 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-5">
          <div className="flex items-start gap-4">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-emerald-100 border-2 border-emerald-200 text-emerald-800 font-black text-3xl flex items-center justify-center overflow-hidden shrink-0">
              {profile.avatar ? (
                <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover" />
              ) : (
                profile.name?.[0]?.toUpperCase() || "U"
              )}
            </div>

            <div className="space-y-2 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900">{profile.name}</h1>
                <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${roleBadge.cls}`}>
                  {roleBadge.label}
                </span>
                {profile.phoneVerified && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" /> SĐT đã xác minh
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                {profile.address && (
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                    {profile.address}
                  </span>
                )}
                {profile.createdAt && (
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    Tham gia từ {new Date(profile.createdAt).toLocaleDateString("vi-VN")}
                  </span>
                )}
              </div>

              <p className="text-sm text-slate-600 leading-relaxed max-w-2xl pt-1">
                {profile.bio || "Thành viên chưa cập nhật lời giới thiệu chi tiết."}
              </p>
            </div>
          </div>

          <div className="shrink-0 flex sm:flex-col gap-2">
            {isMe ? (
              <Link
                to="/profile"
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors"
              >
                <Pencil className="w-3.5 h-3.5" /> Chỉnh sửa hồ sơ
              </Link>
            ) : (
              <Link
                to={`/chat?partnerId=${profile.id}`}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors"
              >
                <MessageSquare className="w-4 h-4" /> Nhắn tin trao đổi
              </Link>
            )}
          </div>
        </div>

        {/* 4 Reputation KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-100">
          <div className="rounded-2xl bg-amber-50/70 border border-amber-200/70 p-4">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800">
              <Star className="w-4 h-4 fill-amber-500 text-amber-500" /> Điểm uy tín
            </div>
            <div className="text-2xl font-black text-slate-900 mt-1">
              {stats.reviewCount > 0 ? `${stats.ratingAvg.toFixed(1)} / 5` : "Mới"}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              {stats.reviewCount > 0 ? `Từ ${stats.reviewCount} giao dịch thực tế` : "Chưa có lượt chấm sao"}
            </div>
          </div>

          <div className="rounded-2xl bg-emerald-50/70 border border-emerald-200/70 p-4">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800">
              <Award className="w-4 h-4 text-emerald-600" /> Đã bàn giao
            </div>
            <div className="text-2xl font-black text-slate-900 mt-1">{stats.completedPosts}</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Lô vật liệu hoàn tất</div>
          </div>

          <div className="rounded-2xl bg-slate-50 border border-slate-200/80 p-4">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
              <Package className="w-4 h-4 text-slate-500" /> Tổng bài đăng
            </div>
            <div className="text-2xl font-black text-slate-900 mt-1">{stats.totalPosts}</div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              Đang mở {activeMaterials.length} bài
            </div>
          </div>

          <div className="rounded-2xl bg-blue-50/60 border border-blue-200/70 p-4">
            <div className="flex items-center gap-1.5 text-xs font-bold text-blue-800">
              <ShieldCheck className="w-4 h-4 text-blue-600" /> Trạng thái xác thực
            </div>
            <div className="text-base font-extrabold text-slate-900 mt-1.5">
              {profile.phoneVerified ? "Đã xác minh SĐT" : "Đã xác thực Email"}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">Tài khoản MatGreen</div>
          </div>
        </div>
      </section>

      {/* Active Materials Grid */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black text-slate-900">
            Vật liệu đang sẵn sàng ({activeMaterials.length})
          </h2>
        </div>

        {activeMaterials.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-xs text-slate-500">
            Người dùng hiện không có bài đăng vật liệu nào đang mở.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeMaterials.map((item) => (
              <MaterialCard key={item._id} material={item} />
            ))}
          </div>
        )}
      </section>

      {/* Reviews Section */}
      <section className="space-y-3">
        <h2 className="text-lg font-black text-slate-900">
          Đánh giá từ giao dịch thực tế ({reviews.length})
        </h2>

        {reviews.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-xs text-slate-500">
            Chưa có nhận xét nào cho thành viên này. Các đánh giá chỉ được tạo sau khi giao dịch nhận vật liệu hoàn tất.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {reviews.map((rev) => (
              <article
                key={rev._id}
                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs space-y-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center overflow-hidden shrink-0">
                      {rev.reviewer?.avatar ? (
                        <img
                          src={rev.reviewer.avatar}
                          alt={rev.reviewer.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        rev.reviewer?.name?.[0]?.toUpperCase() || "U"
                      )}
                    </div>
                    <div className="min-w-0">
                      {rev.reviewer?._id ? (
                        <Link
                          to={`/users/${rev.reviewer._id}`}
                          className="font-bold text-xs text-slate-900 hover:text-emerald-700 truncate block"
                        >
                          {rev.reviewer.name}
                        </Link>
                      ) : (
                        <span className="font-bold text-xs text-slate-900">Thành viên</span>
                      )}
                      <span className="text-[10px] text-slate-400">
                        {formatRelativeTime(rev.createdAt)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-0.5 text-amber-500 shrink-0">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < rev.rating ? "fill-amber-400 text-amber-400" : "text-slate-200"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {rev.comment ? (
                  <p className="text-xs text-slate-600 leading-relaxed">“{rev.comment}”</p>
                ) : (
                  <p className="text-xs text-slate-400 italic">Đã chấm {rev.rating} sao cho giao dịch.</p>
                )}
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
