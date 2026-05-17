"use client";

import { useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ORDER_STATUSES,
  ORDER_STATUS_LABEL,
} from "@/lib/constants/order-status";
import { updateOrderStatusAction } from "@/features/orders/actions";

export function OrderStatusSelect({ id, status }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [value, setValue] = useState(status);

  function onChange(next) {
    if (next === value) return;
    const prev = value;
    setValue(next);
    startTransition(async () => {
      const res = await updateOrderStatusAction({ id, status: next });
      if (res?.error) {
        toast.error(res.error);
        setValue(prev);
        return;
      }
      toast.success("Status updated");
      router.refresh();
    });
  }

  return (
    <Select value={value} onValueChange={onChange} disabled={isPending}>
      <SelectTrigger size="sm" className="h-8 w-[140px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {ORDER_STATUSES.map((s) => (
          <SelectItem key={s} value={s}>
            {ORDER_STATUS_LABEL[s]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
