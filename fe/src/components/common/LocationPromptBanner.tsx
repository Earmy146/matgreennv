import React, { useState, useEffect } from "react";
import { LocateFixed, AlertTriangle, RefreshCw, MapPin, CheckCircle2, ChevronDown } from "lucide-react";
import { useLocationStore, POPULAR_LOCATIONS, type LocationPreset } from "@/stores/location.store";
import { useGeolocation } from "@/hooks/useGeolocation";

interface LocationPromptBannerProps {
  className?: string;
  showPresets?: boolean;
}

export const LocationPromptBanner: React.FC<LocationPromptBannerProps> = ({
  className = "",
  showPresets = true,
}) => {
  const { latitude, longitude, address, capturedAt, setLocation, isStale } = useLocationStore();
  const { getCurrentLocation, isLocating, error } = useGeolocation();
  const [staleWarning, setStaleWarning] = useState<boolean>(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Kiểm tra định kỳ mỗi 30s xem vị trí có bị quá 5 phút (stale) không
  useEffect(() => {
    const checkStale = () => {
      if (latitude && longitude && capturedAt) {
        setStaleWarning(isStale(5));
      } else {
        setStaleWarning(false);
      }
    };

    checkStale();
    const interval = setInterval(checkStale, 30000);
    return () => clearInterval(interval);
  }, [latitude, longitude, capturedAt, isStale]);

  const handleGetGps = async () => {
    try {
      await getCurrentLocation();
      setSuccessMsg("Đã cập nhật vị trí GPS thành công!");
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch {
      // Error handled by hook
    }
  };

  const handleSelectPreset = (preset: LocationPreset) => {
    setLocation(preset.lat, preset.lng, preset.address, 10, new Date().toISOString());
    setSuccessMsg(`Đã chọn vị trí: ${preset.name}`);
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  // Tính thời gian đã trôi qua kể từ lần lấy GPS cuối
  const getTimeAgoText = () => {
    if (!capturedAt) return "";
    const diffMs = Date.now() - new Date(capturedAt).getTime();
    const minutes = Math.floor(diffMs / 60000);
    if (minutes < 1) return "vừa xong";
    if (minutes < 60) return `${minutes} phút trước`;
    const hours = Math.floor(minutes / 60);
    return `${hours} giờ trước`;
  };

  // TRƯỜNG HỢP 1: Chưa có vị trí GPS (Mất vị trí)
  if (!latitude || !longitude) {
    return (
      <div
        className={`rounded-3xl border border-amber-300 bg-gradient-to-r from-amber-50 via-amber-50/80 to-amber-100/50 p-5 sm:p-6 shadow-sm animate-fadeIn ${className}`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm shadow-amber-500/20">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                Chưa Xác Định Được Vị Trí Của Bạn
              </h4>
              <p className="text-xs text-slate-600 mt-1 max-w-xl leading-relaxed">
                Hệ thống cần tọa độ để quét công trình và tính toán khoảng cách km quanh bạn. Hãy nhấn nút lấy GPS hoặc chọn một vị trí mẫu bên dưới để xem dữ liệu ngay lập tức.
              </p>
              {error && (
                <div className="text-xs font-semibold text-rose-600 mt-1.5 flex items-center gap-1">
                  ⚠️ {error}
                </div>
              )}
            </div>
          </div>

          {/* CTA Nút Lấy Vị Trí Nổi Bật */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleGetGps}
              disabled={isLocating}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/30 transition-all cursor-pointer disabled:opacity-60"
            >
              <LocateFixed className={`w-4 h-4 ${isLocating ? "animate-spin" : ""}`} />
              <span>{isLocating ? "Đang xác định GPS..." : "Lấy Vị Trí GPS Ngay"}</span>
            </button>
          </div>
        </div>

        {/* Danh sách Preset vị trí nhanh để người dùng không bị kẹt khi trình duyệt chặn GPS */}
        {showPresets && (
          <div className="mt-4 pt-3.5 border-t border-amber-200/70 flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1 mr-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              Chọn nhanh vị trí mẫu:
            </span>
            {POPULAR_LOCATIONS.map((preset) => (
              <button
                key={preset.name}
                type="button"
                onClick={() => handleSelectPreset(preset)}
                className="px-3 py-1.5 rounded-xl bg-white hover:bg-amber-100/60 border border-amber-200 text-slate-700 hover:text-emerald-800 text-xs font-semibold transition-colors cursor-pointer shadow-2xs"
              >
                {preset.name}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  // TRƯỜNG HỢP 2: Vị trí đã cũ trên 5 phút (Stale)
  if (staleWarning) {
    return (
      <div
        className={`rounded-2xl border border-sky-200 bg-sky-50/80 p-3.5 sm:px-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-xs animate-fadeIn ${className}`}
      >
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-sky-500/10 text-sky-700 flex items-center justify-center shrink-0">
            <RefreshCw className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="font-bold text-slate-800">Vị trí đã lưu: </span>
            <span className="text-slate-600">{address}</span>
            <span className="text-slate-400 ml-1.5">({getTimeAgoText()})</span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleGetGps}
            disabled={isLocating}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3 h-3 ${isLocating ? "animate-spin" : ""}`} />
            <span>{isLocating ? "Đang cập nhật..." : "Cập nhật vị trí mới (5p)"}</span>
          </button>
        </div>
      </div>
    );
  }

  // Nếu có thông báo thành công
  if (successMsg) {
    return (
      <div
        className={`rounded-2xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-800 font-bold flex items-center gap-2 animate-fadeIn ${className}`}
      >
        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
        {successMsg}
      </div>
    );
  }

  return null;
};
