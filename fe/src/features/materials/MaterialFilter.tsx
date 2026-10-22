import React from "react";
import { LocateFixed, SlidersHorizontal, Loader2 } from "lucide-react";
import { useLocationStore } from "@/stores/location.store";
import { useGeolocation } from "@/hooks/useGeolocation";
import { CATEGORY_LABELS } from "@/lib/utils";

interface MaterialFilterProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  selectedType: string;
  onSelectType: (type: string) => void;
}

export const MaterialFilter: React.FC<MaterialFilterProps> = ({
  selectedCategory,
  onSelectCategory,
  selectedType,
  onSelectType,
}) => {
  const { radiusKm, setRadius, address } = useLocationStore();
  const { getCurrentLocation, isLocating, error } = useGeolocation();

  const radiusOptions = [1, 3, 5, 10, 20, 50];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm mb-6">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        {/* Current Location & Radius Control */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={getCurrentLocation}
            disabled={isLocating}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs shadow-sm transition-all active:scale-95 disabled:opacity-50"
          >
            {isLocating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <LocateFixed className="w-4 h-4" />
            )}
            <span>Lấy Vị Trí Hiện Tại Của Bạn</span>
          </button>

          <span className="text-xs text-slate-500 font-medium">
            Điểm gốc: <strong className="text-slate-800">{address}</strong>
          </span>

          {error && <span className="text-xs text-rose-500 font-medium">{error}</span>}
        </div>

        {/* Radius selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-600 flex items-center gap-1">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
            Bán kính quét:
          </span>
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            {radiusOptions.map((r) => (
              <button
                key={r}
                onClick={() => setRadius(r)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                  radiusKm === r
                    ? "bg-white text-emerald-700 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {r}km
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Category & Pricing Filters */}
      <div className="pt-4 flex flex-wrap items-center justify-between gap-3">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => onSelectCategory("")}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
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
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                selectedCategory === catKey
                  ? "bg-emerald-700 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Type Filter */}
        <div className="flex items-center gap-1 text-xs">
          <button
            onClick={() => onSelectType("")}
            className={`px-3 py-1 rounded-lg font-medium transition-colors ${
              selectedType === "" ? "bg-slate-800 text-white" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            Tất cả
          </button>
          <button
            onClick={() => onSelectType("free")}
            className={`px-3 py-1 rounded-lg font-medium transition-colors ${
              selectedType === "free"
                ? "bg-emerald-600 text-white"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            🎁 Cho/Tặng (0đ)
          </button>
          <button
            onClick={() => onSelectType("sell")}
            className={`px-3 py-1 rounded-lg font-medium transition-colors ${
              selectedType === "sell"
                ? "bg-amber-600 text-white"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            🏷️ Thanh lý có phí
          </button>
        </div>
      </div>
    </div>
  );
};
