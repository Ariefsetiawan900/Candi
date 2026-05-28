"use client";

import { useTimezone } from "@/store/user-store";
import { formatInTz, formatDate } from "@/lib/utils/format-date";

export function useFormatDate() {
  const tz = useTimezone();
  return {
    formatTs: (value, pattern) => formatInTz(value, tz, pattern),
    formatDate,
    timezone: tz,
  };
}
