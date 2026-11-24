import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { DashboardTopbar } from "./DashboardTopbar";
import { MobileBottomNav } from "./MobileBottomNav";
import { FloatingAiAssistant } from "@/components/ai/FloatingAiAssistant";

export const DashboardLayout: React.FC = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed(!collapsed)}
        isMobileOpen={isMobileOpen}
        onCloseMobile={() => setIsMobileOpen(false)}
      />

      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
          collapsed ? "lg:ml-20" : "lg:ml-64"
        }`}
      >
        <DashboardTopbar
          onToggleMobileMenu={() => setIsMobileOpen(true)}
          onToggleSidebar={() => setCollapsed(!collapsed)}
          collapsed={collapsed}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-7 pb-24 lg:pb-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>

      <MobileBottomNav />
      <FloatingAiAssistant />
    </div>
  );
};
