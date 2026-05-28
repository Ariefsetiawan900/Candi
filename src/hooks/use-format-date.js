"use client";

import { useTimezone } from "@/store/user-store";
import { formatInTz, formatDate } from "@/lib/utils/format-date";
import { TIMEZONE_LABEL } from "@/lib/constants/timezones";

export function useFormatDate() {
  const tz = useTimezone();
  const tzLabel = TIMEZONE_LABEL[tz] ?? "";

  function formatTs(value, pattern) {
    const result = formatInTz(value, tz, pattern);
    if (result === "—") return result;
    return tzLabel ? `${result} ${tzLabel}` : result;
  }

  return { formatTs, formatDate, timezone: tz };
}
