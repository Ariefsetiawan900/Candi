"use client";

import { create } from "zustand";

export const useUiStore = create((set) => ({
  mobileSidebarOpen: false,
  setMobileSidebarOpen: (open) => set({ mobileSidebarOpen: open }),
  toggleMobileSidebar: () =>
    set((s) => ({ mobileSidebarOpen: !s.mobileSidebarOpen })),
}));
