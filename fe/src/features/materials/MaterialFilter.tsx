import React, { useState } from "react";
import { LocateFixed, SlidersHorizontal, Loader2, Search, ArrowRight } from "lucide-react";
import { useLocationStore } from "@/stores/location.store";
import { useGeolocation } from "@/hooks/useGeolocation";
import { CATEGORY_LABELS } from "@/lib/utils";

interface MaterialFilterProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  selectedType: string;
  onSelectType: (type: string) => void;
  searchTerm?: string;
  onSearchChange?: (term: string) => void;
}

export const MaterialFilter: React.FC<MaterialFilterProps> = ({
  selectedCategory,
  onSelectCategory,
  selectedType,
  onSelectType,
  searchTerm = "",
  onSearchChange,
}) => {
  const { latitude, longitude, radiusKm, setRadius, address } = useLocationStore();
  const { getCurrentLocation, isLocating, error } = useGeolocation();
  const [customRadius, setCustomRadius] = useState<string>(String(radiusKm));
  const [isDiameterMode, setIsDiameterMode] = useState<boolean>(false);

  const radiusPresets = [1, 3, 5, 10, 20, 50];

  const handleApplyCustomRadius = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(customRadius);
    if (!isNaN(val) && val > 0) {
      if (isDiameterMode) {
        setRadius(Math.round((val / 2) * 10) / 10);
      } else {
        setRadius(val);
      }
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm mb-6 space-y-4">
      {/* Row 1: GPS Locate & Custom Radius/Diameter Input */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        {/* GPS Current Location button */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={getCurrentLocation}
            disabled={isLocating}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all active:scale-95 disabled:opacity-50"
          >
            {isLocating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <LocateFixed className="w-4 h-4" />
            )}
            <span>Lấy Vị Trí Của Bạn (GPS)</span>
          </button>

          <span className="text-xs text-slate-500 font-medium">
            Tọa độ gốc:{" "}
            {latitude && longitude ? (
              <strong className="text-slate-800">{address || `GPS (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`}</strong>
            ) : (
              <span className="text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                Chưa xác định (Hãy bấm Lấy Vị Trí)
              </span>
            )}
          </span>

          {error && <span className="text-xs text-rose-500 font-medium">{error}</span>}
        </div>

        {/* Custom Radius / Diameter Numeric Input */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold">
            <button
              type="button"
              onClick={() => setIsDiameterMode(false)}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                !isDiameterMode ? "bg-white text-emerald-700 shadow-xs" : "text-slate-500"
              }`}
            >
              Bán kính (R)
            </button>
            <button
              type="button"
              onClick={() => setIsDiameterMode(true)}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                isDiameterMode ? "bg-white text-emerald-700 shadow-xs" : "text-slate-500"
              }`}
            >
              Đường kính (D)
            </button>
          </div>

          <form onSubmit={handleApplyCustomRadius} className="flex items-center gap-1.5">
            <input
              type="number"
              min="0.5"
              max="200"
              step="0.5"
              placeholder={isDiameterMode ? "Nhập km đường kính" : "Nhập km bán kính"}
              value={customRadius}
              onChange={(e) => setCustomRadius(e.target.value)}
              className="w-24 px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs text-center font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <span className="text-xs font-semibold text-slate-500">km</span>
            <button
              type="submit"
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold transition-colors"
            >
              Quét
            </button>
          </form>

          {/* Quick presets */}
          <div className="hidden sm:flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            {radiusPresets.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => {
                  setRadius(r);
                  setCustomRadius(String(r));
                }}
                className={`px-2 py-0.5 rounded-lg text-xs font-bold transition-colors ${
                  radiusKm === r
                    ? "bg-white text-emerald-700 shadow-xs"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {r}km
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Row 2: Search Input & Category Pills & Pricing */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 pt-1">
        {/* Search Input */}
        {onSearchChange && (
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Tìm theo tên vật liệu, mô tả..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
            />
          </div>
        )}

        {/* Type Filter */}
        <div className="flex items-center gap-1 text-xs">
          <button
            onClick={() => onSelectType("")}
            className={`px-3 py-1.5 rounded-xl font-bold transition-colors ${
              selectedType === "" ? "bg-slate-800 text-white" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            Tất cả
          </button>
          <button
            onClick={() => onSelectType("free")}
            className={`px-3 py-1.5 rounded-xl font-bold transition-colors ${
              selectedType === "free"
                ? "bg-emerald-600 text-white"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            🎁 Cho/Tặng (0đ)
          </button>
          <button
            onClick={() => onSelectType("sell")}
            className={`px-3 py-1.5 rounded-xl font-bold transition-colors ${
              selectedType === "sell"
                ? "bg-amber-600 text-white"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            🏷️ Thanh lý có phí
          </button>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap items-center gap-1.5 pt-1">
        <button
          onClick={() => onSelectCategory("")}
          className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
            selectedCategory === ""
              ? "bg-emerald-700 text-white"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          Tất cả danh mục
        </button>
        {Object.entries(CATEGORY_LABELS).map(([catKey, label]) => (
          <button
            key={catKey}
            onClick={() => onSelectCategory(catKey)}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
              selectedCategory === catKey
                ? "bg-emerald-700 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
};
