import React from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { materialsApi } from "@/services/api";

export const EditMaterialPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: material, isLoading } = useQuery({ queryKey: ["material-detail", id], queryFn: () => materialsApi.getById(id as string), enabled: Boolean(id) });
  const [form, setForm] = React.useState({ title: "", description: "", price: 0, unit: "", contactPhone: "", contactHours: "" });
  React.useEffect(() => { if (material) setForm({ title: material.title, description: material.description || "", price: material.price, unit: material.unit, contactPhone: material.contactPhone, contactHours: material.contactHours || "" }); }, [material]);
  const update = useMutation({ mutationFn: () => materialsApi.update(id as string, form), onSuccess: () => navigate("/my-posts") });
  if (isLoading || !material) return <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-emerald-600" /></div>;
  return <div className="max-w-2xl mx-auto py-6"><div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4">
    <Link to="/my-posts" className="text-xs text-slate-500 hover:underline">Quay lại bài của tôi</Link>
    <h1 className="text-2xl font-black text-slate-900">Chỉnh sửa bài đăng</h1>
    {(["title", "description", "unit", "contactPhone", "contactHours"] as const).map((key) => <label key={key} className="block text-xs font-bold text-slate-700">{key === "title" ? "Tiêu đề" : key === "description" ? "Mô tả" : key}<input value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" /></label>)}
    <label className="block text-xs font-bold text-slate-700">Giá<input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" /></label>
    <button type="button" onClick={() => update.mutate()} disabled={update.isPending} className="w-full rounded-xl bg-emerald-600 text-white py-3 text-sm font-bold disabled:opacity-50">{update.isPending ? "Đang lưu..." : "Lưu thay đổi"}</button>
  </div></div>;
};
