import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Clock, MapPin, MessageSquare, Phone, ShieldCheck, Tag } from "lucide-react";
import type { MaterialItem } from "@/types/material.types";
import {
  calculateHaversineDistance,
  CATEGORY_LABELS,
  formatCurrency,
  formatDistance,
  formatRelativeTime,
  stripHtml,
} from "@/lib/utils";
import { useLocationStore } from "@/stores/location.store";

interface MaterialCardProps {
  material: MaterialItem;
}

export const MaterialCard: React.FC<MaterialCardProps> = ({ material }) => {
  const { latitude: userLat, longitude: userLng } = useLocationStore();
  const [imgError, setImgError] = useState(false);
  const isFree = material.type === "free";

  const coords = material.location?.coordinates;
  const hasCoords =
    Array.isArray(coords) &&
    coords.length === 2 &&
    typeof coords[0] === "number" &&
    typeof coords[1] === "number";

  const effectiveDistance = useMemo(() => {
    if (typeof material.distanceKm === "number" && !Number.isNaN(material.distanceKm)) {
      return material.distanceKm;
    }
    if (userLat !== null && userLng !== null && hasCoords) {
      return calculateHaversineDistance(userLat, userLng, coords[1], coords[0]);
    }
    return undefined;
  }, [material.distanceKm, userLat, userLng, hasCoords, coords]);

  const plainDescription = useMemo(
    () =>
      stripHtml(material.description) ||
      "Công trình đang chuẩn bị tháo dỡ, cần dọn dẹp mặt bằng nhanh...",
    [material.description]
  );

  const relativeTime = useMemo(() => formatRelativeTime(material.createdAt), [material.createdAt]);
  const hasImage = Boolean(material.images?.[0]) && !imgError;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-lg hover:border-emerald-200 transition-all duration-200 overflow-hidden flex flex-col group h-full">
      {/* Clickable Thumbnail */}
      <Link
        to={`/materials/${material._id}`}
        className="h-44 bg-slate-100 relative overflow-hidden flex items-center justify-center shrink-0"
      >
        {hasImage ? (
          <>
            <div className="absolute inset-0 bg-slate-200/70 animate-shimmer" />
            <img
              src={material.images[0]}
              alt={material.title}
              loading="lazy"
              onError={() => setImgError(true)}
              className="relative z-10 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </>
        ) : (
          <div className="text-slate-400 text-xs flex flex-col items-center gap-1.5">
            <Tag className="w-8 h-8 stroke-1 text-slate-300" />
            <span>Chưa có ảnh vật liệu</span>
          </div>
        )}

        {/* Pricing Badge */}
        <div className="absolute top-3 left-3 z-20 pointer-events-none flex items-center gap-1.5">
          {isFree ? (
            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-600 text-white shadow-sm">
              Cho/Tặng 0đ
            </span>
          ) : (
            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500 text-white shadow-sm">
              Thanh lý
            </span>
          )}
          {material.location?.verificationStatus === "verified" && (
            <span
              className="p-1 rounded-full bg-white/95 text-emerald-700 shadow-sm"
              title="GPS đã xác minh"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
            </span>
          )}
        </div>

        {/* Distance Badge */}
        <div className="absolute bottom-2.5 right-2.5 z-20 pointer-events-none">
          {effectiveDistance !== undefined ? (
            <div className="bg-slate-950/80 backdrop-blur-sm text-white px-2.5 py-1 rounded-xl text-[11px] font-bold flex items-center gap-1 shadow-sm">
              <MapPin className="w-3 h-3 text-emerald-400" />
              {formatDistance(effectiveDistance)}
            </div>
          ) : null}
        </div>
      </Link>

      {/* Body */}
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex items-center justify-between gap-2 text-[11px] mb-1">
          <span className="font-bold text-emerald-700 truncate">
            {CATEGORY_LABELS[material.category] || "Vật liệu khác"}
          </span>
          {relativeTime && (
            <span className="text-slate-400 inline-flex items-center gap-1 shrink-0">
              <Clock className="w-3 h-3" />
              {relativeTime}
            </span>
          )}
        </div>

        <Link
          to={`/materials/${material._id}`}
          className="font-bold text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-1 text-[15px] mb-1"
          title={material.title}
        >
          {material.title}
        </Link>

        <p className="text-xs text-slate-500 line-clamp-2 mb-3 leading-relaxed">
          {plainDescription}
        </p>

        {/* Price & Address */}
        <div className="mt-auto pt-3 border-t border-slate-100 flex items-end justify-between gap-2 text-xs">
          <div className="min-w-0">
            <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
              Chi phí
            </div>
            <div
              className={`font-extrabold text-sm truncate ${
                isFree ? "text-emerald-600" : "text-amber-600"
              }`}
            >
              {formatCurrency(material.price)}
              {material.unit && !isFree ? ` / ${material.unit}` : ""}
            </div>
          </div>

          <div className="text-right max-w-[52%] min-w-0">
            <div
              className="font-medium text-slate-700 truncate text-[11px]"
              title={material.location?.address}
            >
              {material.location?.address}
            </div>
            {hasCoords && (
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${coords[1]},${coords[0]}`}
                target="_blank"
                rel="noreferrer"
                className="text-[11px] font-bold text-emerald-700 hover:underline inline-block mt-0.5"
                onClick={(event) => event.stopPropagation()}
              >
                Chỉ đường →
              </a>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="mt-3 grid grid-cols-2 gap-2">
          {material.contactPhone ? (
            <a
              href={`tel:${material.contactPhone}`}
              className="flex items-center justify-center gap-1.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-emerald-700 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-600" />
              Gọi điện
            </a>
          ) : (
            <div />
          )}
          <Link
            to={`/chat?partnerId=${material.owner?._id}&materialId=${material._id}`}
            className="flex items-center justify-center gap-1.5 py-2 rounded-xl bg-emerald-50 text-xs font-semibold text-emerald-800 hover:bg-emerald-100 transition-colors"
          >
            <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
            Nhắn tin
          </Link>
        </div>
      </div>
    </div>
  );
};
