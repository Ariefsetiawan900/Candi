"use client";

import { create } from "zustand";

export const useUserStore = create(() => ({
  user: null,
  profile: null,
}));

export function useUser() {
  return useUserStore();
}
