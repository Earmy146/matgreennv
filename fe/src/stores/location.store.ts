import { create } from "zustand";

interface LocationStore {
  latitude: number | null;
  longitude: number | null;
  radiusKm: number;
  address: string;
  isLocating: boolean;
  setLocation: (lat: number, lng: number, address?: string) => void;
  setRadius: (radius: number) => void;
  setIsLocating: (isLocating: boolean) => void;
}

// Mặc định ban đầu: Trung tâm Hà Nội (21.0285, 105.8542)
export const useLocationStore = create<LocationStore>((set) => ({
  latitude: 21.0285,
  longitude: 105.8542,
  radiusKm: 5,
  address: "Hà Nội",
  isLocating: false,
  setLocation: (latitude, longitude, address = "Vị trí của bạn") =>
    set({ latitude, longitude, address }),
  setRadius: (radiusKm) => set({ radiusKm }),
  setIsLocating: (isLocating) => set({ isLocating }),
}));
