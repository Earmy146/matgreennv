import React from "react";
import { Link } from "react-router-dom";
import { MapPin, Phone, MessageSquare, Tag } from "lucide-react";
import type { MaterialItem } from "@/types/material.types";
import { formatCurrency, formatDistance, CATEGORY_LABELS } from "@/lib/utils";

interface MaterialCardProps {
  material: MaterialItem;
}

export const MaterialCard: React.FC<MaterialCardProps> = ({ material }) => {
  const isFree = material.type === "free";

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden flex flex-col group">
      {/* Thumbnail or placeholder */}
      <div className="h-44 bg-slate-100 relative overflow-hidden flex items-center justify-center">
        {material.images && material.images.length > 0 ? (
          <img
            src={material.images[0]}
            alt={material.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="text-slate-400 text-xs flex flex-col items-center gap-1">
            <Tag className="w-8 h-8 stroke-1 text-slate-300" />
            <span>Chưa có ảnh vật liệu</span>
          </div>
        )}

        {/* Pricing Badge */}
        <div className="absolute top-3 left-3">
          {isFree ? (
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-600 text-white shadow-sm">
              Miễn phí (Cho/Tặng)
            </span>
          ) : (
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500 text-white shadow-sm">
              Thanh lý có phí
            </span>
          )}
        </div>

        {/* Distance Badge */}
        {material.distanceKm !== undefined && (
          <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-sm text-white px-2 py-0.5 rounded-md text-xs font-medium flex items-center gap-1">
            <MapPin className="w-3 h-3 text-emerald-400" />
            Cách bạn {formatDistance(material.distanceKm)}
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-4 flex-1 flex flex-col">
        <div className="text-xs font-medium text-emerald-700 mb-1">
          {CATEGORY_LABELS[material.category] || "Vật liệu khác"}
        </div>
        <Link
          to={`/materials/${material._id}`}
          className="font-bold text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-1 text-base mb-1"
        >
          {material.title}
        </Link>
        <p className="text-xs text-slate-500 line-clamp-2 mb-3">
          {material.description || "Công trình đang chuẩn bị tháo dỡ, cần dọn dẹp mặt bằng nhanh..."}
        </p>

        {/* Price & Address */}
        <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          <div>
            <div className="text-slate-400">Chi phí:</div>
            <div className={`font-extrabold text-sm ${isFree ? "text-emerald-600" : "text-amber-600"}`}>
              {formatCurrency(material.price)}
              {material.unit && !isFree ? ` / ${material.unit}` : ""}
            </div>
          </div>
          <div className="text-right max-w-[50%]">
            <div className="text-slate-400">Địa chỉ:</div>
            <div className="font-medium text-slate-700 truncate" title={material.location?.address}>
              {material.location?.address}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-3 grid grid-cols-2 gap-2">
          {material.contactPhone ? (
            <a
              href={`tel:${material.contactPhone}`}
              className="flex items-center justify-center gap-1.5 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-emerald-700 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-600" />
              Gọi điện
            </a>
          ) : (
            <div />
          )}
          <Link
            to={`/chat?partnerId=${material.owner?._id}&materialId=${material._id}`}
            className="flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-emerald-50 text-xs font-medium text-emerald-800 hover:bg-emerald-100 transition-colors"
          >
            <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
            Nhắn tin
          </Link>
        </div>
      </div>
    </div>
  );
};
