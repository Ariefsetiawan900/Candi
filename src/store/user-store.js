"use client";

import { create } from "zustand";
import { DEFAULT_TIMEZONE } from "@/lib/constants/timezones";

export const useUserStore = create(() => ({
  user: null,
  profile: null,
  timezone: DEFAULT_TIMEZONE,
}));

export function useUser() {
  return useUserStore();
}

export function useTimezone() {
  return useUserStore((s) => s.timezone);
}

export function setTimezone(tz) {
  useUserStore.setState({ timezone: tz });
}
