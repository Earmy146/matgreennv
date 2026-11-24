import React, { useEffect, useMemo, useRef, useState } from "react";
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Loader2, LocateFixed, MapPin, Search } from "lucide-react";
import { materialsApi } from "@/services/api";
import { useGeolocation } from "@/hooks/useGeolocation";

const draggablePinIcon = L.divIcon({
  className: "",
  html: `<div style="
    width:34px;height:34px;
    border-radius:50% 50% 50% 0;
    transform:rotate(-45deg);
    background:#059669;
    border:3px solid white;
    box-shadow:0 4px 12px rgba(0,0,0,.35)
  "><span style="display:block;transform:rotate(45deg);color:white;font-size:15px;font-weight:800;text-align:center;line-height:28px">●</span></div>`,
  iconSize: [34, 34],
  iconAnchor: [17, 34],
});

function MapInteractionHandler({
  lat,
  lng,
  onPick,
}: {
  lat: number;
  lng: number;
  onPick: (lat: number, lng: number) => void;
}) {
  const map = useMap();

  useEffect(() => {
    map.setView([lat, lng], Math.max(map.getZoom(), 15), { animate: true });
  }, [lat, lng, map]);

  useMapEvents({
    click(e) {
      onPick(e.latlng.lat, e.latlng.lng);
    },
  });

  return null;
}

export interface LocationPickerValue {
  latitude: number;
  longitude: number;
  address: string;
  accuracy: number;
  capturedAt: string;
  locationSource: "browser_gps" | "map_pin";
}

interface LocationMapPickerProps {
  latitude: number;
  longitude: number;
  address: string;
  onChange: (next: LocationPickerValue) => void;
}

const DEFAULT_CENTER = { lat: 21.0285, lng: 105.8542 }; // Hà Nội

export const LocationMapPicker: React.FC<LocationMapPickerProps> = ({
  latitude,
  longitude,
  address,
  onChange,
}) => {
  const { getCurrentLocation, isLocating, error: gpsError } = useGeolocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [resolvingPin, setResolvingPin] = useState(false);
  const [suggestions, setSuggestions] = useState<
    Array<{ label: string; fullAddress: string; lat: number; lng: number }>
  >([]);
  const markerRef = useRef<L.Marker | null>(null);

  const hasValidCoords = Boolean(latitude && longitude);
  const mapCenter = hasValidCoords ? { lat: latitude, lng: longitude } : DEFAULT_CENTER;

  const applyPinnedCoords = async (lat: number, lng: number, explicitAddress?: string) => {
    setResolvingPin(true);
    let resolvedAddr = explicitAddress || address;
    if (!explicitAddress) {
      try {
        const rev = await materialsApi.reverseGeocode(lat, lng);
        if (rev?.address) resolvedAddr = rev.address;
      } catch {
        if (!resolvedAddr) resolvedAddr = `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
      }
    }
    setResolvingPin(false);
    onChange({
      latitude: lat,
      longitude: lng,
      address: resolvedAddr || `${lat.toFixed(5)}, ${lng.toFixed(5)}`,
      accuracy: 15,
      capturedAt: new Date().toISOString(),
      locationSource: "map_pin",
    });
  };

  const handleUseBrowserGps = async () => {
    try {
      const pos = await getCurrentLocation();
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;
      let resolvedAddr = address;
      try {
        const rev = await materialsApi.reverseGeocode(lat, lng);
        if (rev?.address) resolvedAddr = rev.address;
      } catch {
        // fallback
      }
      onChange({
        latitude: lat,
        longitude: lng,
        address: resolvedAddr || `${lat.toFixed(5)}, ${lng.toFixed(5)}`,
        accuracy: pos.coords.accuracy || 20,
        capturedAt: new Date().toISOString(),
        locationSource: "browser_gps",
      });
    } catch {
      // useGeolocation exposes error
    }
  };

  const handleSearchAddress = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (searchQuery.trim().length < 3) return;
    setSearching(true);
    try {
      const results = await materialsApi.searchAddress(searchQuery.trim());
      setSuggestions(results);
    } catch {
      setSuggestions([]);
    } finally {
      setSearching(false);
    }
  };

  const markerEventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker) {
          const pos = marker.getLatLng();
          void applyPinnedCoords(pos.lat, pos.lng);
        }
      },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [address]
  );

  return (
    <div className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-emerald-600" />
            Vị Trí Công Trình & Ghim Bản Đồ *
          </label>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Bấm lấy GPS hiện tại, tìm tên đường hoặc chạm/kéo ghim trực tiếp vào đúng vị trí công trình trên bản đồ.
          </p>
        </div>

        <button
          type="button"
          onClick={() => void handleUseBrowserGps()}
          disabled={isLocating}
          className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-2xs transition-colors cursor-pointer shrink-0 disabled:opacity-60"
        >
          {isLocating ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <LocateFixed className="w-3.5 h-3.5" />
          )}
          <span>{isLocating ? "Đang lấy GPS..." : "Lấy GPS hiện tại"}</span>
        </button>
      </div>

      {gpsError && (
        <div className="text-xs text-rose-600 bg-rose-50 border border-rose-200 rounded-xl px-3 py-2">
          {gpsError} — Bạn có thể tìm tên đường hoặc chạm trực tiếp lên bản đồ bên dưới để ghim vị trí!
        </div>
      )}

      {/* Search Address on Map */}
      <div className="relative">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  void handleSearchAddress();
                }
              }}
              placeholder="Tìm nhanh khu vực / tên đường trên bản đồ (VD: Cầu Giấy, Hà Nội)..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 bg-white text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <button
            type="button"
            disabled={searching || searchQuery.trim().length < 3}
            onClick={() => void handleSearchAddress()}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold disabled:opacity-50 cursor-pointer"
          >
            {searching ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Tìm vị trí"}
          </button>
        </div>

        {suggestions.length > 0 && (
          <div className="mt-1.5 rounded-xl border border-slate-200 bg-white shadow-lg divide-y divide-slate-100 overflow-hidden z-20 relative">
            {suggestions.map((sug, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  setSuggestions([]);
                  setSearchQuery("");
                  void applyPinnedCoords(sug.lat, sug.lng, sug.label);
                }}
                className="w-full text-left px-3 py-2 hover:bg-emerald-50 text-xs text-slate-700 flex items-center gap-2 cursor-pointer"
              >
                <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="truncate">{sug.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Interactive Leaflet Map */}
      <div className="h-56 rounded-2xl overflow-hidden border border-slate-200 relative z-0">
        <MapContainer
          center={[mapCenter.lat, mapCenter.lng]}
          zoom={hasValidCoords ? 15 : 12}
          scrollWheelZoom={false}
          className="h-full w-full"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />
          <MapInteractionHandler
            lat={mapCenter.lat}
            lng={mapCenter.lng}
            onPick={(lat, lng) => void applyPinnedCoords(lat, lng)}
          />
          {hasValidCoords && (
            <Marker
              draggable
              eventHandlers={markerEventHandlers}
              position={[latitude, longitude]}
              icon={draggablePinIcon}
              ref={markerRef}
            />
          )}
        </MapContainer>

        {resolvingPin && (
          <div className="absolute top-2.5 left-2.5 z-[400] px-2.5 py-1 rounded-lg bg-slate-900/80 text-white text-[11px] font-semibold flex items-center gap-1.5">
            <Loader2 className="w-3 h-3 animate-spin" />
            <span>Đang lấy tên đường...</span>
          </div>
        )}
      </div>

      {/* Editable Street Address Field */}
      <div>
        <label className="block text-[11px] font-bold text-slate-600 mb-1">
          Địa chỉ hiển thị công khai (có thể ghi rõ số nhà / ngõ / mốc dễ tìm) *:
        </label>
        <input
          type="text"
          required
          value={address}
          onChange={(e) =>
            onChange({
              latitude,
              longitude,
              address: e.target.value,
              accuracy: 15,
              capturedAt: new Date().toISOString(),
              locationSource: "map_pin",
            })
          }
          placeholder="VD: Đầu ngõ 85 Xuân Thủy, Cầu Giấy, Hà Nội (xe tải 2.5T vào tận cửa)"
          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
        <div className="mt-1 text-[11px] text-slate-500 flex items-center justify-between">
          <span>
            {hasValidCoords
              ? `✅ Đã ghim tọa độ: [${latitude.toFixed(5)}, ${longitude.toFixed(5)}]`
              : "⚠️ Chưa chọn tọa độ — Hãy bấm Lấy GPS hoặc chạm vào bản đồ phía trên"}
          </span>
        </div>
      </div>
    </div>
  );
};
