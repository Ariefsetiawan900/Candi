import { format, parseISO } from "date-fns";

export function formatDate(value, pattern = "dd MMM yyyy") {
  if (!value) return "—";
  const d = value instanceof Date ? value : parseISO(value);
  return format(d, pattern);
}

export function todayISO() {
  return format(new Date(), "yyyy-MM-dd");
}
