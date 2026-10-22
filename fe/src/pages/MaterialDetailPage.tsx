import React from "react";
import { useParams, Link } from "react-router-dom";
import { MapPin, Phone, MessageSquare, ArrowLeft, Tag, Calendar, User, ShieldCheck } from "lucide-react";
import { formatCurrency, formatDistance, CATEGORY_LABELS } from "@/lib/utils";

export const MaterialDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  // Placeholder mock detail for demo
  const material = {
    _id: id || "demo-1",
    title: "1.5 Tấn thép phi 10, phi 12 cũ tháo dỡ từ nhà 3 tầng",
    description:
      "Nhà chuẩn bị đập để xây mới, thép còn thẳng và đẹp, đã được cắt thành từng thanh 3-4m gọn gàng. Bán thanh lý giá hữu nghị cho ai cần đổ móng hoặc dựng xưởng nhỏ. Người mua tự bố trí xe đến bốc xếp.",
    category: "sat_thep",
    type: "sell" as "free" | "sell",
    price: 8500,
    unit: "kg",
    images: ["https://images.unsplash.com/photo-1535813547-99c456a41d4a?auto=format&fit=crop&w=1000&q=80"],
    location: {
      type: "Point" as const,
      coordinates: [105.8542, 21.0285] as [number, number],
      address: "Số 45, Ngõ 12 Đội Cấn, Ba Đình, Hà Nội",
    },
    contactPhone: "0987654321",
    status: "available",
    owner: { _id: "user-1", name: "Anh Nam (Chủ nhà A)" },
    distanceKm: 0.8,
    createdAt: new Date().toISOString(),
  };

  const isFree = material.type === "free";

  return (
    <div className="max-w-4xl mx-auto py-4 space-y-6">
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-emerald-700 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Quay lại danh sách vật liệu
      </Link>

      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm grid grid-cols-1 md:grid-cols-2">
        {/* Image */}
        <div className="bg-slate-100 min-h-[300px] relative">
          <img
            src={material.images[0]}
            alt={material.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 left-4">
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold ${
                isFree ? "bg-emerald-600 text-white" : "bg-amber-600 text-white"
              }`}
            >
              {isFree ? "Cho Tặng 0đ" : "Bán Thanh Lý"}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
              {CATEGORY_LABELS[material.category] || "Vật liệu khác"}
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
              {material.title}
            </h1>

            <div className="text-2xl font-extrabold text-amber-600">
              {formatCurrency(material.price)}
              {material.unit && !isFree ? ` / ${material.unit}` : ""}
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  Địa chỉ: <strong>{material.location.address}</strong> (Cách bạn{" "}
                  <strong>{formatDistance(material.distanceKm)}</strong>)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-slate-400 shrink-0" />
                <span>Người đăng: {material.owner.name}</span>
              </div>
            </div>

            <div>
              <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Mô tả hiện trạng
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {material.description}
              </p>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 grid grid-cols-2 gap-3 mt-6">
            <a
              href={`tel:${material.contactPhone}`}
              className="flex items-center justify-center gap-2 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all active:scale-95"
            >
              <Phone className="w-4 h-4" /> Gọi điện ({material.contactPhone})
            </a>
            <Link
              to={`/chat?partnerId=${material.owner._id}&materialId=${material._id}`}
              className="flex items-center justify-center gap-2 py-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold transition-colors"
            >
              <MessageSquare className="w-4 h-4" /> Nhắn tin trực tiếp
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
