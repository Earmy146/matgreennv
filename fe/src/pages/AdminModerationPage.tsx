import React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminApi, reportsApi } from "@/services/api";

export const AdminModerationPage: React.FC = () => {
  const client = useQueryClient();
  const reports = useQuery({ queryKey: ["admin-reports"], queryFn: reportsApi.list });
  const users = useQuery({ queryKey: ["admin-users"], queryFn: adminApi.users });
  const materials = useQuery({ queryKey: ["admin-materials"], queryFn: adminApi.materials });
  const reportUpdate = useMutation({ mutationFn: ({ id, status }: { id: string; status: string }) => reportsApi.update(id, status, ""), onSuccess: () => client.invalidateQueries({ queryKey: ["admin-reports"] }) });
  const suspend = useMutation({ mutationFn: ({ id, suspended }: { id: string; suspended: boolean }) => adminApi.suspendUser(id, suspended), onSuccess: () => client.invalidateQueries({ queryKey: ["admin-users"] }) });
  const moderate = useMutation({ mutationFn: ({ id, status }: { id: string; status: string }) => adminApi.moderateMaterial(id, status), onSuccess: () => client.invalidateQueries({ queryKey: ["admin-materials"] }) });
  return <div className="max-w-6xl mx-auto py-6 space-y-6"><h1 className="text-2xl font-black">Admin Moderation</h1>
    <section className="bg-white rounded-2xl border p-5"><h2 className="font-bold mb-3">Báo cáo</h2>{(reports.data || []).map((report: any) => <div key={report._id} className="border-t py-3 flex justify-between gap-3 text-sm"><span><b>{report.targetType}</b> · {report.reason} · {report.status}</span>{report.status === "open" && <div className="flex gap-2"><button onClick={() => reportUpdate.mutate({ id: report._id, status: "reviewing" })} className="text-amber-700 text-xs font-bold">Đang xử lý</button><button onClick={() => reportUpdate.mutate({ id: report._id, status: "resolved" })} className="text-emerald-700 text-xs font-bold">Đã xử lý</button></div>}</div>)}</section>
    <section className="bg-white rounded-2xl border p-5"><h2 className="font-bold mb-3">Người dùng</h2>{(users.data || []).map((user: any) => <div key={user._id} className="border-t py-3 flex justify-between text-sm"><span>{user.name} · {user.email}</span><button onClick={() => suspend.mutate({ id: user._id, suspended: !user.isSuspended })} className="text-rose-700 text-xs font-bold">{user.isSuspended ? "Mở khóa" : "Khóa tài khoản"}</button></div>)}</section>
    <section className="bg-white rounded-2xl border p-5"><h2 className="font-bold mb-3">Bài đăng</h2>{(materials.data || []).map((material: any) => <div key={material._id} className="border-t py-3 flex justify-between text-sm"><span>{material.title} · {material.status}</span><div className="flex gap-2"><button onClick={() => moderate.mutate({ id: material._id, status: "completed" })} className="text-rose-700 text-xs font-bold">Ẩn bài</button><button onClick={() => moderate.mutate({ id: material._id, status: "available" })} className="text-emerald-700 text-xs font-bold">Hiện bài</button></div></div>)}</section>
  </div>;
};
