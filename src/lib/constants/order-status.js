export const ORDER_STATUSES = [
  "pending",
  "processing",
  "ready",
  "completed",
  "cancelled",
];

export const ACTIVE_STATUSES = ["pending", "processing", "ready"];
export const HISTORY_STATUSES = ["completed", "cancelled"];

export const ORDER_STATUS_LABEL = {
  pending: "Pending",
  processing: "Processing",
  ready: "Ready",
  completed: "Completed",
  cancelled: "Cancelled",
};

// Tailwind class strings (work in light + dark via mix-blend on slate base)
export const ORDER_STATUS_CLASS = {
  pending: "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-100",
  processing: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-200",
  ready: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200",
  completed: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200",
  cancelled: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-200",
};
