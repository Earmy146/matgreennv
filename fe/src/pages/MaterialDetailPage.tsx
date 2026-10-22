import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  MapPin,
  Phone,
  MessageSquare,
  ArrowLeft,
  Tag,
  Calendar,
  User,
  Clock,
  MessageCircle,
  Share2,
} from "lucide-react";
import { formatCurrency, formatDistance, CATEGORY_LABELS } from "@/lib/utils";

export const MaterialDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);

  // Mock detail
  const material = {
    _id: id || "demo-1",
    title: "1.5 Tấn thép phi 10, phi 12 cũ tháo dỡ từ nhà 3 tầng",
    description:
      "Nhà chuẩn bị đập để xây mới, thép còn thẳng và đẹp, đã được cắt thành từng thanh 3-4m bó lại gọn gàng trong sân. Bán thanh lý giá hữu nghị cho ai cần đổ móng hoặc dựng xưởng nhỏ. Người mua tự bố trí xe đến bốc xếp.",
    category: "sat_thep",
    type: "sell" as "free" | "sell",
    price: 8500,
    unit: "kg",
    images: [
      "https://images.unsplash.com/photo-1535813547-99c456a41d4a?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1000&q=80",
    ],
    location: {
      type: "Point" as const,
      coordinates: [105.8542, 21.0285] as [number, number],
      address: "Số 45, Ngõ 12 Đội Cấn, Ba Đình, Hà Nội",
    },
    contactName: "Anh Nam (Chủ nhà A)",
    contactPhone: "0987654321",
    contactZalo: "0987654321",
    contactHours: "Gọi trước 30 phút hoặc 8h - 18h",
    status: "available",
    owner: { _id: "user-1", name: "Anh Nam (Chủ nhà A)" },
    distanceKm: 0.8,
    createdAt: new Date().toISOString(),
  };

  const isFree = material.type === "free";
  const cleanPhone = material.contactPhone.replace(/[^0-9]/g, "");
  const zaloPhone = (material.contactZalo || material.contactPhone).replace(/[^0-9]/g, "");

  return (
    <div className="max-w-4xl mx-auto py-4 space-y-6">
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-emerald-700 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Quay lại danh sách vật liệu quanh bạn
      </Link>

      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm grid grid-cols-1 md:grid-cols-2">
        {/* Left: Image Gallery */}
        <div className="bg-slate-100 p-4 flex flex-col justify-between">
          <div className="h-72 rounded-2xl overflow-hidden relative border border-slate-200 bg-slate-900">
            <img
              src={material.images[selectedImageIdx] || material.images[0]}
              alt={material.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-3 left-3">
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold ${
                  isFree ? "bg-emerald-600 text-white" : "bg-amber-600 text-white"
                }`}
              >
                {isFree ? "🎁 Cho Tặng 0đ" : "🏷️ Bán Thanh Lý"}
              </span>
            </div>
            <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded-md bg-black/70 text-white text-xs font-mono font-bold flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              Cách bạn {formatDistance(material.distanceKm)}
            </div>
          </div>

          {/* Thumbnails */}
          {material.images.length > 1 && (
            <div className="flex gap-2 mt-3 overflow-x-auto">
              {material.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImageIdx(i)}
                  className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                    selectedImageIdx === i ? "border-emerald-600 scale-95" : "border-transparent opacity-70"
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Content & Contact Details */}
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

            {/* Location & Contact Info Box */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5 text-xs text-slate-700">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  Địa chỉ: <strong>{material.location.address}</strong> (Cách bạn{" "}
                  <strong>{formatDistance(material.distanceKm)}</strong>)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-slate-400 shrink-0" />
                <span>Người liên hệ: <strong>{material.contactName || material.owner.name}</strong></span>
              </div>
              {material.contactHours && (
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>Thời gian tiếp nhận: <strong>{material.contactHours}</strong></span>
                </div>
              )}
            </div>

            <div>
              <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Mô tả hiện trạng công trình
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {material.description}
              </p>
            </div>
          </div>

          {/* Action Contact Buttons (Gọi điện, Zalo, Chat) */}
          <div className="pt-6 border-t border-slate-100 space-y-2.5 mt-6">
            <div className="grid grid-cols-2 gap-2">
              <a
                href={`tel:${cleanPhone}`}
                className="flex items-center justify-center gap-2 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all active:scale-95"
              >
                <Phone className="w-4 h-4" /> Gọi điện ({material.contactPhone})
              </a>

              <a
                href={`https://zalo.me/${zaloPhone}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/20 transition-all active:scale-95"
              >
                <MessageCircle className="w-4 h-4" /> Nhắn Zalo
              </a>
            </div>

            <Link
              to={`/chat?partnerId=${material.owner._id}&materialId=${material._id}`}
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold transition-colors"
            >
              <MessageSquare className="w-4 h-4" /> Chat trực tiếp trên MatGreen
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
