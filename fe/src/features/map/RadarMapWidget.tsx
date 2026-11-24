import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Circle, MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  Crosshair,
  MapPin,
  Maximize2,
  MessageSquare,
  Minimize2,
  Navigation,
  Phone,
  Sparkles,
} from "lucide-react";
import type { MaterialItem } from "@/types/material.types";
import { CATEGORY_LABELS, formatCurrency, formatDistance } from "@/lib/utils";
import { useAiAssistantStore } from "@/stores/ai-assistant.store";

interface RadarMapWidgetProps {
  materials: MaterialItem[];
  radiusKm: number;
  userAddress: string;
  userLatitude?: number | null;
  userLongitude?: number | null;
}

const CATEGORY_SHORT_BADGE: Record<string, string> = {
  sat_thep: "Thép",
  gach_ngoi: "Gạch",
  cua_kinh: "Cửa",
  thiet_bi_ve_sinh: "TBVS",
  go_copha: "Gỗ",
  xa_ban: "Xà bần",
  khac: "Khác",
};

function compactPriceLabel(item: MaterialItem): string {
  if (item.type === "free" || !item.price) return "0đ";
  if (item.price >= 1_000_000) {
    const tr = Math.round((item.price / 1_000_000) * 10) / 10;
    return `${tr}tr`;
  }
  if (item.price >= 1_000) {
    return `${Math.round(item.price / 1_000)}k`;
  }
  return `${item.price}đ`;
}

const userBeaconIcon = L.divIcon({
  className: "",
  html: `<div style="position:relative;width:22px;height:22px;display:flex;align-items:center;justify-content:center">
    <span style="position:absolute;inset:-8px;border-radius:9999px;background:rgba(16,185,129,0.22);border:1.5px solid rgba(5,150,105,0.45)"></span>
    <span style="width:14px;height:14px;border-radius:9999px;background:#059669;border:2.5px solid #ffffff;box-shadow:0 2px 8px rgba(0,0,0,0.35)"></span>
  </div>`,
  iconSize: [22, 22],
  iconAnchor: [11, 11],
});

function createMaterialPillIcon(item: MaterialItem, isSelected: boolean) {
  const isFree = item.type === "free";
  const bg = isSelected ? "#0f172a" : isFree ? "#059669" : "#d97706";
  const catShort = CATEGORY_SHORT_BADGE[item.category] || "VL";
  const priceShort = compactPriceLabel(item);
  const scale = isSelected ? "transform:scale(1.1);z-index:999;" : "";

  return L.divIcon({
    className: "",
    html: `<div style="
      display:inline-flex;align-items:center;gap:4px;
      padding:3px 8px;border-radius:9999px;
      background:${bg};color:#fff;
      font-family:'Be Vietnam Pro',sans-serif;font-size:11px;font-weight:800;
      white-space:nowrap;border:2px solid #fff;
      box-shadow:0 3px 10px rgba(0,0,0,0.28);${scale}
    "><span>${catShort}</span><span style="opacity:0.75">·</span><span>${priceShort}</span></div>`,
    iconSize: [76, 26],
    iconAnchor: [38, 13],
  });
}

function MapController({
  materials,
  userLatitude,
  userLongitude,
  focusCoords,
  recenterSignal,
}: {
  materials: MaterialItem[];
  userLatitude: number;
  userLongitude: number;
  focusCoords: [number, number] | null;
  recenterSignal: number;
}) {
  const map = useMap();

  useEffect(() => {
    const points: L.LatLngExpression[] = [
      [userLatitude, userLongitude],
      ...materials
        .filter((item) => item.location?.coordinates?.length === 2)
        .map(
          (item) =>
            [item.location.coordinates[1], item.location.coordinates[0]] as L.LatLngExpression
        ),
    ];
    if (points.length > 1) map.fitBounds(L.latLngBounds(points), { padding: [36, 36] });
    else map.setView([userLatitude, userLongitude], 13);
  }, [map, materials, userLatitude, userLongitude]);

  useEffect(() => {
    if (focusCoords) {
      map.flyTo(focusCoords, Math.max(map.getZoom(), 14), { duration: 0.6 });
    }
  }, [focusCoords, map]);

  useEffect(() => {
    if (recenterSignal > 0) {
      map.flyTo([userLatitude, userLongitude], 14, { duration: 0.6 });
    }
  }, [recenterSignal, userLatitude, userLongitude, map]);

  return null;
}

export const RadarMapWidget: React.FC<RadarMapWidgetProps> = ({
  materials,
  radiusKm,
  userAddress,
  userLatitude,
  userLongitude,
}) => {
  const [selectedMaterial, setSelectedMaterial] = useState<MaterialItem | null>(
    materials[0] || null
  );
  const [focusCoords, setFocusCoords] = useState<[number, number] | null>(null);
  const [recenterSignal, setRecenterSignal] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const openAiDrawer = useAiAssistantStore((state) => state.openDrawer);

  const validMaterials = useMemo(
    () => materials.filter((item) => item.location?.coordinates?.length === 2),
    [materials]
  );

  useEffect(() => {
    if (!validMaterials.length) {
      setSelectedMaterial(null);
      return;
    }
    if (!selectedMaterial || !validMaterials.some((m) => m._id === selectedMaterial._id)) {
      setSelectedMaterial(validMaterials[0]);
    }
  }, [validMaterials, selectedMaterial]);

  if (
    userLatitude === null ||
    userLongitude === null ||
    userLatitude === undefined ||
    userLongitude === undefined
  ) {
    return (
      <div className="rounded-3xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-900">
        Cần cấp quyền GPS để hiển thị bản đồ Radar công trình quanh bạn.
      </div>
    );
  }

  const handleSelectItem = (item: MaterialItem) => {
    setSelectedMaterial(item);
    if (item.location?.coordinates?.length === 2) {
      setFocusCoords([item.location.coordinates[1], item.location.coordinates[0]]);
    }
  };

  return (
    <div
      className={`bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm ${
        isExpanded ? "fixed inset-3 z-[80] flex flex-col shadow-2xl" : ""
      }`}
      data-lenis-prevent
    >
      {/* Top Bar */}
      <div className="px-4 sm:px-5 py-3.5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div>
          <h3 className="font-extrabold text-slate-900 text-sm sm:text-base flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-600" />
            <span>Radar Điều Phối Quanh Bạn</span>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              R = {radiusKm} km
            </span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Tâm quét: <strong>{userAddress || "Vị trí GPS hiện tại"}</strong> ·{" "}
            <strong>{validMaterials.length}</strong> điểm cung ứng
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-3 text-xs text-slate-500 mr-2">
            <span className="inline-flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" /> Cho/Tặng 0đ
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-600" /> Thanh lý
            </span>
          </div>

          <button
            type="button"
            onClick={() => setRecenterSignal((n) => n + 1)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-emerald-50 hover:text-emerald-800 text-xs font-bold text-slate-700 transition-colors cursor-pointer"
            title="Đưa bản đồ về vị trí của tôi"
          >
            <Crosshair className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden sm:inline">Vị trí của tôi</span>
          </button>

          <button
            type="button"
            onClick={() => setIsExpanded((v) => !v)}
            className="p-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 cursor-pointer"
            title={isExpanded ? "Thu nhỏ bản đồ" : "Mở rộng bản đồ"}
          >
            {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Map + Synchronized Inspector Panel */}
      <div
        className={`grid grid-cols-1 lg:grid-cols-12 ${
          isExpanded ? "flex-1 min-h-0" : ""
        }`}
      >
        <div className={`lg:col-span-8 ${isExpanded ? "h-full min-h-[340px]" : "h-[460px]"}`}>
          <MapContainer
            center={[userLatitude, userLongitude]}
            zoom={13}
            scrollWheelZoom
            className="h-full w-full z-0"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapController
              materials={validMaterials}
              userLatitude={userLatitude}
              userLongitude={userLongitude}
              focusCoords={focusCoords}
              recenterSignal={recenterSignal}
            />
            <Circle
              center={[userLatitude, userLongitude]}
              radius={radiusKm * 1000}
              pathOptions={{
                color: "#059669",
                weight: 1.5,
                dashArray: "6 6",
                fillColor: "#10b981",
                fillOpacity: 0.07,
              }}
            />
            <Marker position={[userLatitude, userLongitude]} icon={userBeaconIcon}>
              <Popup>
                <strong>Tâm Radar của bạn</strong>
                <br />
                {userAddress || "Vị trí hiện tại"}
              </Popup>
            </Marker>

            {validMaterials.map((material) => {
              const [lng, lat] = material.location.coordinates;
              const isSelected = selectedMaterial?._id === material._id;
              return (
                <Marker
                  key={material._id}
                  position={[lat, lng]}
                  icon={createMaterialPillIcon(material, isSelected)}
                  eventHandlers={{ click: () => setSelectedMaterial(material) }}
                >
                  <Popup>
                    <strong>{material.title}</strong>
                    <br />
                    {material.distanceKm !== undefined
                      ? `Cách bạn ${formatDistance(material.distanceKm)}`
                      : "Trong bán kính quét"}
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        </div>

        {/* Right Side: Selected Detail + Quick-Switch List */}
        <div
          onWheel={(e) => e.stopPropagation()}
          className={`lg:col-span-4 bg-slate-50 border-t lg:border-t-0 lg:border-l border-slate-200 flex flex-col ${
            isExpanded ? "h-full min-h-0 overflow-y-auto" : "max-h-[460px] overflow-y-auto"
          } overscroll-contain`}
        >
          {selectedMaterial ? (
            <div className="p-4 space-y-3 border-b border-slate-200 bg-white">
              <div className="flex items-start gap-3">
                {selectedMaterial.images?.[0] && (
                  <img
                    src={selectedMaterial.images[0]}
                    alt={selectedMaterial.title}
                    className="w-20 h-20 rounded-xl object-cover shrink-0 border border-slate-200"
                  />
                )}
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                    {CATEGORY_LABELS[selectedMaterial.category] || "Vật liệu"}
                  </span>
                  <h4 className="font-bold text-slate-900 text-xs sm:text-sm line-clamp-2 leading-snug mt-0.5">
                    {selectedMaterial.title}
                  </h4>
                  <div
                    className={`text-sm font-extrabold mt-1 ${
                      selectedMaterial.type === "free" ? "text-emerald-600" : "text-amber-600"
                    }`}
                  >
                    {formatCurrency(selectedMaterial.price)}
                    {selectedMaterial.unit && selectedMaterial.type !== "free"
                      ? ` / ${selectedMaterial.unit}`
                      : ""}
                  </div>
                </div>
              </div>

              <div className="text-xs text-slate-600 bg-slate-50 rounded-xl p-2.5 border border-slate-200/70 space-y-1">
                <div className="truncate" title={selectedMaterial.location.address}>
                  <strong>Địa chỉ:</strong> {selectedMaterial.location.address}
                </div>
                <div>
                  <strong>Khoảng cách:</strong>{" "}
                  {selectedMaterial.distanceKm !== undefined
                    ? formatDistance(selectedMaterial.distanceKm)
                    : "Trong bán kính"}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <a
                  href={`tel:${selectedMaterial.contactPhone}`}
                  className="flex items-center justify-center gap-1.5 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-600" /> Gọi điện
                </a>
                <Link
                  to={`/chat?partnerId=${selectedMaterial.owner?._id}&materialId=${selectedMaterial._id}`}
                  className="flex items-center justify-center gap-1.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold"
                >
                  <MessageSquare className="w-3.5 h-3.5" /> Nhắn tin
                </Link>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() =>
                    openAiDrawer({
                      materialContext: {
                        materialId: selectedMaterial._id,
                        title: selectedMaterial.title,
                      },
                      prompt: `Thẩm định giúp mình lô "${selectedMaterial.title}" trên bản đồ này: giá/hình thức có hợp lý và cần xe gì chở?`,
                    })
                  }
                  className="flex items-center justify-center gap-1 py-2 rounded-xl bg-teal-50 hover:bg-teal-100 border border-teal-200 text-teal-800 text-[11px] font-bold cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-teal-600" /> AI thẩm định
                </button>
                <Link
                  to={`/materials/${selectedMaterial._id}`}
                  className="flex items-center justify-center gap-1 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-bold"
                >
                  <Navigation className="w-3.5 h-3.5" /> Chi tiết
                </Link>
              </div>
            </div>
          ) : (
            <div className="p-6 text-center text-slate-400 text-xs">
              Chưa có điểm ghim nào trong bán kính này.
            </div>
          )}

          {/* Scrollable Quick Switcher List */}
          {validMaterials.length > 1 && (
            <div className="p-3 space-y-1.5">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-1">
                Danh sách điểm trên bản đồ ({validMaterials.length})
              </div>
              {validMaterials.map((item) => {
                const active = selectedMaterial?._id === item._id;
                return (
                  <button
                    key={item._id}
                    type="button"
                    onClick={() => handleSelectItem(item)}
                    className={`w-full text-left p-2.5 rounded-xl border text-xs transition-all flex items-center justify-between gap-2 cursor-pointer ${
                      active
                        ? "bg-emerald-50 border-emerald-300 text-emerald-950 font-semibold"
                        : "bg-white border-slate-200/80 hover:border-emerald-300 text-slate-700"
                    }`}
                  >
                    <span className="truncate flex-1">{item.title}</span>
                    <span className="text-[11px] font-bold text-emerald-700 shrink-0">
                      {item.distanceKm !== undefined ? formatDistance(item.distanceKm) : compactPriceLabel(item)}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
