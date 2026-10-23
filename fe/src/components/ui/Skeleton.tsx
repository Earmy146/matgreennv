import React from "react";
import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Skeleton: React.FC<SkeletonProps> = ({ className, ...props }) => {
  return (
    <div
      className={cn(
        "bg-slate-200/80 rounded-xl animate-shimmer relative overflow-hidden",
        className
      )}
      {...props}
    />
  );
};

// Skeleton mô phỏng 1:1 thẻ Vật Liệu (MaterialCard) để triệt tiêu hoàn toàn giật layout
export const MaterialCardSkeleton: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div
      className={cn(
        "bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col h-full",
        className
      )}
    >
      {/* Khung ảnh Thumbnail */}
      <div className="h-44 bg-slate-100 relative overflow-hidden flex items-center justify-center animate-shimmer">
        <Skeleton className="w-full h-full rounded-none bg-slate-200/90" />
        {/* Giả lập badge giá & khoảng cách */}
        <div className="absolute top-3 left-3">
          <Skeleton className="w-24 h-5 rounded-full bg-slate-300/80" />
        </div>
        <div className="absolute bottom-3 right-3">
          <Skeleton className="w-20 h-4 rounded-md bg-slate-400/50" />
        </div>
      </div>

      {/* Thân thẻ Body */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Category Tag */}
          <Skeleton className="w-24 h-3 rounded-md mb-2 bg-emerald-100/60" />
          {/* Tiêu đề 2 dòng */}
          <Skeleton className="w-4/5 h-4.5 rounded-md mb-1.5" />
          <Skeleton className="w-3/5 h-4.5 rounded-md mb-2" />
          {/* Mô tả ngắn */}
          <Skeleton className="w-full h-3 rounded-md mb-1" />
          <Skeleton className="w-2/3 h-3 rounded-md" />
        </div>

        {/* Khối giá & địa chỉ */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <div className="space-y-1">
            <Skeleton className="w-12 h-2.5 rounded-md" />
            <Skeleton className="w-20 h-4 rounded-md bg-amber-100/70" />
          </div>
          <div className="space-y-1 flex flex-col items-end">
            <Skeleton className="w-14 h-2.5 rounded-md" />
            <Skeleton className="w-24 h-3.5 rounded-md" />
          </div>
        </div>

        {/* 2 Nút thao tác bên dưới */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <Skeleton className="h-8 rounded-xl" />
          <Skeleton className="h-8 rounded-xl bg-emerald-100/50" />
        </div>
      </div>
    </div>
  );
};

// Lưới Skeleton Vật Liệu
export const MaterialGridSkeleton: React.FC<{
  count?: number;
  className?: string;
}> = ({
  count = 8,
  className = "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5",
}) => {
  return (
    <div className={className}>
      {Array.from({ length: count }).map((_, index) => (
        <MaterialCardSkeleton key={index} />
      ))}
    </div>
  );
};

// Skeleton mô phỏng bài viết Tin Tức (NewsArticle)
export const NewsCardSkeleton: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div
      className={cn(
        "bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-xs flex flex-col justify-between h-full",
        className
      )}
    >
      <div>
        {/* Thumbnail */}
        <div className="relative h-56 bg-slate-100 overflow-hidden animate-shimmer">
          <Skeleton className="w-full h-full rounded-none" />
          <div className="absolute top-4 left-4">
            <Skeleton className="w-24 h-6 rounded-full bg-slate-300" />
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-3">
          <div className="flex items-center gap-4">
            <Skeleton className="w-20 h-3 rounded-md" />
            <Skeleton className="w-16 h-3 rounded-md" />
          </div>
          <Skeleton className="w-4/5 h-5 rounded-md" />
          <Skeleton className="w-3/5 h-5 rounded-md" />
          <Skeleton className="w-full h-3 rounded-md" />
          <Skeleton className="w-2/3 h-3 rounded-md" />
        </div>
      </div>

      <div className="px-6 pb-6 pt-3 border-t border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Skeleton className="w-8 h-8 rounded-full" />
          <div className="space-y-1">
            <Skeleton className="w-20 h-3 rounded-md" />
            <Skeleton className="w-14 h-2.5 rounded-md" />
          </div>
        </div>
        <Skeleton className="w-20 h-3 rounded-md" />
      </div>
    </div>
  );
};

// Lưới Skeleton Tin tức
export const NewsGridSkeleton: React.FC<{
  count?: number;
  className?: string;
}> = ({
  count = 6,
  className = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8",
}) => {
  return (
    <div className={className}>
      {Array.from({ length: count }).map((_, index) => (
        <NewsCardSkeleton key={index} />
      ))}
    </div>
  );
};

// Skeleton dạng hàng ngang (Cho SavedMaterialsPage, MyPostsPage)
export const HorizontalItemSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex gap-4 animate-shimmer">
      <Skeleton className="w-24 h-24 rounded-xl shrink-0" />
      <div className="min-w-0 flex-1 space-y-2">
        <Skeleton className="w-24 h-3 rounded-md" />
        <Skeleton className="w-3/4 h-4 rounded-md" />
        <Skeleton className="w-28 h-3.5 rounded-md" />
        <Skeleton className="w-1/2 h-3 rounded-md" />
      </div>
    </div>
  );
};
