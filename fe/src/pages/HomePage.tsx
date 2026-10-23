import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Recycle, Sparkles, MapPin, Search, PlusCircle, ArrowRight, Layers } from "lucide-react";
import { MaterialFilter } from "@/features/materials/MaterialFilter";
import { MaterialCard } from "@/features/materials/MaterialCard";
import { Pagination } from "@/components/ui/Pagination";
import { useLocationStore } from "@/stores/location.store";
import { materialsApi } from "@/services/api";
import type { MaterialItem } from "@/types/material.types";

export const HomePage: React.FC = () => {
  const { latitude, longitude, radiusKm } = useLocationStore();
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const pageSize = 12;

  // Lấy dữ liệu gần bạn theo GPS và bán kính
  const { data: nearbyResult, isLoading } = useQuery({
    queryKey: [
      "materials-nearby-page",
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

  return (
    <div className="space-y-8">
      {/* Hero Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 text-white p-8 sm:p-12 shadow-xl shadow-emerald-950/20">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 text-xs font-semibold mb-4 backdrop-blur-sm">
            <Recycle className="w-4 h-4 text-emerald-300" />
            <span>Kinh Tế Tuần Hoàn Vật Liệu Xây Dựng</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight text-white mb-4">
            Người Thừa Cho Đi, <br />
            <span className="text-emerald-300">Người Cần Quanh Bạn Nhận Lại!</span>
          </h1>

          <p className="text-emerald-100/90 text-sm sm:text-base leading-relaxed mb-8">
            Nền tảng kết nối trực tiếp chủ công trình tháo dỡ (Nhà A) với thầu xây dựng, người dân cần vật liệu thừa (Nhà B) hoàn toàn tự động theo tọa độ định vị bán kính gần nhất.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/post"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-lg transition-transform active:scale-95"
            >
              <PlusCircle className="w-5 h-5" />
              Đăng Vật Liệu Tháo Dỡ Của Bạn
            </Link>

            <Link
              to="/ai-advisor"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white border border-white/20 font-semibold text-sm backdrop-blur-md transition-colors"
            >
              <Sparkles className="w-4 h-4 text-emerald-300" />
              Dùng AI Bóc Tách Công Trình
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Decorative background circle */}
        <div className="absolute -right-20 -bottom-20 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
      </section>

      {/* Filter Component with Custom Radius/Diameter and Keyword Search */}
      <MaterialFilter
        selectedCategory={selectedCategory}
        onSelectCategory={handleFilterCategory}
        selectedType={selectedType}
        onSelectType={handleFilterType}
        searchTerm={searchTerm}
        onSearchChange={handleSearch}
      />

      {/* Material Grid Section */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
              <Layers className="w-5 h-5 text-emerald-600" />
              Vật Liệu Khả Dụng Quanh Vị Trí Của Bạn
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Tìm thấy {paginationData.total} nguồn vật liệu trong bán kính {radiusKm}km
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="py-20 text-center text-slate-400 text-sm">
            Đang tìm kiếm vật liệu quanh khu vực của bạn...
          </div>
        ) : displayMaterials.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-3xl border border-slate-200 p-8 space-y-2">
            <MapPin className="w-12 h-12 text-slate-300 mx-auto mb-2" />
            <h3 className="text-base font-bold text-slate-700">Không có vật liệu nào quanh đây</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Hãy thử nới rộng bán kính tìm kiếm (ví dụ lên 10km hoặc 20km) hoặc chọn danh mục khác.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {displayMaterials.map((mat) => (
              <MaterialCard key={mat._id} material={mat} />
            ))}
          </div>
        )}

        {/* Phân Trang (Pagination) */}
        <Pagination
          pagination={paginationData}
          onPageChange={(newPage) => setPage(newPage)}
        />
      </section>
    </div>
  );
};
