"use client";

import { useState } from "react";
import { format, parseISO, isValid } from "date-fns";
import { CalendarIcon, X } from "lucide-react";
import { DayPicker } from "react-day-picker";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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

  // react-day-picker v10: onSelect(selected: DateRange | undefined, triggerDate, modifiers, e)
  function handleSelect(range) {
    onFromChange(range?.from ? format(range.from, "yyyy-MM-dd") : "");
    onToChange(range?.to ? format(range.to, "yyyy-MM-dd") : "");
    // tutup hanya setelah end date terpilih
    if (range?.from && range?.to) setOpen(false);
  }

  function handleClear(e) {
    e.stopPropagation();
    onFromChange("");
    onToChange("");
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
              "w-full justify-start text-left font-normal pr-2",
              !hasValue && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 size-4 shrink-0" />
            <span className="flex-1">{formatTrigger(from, to)}</span>
            {hasValue && (
              <span
                role="button"
                tabIndex={0}
                onClick={handleClear}
                onKeyDown={(e) => e.key === "Enter" && handleClear(e)}
                className="ml-1 rounded p-0.5 hover:bg-accent"
                aria-label="Clear date range"
              >
                <X className="size-3.5 text-muted-foreground" />
              </span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <DayPicker
            mode="range"
            selected={selected}
            onSelect={handleSelect}
            resetOnSelect
            numberOfMonths={2}
            showOutsideDays
            className="p-3"
            classNames={{
              months: "flex flex-col sm:flex-row gap-4",
              month: "flex flex-col gap-4",
              month_caption:
                "flex justify-center pt-1 relative items-center",
              caption_label: "text-sm font-medium",
              nav: "flex items-center gap-1",
              button_previous:
                "absolute left-1 h-7 w-7 inline-flex items-center justify-center rounded-md border border-input bg-transparent p-0 opacity-50 hover:opacity-100",
              button_next:
                "absolute right-1 h-7 w-7 inline-flex items-center justify-center rounded-md border border-input bg-transparent p-0 opacity-50 hover:opacity-100",
              month_grid: "w-full border-collapse",
              weekdays: "flex",
              weekday:
                "text-muted-foreground rounded-md w-8 font-normal text-[0.8rem] text-center",
              week: "flex w-full mt-2",
              day: "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md [&:has([aria-selected].range_end)]:rounded-r-md [&:has([aria-selected].range_start)]:rounded-l-md",
              day_button:
                "h-8 w-8 p-0 font-normal aria-selected:opacity-100 rounded-md hover:bg-accent hover:text-accent-foreground inline-flex items-center justify-center",
              range_start:
                "range_start bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground rounded-l-md",
              range_end:
                "range_end bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground rounded-r-md",
              selected:
                "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
              today: "bg-accent text-accent-foreground",
              outside: "text-muted-foreground opacity-50",
              disabled: "text-muted-foreground opacity-50",
              range_middle:
                "range_middle aria-selected:bg-accent aria-selected:text-accent-foreground rounded-none",
              hidden: "invisible",
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
