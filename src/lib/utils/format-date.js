import { format, parseISO } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";

export function formatDate(value, pattern = "dd MMM yyyy") {
  if (!value) return "—";
  const d = value instanceof Date ? value : parseISO(value);
  return format(d, pattern);
}

export function formatInTz(value, timezone, pattern = "dd MMM yyyy, HH:mm") {
  if (!value) return "—";
  const d = value instanceof Date ? value : parseISO(String(value));
  return formatInTimeZone(d, timezone, pattern);
}

export function todayISO() {
  return format(new Date(), "yyyy-MM-dd");
}
