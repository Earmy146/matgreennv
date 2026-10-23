import React, { useEffect } from "react";
import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix icon bị vỡ khi dùng bundler (vite/webpack)
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Icon tuỳ chỉnh màu xanh lá
const pinIcon = L.divIcon({
  className: "",
  html: `<div style="
    width:32px;height:32px;
    border-radius:50% 50% 50% 0;
    transform:rotate(-45deg);
    background:#059669;
    border:3px solid white;
    box-shadow:0 2px 8px rgba(0,0,0,.4)
  "><span style="display:block;transform:rotate(45deg);color:white;font-size:16px;text-align:center;line-height:26px">📍</span></div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -36],
});

/** Đảm bảo map re-center khi lat/lng thay đổi */
function RecenterMap({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], map.getZoom(), { animate: true });
  }, [lat, lng, map]);
  return null;
}

interface MaterialMapProps {
  lat: number;
  lng: number;
  className?: string;
}

export const MaterialMap: React.FC<MaterialMapProps> = ({ lat, lng, className = "" }) => {
  return (
    <div className={`rounded-2xl overflow-hidden border border-slate-200 ${className}`}>
      <MapContainer
        center={[lat, lng]}
        zoom={15}
        scrollWheelZoom={false}
        style={{ width: "100%", height: "100%", minHeight: "224px" }}
        attributionControl={true}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a>'
        />
        <RecenterMap lat={lat} lng={lng} />
        <Marker position={[lat, lng]} icon={pinIcon} />
      </MapContainer>
    </div>
  );
};
