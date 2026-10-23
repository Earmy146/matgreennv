import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface LocationPreset {
  name: string;
  lat: number;
  lng: number;
  address: string;
}

export const POPULAR_LOCATIONS: LocationPreset[] = [
  { name: "Hà Nội (Trung tâm)", lat: 21.0285, lng: 105.8542, address: "Hoàn Kiếm, Hà Nội" },
  { name: "Hà Nội (Cầu Giấy)", lat: 21.0333, lng: 105.7944, address: "Cầu Giấy, Hà Nội" },
  { name: "TP. Hồ Chí Minh", lat: 10.7769, lng: 106.7009, address: "Quận 1, TP. Hồ Chí Minh" },
  { name: "Đà Nẵng", lat: 16.0544, lng: 108.2022, address: "Hải Châu, Đà Nẵng" },
];

interface LocationStore {
  latitude: number | null;
  longitude: number | null;
  radiusKm: number;
  address: string;
  accuracy: number | null;
  capturedAt: string | null;
  isLocating: boolean;
  setLocation: (
    lat: number,
    lng: number,
    address: string,
    accuracy?: number | null,
    capturedAt?: string | null
  ) => void;
  setRadius: (radius: number) => void;
  setIsLocating: (isLocating: boolean) => void;
  clearLocation: () => void;
  isStale: (maxAgeMinutes?: number) => boolean;
}

export const useLocationStore = create<LocationStore>()(
  persist(
    (set, get) => ({
      latitude: null,
      longitude: null,
      radiusKm: 5,
      address: "",
      accuracy: null,
      capturedAt: null,
      isLocating: false,
      setLocation: (
        latitude,
        longitude,
        address,
        accuracy = null,
        capturedAt = new Date().toISOString()
      ) =>
        set({ latitude, longitude, address, accuracy, capturedAt }),
      setRadius: (radiusKm) => set({ radiusKm }),
      setIsLocating: (isLocating) => set({ isLocating }),
      clearLocation: () =>
        set({
          latitude: null,
          longitude: null,
          address: "",
          accuracy: null,
          capturedAt: null,
        }),
      isStale: (maxAgeMinutes = 5) => {
        const { capturedAt, latitude, longitude } = get();
        if (!latitude || !longitude || !capturedAt) return true;
        const capturedTime = new Date(capturedAt).getTime();
        const now = Date.now();
        return now - capturedTime > maxAgeMinutes * 60 * 1000;
      },
    }),
    {
      name: "matgreen-location-storage",
      partialize: (state) => ({
        latitude: state.latitude,
        longitude: state.longitude,
        radiusKm: state.radiusKm,
        address: state.address,
        accuracy: state.accuracy,
        capturedAt: state.capturedAt,
      }),
    }
  )
);
