import React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AlertTriangle, BarChart3, CheckCircle2, History, Shield, Users } from "lucide-react";
import { adminApi, reportsApi } from "@/services/api";

const pageSize = 10;

export const AdminModerationPage: React.FC = () => {
  const client = useQueryClient();
  const [reportPage, setReportPage] = React.useState(1);
  const [userPage, setUserPage] = React.useState(1);
  const [materialPage, setMaterialPage] = React.useState(1);
  const [reason, setReason] = React.useState<Record<string, string>>({});
  const stats = useQuery({ queryKey: ["admin-stats"], queryFn: adminApi.stats });
  const reports = useQuery({ queryKey: ["admin-reports", reportPage], queryFn: () => reportsApi.list({ page: reportPage, limit: pageSize }) });
  const users = useQuery({ queryKey: ["admin-users", userPage], queryFn: () => adminApi.users({ page: userPage, limit: pageSize }) });
  const materials = useQuery({ queryKey: ["admin-materials", materialPage], queryFn: () => adminApi.materials({ page: materialPage, limit: pageSize }) });
  const logs = useQuery({ queryKey: ["admin-audit-logs"], queryFn: () => adminApi.auditLogs({ limit: 20 }) });
  const reportUpdate = useMutation({
    mutationFn: ({ id, status, actionReason }: { id: string; status: string; actionReason: string }) => reportsApi.update(id, status, actionReason),
    onSuccess: () => { client.invalidateQueries({ queryKey: ["admin-reports"] }); client.invalidateQueries({ queryKey: ["admin-audit-logs"] }); },
  });
  const suspend = useMutation({
    mutationFn: ({ id, suspended, actionReason }: { id: string; suspended: boolean; actionReason: string }) => adminApi.suspendUser(id, suspended, actionReason),
    onSuccess: () => { client.invalidateQueries({ queryKey: ["admin-users"] }); client.invalidateQueries({ queryKey: ["admin-audit-logs"] }); },
  });
  const moderate = useMutation({
    mutationFn: ({ id, status, actionReason }: { id: string; status: string; actionReason: string }) => adminApi.moderateMaterial(id, status, actionReason),
    onSuccess: () => { client.invalidateQueries({ queryKey: ["admin-materials"] }); client.invalidateQueries({ queryKey: ["admin-audit-logs"] }); },
  });
  const getActionReason = (id: string) => {
    if (reason[id]) return reason[id];
    const value = window.prompt("Nhập lý do bắt buộc cho thao tác này:");
    if (!value?.trim()) return null;
    const normalized = value.trim();
    setReason((current) => ({ ...current, [id]: normalized }));
    return normalized;
  };
  const statsCards = [
    ["Người dùng", stats.data?.users || 0, Users],
    ["Đã khóa", stats.data?.suspendedUsers || 0, Shield],
    ["Bài đăng", stats.data?.materials || 0, BarChart3],
    ["Report mở", stats.data?.reports?.open || 0, AlertTriangle],
    ["Đang xử lý", stats.data?.reports?.reviewing || 0, History],
    ["Đã xử lý", stats.data?.reports?.resolved || 0, CheckCircle2],
  ] as const;
  const Pager = ({ page, totalPages, onChange }: { page: number; totalPages?: number; onChange: (page: number) => void }) => (
    <div className="flex items-center justify-between pt-3 text-xs text-slate-500">
      <span>Trang {page}/{totalPages || 1}</span>
      <div className="flex gap-2">
        <button disabled={page <= 1} onClick={() => onChange(page - 1)} className="px-2 py-1 rounded border disabled:opacity-40">Trước</button>
        <button disabled={!totalPages || page >= totalPages} onClick={() => onChange(page + 1)} className="px-2 py-1 rounded border disabled:opacity-40">Sau</button>
      </div>
    </div>
  );
  return (
    <div className="max-w-7xl mx-auto py-6 space-y-6">
      <div><h1 className="text-2xl font-black text-slate-900">Admin Moderation</h1><p className="text-sm text-slate-500 mt-1">Theo dõi rủi ro, xử lý báo cáo và ghi nhận mọi thao tác quản trị.</p></div>
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        {statsCards.map(([label, value, Icon]) => <div key={label} className="bg-white rounded-2xl border p-4"><Icon className="w-4 h-4 text-emerald-600 mb-2" /><div className="text-2xl font-black">{value}</div><div className="text-xs text-slate-500">{label}</div></div>)}
      </div>
      <section className="bg-white rounded-2xl border p-5"><h2 className="font-bold mb-3">Báo cáo</h2>{(reports.data?.items || []).map((report: any) => <div key={report._id} className="border-t py-3 space-y-2 text-sm"><div className="flex justify-between gap-3"><span><b>{report.targetType}</b> · {report.reason}</span><span className="text-xs text-slate-500">{report.status}</span></div><div className="flex gap-2 items-center"><input value={reason[report._id] || ""} onChange={(e) => setReason((v) => ({ ...v, [report._id]: e.target.value }))} placeholder="Lý do xử lý bắt buộc..." className="flex-1 rounded-lg border px-2 py-1 text-xs" />{report.status === "open" && <><button onClick={() => { const actionReason = getActionReason(report._id); if (actionReason) reportUpdate.mutate({ id: report._id, status: "reviewing", actionReason }); }} className="text-amber-700 text-xs font-bold">Đang xử lý</button><button onClick={() => { const actionReason = getActionReason(report._id); if (actionReason) reportUpdate.mutate({ id: report._id, status: "resolved", actionReason }); }} className="text-emerald-700 text-xs font-bold">Đã xử lý</button></>}</div></div>)}<Pager page={reportPage} totalPages={reports.data?.pagination?.totalPages} onChange={setReportPage} /></section>
      <section className="bg-white rounded-2xl border p-5"><h2 className="font-bold mb-3">Người dùng</h2>{(users.data?.items || []).map((user: any) => <div key={user._id} className="border-t py-3 flex justify-between items-center gap-3 text-sm"><span>{user.name} · {user.email} <small className="text-slate-400">({user.role})</small></span><button onClick={() => { const actionReason = getActionReason(user._id); if (actionReason) suspend.mutate({ id: user._id, suspended: !user.isSuspended, actionReason }); }} className="text-rose-700 text-xs font-bold">{user.isSuspended ? "Mở khóa" : "Khóa tài khoản"}</button></div>)}<Pager page={userPage} totalPages={users.data?.pagination?.totalPages} onChange={setUserPage} /></section>
      <section className="bg-white rounded-2xl border p-5"><h2 className="font-bold mb-3">Bài đăng</h2>{(materials.data?.items || []).map((material: any) => <div key={material._id} className="border-t py-3 flex justify-between items-center gap-3 text-sm"><span>{material.title} · {material.status}</span><div className="flex gap-2"><button onClick={() => { const actionReason = getActionReason(material._id); if (actionReason) moderate.mutate({ id: material._id, status: "completed", actionReason }); }} className="text-rose-700 text-xs font-bold">Ẩn bài</button><button onClick={() => { const actionReason = getActionReason(material._id); if (actionReason) moderate.mutate({ id: material._id, status: "available", actionReason }); }} className="text-emerald-700 text-xs font-bold">Hiện bài</button></div></div>)}<Pager page={materialPage} totalPages={materials.data?.pagination?.totalPages} onChange={setMaterialPage} /></section>
      <section className="bg-white rounded-2xl border p-5"><h2 className="font-bold mb-3">Nhật ký thao tác admin</h2>{(logs.data?.items || []).map((log: any) => <div key={log._id} className="border-t py-2 text-xs text-slate-600">{new Date(log.createdAt).toLocaleString("vi-VN")} · <b>{log.actor?.name}</b> · {log.action} · {log.reason}</div>)}</section>
    </div>
  );
};
