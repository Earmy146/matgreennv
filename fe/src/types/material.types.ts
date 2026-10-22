import type { Pagination } from "./api.types";

export type MaterialCategory =
  | "sat_thep"
  | "gach_ngoi"
  | "cua_kinh"
  | "thiet_bi_ve_sinh"
  | "go_copha"
  | "xa_ban"
  | "khac";

export type MaterialPricingType = "free" | "sell";

export interface MaterialLocation {
  type: "Point";
  coordinates: [number, number]; // [lng, lat]
  address: string;
}

export interface MaterialItem {
  _id: string;
  title: string;
  description?: string;
  category: MaterialCategory;
  type: MaterialPricingType;
  price: number;
  unit: string;
  images: string[];
  location: MaterialLocation;
  contactPhone: string;
  contactZalo?: string;
  contactName?: string;
  contactHours?: string;
  status: "available" | "reserved" | "completed";
  owner: {
    _id: string;
    name: string;
    phone?: string;
    avatar?: string;
    email?: string;
  };
  distanceKm?: number;
  createdAt: string;
  updatedAt: string;
}

export interface NearbyMaterialsResult {
  items: MaterialItem[];
  pagination: Pagination;
  searchRadiusKm: number;
  searchDiameterKm: number;
}
