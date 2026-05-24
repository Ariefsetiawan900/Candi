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

export function FilterDrawer({ children, title = "Filters", hasActiveFilters, onReset }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="relative inline-flex">
        <Button
          variant="outline"
          size="icon"
          aria-label="Open filters"
          onClick={() => setOpen(true)}
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
            <div className="flex items-center justify-between">
              <SheetTitle>{title}</SheetTitle>
              {onReset && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs text-muted-foreground h-auto p-0 hover:text-foreground"
                  onClick={() => { onReset(); }}
                >
                  Reset all
                </Button>
              )}
            </div>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5">
            {children}
          </div>

          <SheetFooter className="px-6 py-4 border-t">
            <Button className="w-full" onClick={() => setOpen(false)}>
              Apply
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
}
