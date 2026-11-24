import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  CheckCircle2,
  Compass,
  DollarSign,
  Gift,
  Layers,
  MapPin,
  PlusCircle,
  Sparkles,
} from "lucide-react";
import { RadarMapWidget } from "@/features/map/RadarMapWidget";
import { MaterialCard } from "@/features/materials/MaterialCard";
import { MaterialGridSkeleton } from "@/components/ui/Skeleton";
import { LocationPromptBanner } from "@/components/common/LocationPromptBanner";
import { useLocationStore } from "@/stores/location.store";
import { useAuthStore } from "@/stores/auth.store";
import { materialsApi } from "@/services/api";
import { CATEGORY_LABELS } from "@/lib/utils";

export const DashboardPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { latitude, longitude, radiusKm, address, setRadius } = useLocationStore();
  const { user } = useAuthStore();

  const [selectedCategory, setSelectedCategory] = useState<string>(searchParams.get("category") || "");
  const [selectedType, setSelectedType] = useState<string>(searchParams.get("type") || "");
  const [searchTerm, setSearchTerm] = useState<string>(searchParams.get("search") || "");

  // Nhận query params truyền từ LandingHero hoặc Topbar
  useEffect(() => {
    const qRadius = Number(searchParams.get("radius"));
    if (Number.isFinite(qRadius) && qRadius > 0 && qRadius <= 200) {
      setRadius(qRadius);
    }
    setSearchTerm(searchParams.get("search") || "");
    setSelectedCategory(searchParams.get("category") || "");
    setSelectedType(searchParams.get("type") || "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const hasGps = latitude !== null && longitude !== null;

  const { data: nearbyResult, isLoading } = useQuery({
    queryKey: [
      "dashboard-radar-materials",
      hasGps ? "nearby" : "all",
      latitude,
      longitude,
      radiusKm,
      selectedCategory,
      selectedType,
      searchTerm,
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
            page: 1,
            limit: 20,
          })
        : materialsApi.getAll({
            category: selectedCategory || undefined,
            type: selectedType || undefined,
            search: searchTerm || undefined,
            page: 1,
            limit: 12,
          }),
    retry: 1,
  });

  const { data: platformStats } = useQuery({
    queryKey: ["materials-public-stats"],
    queryFn: materialsApi.getStats,
    staleTime: 60000,
  });

  const displayMaterials = nearbyResult?.items || [];
  const totalInScope = nearbyResult?.pagination?.total ?? displayMaterials.length;
  const totalFree =
    nearbyResult?.summary?.totalFree ?? displayMaterials.filter((m) => m.type === "free").length;
  const totalSell =
    nearbyResult?.summary?.totalSell ?? displayMaterials.filter((m) => m.type === "sell").length;

  const updateFilter = (updates: Record<string, string>) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([k, v]) => {
      if (v) next.set(k, v);
      else next.delete(k);
    });
    setSearchParams(next, { replace: true });
  };

  return (
    <div className="space-y-5">
      {/* Compact Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Bản Đồ Radar Vật Liệu{user?.name ? ` · Chào ${user.name}` : ""}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            {hasGps
              ? `Đang quét bán kính ${radiusKm} km quanh ${address || "vị trí GPS hiện tại"} (${totalInScope} nguồn cung)`
              : `Bật GPS để định vị các lô vật liệu gần bạn nhất trên bản đồ`}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Link
            to="/materials"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700"
          >
            <Layers className="w-3.5 h-3.5 text-emerald-600" />
            Xem Dạng Lưới
          </Link>
          <Link
            to="/post"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            Đăng Tin
          </Link>
        </div>
      </div>

      {/* Real KPI Stats Grid — Zero fake hardcoded numbers! */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-[11px] font-bold uppercase">
            <span>{hasGps ? `Trong ${radiusKm} km` : "Đang khả dụng"}</span>
            <Compass className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-1.5">{totalInScope}</div>
          <div className="text-[11px] text-emerald-700 font-medium mt-0.5">
            {hasGps ? "Nguồn vật liệu quanh bạn" : "Trên toàn sàn MatGreen"}
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-[11px] font-bold uppercase">
            <span>Cho / Tặng 0đ</span>
            <Gift className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-2xl font-black text-emerald-700 mt-1.5">{totalFree}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Xà bần, gạch, thiết bị</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-[11px] font-bold uppercase">
            <span>Bán Thanh Lý</span>
            <DollarSign className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-amber-600 mt-1.5">{totalSell}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Sắt thép, tôn, cửa nhôm</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-[11px] font-bold uppercase">
            <span>Đã Tuần Hoàn</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-1.5">
            {platformStats?.totalCompleted ?? 0}
          </div>
          <div className="text-[11px] text-emerald-700 font-medium mt-0.5">
            Công trình đã bàn giao xong
          </div>
        </div>
      </div>

      {/* Quick Filter Strip right above Radar Map */}
      <div className="flex flex-wrap items-center gap-2 bg-white p-3 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div className="inline-flex p-0.5 rounded-xl bg-slate-100 text-xs">
          {[
            { key: "", label: "Tất cả" },
            { key: "free", label: "Cho/Tặng 0đ" },
            { key: "sell", label: "Thanh lý" },
          ].map((opt) => (
            <button
              key={opt.key}
              type="button"
              onClick={() => updateFilter({ type: opt.key })}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                selectedType === opt.key ? "bg-white text-emerald-700 shadow-2xs" : "text-slate-600"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto flex-1">
          <button
            type="button"
            onClick={() => updateFilter({ category: "" })}
            className={`px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap cursor-pointer ${
              selectedCategory === "" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Tất cả danh mục
          </button>
          {Object.entries(CATEGORY_LABELS).map(([k, label]) => (
            <button
              key={k}
              type="button"
              onClick={() => updateFilter({ category: k })}
              className={`px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap cursor-pointer ${
                selectedCategory === k ? "bg-emerald-700 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Radar Map or GPS Prompt */}
      {!hasGps ? (
        <LocationPromptBanner />
      ) : (
        <RadarMapWidget
          materials={displayMaterials}
          radiusKm={radiusKm}
          userAddress={address}
          userLatitude={latitude}
          userLongitude={longitude}
        />
      )}

      {/* Nearest / Latest Materials */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-600" />
            {hasGps ? "Các Công Trình Gần Bạn Nhất" : "Nguồn Vật Liệu Mới Nhất Trên Sàn"}
          </h2>
          <Link
            to="/materials"
            className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1"
          >
            Xem tất cả →
          </Link>
        </div>

        {isLoading ? (
          <MaterialGridSkeleton
            count={4}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          />
        ) : displayMaterials.length === 0 ? (
          <div className="py-10 text-center text-xs text-slate-500 bg-white rounded-2xl border border-slate-200 p-6 space-y-2">
            <p>Chưa có công trình nào phù hợp trong bán kính {radiusKm} km.</p>
            <button
              type="button"
              onClick={() => setRadius(50)}
              className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs cursor-pointer"
            >
              Mở rộng bán kính lên 50 km
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-fadeIn">
            {displayMaterials.slice(0, 8).map((mat) => (
              <MaterialCard key={mat._id} material={mat} />
            ))}
          </div>
        )}
      </div>

      {/* Compact AI Helper Callout */}
      <div className="rounded-2xl bg-slate-900 text-white p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-sm">Chuẩn bị phá dỡ công trình?</div>
            <div className="text-xs text-slate-400">
              Dùng MatGreen AI bóc tách khối lượng xà bần, sắt thép từ mô tả hoặc ảnh để định giá & đăng tin chỉ trong 10 giây.
            </div>
          </div>
        </div>
        <Link
          to="/ai-advisor"
          className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shrink-0 text-center transition-colors"
        >
          Mở AI Bóc Tách →
        </Link>
      </div>
    </div>
  );
};
