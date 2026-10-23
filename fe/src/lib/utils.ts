import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatCurrency(amount: number): string {
  if (amount === 0) return "Miễn phí (0đ)";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
}

export const formatPrice = formatCurrency;

export function formatDistance(distanceKm?: number): string {
  if (distanceKm === undefined || distanceKm === null) return "Chưa rõ";
  if (distanceKm < 1) {
    return `${Math.round(distanceKm * 1000)} m`;
  }
  return `${distanceKm.toFixed(1)} km`;
}

// Tính khoảng cách Haversine giữa tọa độ người dùng và công trình (km)
export function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

export const CATEGORY_LABELS: Record<string, string> = {
  sat_thep: "Sắt thép cũ",
  gach_ngoi: "Gạch, ngói cũ",
  cua_kinh: "Cửa gỗ, nhôm kính",
  thiet_bi_ve_sinh: "Thiết bị vệ sinh",
  go_copha: "Gỗ ván, copha",
  xa_ban: "Xà bần, san lấp",
  khac: "Vật liệu khác",
};
