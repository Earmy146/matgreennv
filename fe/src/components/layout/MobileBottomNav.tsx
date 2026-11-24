import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Compass, MapPin, MessageSquare, PlusCircle, Sparkles } from "lucide-react";

const TABS = [
  { label: "Kho", href: "/materials", icon: Compass },
  { label: "Radar", href: "/dashboard", icon: MapPin },
  { label: "Đăng tin", href: "/post", icon: PlusCircle, primary: true },
  { label: "Chat", href: "/chat", icon: MessageSquare },
  { label: "AI", href: "/ai-advisor", icon: Sparkles },
];

export const MobileBottomNav: React.FC = () => {
  const { pathname } = useLocation();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1.5">
      <div className="grid grid-cols-5 items-center max-w-md mx-auto">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const active =
            pathname === tab.href ||
            (tab.href === "/dashboard" && pathname === "/map-radar");

          if (tab.primary) {
            return (
              <Link
                key={tab.href}
                to={tab.href}
                className="flex flex-col items-center justify-center -mt-4"
              >
                <span className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-lg shadow-emerald-600/30 flex items-center justify-center">
                  <Icon className="w-5 h-5" />
                </span>
                <span className="text-[10px] font-bold text-emerald-700 mt-0.5">{tab.label}</span>
              </Link>
            );
          }

          return (
            <Link
              key={tab.href}
              to={tab.href}
              className={`flex flex-col items-center justify-center py-1 rounded-xl transition-colors ${
                active ? "text-emerald-700 font-bold" : "text-slate-500 font-medium"
              }`}
            >
              <Icon className={`w-5 h-5 ${active ? "text-emerald-600" : "text-slate-400"}`} />
              <span className="text-[10px] mt-0.5">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
