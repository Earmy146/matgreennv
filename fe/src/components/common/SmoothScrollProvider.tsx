import React, { useEffect, useRef } from "react";
import Lenis from "lenis";
import { useLocation } from "react-router-dom";

const LANDING_PATHS = new Set(["/", "/about", "/services", "/contact", "/news"]);

function shouldUseLenis(pathname: string): boolean {
  if (LANDING_PATHS.has(pathname)) return true;
  if (pathname.startsWith("/news/")) return true;
  return false;
}

export const SmoothScrollProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const lenisRef = useRef<Lenis | null>(null);
  const location = useLocation();

  useEffect(() => {
    // Chỉ bật Lenis trên các trang Landing/Tin tức marketing;
    // toàn bộ khu vực App/Dashboard/Chat/AI/Admin dùng cuộn native để không bao giờ cướp wheel của khung con.
    if (!shouldUseLenis(location.pathname)) {
      if (lenisRef.current) {
        lenisRef.current.destroy();
        lenisRef.current = null;
      }
      document.documentElement.classList.remove("lenis", "lenis-smooth", "lenis-stopped");
      document.body.classList.remove("lenis", "lenis-smooth", "lenis-stopped");
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    if (!lenisRef.current) {
      const lenis = new Lenis({
        duration: 1.0,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: "vertical",
        gestureOrientation: "vertical",
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 1.5,
        prevent: (node) => {
          return (
            node.closest("[data-lenis-prevent]") !== null ||
            node.closest(".admin-scrollable") !== null
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
