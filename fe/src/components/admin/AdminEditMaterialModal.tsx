import React, { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  X,
  Save,
  Loader2,
  CheckCircle,
  AlertCircle,
  Edit3,
  Phone,
  Tag,
} from "lucide-react";
import { adminApi, materialsApi } from "@/services/api";
import { RichTextEditor } from "@/components/common/RichTextEditor";
import { CATEGORY_LABELS } from "@/lib/utils";
import type { MaterialCategory } from "@/types/material.types";

export interface AdminEditMaterialModalProps {
  material: any | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const AdminEditMaterialModal: React.FC<AdminEditMaterialModalProps> = ({
  material,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const queryClient = useQueryClient();

  const [form, setForm] = useState<{
    title: string;
    category: MaterialCategory;
    description: string;
    price: number;
    unit: string;
    contactPhone: string;
    contactName: string;
    contactHours: string;
    status: "available" | "reserved" | "completed";
  }>({
    title: "",
    category: "khac",
    description: "",
    price: 0,
    unit: "",
    contactPhone: "",
    contactName: "",
    contactHours: "",
    status: "available",
  });

  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (material) {
      setForm({
        title: material.title || "",
        category: (material.category as MaterialCategory) || "khac",
        description: material.description || "",
        price: material.price || 0,
        unit: material.unit || "",
        contactPhone: material.contactPhone || "",
        contactName: material.contactName || "",
        contactHours: material.contactHours || "",
        status: (material.status as any) || "available",
      });
      setReason("");
      setError(null);
      setSuccess(false);
    }
  }, [material]);

  const updateMutation = useMutation({
    mutationFn: async () => {
      if (!material?._id) return;
      // 1. Cập nhật nội dung bài đăng
      await materialsApi.update(material._id, form);

      // 2. Nếu trạng thái thay đổi, cập nhật trạng thái kiểm duyệt
      if (form.status !== material.status) {
        await adminApi.moderateMaterial(
          material._id,
          form.status,
          reason.trim() || "Quản trị viên cập nhật thông tin bài viết"
        );
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-materials"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
      queryClient.invalidateQueries({ queryKey: ["material-detail", material?._id] });
      setSuccess(true);
      setTimeout(() => {
        onSuccess?.();
        onClose();
      }, 1000);
    },
    onError: (err: any) => {
      setError(err?.response?.data?.message || err?.message || "Không thể cập nhật bài viết");
    },
  });

  if (!isOpen || !material) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn"
      data-lenis-prevent
    >
      <div
        className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl relative overscroll-contain flex flex-col space-y-6"
        data-lenis-prevent
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Edit3 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                Chỉnh Sửa Bài Viết Người Đăng
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Mã bài: <span className="font-mono text-slate-700">{material._id}</span> · Đăng bởi:{" "}
                <strong>{material.author?.name || "Người dùng"}</strong>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {success && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>Đã lưu thành công các thay đổi bài đăng!</span>
          </div>
        )}

        {error && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            updateMutation.mutate();
          }}
          className="space-y-5 text-xs"
        >
          {/* Tiêu đề & Danh mục */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Tiêu đề bài đăng *
              </label>
              <input
                type="text"
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Danh mục vật liệu
              </label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value as MaterialCategory })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
              >
                {Object.entries(CATEGORY_LABELS).map(([k, label]) => (
                  <option key={k} value={k}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Trạng thái duyệt & Giá bán */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Trạng thái kiểm duyệt *
              </label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as any })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white font-bold"
              >
                <option value="available">🟢 Đang hiển thị trên sàn</option>
                <option value="pending">🟡 Chờ kiểm duyệt</option>
                <option value="completed">⚪ Đã bốc hết / Đã ẩn</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Giá (0đ = Tặng miễn phí)
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
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Đơn vị tính
              </label>
              <input
                type="text"
                placeholder="VD: trọn gói, xe ba gác, kg..."
                value={form.unit}
                onChange={(e) => setForm({ ...form, unit: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white"
              />
            </div>
          </div>

          {/* Thông tin liên hệ */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                SĐT liên hệ
              </label>
              <input
                type="tel"
                value={form.contactPhone}
                onChange={(e) => setForm({ ...form, contactPhone: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Người liên hệ
              </label>
              <input
                type="text"
                value={form.contactName}
                onChange={(e) => setForm({ ...form, contactName: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Khung giờ bốc dỡ
              </label>
              <input
                type="text"
                value={form.contactHours}
                onChange={(e) => setForm({ ...form, contactHours: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
              />
            </div>
          </div>

          {/* RichTextEditor cho mô tả */}
          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
              <span>Mô tả chi tiết bài đăng (Bộ công cụ nâng cao)</span>
              <span className="text-[11px] font-normal text-slate-400 lowercase">
                chèn ảnh, cỡ chữ, căn chỉnh, định dạng phong phú
              </span>
            </label>
            <RichTextEditor
              value={form.description}
              onChange={(description) => setForm({ ...form, description })}
              placeholder="Nhập mô tả chi tiết của vật liệu..."
              minHeight={240}
            />
          </div>

          {/* Lý do kiểm duyệt / ghi chú */}
          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
              Ghi chú / Lý do thao tác quản trị (Lưu vào nhật ký)
            </label>
            <input
              type="text"
              placeholder="VD: Cập nhật giá theo yêu cầu người đăng / Biên tập nội dung rõ ràng..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-200 font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
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
