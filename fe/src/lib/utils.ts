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

export function formatDistance(distanceKm?: number): string {
  if (distanceKm === undefined || distanceKm === null) return "Chưa rõ";
  if (distanceKm < 1) {
    return `${Math.round(distanceKm * 1000)} m`;
  }
  return `${distanceKm.toFixed(1)} km`;
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
