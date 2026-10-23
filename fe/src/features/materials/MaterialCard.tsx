import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { MapPin, Phone, MessageSquare, Tag } from "lucide-react";
import type { MaterialItem } from "@/types/material.types";
import { formatCurrency, formatDistance, calculateHaversineDistance, CATEGORY_LABELS } from "@/lib/utils";
import { useLocationStore } from "@/stores/location.store";

interface MaterialCardProps {
  material: MaterialItem;
}

export const MaterialCard: React.FC<MaterialCardProps> = ({ material }) => {
  const { latitude: userLat, longitude: userLng } = useLocationStore();
  const [imgError, setImgError] = useState(false);
  const isFree = material.type === "free";

  // Tọa độ công trình
  const coords = material.location?.coordinates;
  const hasCoords =
    Array.isArray(coords) &&
    coords.length === 2 &&
    typeof coords[0] === "number" &&
    typeof coords[1] === "number";

  // Khoảng cách thực tế: Ưu tiên backend distanceKm, fallback tính Haversine trực tiếp tại frontend
  const effectiveDistance = useMemo(() => {
    if (typeof material.distanceKm === "number" && !isNaN(material.distanceKm)) {
      return material.distanceKm;
    }
    if (userLat !== null && userLng !== null && hasCoords) {
      return calculateHaversineDistance(userLat, userLng, coords[1], coords[0]);
    }
    return undefined;
  }, [material.distanceKm, userLat, userLng, hasCoords, coords]);

  const displayImage = imgError
    ? "/assets/images/products/product-1-1.jpg"
    : material.images?.[0] || "/assets/images/products/product-1-1.jpg";

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden flex flex-col group h-full">
      {/* Thumbnail or placeholder */}
      <div className="h-44 bg-slate-100 relative overflow-hidden flex items-center justify-center">
        {material.images && material.images.length > 0 ? (
          <>
            <div className="absolute inset-0 bg-slate-200/80 animate-shimmer" />
            <img
              src={displayImage}
              alt=""
              loading="lazy"
              onError={() => setImgError(true)}
              className="relative z-10 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </>
        ) : (
          <div className="text-slate-400 text-xs flex flex-col items-center gap-1">
            <Tag className="w-8 h-8 stroke-1 text-slate-300" />
            <span>Chưa có ảnh vật liệu</span>
          </div>
        )}

        {/* Pricing Badge (z-20 nằm trên ảnh) */}
        <div className="absolute top-3 left-3 z-20 pointer-events-none">
          {isFree ? (
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-600 text-white shadow-md">
              Miễn phí (Cho/Tặng)
            </span>
          ) : (
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500 text-white shadow-md">
              Thanh lý có phí
            </span>
          )}
        </div>

        {/* Distance Badge (z-20 nằm trên ảnh) */}
        <div className="absolute bottom-3 right-3 z-20 pointer-events-none">
          {effectiveDistance !== undefined ? (
            <div className="bg-slate-950/80 backdrop-blur-sm text-white px-2.5 py-1 rounded-xl text-xs font-bold flex items-center gap-1 shadow-md">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              Cách bạn {formatDistance(effectiveDistance)}
            </div>
          ) : hasCoords ? (
            <div className="bg-slate-900/60 backdrop-blur-sm text-slate-300 px-2 py-0.5 rounded-lg text-[10px] font-medium flex items-center gap-1">
              <MapPin className="w-3 h-3 text-slate-400" />
              Có tọa độ GPS
            </div>
          ) : null}
        </div>
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
            {material.location?.coordinates?.length === 2 && (
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${material.location.coordinates[1]},${material.location.coordinates[0]}`}
                target="_blank"
                rel="noreferrer"
                className="text-[11px] font-bold text-emerald-700 hover:underline"
                onClick={(event) => event.stopPropagation()}
              >
                Mở bản đồ / Chỉ đường
              </a>
            )}
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
