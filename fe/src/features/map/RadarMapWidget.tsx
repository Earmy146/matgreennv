import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  MapPin,
  Phone,
  MessageSquare,
  Navigation,
  Compass,
  Sliders,
  Info,
  Maximize2,
  Tag,
  CheckCircle,
} from "lucide-react";
import type { MaterialItem } from "@/types/material.types";
import { formatCurrency, formatDistance, CATEGORY_LABELS } from "@/lib/utils";

interface RadarMapWidgetProps {
  materials: MaterialItem[];
  radiusKm: number;
  userAddress: string;
}

export const RadarMapWidget: React.FC<RadarMapWidgetProps> = ({
  materials,
  radiusKm,
  userAddress,
}) => {
  const [selectedMaterial, setSelectedMaterial] = useState<MaterialItem | null>(
    materials[0] || null
  );

  // Giả lập tọa độ polar để bố trí trực quan các điểm Nhà A trên vòng tròn Radar
  const getRadarPosition = (index: number, total: number, distanceKm: number = 1) => {
    const angle = (index / Math.max(total, 1)) * 2 * Math.PI - Math.PI / 2;
    // Tỷ lệ khoảng cách so với bán kính quét tối đa
    const normalizedDistance = Math.min(Math.max(distanceKm / radiusKm, 0.2), 0.88);
    const radiusPercentage = normalizedDistance * 45; // 45% max radius from center

    const x = 50 + radiusPercentage * Math.cos(angle);
    const y = 50 + radiusPercentage * Math.sin(angle);

    return { left: `${x}%`, top: `${y}%` };
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
      {/* Widget Header */}
      <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
            <Compass className="w-5 h-5 text-emerald-700 animate-spin-slow" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-900 text-sm sm:text-base flex items-center gap-2">
              Radar Quét Vị Trí Xung Quanh
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                Bán kính {radiusKm} km
              </span>
            </h3>
            <p className="text-xs text-slate-500">
              Tâm quét: <strong className="text-slate-800">{userAddress}</strong> (Tìm thấy {materials.length} điểm vật liệu)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="flex items-center gap-1.5 text-slate-500">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Cho tặng (0đ)
          </span>
          <span className="flex items-center gap-1.5 text-slate-500 ml-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Bán thanh lý
          </span>
        </div>
      </div>

      {/* Main Grid: Radar Screen + Selected Detail Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[420px]">
        {/* Radar Circular Screen */}
        <div className="lg:col-span-8 p-6 flex items-center justify-center bg-slate-950 relative overflow-hidden select-none">
          {/* Radar background grid & concentric circles */}
          <div className="relative w-80 h-80 sm:w-96 sm:h-96 rounded-full border border-emerald-500/20 flex items-center justify-center">
            {/* Concentric distance rings */}
            <div className="absolute inset-4 rounded-full border border-emerald-500/15" />
            <div className="absolute inset-16 rounded-full border border-emerald-500/20" />
            <div className="absolute inset-28 rounded-full border border-emerald-500/25" />
            <div className="absolute inset-40 rounded-full border border-emerald-500/30" />

            {/* Crosshair axis lines */}
            <div className="absolute w-full h-[1px] bg-emerald-500/20" />
            <div className="absolute h-full w-[1px] bg-emerald-500/20" />

            {/* Sweep Animation */}
            <div
              className="absolute inset-0 rounded-full pointer-events-none opacity-40 animate-spin"
              style={{
                background: "conic-gradient(from 0deg at 50% 50%, rgba(16, 185, 129, 0.4) 0deg, transparent 60deg, transparent 360deg)",
                animationDuration: "6s",
              }}
            />

            {/* Distance labels */}
            <span className="absolute top-2 left-1/2 -translate-x-1/2 text-[9px] font-mono text-emerald-400/60 font-semibold">
              {radiusKm} km
            </span>
            <span className="absolute top-1/4 left-1/2 -translate-x-1/2 text-[9px] font-mono text-emerald-400/50">
              {(radiusKm / 2).toFixed(1)} km
            </span>

            {/* Center: YOU (Nhà B) */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center pointer-events-none">
              <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-white ring-4 ring-emerald-400/30 shadow-lg shadow-emerald-500">
                <Navigation className="w-3 h-3 fill-current rotate-45" />
              </div>
              <span className="mt-1 px-1.5 py-0.5 rounded-md bg-emerald-950/90 text-emerald-300 text-[10px] font-bold border border-emerald-500/40">
                Bạn (Nhà B)
              </span>
            </div>

            {/* Material Points (Nhà A) */}
            {materials.map((mat, idx) => {
              const pos = getRadarPosition(idx, materials.length, mat.distanceKm || 1);
              const isSelected = selectedMaterial?._id === mat._id;
              const isFree = mat.type === "free";

              return (
                <button
                  key={mat._id}
                  onClick={() => setSelectedMaterial(mat)}
                  style={{ left: pos.left, top: pos.top }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 z-30 group cursor-pointer transition-transform duration-200 ${
                    isSelected ? "scale-125 z-40" : "hover:scale-115"
                  }`}
                  title={`${mat.title} - Cách ${mat.distanceKm}km`}
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center shadow-md text-white transition-all ${
                      isFree
                        ? "bg-emerald-500 ring-2 ring-emerald-300/50 shadow-emerald-500/50"
                        : "bg-amber-500 ring-2 ring-amber-300/50 shadow-amber-500/50"
                    } ${isSelected ? "ring-4 ring-white" : ""}`}
                  >
                    <MapPin className="w-4 h-4 fill-current" />
                  </div>

                  {/* Pin distance tag */}
                  <div
                    className={`absolute left-1/2 -translate-x-1/2 -bottom-5 px-1.5 py-0.2 rounded text-[9px] font-mono whitespace-nowrap shadow-xs ${
                      isSelected
                        ? "bg-white text-slate-900 font-extrabold"
                        : "bg-slate-900/80 text-emerald-300 border border-emerald-500/30"
                    }`}
                  >
                    {formatDistance(mat.distanceKm)}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Material Detail Inspector Panel */}
        <div className="lg:col-span-4 p-5 sm:p-6 bg-slate-50 border-t lg:border-t-0 lg:border-l border-slate-200 flex flex-col justify-between">
          {selectedMaterial ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">
                  {CATEGORY_LABELS[selectedMaterial.category] || "Vật liệu tháo dỡ"}
                </span>
                <span
                  className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                    selectedMaterial.type === "free"
                      ? "bg-emerald-600 text-white"
                      : "bg-amber-500 text-white"
                  }`}
                >
                  {selectedMaterial.type === "free" ? "🎁 Cho/Tặng (0đ)" : "🏷️ Bán Thanh Lý"}
                </span>
              </div>

              {/* Thumbnail */}
              <div className="h-36 rounded-2xl bg-slate-200 overflow-hidden relative border border-slate-200">
                {selectedMaterial.images?.[0] ? (
                  <img
                    src={selectedMaterial.images[0]}
                    alt={selectedMaterial.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
                    Chưa có ảnh
                  </div>
                )}
                <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-black/70 text-white text-xs font-mono font-bold flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-emerald-400" />
                  Cách bạn {formatDistance(selectedMaterial.distanceKm)}
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-sm leading-snug line-clamp-2">
                  {selectedMaterial.title}
                </h4>
                <div className="mt-1 text-base font-extrabold text-amber-600">
                  {formatCurrency(selectedMaterial.price)}
                  {selectedMaterial.unit && selectedMaterial.type !== "free"
                    ? ` / ${selectedMaterial.unit}`
                    : ""}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white border border-slate-200 text-xs text-slate-600 space-y-1">
                <div>
                  <strong>Địa chỉ:</strong> {selectedMaterial.location?.address}
                </div>
                <div>
                  <strong>Chủ công trình (Nhà A):</strong> {selectedMaterial.owner?.name}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-2">
                {selectedMaterial.contactPhone ? (
                  <a
                    href={`tel:${selectedMaterial.contactPhone}`}
                    className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-white hover:text-emerald-700 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-emerald-600" />
                    Gọi Điện
                  </a>
                ) : (
                  <div />
                )}
                <Link
                  to={`/chat?partnerId=${selectedMaterial.owner?._id}&materialId=${selectedMaterial._id}`}
                  className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  Nhắn Tin
                </Link>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 text-xs">
              <MapPin className="w-8 h-8 text-slate-300 mb-2" />
              Chọn một điểm ghim trên Radar để xem thông tin chi tiết
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
