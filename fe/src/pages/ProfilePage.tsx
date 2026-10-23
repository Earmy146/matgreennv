import React, { useEffect, useState } from "react";
import { CheckCircle2, KeyRound, Phone, Save, ShieldCheck, User as UserIcon } from "lucide-react";
import { useAuthStore } from "@/stores/auth.store";
import { authApi } from "@/services/api";

export const ProfilePage: React.FC = () => {
  const { user, setAuth, token } = useAuthStore();
  const [form, setForm] = useState({ name: "", phone: "", address: "", bio: "" });
  const [passwords, setPasswords] = useState({ currentPassword: "", newPassword: "" });
  const [verificationNote, setVerificationNote] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) setForm({ name: user.name || "", phone: user.phone || "", address: user.address || "", bio: user.bio || "" });
  }, [user]);

  const run = async (action: () => Promise<{ message: string; data?: any }>) => {
    setMessage(""); setError(""); setSaving(true);
    try {
      const result = await action();
      if (result.data && token && user) setAuth(result.data, token);
      setMessage(result.message);
    } catch (err: any) {
      setError(err.response?.data?.message || "Không thể thực hiện thao tác");
    } finally { setSaving(false); }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-emerald-600">Danh tính cộng đồng</p>
        <h1 className="text-3xl font-black text-slate-900 mt-1">Hồ sơ của tôi</h1>
        <p className="text-sm text-slate-500 mt-2">Thông tin này giúp bên cho và bên nhận hiểu nhau trước khi giao dịch.</p>
      </div>
      {(message || error) && <div className={`rounded-2xl p-4 text-sm ${error ? "bg-rose-50 text-rose-700" : "bg-emerald-50 text-emerald-700"}`}>{error || message}</div>}
      <section className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-5"><UserIcon className="text-emerald-600" /><h2 className="font-bold text-slate-900">Thông tin cá nhân</h2></div>
        <div className="grid md:grid-cols-2 gap-4">
          {([["name", "Họ và tên"], ["phone", "Số điện thoại"], ["address", "Địa chỉ"]] as const).map(([key, label]) => (
            <label key={key} className="text-xs font-semibold text-slate-600">{label}
              <input value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm" />
            </label>
          ))}
          <label className="text-xs font-semibold text-slate-600 md:col-span-2">Bio / Giới thiệu
            <textarea maxLength={500} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} rows={4} placeholder="Bạn là ai, thường cho/nhận loại vật liệu nào?" className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm" />
          </label>
        </div>
        <div className="mt-4 flex items-center justify-between gap-3 flex-wrap">
          <p className="text-xs text-slate-500">Email: <strong>{user?.email}</strong> <span className="text-emerald-600">đã xác minh</span></p>
          <button disabled={saving} onClick={() => run(() => authApi.updateProfile(form))} className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white disabled:opacity-50"><Save className="w-4 h-4" /> Lưu hồ sơ</button>
        </div>
      </section>
      <section className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-3"><Phone className="text-amber-600" /><h2 className="font-bold text-slate-900">Xác minh số điện thoại</h2></div>
        <div className="flex items-center gap-2 text-sm mb-3">{user?.phoneVerified ? <><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Số điện thoại đã được admin xác minh</> : <><ShieldCheck className="w-4 h-4 text-amber-600" /> Số điện thoại chưa xác minh</>}</div>
        {!user?.phoneVerified && <div className="flex gap-2 flex-col md:flex-row"><input value={verificationNote} onChange={(e) => setVerificationNote(e.target.value)} placeholder="Ghi chú cho admin (ví dụ: tôi có thể cung cấp giấy tờ khi cần)" className="flex-1 rounded-xl border border-slate-200 px-3 py-2.5 text-sm" /><button disabled={saving || !user?.phone} onClick={() => run(() => authApi.requestPhoneVerification(verificationNote))} className="rounded-xl bg-amber-500 px-4 py-2.5 text-xs font-bold text-white disabled:opacity-50">Gửi yêu cầu admin</button></div>}
        {!user?.phone && <p className="text-xs text-rose-600 mt-2">Hãy cập nhật số điện thoại trước khi gửi yêu cầu.</p>}
      </section>
      <section className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-5"><KeyRound className="text-slate-600" /><h2 className="font-bold text-slate-900">Đổi mật khẩu</h2></div>
        <div className="grid md:grid-cols-2 gap-4">
          <input type="password" placeholder="Mật khẩu hiện tại" value={passwords.currentPassword} onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })} className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm" />
          <input type="password" placeholder="Mật khẩu mới (ít nhất 8 ký tự)" value={passwords.newPassword} onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })} className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm" />
        </div>
        <button disabled={saving} onClick={() => run(() => authApi.changePassword(passwords))} className="mt-4 rounded-xl border border-slate-300 px-4 py-2.5 text-xs font-bold text-slate-700 disabled:opacity-50">Đổi mật khẩu</button>
      </section>
    </div>
  );
};
