import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Circle, MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapPin, MessageSquare, Navigation, Phone } from "lucide-react";
import type { MaterialItem } from "@/types/material.types";
import { CATEGORY_LABELS, formatCurrency, formatDistance } from "@/lib/utils";

interface RadarMapWidgetProps {
  materials: MaterialItem[];
  radiusKm: number;
  userAddress: string;
  userLatitude?: number | null;
  userLongitude?: number | null;
}

const userIcon = L.divIcon({
  className: "",
  html: '<div style="width:18px;height:18px;border-radius:50%;background:#059669;border:3px solid white;box-shadow:0 0 0 5px rgba(5,150,105,.25)"></div>',
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

const materialIcon = (type: MaterialItem["type"]) =>
  L.divIcon({
    className: "",
    html: `<div style="width:28px;height:28px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);background:${type === "free" ? "#10b981" : "#f59e0b"};border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,.35)"><span style="display:block;transform:rotate(45deg);color:white;font-size:14px;text-align:center;line-height:22px">•</span></div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 28],
  });

function FitBounds({ materials, userLatitude, userLongitude }: {
  materials: MaterialItem[];
  userLatitude: number;
  userLongitude: number;
}) {
  const map = useMap();
  React.useEffect(() => {
    const points: L.LatLngExpression[] = [
      [userLatitude, userLongitude],
      ...materials
        .filter((item) => item.location?.coordinates?.length === 2)
        .map((item) => [item.location.coordinates[1], item.location.coordinates[0]] as L.LatLngExpression),
    ];
    if (points.length > 1) map.fitBounds(L.latLngBounds(points), { padding: [30, 30] });
    else map.setView([userLatitude, userLongitude], 13);
  }, [map, materials, userLatitude, userLongitude]);
  return null;
}

export const RadarMapWidget: React.FC<RadarMapWidgetProps> = ({
  materials,
  radiusKm,
  userAddress,
  userLatitude,
  userLongitude,
}) => {
  const [selectedMaterial, setSelectedMaterial] = useState<MaterialItem | null>(materials[0] || null);
  const validMaterials = useMemo(
    () => materials.filter((item) => item.location?.coordinates?.length === 2),
    [materials]
  );

  if (userLatitude === null || userLongitude === null || userLatitude === undefined || userLongitude === undefined) {
    return (
      <div className="rounded-3xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-900">
        Cần cấp quyền GPS để hiển thị bản đồ công trình quanh bạn.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
      <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between gap-3">
        <div>
          <h3 className="font-extrabold text-slate-900 text-sm sm:text-base flex items-center gap-2">
            <MapPin className="w-5 h-5 text-emerald-600" /> Bản đồ vật liệu quanh bạn
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              Bán kính {radiusKm} km
            </span>
          </h3>
          <p className="text-xs text-slate-500">Tâm bản đồ: <strong>{userAddress || "Vị trí GPS hiện tại"}</strong> · {validMaterials.length} kết quả</p>
        </div>
        <div className="hidden sm:flex items-center gap-3 text-xs text-slate-500">
          <span><b className="text-emerald-600">●</b> Cho/Tặng</span>
          <span><b className="text-amber-500">●</b> Thanh lý</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12">
        <div className="lg:col-span-8 h-[430px]">
          <MapContainer center={[userLatitude, userLongitude]} zoom={13} scrollWheelZoom className="h-full w-full">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <FitBounds materials={validMaterials} userLatitude={userLatitude} userLongitude={userLongitude} />
            <Circle center={[userLatitude, userLongitude]} radius={radiusKm * 1000} pathOptions={{ color: "#059669", fillColor: "#10b981", fillOpacity: 0.08 }} />
            <Marker position={[userLatitude, userLongitude]} icon={userIcon}>
              <Popup>Vị trí GPS của bạn</Popup>
            </Marker>
            {validMaterials.map((material) => {
              const [lng, lat] = material.location.coordinates;
              return (
                <Marker key={material._id} position={[lat, lng]} icon={materialIcon(material.type)} eventHandlers={{ click: () => setSelectedMaterial(material) }}>
                  <Popup>
                    <strong>{material.title}</strong><br />
                    {material.distanceKm !== undefined ? `Cách bạn ${formatDistance(material.distanceKm)}` : "Trong phạm vi tìm kiếm"}
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        </div>

        <div className="lg:col-span-4 p-5 bg-slate-50 border-t lg:border-t-0 lg:border-l border-slate-200">
          {selectedMaterial ? (
            <div className="space-y-4">
              <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">{CATEGORY_LABELS[selectedMaterial.category] || "Vật liệu"}</div>
              <h4 className="font-bold text-slate-900 text-sm leading-snug">{selectedMaterial.title}</h4>
              <div className="text-base font-extrabold text-amber-600">{formatCurrency(selectedMaterial.price)}{selectedMaterial.unit && selectedMaterial.type !== "free" ? ` / ${selectedMaterial.unit}` : ""}</div>
              <div className="p-3 rounded-xl bg-white border border-slate-200 text-xs text-slate-600 space-y-2">
                <div><strong>Địa chỉ:</strong> {selectedMaterial.location.address}</div>
                <div><strong>Khoảng cách:</strong> {selectedMaterial.distanceKm !== undefined ? formatDistance(selectedMaterial.distanceKm) : "Trong bán kính"}</div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <a href={`tel:${selectedMaterial.contactPhone}`} className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700"><Phone className="w-3.5 h-3.5 text-emerald-600" /> Gọi điện</a>
                <Link to={`/chat?partnerId=${selectedMaterial.owner?._id}&materialId=${selectedMaterial._id}`} className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold"><MessageSquare className="w-3.5 h-3.5" /> Nhắn tin</Link>
              </div>
              <Link to={`/materials/${selectedMaterial._id}`} className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white border border-emerald-200 text-emerald-800 text-xs font-bold">
                <Navigation className="w-3.5 h-3.5" /> Xem chi tiết & chỉ đường
              </Link>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-center text-slate-400 text-xs">Chọn một marker trên bản đồ để xem thông tin.</div>
          )}
        </div>
      </div>
    </div>
  );
};
