import React, { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Loader2,
  ArrowLeft,
  Save,
  CheckCircle,
  AlertCircle,
  Phone,
  Clock,
  Sparkles,
} from "lucide-react";
import { materialsApi } from "@/services/api";
import { RichTextEditor } from "@/components/common/RichTextEditor";
import { CATEGORY_LABELS } from "@/lib/utils";
import type { MaterialCategory } from "@/types/material.types";

export const EditMaterialPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: material, isLoading } = useQuery({
    queryKey: ["material-detail", id],
    queryFn: () => materialsApi.getById(id as string),
    enabled: Boolean(id),
  });

  const [form, setForm] = useState<{
    title: string;
    category: MaterialCategory;
    description: string;
    price: number;
    unit: string;
    contactPhone: string;
    contactHours: string;
    contactName: string;
    contactZalo: string;
    status: "available" | "reserved" | "completed";
  }>({
    title: "",
    category: "khac",
    description: "",
    price: 0,
    unit: "",
    contactPhone: "",
    contactHours: "",
    contactName: "",
    contactZalo: "",
    status: "available",
  });

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (material) {
      setForm({
        title: material.title || "",
        category: (material.category as MaterialCategory) || "khac",
        description: material.description || "",
        price: material.price || 0,
        unit: material.unit || "",
        contactPhone: material.contactPhone || "",
        contactHours: material.contactHours || "",
        contactName: material.contactName || "",
        contactZalo: material.contactZalo || "",
        status: (material.status as any) || "available",
      });
    }
  }, [material]);

  const updateMutation = useMutation({
    mutationFn: () => materialsApi.update(id as string, form),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["material-detail", id] });
      queryClient.invalidateQueries({ queryKey: ["my-materials"] });
      setSuccess(true);
      setTimeout(() => navigate(-1), 1200);
    },
    onError: (err: any) => {
      setError(err?.response?.data?.message || "Không thể cập nhật bài đăng");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    updateMutation.mutate();
  };

  if (isLoading || !material) {
    return (
      <div className="py-24 flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
        <span className="text-xs text-slate-500 font-medium">Đang tải thông tin bài đăng...</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-6 animate-fadeIn">
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <button
              onClick={() => navigate(-1)}
              className="text-xs font-bold text-slate-500 hover:text-emerald-700 flex items-center gap-1 mb-1 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" /> Quay lại
            </button>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Chỉnh Sửa Bài Đăng Vật Liệu
            </h1>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
            {CATEGORY_LABELS[form.category] || form.category}
          </span>
        </div>

        {success && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>Cập nhật bài viết thành công! Đang quay lại...</span>
          </div>
        )}

        {error && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Tiêu đề & Danh mục */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Tiêu đề bài đăng *
              </label>
              <input
                type="text"
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Danh mục
              </label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value as MaterialCategory })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {Object.entries(CATEGORY_LABELS).map(([k, label]) => (
                  <option key={k} value={k}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Giá & Đơn vị */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Giá (0đ = Miễn phí)
              </label>
              <input
                type="number"
                min={0}
                step={1000}
                value={form.price}
                onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Đơn vị tính
              </label>
              <input
                type="text"
                placeholder="VD: chuyến xe, kg, trọn gói..."
                value={form.unit}
                onChange={(e) => setForm({ ...form, unit: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Trạng thái hiển thị
              </label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as "available" | "reserved" | "completed" })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white font-bold"
              >
                <option value="available">🟢 Đang hiển thị trên sàn</option>
                <option value="reserved">🟡 Đã nhận gạch / Đặt chỗ</option>
                <option value="completed">⚪ Đã bốc hết / Hoàn tất</option>
              </select>
            </div>
          </div>

          {/* Liên hệ */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Số điện thoại liên hệ *
              </label>
              <input
                type="tel"
                required
                value={form.contactPhone}
                onChange={(e) => setForm({ ...form, contactPhone: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Người liên hệ
              </label>
              <input
                type="text"
                placeholder="VD: Bác Ba"
                value={form.contactName}
                onChange={(e) => setForm({ ...form, contactName: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Khung giờ đón hàng
              </label>
              <input
                type="text"
                placeholder="VD: 8h - 17h hàng ngày"
                value={form.contactHours}
                onChange={(e) => setForm({ ...form, contactHours: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
              />
            </div>
          </div>

          {/* Description with RichTextEditor */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
              <span>Mô tả chi tiết công trình & vật liệu (Bộ công cụ nâng cao)</span>
              <span className="text-[11px] font-normal text-slate-400 lowercase">
                hỗ trợ căn lề, cỡ chữ, chèn ảnh, bảng, định dạng
              </span>
            </label>
            <RichTextEditor
              value={form.description}
              onChange={(description) => setForm({ ...form, description })}
              placeholder="Nhập mô tả chi tiết vật liệu, tình trạng công trình, điều kiện bốc hàng..."
              minHeight={260}
            />
          </div>

          {/* Nút lưu */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
            >
              Hủy Bỏ
            </button>
            <button
              type="submit"
              disabled={updateMutation.isPending}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 active:scale-98 transition-all cursor-pointer disabled:opacity-50"
            >
              {updateMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Đang Lưu...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Lưu Thay Đổi Bài Đăng</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
