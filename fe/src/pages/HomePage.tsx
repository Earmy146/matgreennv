import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowUpDown,
  LocateFixed,
  MapPin,
  Sparkles,
  X,
} from "lucide-react";
import { MaterialCard } from "@/features/materials/MaterialCard";
import { MaterialGridSkeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { Pagination } from "@/components/ui/Pagination";
import { useLocationStore } from "@/stores/location.store";
import { useGeolocation } from "@/hooks/useGeolocation";
import { materialsApi } from "@/services/api";
import { CATEGORY_LABELS } from "@/lib/utils";

export const HomePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { latitude, longitude, radiusKm, setRadius } = useLocationStore();
  const { getCurrentLocation, isLocating } = useGeolocation();

  const [selectedCategory, setSelectedCategory] = useState<string>(searchParams.get("category") || "");
  const [selectedType, setSelectedType] = useState<string>(searchParams.get("type") || "");
  const [searchTerm, setSearchTerm] = useState<string>(searchParams.get("search") || "");
  const [sortBy, setSortBy] = useState<"newest" | "price_asc" | "price_desc">("newest");
  const [page, setPage] = useState<number>(1);
  const pageSize = 12;

  // Sync URL query params (from Topbar Search or LandingHero)
  useEffect(() => {
    const qSearch = searchParams.get("search") || "";
    const qCat = searchParams.get("category") || "";
    const qType = searchParams.get("type") || "";
    const qRadius = Number(searchParams.get("radius"));

    setSearchTerm(qSearch);
    if (qCat !== selectedCategory) setSelectedCategory(qCat);
    if (qType !== selectedType) setSelectedType(qType);
    if (Number.isFinite(qRadius) && qRadius > 0 && qRadius <= 200) {
      setRadius(qRadius);
    }
    setPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const hasGps = latitude !== null && longitude !== null;

  // Khi có GPS: tìm theo bán kính gần nhất; khi chưa bật GPS: tự động hiện toàn sàn mới nhất (không bị màn hình trống!)
  const { data: result, isLoading } = useQuery({
    queryKey: [
      "materials-marketplace",
      hasGps ? "nearby" : "all",
      latitude,
      longitude,
      radiusKm,
      selectedCategory,
      selectedType,
      searchTerm,
      sortBy,
      page,
    ],
    queryFn: () =>
      hasGps
        ? materialsApi.getNearby({
            latitude: latitude as number,
            longitude: longitude as number,
            radiusKm,
            category: selectedCategory || undefined,
            type: selectedType || undefined,
            search: searchTerm || undefined,
            page,
            limit: pageSize,
          })
        : materialsApi.getAll({
            category: selectedCategory || undefined,
            type: selectedType || undefined,
            search: searchTerm || undefined,
            sort: sortBy,
            page,
            limit: pageSize,
          }),
    retry: 1,
  });

  const displayMaterials = result?.items || [];
  const paginationData = result?.pagination || {
    page,
    limit: pageSize,
    total: displayMaterials.length,
    totalPages: Math.ceil(displayMaterials.length / pageSize) || 1,
  };

  const updateUrlFilter = (updates: Record<string, string>) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([k, v]) => {
      if (v) next.set(k, v);
      else next.delete(k);
    });
    setSearchParams(next, { replace: true });
    setPage(1);
  };

  const handleResetFilters = () => {
    setSelectedCategory("");
    setSelectedType("");
    setSearchTerm("");
    setSortBy("newest");
    setSearchParams({}, { replace: true });
    setPage(1);
  };

  const hasActiveFilter = Boolean(selectedCategory || selectedType || searchTerm);

  return (
    <div className="space-y-5">
      {/* Compact Header — No bloated hero pushing products down! */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Kho Vật Liệu Tái Sử Dụng
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            {isLoading
              ? "Đang tải danh sách vật liệu..."
              : hasGps
              ? `Tìm thấy ${paginationData.total} nguồn cung trong bán kính ${radiusKm} km quanh vị trí của bạn`
              : `Đang hiển thị ${paginationData.total} nguồn cung mới nhất toàn sàn`}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 transition-colors"
          >
            <MapPin className="w-3.5 h-3.5 text-emerald-600" />
            Xem Bản Đồ Radar
          </Link>
          <Link
            to="/ai-advisor"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-teal-50 hover:bg-teal-100 border border-teal-200 text-xs font-bold text-teal-800 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            AI Bóc Tách
          </Link>
        </div>
      </div>

      {/* Slim 1-line GPS prompt ONLY when GPS is not yet enabled */}
      {!hasGps && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 px-4 py-3 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs">
          <div className="flex items-center gap-2 text-amber-900">
            <LocateFixed className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              <strong>Mẹo:</strong> Bật GPS để tự động sắp xếp các lô vật liệu gần công trình của bạn nhất (tính theo km).
            </span>
          </div>
          <button
            type="button"
            onClick={() => void getCurrentLocation()}
            disabled={isLocating}
            className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shrink-0 cursor-pointer disabled:opacity-60"
          >
            {isLocating ? "Đang dò..." : "Bật GPS ngay"}
          </button>
        </div>
      )}

      {/* Clean Single-Card Filter Strip (Zero duplicate GPS/Search/Radius controls!) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-3.5 sm:p-4 shadow-2xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          {/* Pricing Type segmented control */}
          <div className="inline-flex items-center p-1 rounded-xl bg-slate-100 text-xs">
            <button
              type="button"
              onClick={() => updateUrlFilter({ type: "" })}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                selectedType === "" ? "bg-white text-slate-900 shadow-2xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Tất cả
            </button>
            <button
              type="button"
              onClick={() => updateUrlFilter({ type: "free" })}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                selectedType === "free" ? "bg-emerald-600 text-white shadow-2xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Cho/Tặng 0đ
            </button>
            <button
              type="button"
              onClick={() => updateUrlFilter({ type: "sell" })}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                selectedType === "sell" ? "bg-amber-600 text-white shadow-2xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Thanh lý
            </button>
          </div>

          {/* Right: Active keyword chip + Sort selector */}
          <div className="flex flex-wrap items-center gap-2">
            {searchTerm && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
                Từ khóa: “{searchTerm}”
                <button
                  type="button"
                  onClick={() => updateUrlFilter({ search: "" })}
                  className="hover:text-emerald-950 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            )}

            {!hasGps && (
              <div className="inline-flex items-center gap-1.5 text-xs">
                <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                <select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value as "newest" | "price_asc" | "price_desc");
                    setPage(1);
                  }}
                  className="px-2.5 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                >
                  <option value="newest">Mới nhất</option>
                  <option value="price_asc">Giá thấp → cao</option>
                  <option value="price_desc">Giá cao → thấp</option>
                </select>
              </div>
            )}

            {hasActiveFilter && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-xs font-bold text-slate-500 hover:text-rose-600 px-2 py-1 cursor-pointer"
              >
                Xóa lọc
              </button>
            )}
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
          <button
            type="button"
            onClick={() => updateUrlFilter({ category: "" })}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              selectedCategory === ""
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Tất cả danh mục
          </button>
          {Object.entries(CATEGORY_LABELS).map(([catKey, label]) => (
            <button
              key={catKey}
              type="button"
              onClick={() => updateUrlFilter({ category: catKey })}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
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

      {/* Product Grid — Immediately Visible Above the Fold! */}
      {isLoading ? (
        <MaterialGridSkeleton count={pageSize} />
      ) : displayMaterials.length === 0 ? (
        <EmptyState
          icon={<MapPin className="w-8 h-8 text-emerald-600 stroke-[1.75]" />}
          title={
            hasGps
              ? `Không tìm thấy vật liệu nào trong bán kính ${radiusKm} km`
              : "Không tìm thấy vật liệu phù hợp với bộ lọc"
          }
          description="Hãy thử nới rộng bán kính ở thanh địa điểm phía trên, đổi danh mục khác hoặc xóa từ khóa tìm kiếm."
          actionText={hasActiveFilter ? "Xóa tất cả bộ lọc" : "Mở rộng bán kính lên 50 km"}
          onAction={hasActiveFilter ? handleResetFilters : () => setRadius(50)}
          secondaryActionText="Đăng tin vật liệu mới"
          secondaryActionHref="/post"
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 animate-fadeIn">
          {displayMaterials.map((mat) => (
            <MaterialCard key={mat._id} material={mat} />
          ))}
        </div>
      )}

      {!isLoading && displayMaterials.length > 0 && (
        <Pagination pagination={paginationData} onPageChange={(newPage) => setPage(newPage)} />
      )}
    </div>
  );
};
