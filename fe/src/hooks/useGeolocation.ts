import { useState, useCallback } from "react";
import { useLocationStore } from "@/stores/location.store";

export function useGeolocation() {
  const [error, setError] = useState<string | null>(null);
  const { setLocation, setIsLocating, isLocating } = useLocationStore();

  const getCurrentLocation = useCallback((): Promise<GeolocationPosition> => {
    if (!navigator.geolocation) {
      setError("Trình duyệt của bạn không hỗ trợ định vị Geolocation.");
      return Promise.reject(new Error("Geolocation không được hỗ trợ"));
    }

    setIsLocating(true);
    setError(null);

    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation(
          latitude,
          longitude,
          `GPS (${latitude.toFixed(5)}, ${longitude.toFixed(5)})`,
          position.coords.accuracy,
          new Date(position.timestamp).toISOString()
        );
        setIsLocating(false);
        resolve(position);
      },
      (err) => {
        setIsLocating(false);
        let errorMsg = "Không thể lấy vị trí hiện tại.";
        if (err.code === 1) {
          errorMsg = "Bạn đã từ chối quyền truy cập vị trí trên trình duyệt.";
        } else if (err.code === 2) {
          errorMsg = "Không thể xác định vị trí vệ tinh/mạng.";
        } else if (err.code === 3) {
          errorMsg = "Quá thời gian lấy vị trí.";
        }
        setError(errorMsg);
        reject(new Error(errorMsg));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
      );
    });
  }, [setLocation, setIsLocating]);

  return { getCurrentLocation, isLocating, error };
}
