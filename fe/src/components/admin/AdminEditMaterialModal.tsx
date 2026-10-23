import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
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
  Image as ImageIcon,
  Trash2,
  Star,
  UploadCloud,
  Plus,
  ExternalLink,
} from "lucide-react";
import { adminApi, materialsApi, uploadApi } from "@/services/api";
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

  const [images, setImages] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
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
      setImages(Array.isArray(material.images) ? [...material.images] : []);
      setNewImageUrl("");
      setUploadingImage(false);
      setReason("");
      setError(null);
      setSuccess(false);
    }
  }, [material]);

  const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploadingImage(true);
      setError(null);
      const res = await uploadApi.uploadImage(file, "materials");
      if (res?.url) {
        setImages((prev) => [...prev, res.url]);
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || "Không thể tải ảnh lên Cloudinary");
    } finally {
      setUploadingImage(false);
      e.target.value = "";
    }
  };

  const handleAddImageUrl = () => {
    if (!newImageUrl.trim()) return;
    setImages((prev) => [...prev, newImageUrl.trim()]);
    setNewImageUrl("");
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleSetPrimaryImage = (index: number) => {
    if (index === 0) return;
    setImages((prev) => {
      const next = [...prev];
      const [chosen] = next.splice(index, 1);
      next.unshift(chosen);
      return next;
    });
  };

  const updateMutation = useMutation({
    mutationFn: async () => {
      if (!material?._id) return;
      // 1. Cập nhật nội dung & hình ảnh bài đăng (Admin có toàn quyền)
      await materialsApi.update(material._id, {
        ...form,
        images,
      });

      // 2. Nếu trạng thái thay đổi, cập nhật trạng thái kiểm duyệt
      if (form.status !== material.status) {
        await adminApi.moderateMaterial(
          material._id,
          form.status,
          reason.trim() || "Quản trị viên cập nhật thông tin và hình ảnh bài viết"
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

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-hidden animate-fadeIn"
      data-lenis-prevent
    >
      <div
        className="bg-white rounded-3xl border border-slate-200 w-full max-w-4xl max-h-[90vh] shadow-2xl relative flex flex-col overflow-hidden"
        data-lenis-prevent
      >
        {/* Header - Cố định ở đỉnh modal */}
        <div className="px-6 py-4 sm:px-8 sm:py-5 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
              <Edit3 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
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
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Form - Cuộn độc lập */}
        <form
          id="admin-edit-material-form"
          onSubmit={(e) => {
            e.preventDefault();
            updateMutation.mutate();
          }}
          className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-5 text-xs"
          data-lenis-prevent
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

          {/* QUẢN LÝ HÌNH ẢNH BÀI ĐĂNG (QUYỀN KIỂM SOÁT ADMIN) */}
          <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/50 border border-emerald-200/80 space-y-3.5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-emerald-700" />
                <span className="font-bold text-slate-900 uppercase tracking-wider text-xs">
                  Hình ảnh thực tế bài đăng ({images.length})
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Toàn quyền Admin
                </span>
              </div>
              <span className="text-[11px] text-slate-500">
                Ảnh đầu tiên là ảnh đại diện chính hiển thị trên sàn
              </span>
            </div>

            {/* Gallery ảnh hiện tại */}
            {images.length === 0 ? (
              <div className="p-4 rounded-xl border border-dashed border-amber-300 bg-amber-50/60 text-amber-800 text-xs text-center">
                Bài đăng này hiện chưa có ảnh thực tế. Vui lòng tải lên ảnh để kiểm duyệt bài đăng chuẩn xác.
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
                {images.map((img, idx) => (
                  <div
                    key={idx}
                    className="relative group rounded-2xl overflow-hidden border border-slate-200 aspect-square bg-slate-100 shadow-2xs"
                  >
                    <img
                      src={img}
                      alt={`Ảnh ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />

                    {/* Badge ảnh đại diện */}
                    {idx === 0 && (
                      <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-md bg-emerald-600 text-white font-bold text-[9px] shadow-sm flex items-center gap-1 z-10">
                        <Star className="w-2.5 h-2.5 fill-current" />
                        <span>Ảnh chính</span>
                      </span>
                    )}

                    {/* Overlay action buttons */}
                    <div className="absolute inset-0 bg-slate-950/65 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5 p-2 z-20">
                      {idx !== 0 && (
                        <button
                          type="button"
                          onClick={() => handleSetPrimaryImage(idx)}
                          className="px-2 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] transition-colors w-full flex items-center justify-center gap-1 cursor-pointer"
                          title="Đưa lên làm ảnh đại diện chính"
                        >
                          <Star className="w-3 h-3" />
                          <span>Đặt làm chính</span>
                        </button>
                      )}

                      <a
                        href={img}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2 py-1 rounded-lg bg-white/20 hover:bg-white/30 text-white font-bold text-[10px] transition-colors w-full flex items-center justify-center gap-1 text-center"
                        title="Xem ảnh gốc cỡ lớn"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>Xem ảnh</span>
                      </a>

                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        className="px-2 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-[10px] transition-colors w-full flex items-center justify-center gap-1 cursor-pointer"
                        title="Xóa ảnh này khỏi bài đăng"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Xóa ảnh</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Công cụ thêm ảnh: Tải lên Cloudinary & Nhập URL */}
            <div className="pt-2 border-t border-emerald-200/50 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
              {/* Nút Upload Cloudinary */}
              <label className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-white border border-emerald-300 hover:bg-emerald-50 text-emerald-800 font-bold text-xs shadow-2xs cursor-pointer transition-colors shrink-0">
                {uploadingImage ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
                    <span>Đang tải ảnh...</span>
                  </>
                ) : (
                  <>
                    <UploadCloud className="w-4 h-4 text-emerald-600" />
                    <span>Tải ảnh từ máy tính</span>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleUploadImage}
                  disabled={uploadingImage}
                />
              </label>

              {/* Nhập URL ảnh */}
              <div className="flex-1 flex items-center gap-1.5">
                <input
                  type="url"
                  placeholder="Hoặc dán URL ảnh trực tiếp vào đây..."
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddImageUrl();
                    }
                  }}
                  className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <button
                  type="button"
                  onClick={handleAddImageUrl}
                  disabled={!newImageUrl.trim()}
                  className="px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-40 text-white font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Thêm</span>
                </button>
              </div>
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
        </form>

        {/* Footer Actions - Cố định ở đáy modal, không bao giờ bị cắt */}
        <div className="px-6 py-4 sm:px-8 border-t border-slate-100 flex items-center justify-end gap-3 shrink-0 bg-slate-50/90">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-slate-200 font-bold text-slate-700 hover:bg-white transition-colors cursor-pointer"
          >
            Hủy Bỏ
          </button>
          <button
            type="submit"
            form="admin-edit-material-form"
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
      </div>
    </div>,
    document.body
  );
};
