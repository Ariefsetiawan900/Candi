"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTimezone, setTimezone } from "@/store/user-store";
import { TIMEZONE_OPTIONS } from "@/lib/constants/timezones";
import { updateTimezone } from "./update-timezone-action";

export function TimezoneSelect() {
  const tz = useTimezone();
  const [pending, startTransition] = useTransition();

  function handleChange(value) {
    setTimezone(value);
    startTransition(async () => {
      try {
        await updateTimezone(value);
        toast.success("Pengaturan timezone berhasil disimpan.");
      } catch {
        toast.error("Gagal menyimpan pengaturan timezone.");
      }
    });
  }

  return (
    <Select value={tz} onValueChange={handleChange} disabled={pending}>
      <SelectTrigger className="w-44">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {TIMEZONE_OPTIONS.map((o) => (
          <SelectItem key={o.value} value={o.value}>
            {o.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
