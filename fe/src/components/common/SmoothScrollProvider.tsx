import React, { useEffect, useRef } from "react";
import Lenis from "lenis";
import { useLocation } from "react-router-dom";

export const SmoothScrollProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const lenisRef = useRef<Lenis | null>(null);
  const location = useLocation();

  useEffect(() => {
    // Không chạy Lenis trên phân hệ Quản trị Admin để giữ cuộn native 100% mượt mà cho bảng & form
    if (location.pathname.startsWith("/admin")) {
      if (lenisRef.current) {
        lenisRef.current.destroy();
        lenisRef.current = null;
      }
      document.documentElement.classList.remove("lenis", "lenis-smooth", "lenis-stopped");
      document.body.classList.remove("lenis", "lenis-smooth", "lenis-stopped");
      return;
    }

    // Chỉ khởi tạo Lenis nếu không phải thiết bị giảm chuyển động (reduced-motion)
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    if (!lenisRef.current) {
      const lenis = new Lenis({
        duration: 1.1,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: "vertical",
        gestureOrientation: "vertical",
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 1.5,
        prevent: (node) => {
          return (
            node.closest("[data-lenis-prevent]") !== null ||
            node.closest(".admin-scrollable") !== null ||
            window.location.pathname.startsWith("/admin")
          );
        },
      });

      lenisRef.current = lenis;

      let rafId: number;
      function raf(time: number) {
        lenis.raf(time);
        rafId = requestAnimationFrame(raf);
      }
      rafId = requestAnimationFrame(raf);

      return () => {
        cancelAnimationFrame(rafId);
        lenis.destroy();
        lenisRef.current = null;
        document.documentElement.classList.remove("lenis", "lenis-smooth", "lenis-stopped");
        document.body.classList.remove("lenis", "lenis-smooth", "lenis-stopped");
      };
    }
  }, [location.pathname]);

  // Cuộn lên đầu trang tức thì khi chuyển trang
  useEffect(() => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
    }
  }, [location.pathname]);

  return <>{children}</>;
};

export default SmoothScrollProvider;
