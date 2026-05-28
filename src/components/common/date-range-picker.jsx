"use client";

import { useState } from "react";
import { format, parseISO, isValid } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

function parseDate(str) {
  if (!str) return undefined;
  const d = parseISO(str);
  return isValid(d) ? d : undefined;
}

function formatTrigger(from, to) {
  const f = parseDate(from);
  const t = parseDate(to);
  if (f && t) return `${format(f, "dd MMM")} – ${format(t, "dd MMM yyyy")}`;
  if (f) return format(f, "dd MMM yyyy");
  return "Pilih tanggal";
}

export function DateRangePicker({ label, from, to, onFromChange, onToChange }) {
  const [open, setOpen] = useState(false);

  const selected = {
    from: parseDate(from),
    to: parseDate(to),
  };

  function handleSelect(range) {
    onFromChange(range?.from ? format(range.from, "yyyy-MM-dd") : "");
    onToChange(range?.to ? format(range.to, "yyyy-MM-dd") : "");
    if (range?.from && range?.to) setOpen(false);
  }

  const hasValue = !!from || !!to;

  return (
    <div className="space-y-1.5">
      {label && <Label className="text-sm font-medium">{label}</Label>}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !hasValue && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 size-4 shrink-0" />
            {formatTrigger(from, to)}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="range"
            selected={selected}
            onSelect={handleSelect}
            numberOfMonths={1}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
