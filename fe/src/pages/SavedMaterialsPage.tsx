import React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Heart, Loader2, MapPin, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { favoritesApi } from "@/services/api";
import { formatCurrency, CATEGORY_LABELS } from "@/lib/utils";

export const SavedMaterialsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const { data: favorites = [], isLoading, isError } = useQuery({
    queryKey: ["favorites"],
    queryFn: favoritesApi.list,
  });
  const remove = useMutation({
    mutationFn: favoritesApi.remove,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["favorites"] }),
  });

  return (
    <div className="max-w-5xl mx-auto py-4 space-y-5">
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-semibold border border-rose-200">
          <Heart className="w-3.5 h-3.5 fill-current" /> Đã lưu
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">Vật liệu yêu thích</h1>
        <p className="text-sm text-slate-500 mt-1">Lưu lại các bài đăng bạn muốn xem hoặc liên hệ sau.</p>
      </div>
      {isLoading ? (
        <div className="py-16 flex justify-center text-emerald-700"><Loader2 className="animate-spin" /></div>
      ) : isError ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-800">Không thể tải danh sách đã lưu.</div>
      ) : favorites.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center text-sm text-slate-500">Bạn chưa lưu bài vật liệu nào.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {favorites.map((favorite) => {
            const material = favorite.material;
            return (
              <article key={favorite._id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm flex gap-4">
                <div className="w-24 h-24 rounded-xl bg-slate-100 overflow-hidden shrink-0">
                  {material.images?.[0] && <img src={material.images[0]} alt={material.title} className="w-full h-full object-cover" />}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[11px] font-bold text-emerald-700">{CATEGORY_LABELS[material.category] || "Vật liệu"}</div>
                  <Link to={`/materials/${material._id}`} className="block mt-1 font-bold text-slate-900 hover:text-emerald-700 truncate">{material.title}</Link>
                  <div className="mt-1 text-xs text-amber-600 font-bold">{formatCurrency(material.price)}{material.type === "sell" && material.unit ? ` / ${material.unit}` : ""}</div>
                  <div className="mt-1 text-xs text-slate-500 flex gap-1"><MapPin className="w-3.5 h-3.5 shrink-0" /> <span className="truncate">{material.location?.address}</span></div>
                  <button type="button" onClick={() => remove.mutate(material._id)} className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-rose-700 hover:underline"><Trash2 className="w-3.5 h-3.5" /> Bỏ lưu</button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};
