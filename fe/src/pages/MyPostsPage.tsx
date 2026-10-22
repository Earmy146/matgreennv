import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FolderOpen,
  PlusCircle,
  MapPin,
  Clock,
  Trash2,
  CheckCircle,
  AlertCircle,
  Eye,
  MessageSquare,
  Tag,
} from "lucide-react";
import { formatCurrency, CATEGORY_LABELS } from "@/lib/utils";
import type { MaterialItem } from "@/types/material.types";

export const MyPostsPage: React.FC = () => {
  const [myPosts, setMyPosts] = useState<MaterialItem[]>([
    {
      _id: "my-1",
      title: "1.5 Tấn thép phi 10, phi 12 cũ tháo dỡ từ nhà 3 tầng",
      description: "Nhà chuẩn bị đập để xây mới, thép còn thẳng và đẹp, đã gom lại gọn gàng trong sân.",
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
      owner: { _id: "user-me", name: "Tôi (Nhà A)" },
      createdAt: new Date(Date.now() - 3600 * 1000 * 24).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      _id: "my-2",
      title: "Tặng miễn phí 3 xe xà bần, vữa vụn gạch vỡ tôn nền",
      description: "Đập tường ngăn phòng, cần dọn mặt bằng gấp trong ngày hôm nay.",
      category: "xa_ban",
      type: "free",
      price: 0,
      unit: "xe tải",
      images: ["https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&w=600&q=80"],
      location: {
        type: "Point",
        coordinates: [105.8542, 21.0285],
        address: "Số 45, Ngõ 12 Đội Cấn, Ba Đình, Hà Nội",
      },
      contactPhone: "0987654321",
      status: "reserved",
      owner: { _id: "user-me", name: "Tôi (Nhà A)" },
      createdAt: new Date(Date.now() - 3600 * 1000 * 48).toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ]);

  const toggleStatus = (id: string) => {
    setMyPosts((prev) =>
      prev.map((post) => {
        if (post._id !== id) return post;
        const nextStatus =
          post.status === "available"
            ? "reserved"
            : post.status === "reserved"
            ? "completed"
            : "available";
        return { ...post, status: nextStatus };
      })
    );
  };

  const deletePost = (id: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa tin đăng vật liệu này?")) {
      setMyPosts((prev) => prev.filter((p) => p._id !== id));
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-2">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold mb-1 border border-emerald-200">
            <FolderOpen className="w-3.5 h-3.5 text-emerald-600" />
            <span>Khu Vực Quản Lý Của Nhà A</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Quản Lý Bài Đăng Vật Liệu Tháo Dỡ
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Theo dõi, cập nhật trạng thái khi đã có người nhận hoặc xóa tin khi công trình đã dọn sạch mặt bằng.
          </p>
        </div>

        <Link
          to="/post"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95"
        >
          <PlusCircle className="w-4 h-4" />
          Đăng Thêm Vật Liệu Mới
        </Link>
      </div>

      {/* Listing Cards */}
      {myPosts.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
          <FolderOpen className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="font-bold text-slate-800 text-base">Bạn chưa có bài đăng nào</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Khi công trình của bạn bắt đầu tháo dỡ, hãy đăng thông tin và ảnh vật liệu lên để người dân quanh khu vực có thể hỗ trợ dọn dẹp hoặc mua lại.
          </p>
          <Link
            to="/post"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs mt-2"
          >
            <PlusCircle className="w-4 h-4" /> Đăng bài ngay
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {myPosts.map((post) => {
            const isFree = post.type === "free";
            return (
              <div
                key={post._id}
                className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                {/* Thumbnail & Info */}
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                    {post.images?.[0] ? (
                      <img src={post.images[0]} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
                        No image
                      </div>
                    )}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-emerald-700">
                        {CATEGORY_LABELS[post.category] || "Vật liệu"}
                      </span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                          isFree ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {isFree ? "🎁 Cho Tặng 0đ" : "🏷️ Bán Thanh Lý"}
                      </span>
                    </div>

                    <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-snug">
                      {post.title}
                    </h3>

                    <div className="text-xs text-slate-500 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {post.location?.address}
                    </div>

                    <div className="text-xs font-bold text-amber-600">
                      {formatCurrency(post.price)} {post.unit && !isFree ? ` / ${post.unit}` : ""}
                    </div>
                  </div>
                </div>

                {/* Status Toggle & Action Controls */}
                <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 w-full md:w-auto pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                  <button
                    onClick={() => toggleStatus(post._id)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold border transition-colors flex items-center gap-1.5 ${
                      post.status === "available"
                        ? "bg-emerald-50 border-emerald-300 text-emerald-800"
                        : post.status === "reserved"
                        ? "bg-amber-50 border-amber-300 text-amber-800"
                        : "bg-slate-100 border-slate-300 text-slate-600"
                    }`}
                    title="Nhấn để đổi trạng thái"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>
                      {post.status === "available"
                        ? "🟢 Đang Khả Dụng"
                        : post.status === "reserved"
                        ? "🟡 Đã Có Người Hẹn"
                        : "⚪ Đã Dọn Xong"}
                    </span>
                  </button>

                  <Link
                    to={`/materials/${post._id}`}
                    className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 border border-slate-200 transition-colors"
                    title="Xem chi tiết"
                  >
                    <Eye className="w-4 h-4" />
                  </Link>

                  <button
                    onClick={() => deletePost(post._id)}
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 transition-colors"
                    title="Xóa bài đăng"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
