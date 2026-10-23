import React, { useEffect, useRef } from "react";
import Lenis from "lenis";
import { useLocation } from "react-router-dom";

export const SmoothScrollProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const lenisRef = useRef<Lenis | null>(null);
  const location = useLocation();

  useEffect(() => {
    // Chỉ khởi tạo Lenis nếu không phải thiết bị giảm chuyển động (reduced-motion)
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
      prevent: (node) => {
        // Cho phép cuộn native tức thì không bị Lenis chặn trên modal, form hoặc trang admin
        return (
          node.closest("[data-lenis-prevent]") !== null ||
          node.closest(".admin-scrollable") !== null ||
          window.location.pathname.startsWith("/admin")
        );
      },
    });

    lenisRef.current = lenis;

    // Tự động dừng Lenis trên trang Admin để con lăn chuột cuộn native mượt mà
    if (window.location.pathname.startsWith("/admin")) {
      lenis.stop();
    }

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
    };
  }, []);

  // Tạm dừng Lenis khi chuyển vào /admin hoặc bật lại khi ra ngoài
  useEffect(() => {
    if (!lenisRef.current) return;
    if (location.pathname.startsWith("/admin")) {
      lenisRef.current.stop();
    } else {
      lenisRef.current.start();
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
