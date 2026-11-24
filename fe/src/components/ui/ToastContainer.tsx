import React from "react";
import { AlertCircle, CheckCircle2, Info, AlertTriangle, X } from "lucide-react";
import { useToastStore, type ToastVariant } from "@/stores/toast.store";

const STYLES: Record<ToastVariant, { box: string; icon: React.ReactNode }> = {
  success: {
    box: "bg-emerald-950 text-emerald-50 border-emerald-700/60",
    icon: <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />,
  },
  error: {
    box: "bg-rose-950 text-rose-50 border-rose-700/60",
    icon: <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />,
  },
  warning: {
    box: "bg-amber-950 text-amber-50 border-amber-700/60",
    icon: <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />,
  },
  info: {
    box: "bg-slate-900 text-slate-50 border-slate-700/60",
    icon: <Info className="w-4 h-4 text-sky-400 shrink-0" />,
  },
};

export const ToastContainer: React.FC = () => {
  const { toasts, dismiss } = useToastStore();
  if (!toasts.length) return null;

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 max-w-sm w-[calc(100vw-2rem)] pointer-events-none">
      {toasts.map((item) => {
        const cfg = STYLES[item.variant];
        return (
          <div
            key={item.id}
            className={`pointer-events-auto flex items-start gap-2.5 px-4 py-3 rounded-2xl border shadow-xl text-xs sm:text-sm font-medium animate-fadeIn ${cfg.box}`}
          >
            <div className="mt-0.5">{cfg.icon}</div>
            <span className="flex-1 leading-snug">{item.message}</span>
            <button
              type="button"
              onClick={() => dismiss(item.id)}
              className="p-0.5 rounded-lg opacity-70 hover:opacity-100 cursor-pointer shrink-0"
              aria-label="Đóng thông báo"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
