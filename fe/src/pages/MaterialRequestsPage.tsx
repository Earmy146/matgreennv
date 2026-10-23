import React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { ClipboardList, Loader2, MapPin, XCircle, CheckCircle2 } from "lucide-react";
import { materialRequestsApi, type MaterialRequest } from "@/services/api";

const statusLabels: Record<MaterialRequest["status"], string> = {
  pending: "Đang chờ người đăng duyệt",
  approved: "Đã được duyệt",
  rejected: "Đã bị từ chối",
  cancelled: "Đã hủy",
  completed: "Đã hoàn tất",
};

const statusClasses: Record<MaterialRequest["status"], string> = {
  pending: "bg-amber-50 text-amber-800 border-amber-200",
  approved: "bg-emerald-50 text-emerald-800 border-emerald-200",
  rejected: "bg-rose-50 text-rose-800 border-rose-200",
  cancelled: "bg-slate-100 text-slate-700 border-slate-200",
  completed: "bg-blue-50 text-blue-800 border-blue-200",
};

export const MaterialRequestsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const { data: requests = [], isLoading, isError } = useQuery({
    queryKey: ["material-requests", "requester"],
    queryFn: () => materialRequestsApi.listMine("requester"),
  });
  const updateStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: MaterialRequest["status"] }) =>
      materialRequestsApi.updateStatus(id, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["material-requests", "requester"] }),
  });

  return (
    <div className="max-w-4xl mx-auto py-2 space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200">
            <ClipboardList className="w-3.5 h-3.5" /> Giao dịch của tôi
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">Yêu cầu nhận vật liệu</h1>
          <p className="text-sm text-slate-500 mt-1">Theo dõi yêu cầu bạn đã gửi và xác nhận khi nhận xong.</p>
        </div>
        <Link to="/materials" className="text-xs font-bold text-emerald-700 hover:underline">Tìm vật liệu</Link>
      </div>

      {isLoading ? (
        <div className="py-16 flex justify-center text-emerald-700"><Loader2 className="animate-spin" /></div>
      ) : isError ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-800">Không thể tải yêu cầu của bạn.</div>
      ) : requests.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center space-y-3">
          <ClipboardList className="w-12 h-12 text-slate-300 mx-auto" />
          <h2 className="font-bold text-slate-800">Bạn chưa gửi yêu cầu nào</h2>
          <p className="text-sm text-slate-500">Khi tìm thấy vật liệu phù hợp, hãy mở chi tiết và gửi yêu cầu nhận.</p>
          <Link to="/materials" className="inline-flex px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold">Khám phá vật liệu</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => (
            <article key={request._id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-2">
                  <Link to={`/materials/${request.material?._id}`} className="font-bold text-slate-900 hover:text-emerald-700">{request.material?.title}</Link>
                  <div className="text-xs text-slate-600 flex items-start gap-1.5"><MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />{request.material?.location?.address}</div>
                  {request.message && <p className="text-xs text-slate-500">“{request.message}”</p>}
                </div>
                <span className={`inline-flex self-start px-2.5 py-1 rounded-full border text-xs font-bold ${statusClasses[request.status]}`}>{statusLabels[request.status]}</span>
              </div>
              {request.status === "approved" && (
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-emerald-50 p-3">
                  <span className="text-xs text-emerald-900 flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4" /> Hãy liên hệ người đăng để thống nhất thời gian lấy.</span>
                  <button type="button" onClick={() => updateStatus.mutate({ id: request._id, status: "completed" })} disabled={updateStatus.isPending} className="px-3 py-2 rounded-xl bg-emerald-700 text-white text-xs font-bold disabled:opacity-50">Xác nhận đã nhận</button>
                </div>
              )}
              {request.status === "pending" && (
                <button type="button" onClick={() => updateStatus.mutate({ id: request._id, status: "cancelled" })} disabled={updateStatus.isPending} className="mt-4 inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-50"><XCircle className="w-3.5 h-3.5" /> Hủy yêu cầu</button>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
};
