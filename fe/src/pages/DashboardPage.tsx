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
import { Pagination } from "@/components/ui/Pagination";
import { useLocationStore } from "@/stores/location.store";
import { useAuthStore } from "@/stores/auth.store";
import { materialsApi } from "@/services/api";
import type { MaterialItem } from "@/types/material.types";
import { formatCurrency, formatDistance, CATEGORY_LABELS } from "@/lib/utils";

// Demo fallback data
const DEMO_ITEMS: MaterialItem[] = [
  {
    _id: "demo-1",
    title: "1.5 Tấn thép phi 10, phi 12 cũ tháo dỡ từ nhà 3 tầng",
    description: "Nhà chuẩn bị đập để xây mới, thép còn thẳng và đẹp, bán thanh lý giá mềm cho ai cần làm móng hoặc xưởng cơ khí.",
    category: "sat_thep",
    type: "sell",
    price: 8500,
    unit: "kg",
    images: ["https://images.unsplash.com/photo-1535813547-99c456a41d4a?auto=format&fit=crop&w=600&q=80"],
    location: {
      type: "Point",
      coordinates: [105.8542, 21.0285],
      address: "Số 45, Ngõ 12 Đội Cấn, Ba Đình, Hà Nội",
    },
    contactPhone: "0987654321",
    contactZalo: "0987654321",
    contactName: "Anh Nam (Chủ nhà)",
    contactHours: "Gọi trước 30p hoặc 8h-18h",
    status: "available",
    owner: { _id: "user-1", name: "Anh Nam (Chủ nhà A)" },
    distanceKm: 0.8,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "demo-2",
    title: "Tặng miễn phí 3 xe xà bần, vữa vụn gạch vỡ tôn nền",
    description: "Công trình đập tường ngăn phòng, cần dọn mặt bằng gấp trong ngày hôm nay. Miễn phí 100%, ai cần san lấp ao hố vui lòng tự chở.",
    category: "xa_ban",
    type: "free",
    price: 0,
    unit: "xe tải",
    images: ["https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&w=600&q=80"],
    location: {
      type: "Point",
      coordinates: [105.8590, 21.0310],
      address: "Ngõ 175 Cầu Giấy, Hà Nội",
    },
    contactPhone: "0912345678",
    contactZalo: "0912345678",
    contactName: "Bác Hùng Thợ Tháo Dỡ",
    contactHours: "Bất kể lúc nào trong ngày",
    status: "available",
    owner: { _id: "user-2", name: "Bác Hùng Thợ Tháo Dỡ" },
    distanceKm: 1.4,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "demo-3",
    title: "Bộ 4 cửa gỗ lim và 2 bộ cửa nhôm kính hệ Xingfa cũ",
    description: "Nhà thay toàn bộ hệ thống cửa sang kính cường lực nên thanh lý cửa cũ còn rất chắc chắn, khóa và tay nắm còn nguyên.",
    category: "cua_kinh",
    type: "sell",
    price: 450000,
    unit: "bộ",
    images: ["https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80"],
    location: {
      type: "Point",
      coordinates: [105.8420, 21.0250],
      address: "Đường Kim Mã, Ba Đình, Hà Nội",
    },
    contactPhone: "0904112233",
    contactZalo: "0904112233",
    contactName: "Chị Lan",
    contactHours: "Sau 17h hoặc cuối tuần",
    status: "available",
    owner: { _id: "user-3", name: "Chị Lan" },
    distanceKm: 2.1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "demo-4",
    title: "Cho tặng bồn cầu Inax và chậu rửa lavabo cũ còn dùng tốt",
    description: "Nâng cấp nội thất vệ sinh, tặng lại cho ai làm phòng trọ hoặc công trình tạm. Tự tháo mang về.",
    category: "thiet_bi_ve_sinh",
    type: "free",
    price: 0,
    unit: "bộ",
    images: ["https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80"],
    location: {
      type: "Point",
      coordinates: [105.8300, 21.0200],
      address: "Đường Láng, Đống Đa, Hà Nội",
    },
    contactPhone: "0977889900",
    contactZalo: "0977889900",
    contactName: "Tuấn Anh",
    contactHours: "Buổi sáng 8h - 12h",
    status: "available",
    owner: { _id: "user-4", name: "Tuấn Anh" },
    distanceKm: 3.5,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

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
        latitude: latitude || 21.0285,
        longitude: longitude || 105.8542,
        radiusKm,
        category: selectedCategory || undefined,
        type: selectedType || undefined,
        search: searchTerm || undefined,
        page,
        limit: pageSize,
      }),
    retry: 1,
  });

  // Dữ liệu hiển thị (Ưu tiên từ Backend, fallback demo nếu chưa có dữ liệu)
  const displayMaterials =
    nearbyResult?.items && nearbyResult.items.length > 0
      ? nearbyResult.items
      : DEMO_ITEMS.filter((item) => {
          if (selectedCategory && item.category !== selectedCategory) return false;
          if (selectedType && item.type !== selectedType) return false;
          if (searchTerm && !item.title.toLowerCase().includes(searchTerm.toLowerCase())) return false;
          return true;
        });

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
          <RadarMapWidget
            materials={displayMaterials}
            radiusKm={radiusKm}
            userAddress={address}
          />

          {/* Quick list of nearest spots */}
          <div className="space-y-3">
            <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-600" />
              Các Công Trình Gần Vị Trí Của Bạn Nhất
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {displayMaterials.slice(0, 4).map((mat) => (
                <MaterialCard key={mat._id} material={mat} />
              ))}
            </div>
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
            <div className="py-20 text-center text-slate-400 text-sm">
              Đang quét các công trình trong bán kính {radiusKm} km...
            </div>
          ) : displayMaterials.length === 0 ? (
            <div className="py-16 text-center bg-white rounded-3xl border border-slate-200 p-8 space-y-2">
              <MapPin className="w-10 h-10 text-slate-300 mx-auto" />
              <h4 className="font-bold text-slate-700 text-sm">Không có vật liệu nào trong bán kính {radiusKm}km</h4>
              <p className="text-xs text-slate-400">
                Hãy thử tăng bán kính quét lên (ví dụ: 10km hoặc 20km) hoặc xóa từ khóa tìm kiếm.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {displayMaterials.map((mat) => (
                <MaterialCard key={mat._id} material={mat} />
              ))}
            </div>
          )}

          {/* Phân Trang (Pagination Controls) */}
          <Pagination
            pagination={paginationData}
            onPageChange={(newPage) => setPage(newPage)}
          />
        </div>
      )}
    </div>
  );
};
