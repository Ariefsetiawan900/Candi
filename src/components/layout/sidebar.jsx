"use client";

import { SidebarNav } from "@/components/layout/sidebar-nav";

export function Sidebar() {
  return (
    <aside className="hidden md:flex md:w-60 md:flex-col md:border-r md:bg-sidebar md:text-sidebar-foreground">
      <div className="h-14 flex items-center px-6 border-b">
        <span className="text-base font-semibold tracking-tight">CANDI</span>
      </div>
      <div className="flex-1 overflow-y-auto p-3">
        <SidebarNav />
      </div>
    </aside>
  );
}
