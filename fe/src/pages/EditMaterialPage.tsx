import React, { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle,
  Loader2,
  Save,
  Upload,
  X,
} from "lucide-react";
import { materialsApi, uploadApi } from "@/services/api";
import { RichTextEditor } from "@/components/common/RichTextEditor";
import { LocationMapPicker } from "@/components/map/LocationMapPicker";
import { CATEGORY_LABELS } from "@/lib/utils";
import { toast } from "@/stores/toast.store";
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
    type: "free" | "sell";
    description: string;
    price: number;
    unit: string;
    images: string[];
    address: string;
    latitude: number;
    longitude: number;
    locationSource: "browser_gps" | "map_pin";
    contactPhone: string;
    contactHours: string;
    contactName: string;
    contactZalo: string;
    status: "available" | "reserved" | "completed";
  }>({
    title: "",
    category: "khac",
    type: "free",
    description: "",
    price: 0,
    unit: "gói",
    images: [],
    address: "",
    latitude: 0,
    longitude: 0,
    locationSource: "map_pin",
    contactPhone: "",
    contactHours: "",
    contactName: "",
    contactZalo: "",
    status: "available",
  });

  const [uploadingImg, setUploadingImg] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (material) {
      const coords = material.location?.coordinates || [0, 0];
      setForm({
        title: material.title || "",
        category: (material.category as MaterialCategory) || "khac",
        type: material.type === "sell" ? "sell" : "free",
        description: material.description || "",
        price: material.price || 0,
        unit: material.unit || "gói",
        images: material.images || [],
        address: material.location?.address || "",
        latitude: coords[1] || 0,
        longitude: coords[0] || 0,
        locationSource: "map_pin",
        contactPhone: material.contactPhone || "",
        contactHours: material.contactHours || "",
        contactName: material.contactName || "",
        contactZalo: material.contactZalo || "",
        status: material.status || "available",
      });
    }
  }, [material]);

  const handleUploadFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !files.length) return;
    setUploadingImg(true);
    setError(null);
    try {
      const urls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const res = await uploadApi.uploadImage(files[i], "materials");
        urls.push(res.url);
      }
      setForm((prev) => ({ ...prev, images: [...prev.images, ...urls] }));
      toast.success(`Đã thêm ${urls.length} ảnh vật liệu`);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Không thể tải ảnh lên");
    } finally {
      setUploadingImg(false);
      e.target.value = "";
    }
  };

  const updateMutation = useMutation({
    mutationFn: () =>
      materialsApi.update(id as string, {
        ...form,
        price: form.type === "free" ? 0 : Number(form.price),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["material-detail", id] });
      queryClient.invalidateQueries({ queryKey: ["my-materials"] });
      setSuccess(true);
      toast.success("Đã cập nhật bài đăng thành công!");
      setTimeout(() => navigate(-1), 900);
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
    <div className="max-w-4xl mx-auto py-4 animate-fadeIn">
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <button
              type="button"
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

          {/* Hình thức, Giá, Đơn vị & Trạng thái */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Hình thức
              </label>
              <select
                value={form.type}
                onChange={(e) => {
                  const nextType = e.target.value as "free" | "sell";
                  setForm({
                    ...form,
                    type: nextType,
                    price: nextType === "free" ? 0 : form.price,
                  });
                }}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white font-bold"
              >
                <option value="free">Cho/Tặng 0đ</option>
                <option value="sell">Bán thanh lý</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Giá (VNĐ)
              </label>
              <input
                type="number"
                min={0}
                step={1000}
                disabled={form.type === "free"}
                value={form.type === "free" ? 0 : form.price}
                onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white disabled:opacity-60"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Đơn vị tính
              </label>
              <input
                type="text"
                placeholder="VD: chuyến xe, kg..."
                value={form.unit}
                onChange={(e) => setForm({ ...form, unit: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Trạng thái
              </label>
              <select
                value={form.status}
                onChange={(e) =>
                  setForm({
                    ...form,
                    status: e.target.value as "available" | "reserved" | "completed",
                  })
                }
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white font-bold"
              >
                <option value="available">🟢 Đang khả dụng</option>
                <option value="reserved">🟡 Đã có người hẹn</option>
                <option value="completed">⚪ Đã bàn giao xong</option>
              </select>
            </div>
          </div>

          {/* Quản lý thư viện ảnh */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Thư viện ảnh vật liệu ({form.images.length})
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {form.images.map((url, idx) => (
                <div
                  key={`${url}-${idx}`}
                  className="relative h-28 rounded-xl overflow-hidden border border-slate-200 bg-slate-100"
                >
                  <img src={url} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() =>
                      setForm((prev) => ({
                        ...prev,
                        images: prev.images.filter((_, i) => i !== idx),
                      }))
                    }
                    className="absolute top-1.5 right-1.5 p-1 rounded-full bg-slate-900/80 text-white hover:bg-rose-600 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
              <label className="flex flex-col items-center justify-center h-28 border-2 border-dashed border-slate-200 rounded-xl cursor-pointer hover:border-emerald-400 hover:bg-emerald-50/30 transition-colors">
                {uploadingImg ? (
                  <Loader2 className="w-6 h-6 text-emerald-600 animate-spin" />
                ) : (
                  <Upload className="w-5 h-5 text-slate-400 mb-1" />
                )}
                <span className="text-[11px] font-bold text-slate-600">Thêm ảnh</span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  disabled={uploadingImg}
                  onChange={handleUploadFiles}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Bản đồ ghim vị trí */}
          <LocationMapPicker
            latitude={form.latitude}
            longitude={form.longitude}
            address={form.address}
            onChange={(loc) =>
              setForm((prev) => ({
                ...prev,
                latitude: loc.latitude,
                longitude: loc.longitude,
                address: loc.address,
                locationSource: loc.locationSource,
              }))
            }
          />

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

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Mô tả chi tiết công trình & vật liệu
            </label>
            <RichTextEditor
              value={form.description}
              onChange={(description) => setForm({ ...form, description })}
              placeholder="Nhập mô tả chi tiết vật liệu, tình trạng công trình, điều kiện bốc hàng..."
              minHeight={240}
            />
          </div>

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
                  <span>Lưu Thay Đổi</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
