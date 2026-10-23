import { create } from "zustand";

interface LocationStore {
  latitude: number | null;
  longitude: number | null;
  radiusKm: number;
  address: string;
  accuracy: number | null;
  capturedAt: string | null;
  isLocating: boolean;
  setLocation: (lat: number, lng: number, address: string, accuracy?: number | null, capturedAt?: string | null) => void;
  setRadius: (radius: number) => void;
  setIsLocating: (isLocating: boolean) => void;
}

export const useLocationStore = create<LocationStore>((set) => ({
  latitude: null,
  longitude: null,
  radiusKm: 5,
  address: "",
  accuracy: null,
  capturedAt: null,
  isLocating: false,
  setLocation: (latitude, longitude, address, accuracy = null, capturedAt = new Date().toISOString()) =>
    set({ latitude, longitude, address, accuracy, capturedAt }),
  setRadius: (radiusKm) => set({ radiusKm }),
  setIsLocating: (isLocating) => set({ isLocating }),
}));
