import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Camera,
  CheckCircle2,
  ExternalLink,
  KeyRound,
  Loader2,
  Phone,
  Save,
  ShieldCheck,
  User as UserIcon,
} from "lucide-react";
import { useAuthStore } from "@/stores/auth.store";
import { authApi, uploadApi } from "@/services/api";
import { toast } from "@/stores/toast.store";

export const ProfilePage: React.FC = () => {
  const { user, setAuth, token } = useAuthStore();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    bio: "",
    avatar: "",
  });
  const [passwords, setPasswords] = useState({ currentPassword: "", newPassword: "" });
  const [verificationNote, setVerificationNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        phone: user.phone || "",
        address: user.address || "",
        bio: user.bio || "",
        avatar: user.avatar || "",
      });
    }
  }, [user]);

  const run = async (
    action: () => Promise<{ message: string; data?: any }>,
    onDone?: () => void
  ) => {
    setSaving(true);
    try {
      const result = await action();
      if (result.data?.id && token) {
        setAuth(result.data, token);
      }
      toast.success(result.message || "Cập nhật thành công!");
      onDone?.();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Không thể thực hiện thao tác");
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = async (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.warning("Vui lòng chọn tệp hình ảnh hợp lệ (JPG, PNG, WEBP).");
      return;
    }
    setUploadingAvatar(true);
    try {
      const uploaded = await uploadApi.uploadImage(file, "avatars");
      setForm((prev) => ({ ...prev, avatar: uploaded.url }));
      const result = await authApi.updateProfile({
        name: form.name || user?.name,
        avatar: uploaded.url,
      });
      if (result.data?.id && token) {
        setAuth(result.data, token);
      }
      toast.success("Đã cập nhật ảnh đại diện mới!");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Không thể tải ảnh đại diện lên.");
    } finally {
      setUploadingAvatar(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-emerald-600">
            Danh tính cộng đồng
          </p>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">Hồ sơ của tôi</h1>
          <p className="text-sm text-slate-500 mt-1.5">
            Thông tin này giúp bên cho và bên nhận tin tưởng nhau trước khi giao dịch vật liệu.
          </p>
        </div>

        {user?.id && (
          <Link
            to={`/users/${user.id}`}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold transition-colors"
          >
            <span>Xem hồ sơ công khai của tôi</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>

      {/* Avatar & Personal Info Card */}
      <section className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <div className="relative w-20 h-20 rounded-2xl bg-emerald-100 border-2 border-emerald-200 text-emerald-800 font-black text-2xl flex items-center justify-center overflow-hidden shrink-0">
              {form.avatar ? (
                <img src={form.avatar} alt={form.name} className="w-full h-full object-cover" />
              ) : (
                (form.name || user?.name || "U")[0]?.toUpperCase()
              )}
              {uploadingAvatar && (
                <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center text-white">
                  <Loader2 className="w-5 h-5 animate-spin" />
                </div>
              )}
            </div>
            <div>
              <div className="font-extrabold text-slate-900 text-base">
                {user?.name || "Người dùng MatGreen"}
              </div>
              <div className="text-xs text-slate-500 mt-0.5">{user?.email}</div>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold cursor-pointer transition-colors">
                  <Camera className="w-3.5 h-3.5" />
                  <span>{uploadingAvatar ? "Đang tải ảnh..." : "Đổi ảnh đại diện"}</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={uploadingAvatar}
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      void handleAvatarUpload(f);
                      e.target.value = "";
                    }}
                  />
                </label>
                {user?.phoneVerified && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" /> SĐT đã xác minh
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2.5 mb-4">
            <UserIcon className="w-5 h-5 text-emerald-600" />
            <h2 className="font-bold text-slate-900">Thông tin cá nhân</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {(
              [
                ["name", "Họ và tên / Tên đơn vị", "Ví dụ: Đội tháo dỡ Minh Tâm"],
                ["phone", "Số điện thoại liên hệ", "Ví dụ: 0987654321"],
                ["address", "Khu vực hoạt động chính", "Ví dụ: Cầu Giấy, Hà Nội"],
              ] as const
            ).map(([key, label, placeholder]) => (
              <label key={key} className="text-xs font-semibold text-slate-600">
                {label}
                <input
                  value={form[key]}
                  placeholder={placeholder}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  className="mt-1.5 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </label>
            ))}

            <label className="text-xs font-semibold text-slate-600 md:col-span-2">
              <div className="flex items-center justify-between">
                <span>Giới thiệu ngắn về bạn / đơn vị</span>
                <span className="text-[11px] text-slate-400 font-normal">
                  {form.bio.length}/500 ký tự
                </span>
              </div>
              <textarea
                maxLength={500}
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                rows={4}
                placeholder="Bạn là chủ công trình, nhà thầu hay đội thu mua vật liệu tái sử dụng? Thường giao dịch khu vực nào?"
                className="mt-1.5 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </label>
          </div>

          <div className="mt-4 flex items-center justify-between gap-3 flex-wrap">
            <p className="text-xs text-slate-500">
              Email đăng nhập: <strong>{user?.email}</strong>{" "}
              <span className="text-emerald-600 font-semibold">(đã xác thực OTP)</span>
            </p>
            <button
              type="button"
              disabled={saving}
              onClick={() => run(() => authApi.updateProfile(form))}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 px-4 py-2.5 text-xs font-bold text-white disabled:opacity-50 cursor-pointer transition-colors"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Lưu hồ sơ
            </button>
          </div>
        </div>
      </section>

      {/* Phone Verification Section */}
      <section className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
        <div className="flex items-center gap-2.5 mb-3">
          <Phone className="w-5 h-5 text-amber-600" />
          <h2 className="font-bold text-slate-900">Xác minh số điện thoại uy tín</h2>
        </div>
        <div className="flex items-center gap-2 text-sm mb-3">
          {user?.phoneVerified ? (
            <span className="inline-flex items-center gap-1.5 text-emerald-700 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Số điện thoại đã được ban quản
              trị xác minh huy hiệu uy tín
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-amber-700 font-medium">
              <ShieldCheck className="w-4 h-4 text-amber-600" /> Số điện thoại chưa gắn huy hiệu xác
              minh
            </span>
          )}
        </div>
        {!user?.phoneVerified && (
          <div className="flex gap-2 flex-col md:flex-row">
            <input
              value={verificationNote}
              onChange={(e) => setVerificationNote(e.target.value)}
              placeholder="Ghi chú gửi ban quản trị (ví dụ: khung giờ nghe máy xác nhận, Zalo chính chủ...)"
              className="flex-1 rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <button
              type="button"
              disabled={saving || !user?.phone}
              onClick={() =>
                run(() => authApi.requestPhoneVerification(verificationNote), () =>
                  setVerificationNote("")
                )
              }
              className="rounded-xl bg-amber-500 hover:bg-amber-600 px-4 py-2.5 text-xs font-bold text-white disabled:opacity-50 cursor-pointer transition-colors"
            >
              Gửi yêu cầu xác minh
            </button>
          </div>
        )}
        {!user?.phone && (
          <p className="text-xs text-rose-600 mt-2">
            Hãy nhập và lưu số điện thoại ở mục Thông tin cá nhân phía trên trước khi gửi yêu cầu.
          </p>
        )}
      </section>

      {/* Change Password Section */}
      <section className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
        <div className="flex items-center gap-2.5 mb-5">
          <KeyRound className="w-5 h-5 text-slate-600" />
          <h2 className="font-bold text-slate-900">Đổi mật khẩu</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <input
            type="password"
            placeholder="Mật khẩu hiện tại"
            value={passwords.currentPassword}
            onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
            className="rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <input
            type="password"
            placeholder="Mật khẩu mới (ít nhất 8 ký tự)"
            value={passwords.newPassword}
            onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
            className="rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
        <button
          type="button"
          disabled={saving || !passwords.currentPassword || passwords.newPassword.length < 8}
          onClick={() =>
            run(() => authApi.changePassword(passwords), () =>
              setPasswords({ currentPassword: "", newPassword: "" })
            )
          }
          className="mt-4 rounded-xl border border-slate-300 hover:bg-slate-50 px-4 py-2.5 text-xs font-bold text-slate-700 disabled:opacity-50 cursor-pointer transition-colors"
        >
          Đổi mật khẩu
        </button>
      </section>
    </div>
  );
};
