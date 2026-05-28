"use client";

import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";

/**
 * FilterDrawer with buffered draft state.
 *
 * Props:
 *   children(draft, setDraft) — render prop receiving draft state + setter
 *   committed                 — current committed filter values (plain object)
 *   onApply(draft)            — called with draft when user clicks Apply
 *   onReset()                 — called when user clicks Reset all (also closes drawer)
 *   hasActiveFilters          — shows red dot on trigger button
 *   title                     — drawer heading
 */
export function FilterDrawer({
  children,
  committed,
  onApply,
  onReset,
  hasActiveFilters,
  title = "Filters",
}) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(committed ?? {});

  function handleOpen() {
    // Reset draft to current committed values each time drawer opens
    setDraft(committed ?? {});
    setOpen(true);
  }

  function handleApply() {
    onApply(draft);
    setOpen(false);
  }

  function handleReset() {
    onReset();
    setOpen(false);
  }

  return (
    <>
      <div className="relative inline-flex">
        <Button
          variant="outline"
          size="icon"
          aria-label="Open filters"
          onClick={handleOpen}
        >
          <SlidersHorizontal className="size-4" />
        </Button>
        {hasActiveFilters && (
          <span className="absolute -top-1 -right-1 size-2 rounded-full bg-destructive" />
        )}
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="flex flex-col w-80 sm:w-96 p-0">
          <SheetHeader className="px-6 pt-6 pb-4 border-b">
            <SheetTitle>{title}</SheetTitle>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5">
            {typeof children === "function" ? children(draft, setDraft) : children}
          </div>

          <SheetFooter className="px-6 py-4 border-t">
            <div className="flex w-full gap-2">
              {onReset && (
                <Button variant="outline" className="flex-1" onClick={handleReset}>
                  Reset all
                </Button>
              )}
              <Button className="flex-1" onClick={handleApply}>
                Apply
              </Button>
            </div>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
}
