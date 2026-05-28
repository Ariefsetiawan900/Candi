import { z } from "zod";
import { ORDER_STATUSES } from "@/lib/constants/order-status";

export const orderSchema = z.object({
  customer_name: z.string().min(2, "At least 2 characters").max(120),
  menu: z.string().min(1, "Required").max(120),
  package: z.string().min(1, "Required").max(120),
  order_date: z.string().min(1, "Required"),
  pickup_date: z.string().min(1, "Required"),
  quantity: z.coerce.number().int().positive("Must be > 0"),
  status: z.enum(ORDER_STATUSES).default("pending"),
  note: z.string().max(500, "Max 500 characters").optional().or(z.literal("")),
});
