import React from "react";
import { Recycle } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-200 bg-white py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-slate-600 text-sm">
          <Recycle className="w-5 h-5 text-emerald-600" />
          <span className="font-semibold text-slate-800">MatGreen</span>
          <span>— Nền tảng kết nối vật liệu xây dựng và tháo dỡ dư thừa</span>
        </div>
        <div className="text-xs text-slate-400">
          © {new Date().getFullYear()} MatGreen. Giải pháp kinh tế tuần hoàn tiết kiệm & giảm thiểu rác thải.
        </div>
      </div>
    </footer>
  );
};
