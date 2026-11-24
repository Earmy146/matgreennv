import React, { useState } from "react";
import { useSiteConfigStore } from "@/stores/site-config.store";

interface BrandLogoProps {
  size?: "sm" | "md" | "lg";
  theme?: "light" | "dark";
  showText?: boolean;
  subtitle?: string;
  badge?: string;
  className?: string;
}

const SIZE_CLASSES = {
  sm: { box: "w-9 h-9 rounded-xl p-1", title: "text-base", sub: "text-[10px]" },
  md: { box: "w-10 h-10 rounded-xl p-1", title: "text-lg", sub: "text-[10px]" },
  lg: { box: "w-12 h-12 rounded-2xl p-1.5", title: "text-xl sm:text-2xl", sub: "text-[11px]" },
};

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = "md",
  theme = "light",
  showText = true,
  subtitle,
  badge,
  className = "",
}) => {
  const { config } = useSiteConfigStore();
  const [logoError, setLogoError] = useState(false);

  const customLogo = !logoError ? config.general?.logoUrl : "";
  const siteName = config.general?.siteName?.trim();
  const tagline = subtitle ?? config.general?.siteTagline ?? "Vật Liệu Tuần Hoàn";
  const styles = SIZE_CLASSES[size];

  const isDark = theme === "dark";

  return (
    <div className={`inline-flex items-center gap-2.5 min-w-0 select-none ${className}`}>
      <div
        className={`${styles.box} shrink-0 flex items-center justify-center overflow-hidden border transition-transform group-hover:scale-105 ${
          isDark
            ? "bg-white/10 border-white/15 shadow-md"
            : "bg-white border-slate-200/90 shadow-xs"
        }`}
      >
        <img
          src={customLogo || "/favicon.svg"}
          alt={siteName || "MatGreen"}
          onError={() => {
            if (customLogo) setLogoError(true);
          }}
          className="w-full h-full object-contain rounded-lg"
        />
      </div>

      {showText && (
        <div className="flex flex-col min-w-0 leading-tight">
          <div className="flex items-center gap-1.5 min-w-0">
            <span
              className={`${styles.title} font-black tracking-tight truncate ${
                isDark ? "text-white" : "text-slate-900"
              }`}
            >
              {siteName && siteName.toLowerCase() !== "matgreen" ? (
                siteName
              ) : (
                <>
                  <span className={isDark ? "text-emerald-400" : "text-emerald-700"}>Mat</span>
                  <span>Green</span>
                </>
              )}
            </span>
            {badge && (
              <span
                className={`text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded-md shrink-0 ${
                  isDark
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                    : "bg-emerald-100 text-emerald-800 border border-emerald-200"
                }`}
              >
                {badge}
              </span>
            )}
          </div>
          {tagline && (
            <span
              className={`${styles.sub} font-semibold uppercase tracking-wider truncate mt-0.5 ${
                isDark ? "text-slate-400" : "text-slate-400"
              }`}
            >
              {tagline}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
