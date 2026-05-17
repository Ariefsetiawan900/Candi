import { cn } from "@/lib/utils";
import {
  ORDER_STATUS_CLASS,
  ORDER_STATUS_LABEL,
} from "@/lib/constants/order-status";

export function StatusBadge({ status, className }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium capitalize",
        ORDER_STATUS_CLASS[status],
        className
      )}
    >
      {ORDER_STATUS_LABEL[status] ?? status}
    </span>
  );
}
