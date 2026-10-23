import React from "react";
import { SearchX, RotateCcw, MapPin, PlusCircle, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  secondaryActionText?: string;
  secondaryActionHref?: string;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionText,
  onAction,
  secondaryActionText,
  secondaryActionHref,
  className = "",
}) => {
  return (
    <div
      className={`min-h-[360px] flex flex-col items-center justify-center text-center bg-white rounded-3xl border border-slate-200/90 p-8 sm:p-12 shadow-xs transition-all animate-fadeIn ${className}`}
    >
      <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 border border-emerald-100/80 shadow-xs">
        {icon || <SearchX className="w-8 h-8 stroke-[1.75]" />}
      </div>

      <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight mb-2">
        {title}
      </h3>

      <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed mb-6">
        {description}
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        {actionText && onAction && (
          <button
            type="button"
            onClick={onAction}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 active:scale-98 transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            {actionText}
          </button>
        )}

        {secondaryActionText && secondaryActionHref && (
          <Link
            to={secondaryActionHref}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
          >
            <PlusCircle className="w-3.5 h-3.5 text-emerald-600" />
            {secondaryActionText}
          </Link>
        )}
      </div>
    </div>
  );
};
