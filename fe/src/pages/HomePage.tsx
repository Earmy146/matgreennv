import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Recycle, Sparkles, MapPin, Search, PlusCircle, ArrowRight, Layers } from "lucide-react";
import { MaterialFilter } from "@/features/materials/MaterialFilter";
import { MaterialCard } from "@/features/materials/MaterialCard";
import { useLocationStore } from "@/stores/location.store";
import { materialsApi } from "@/services/api";
import type { MaterialItem } from "@/types/material.types";

// Mock demo data để khi chưa kết nối database vẫn xem và trải nghiệm giao diện mượt mà
const DEMO_MATERIALS: MaterialItem[] = [
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
    status: "available",
    owner: { _id: "user-4", name: "Tuấn Anh" },
    distanceKm: 3.5,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const HomePage: React.FC = () => {
  const { latitude, longitude, radiusKm } = useLocationStore();
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("");

  const { data: remoteMaterials, isLoading } = useQuery({
    queryKey: ["materials-nearby", latitude, longitude, radiusKm, selectedCategory, selectedType],
    queryFn: () =>
      latitude && longitude
        ? materialsApi.getNearby({
            latitude,
            longitude,
            radiusKm,
            category: selectedCategory || undefined,
            type: selectedType || undefined,
          })
        : materialsApi.getAll({
            category: selectedCategory || undefined,
            type: selectedType || undefined,
          }),
    retry: 1,
  });

  // Ưu tiên hiển thị dữ liệu từ Backend, nếu chưa có hoặc đang khởi tạo thì fallback demo
  const displayMaterials =
    remoteMaterials && remoteMaterials.length > 0
      ? remoteMaterials
      : DEMO_MATERIALS.filter((item) => {
          if (selectedCategory && item.category !== selectedCategory) return false;
          if (selectedType && item.type !== selectedType) return false;
          return true;
        });

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

      {/* Filter Component */}
      <MaterialFilter
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        selectedType={selectedType}
        onSelectType={setSelectedType}
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
              Tìm thấy {displayMaterials.length} nguồn vật liệu trong bán kính {radiusKm}km
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="py-20 text-center text-slate-400 text-sm">
            Đang tìm kiếm vật liệu quanh khu vực của bạn...
          </div>
        ) : displayMaterials.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-2xl border border-slate-200 p-8">
            <MapPin className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-700">Không có vật liệu nào quanh đây</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
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
      </section>
    </div>
  );
};
