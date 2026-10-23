import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  Compass,
  MapPin,
  PlusCircle,
  Sparkles,
  Layers,
  Recycle,
  DollarSign,
  Gift,
  ArrowUpRight,
  Filter,
  CheckCircle2,
  Clock,
  Phone,
  MessageSquare,
} from "lucide-react";
import { RadarMapWidget } from "@/features/map/RadarMapWidget";
import { MaterialCard } from "@/features/materials/MaterialCard";
import { MaterialFilter } from "@/features/materials/MaterialFilter";
import { MaterialGridSkeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { Pagination } from "@/components/ui/Pagination";
import { useLocationStore } from "@/stores/location.store";
import { useAuthStore } from "@/stores/auth.store";
import { materialsApi } from "@/services/api";
import type { MaterialItem } from "@/types/material.types";
import { formatCurrency, formatDistance, CATEGORY_LABELS } from "@/lib/utils";

// DashboardPage - Sàn tuần hoàn vật liệu
export const DashboardPage: React.FC = () => {
  const { latitude, longitude, radiusKm, address } = useLocationStore();
  const { user } = useAuthStore();

  const [activeTab, setActiveTab] = useState<"radar" | "list">("radar");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const pageSize = 8;

  // Lấy dữ liệu theo tọa độ người nhận và bán kính quét có phân trang
  const { data: nearbyResult, isLoading } = useQuery({
    queryKey: [
      "dashboard-nearby-materials",
      latitude,
      longitude,
      radiusKm,
      selectedCategory,
      selectedType,
      searchTerm,
      page,
    ],
    queryFn: () =>
      materialsApi.getNearby({
        latitude: latitude as number,
        longitude: longitude as number,
        radiusKm,
        category: selectedCategory || undefined,
        type: selectedType || undefined,
        search: searchTerm || undefined,
        page,
        limit: pageSize,
      }),
    retry: 1,
    enabled: latitude !== null && longitude !== null,
  });

  const displayMaterials = nearbyResult?.items || [];

  const paginationData = nearbyResult?.pagination || {
    page,
    limit: pageSize,
    total: displayMaterials.length,
    totalPages: Math.ceil(displayMaterials.length / pageSize) || 1,
  };

  // KPI calculations
  const totalFree = displayMaterials.filter((m) => m.type === "free").length;
  const totalSell = displayMaterials.filter((m) => m.type === "sell").length;

  const handleFilterCategory = (cat: string) => {
    setSelectedCategory(cat);
    setPage(1);
  };

  const handleFilterType = (t: string) => {
    setSelectedType(t);
    setPage(1);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setPage(1);
  };

  const handleResetFilters = () => {
    setSelectedCategory("");
    setSelectedType("");
    setSearchTerm("");
    setPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 rounded-3xl p-6 sm:p-8 text-white shadow-lg">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Nền tảng tuần hoàn vật liệu tháo dỡ MatGreen</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Xin chào, {user?.name || "Bạn"}! 👋
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100/80 max-w-xl">
            Đang quét trong bán kính <strong>{radiusKm}km</strong> (đường kính <strong>{radiusKm * 2}km</strong>) quanh{" "}
            <strong>{address}</strong>. Tìm thấy <strong>{paginationData.total}</strong> công trình và nguồn vật liệu khả dụng.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/post"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            Đăng Vật Liệu (Nhà A)
          </Link>
          <Link
            to="/ai-advisor"
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm border border-white/20 transition-colors"
          >
            <Sparkles className="w-4 h-4 text-emerald-300" />
            AI Bóc Tách
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase mb-2">
            <span>Công trình quanh đây</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Compass className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">
            {paginationData.total}
          </div>
          <div className="mt-1 text-xs text-emerald-600 font-medium">
            Bán kính quét: {radiusKm} km
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase mb-2">
            <span>Cho / Tặng (0đ)</span>
            <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <Gift className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-700">
            {totalFree}
          </div>
          <div className="mt-1 text-xs text-slate-500">
            Xà bần, vữa, thiết bị dọn gấp
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase mb-2">
            <span>Thanh lý có phí</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-600">
            {totalSell}
          </div>
          <div className="mt-1 text-xs text-slate-500">
            Sắt thép, cửa nhôm, gỗ ván
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase mb-2">
            <span>Rác Thải Giảm Thiểu</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Recycle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">
            ~12.8 <span className="text-sm font-bold text-slate-500">Tấn</span>
          </div>
          <div className="mt-1 text-xs text-emerald-600 font-medium">
            Được tuần hoàn tái sử dụng
          </div>
        </div>
      </div>

      {/* View Switcher Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-2 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setActiveTab("radar")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === "radar"
                ? "bg-emerald-600 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <Compass className="w-4 h-4" />
            Bản Đồ Radar Vị Trí
          </button>

          <button
            onClick={() => setActiveTab("list")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === "list"
                ? "bg-emerald-600 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <Layers className="w-4 h-4" />
            Danh Sách Phân Trang ({paginationData.total})
          </button>
        </div>

        <Link
          to="/post"
          className="text-xs font-bold text-emerald-700 hover:underline px-3 py-1.5 flex items-center gap-1"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          Đăng tin công trình mới
        </Link>
      </div>

      {/* Main Tab Views */}
      {activeTab === "radar" && (
        <div className="space-y-6">
          {/* Radar Component */}
          {latitude === null || longitude === null ? (
            <div className="rounded-3xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-900">
              Vui lòng cấp quyền vị trí GPS để xem các công trình quanh bạn. Hệ thống không dùng vị trí mặc định.
            </div>
          ) : (
            <RadarMapWidget
              materials={displayMaterials}
              radiusKm={radiusKm}
              userAddress={address}
              userLatitude={latitude}
              userLongitude={longitude}
            />
          )}

          {/* Quick list of nearest spots */}
          <div className="space-y-3">
            <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-600" />
              Các Công Trình Gần Vị Trí Của Bạn Nhất
            </h3>
            {isLoading ? (
              <MaterialGridSkeleton
                count={4}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
              />
            ) : displayMaterials.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400 bg-white rounded-2xl border border-slate-200 p-6">
                Chưa có công trình nào trong bán kính {radiusKm}km. Hãy thử nới rộng bán kính quét.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-fadeIn">
                {displayMaterials.slice(0, 4).map((mat) => (
                  <MaterialCard key={mat._id} material={mat} />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "list" && (
        <div className="space-y-6">
          {/* Filters with custom radius/diameter input and keyword search */}
          <MaterialFilter
            selectedCategory={selectedCategory}
            onSelectCategory={handleFilterCategory}
            selectedType={selectedType}
            onSelectType={handleFilterType}
            searchTerm={searchTerm}
            onSearchChange={handleSearch}
          />

          {/* Grid */}
          {isLoading ? (
            /* Skeleton chiếm đúng diện tích 8 card - không giật layout */
            <MaterialGridSkeleton count={pageSize} />
          ) : displayMaterials.length === 0 ? (
            <EmptyState
              icon={<MapPin className="w-8 h-8 text-emerald-600 stroke-[1.75]" />}
              title={`Không có vật liệu nào trong bán kính ${radiusKm}km`}
              description="Hãy thử tăng bán kính quét (ví dụ lên 10km hoặc 20km) hoặc xóa từ khóa tìm kiếm để khám phá nhiều nguồn cung hơn."
              actionText="Xóa tất cả bộ lọc"
              onAction={handleResetFilters}
              secondaryActionText="Đăng tin công trình mới"
              secondaryActionHref="/post"
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 animate-fadeIn">
              {displayMaterials.map((mat) => (
                <MaterialCard key={mat._id} material={mat} />
              ))}
            </div>
          )}

          {/* Phân Trang (Pagination Controls) */}
          {!isLoading && displayMaterials.length > 0 && (
            <Pagination
              pagination={paginationData}
              onPageChange={(newPage) => setPage(newPage)}
            />
          )}
        </div>
      )}
    </div>
  );
};
