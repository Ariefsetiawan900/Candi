"use client";

import { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FilterDrawer } from "@/components/common/filter-drawer";
import { ExportCsvButton } from "@/features/orders/export-csv-button";
import { OrderFormModal } from "@/features/orders/order-form-modal";
import { useUser } from "@/components/providers/user-provider";
import { ORDER_STATUS_LABEL } from "@/lib/constants/order-status";

export function ActiveOrdersToolbar({
  search,
  onSearchChange,
  filteredOrders,
  filenamePrefix,
  committed,
  hasActiveFilters,
  availableStatuses,
  onApply,
  onReset,
}) {
  const { profile } = useUser();
  const isAdmin = profile?.role === "admin";

  const [localSearch, setLocalSearch] = useState(search);

  useEffect(() => {
    const id = setTimeout(() => onSearchChange(localSearch), 2000);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localSearch]);

  function handleClear() {
    setLocalSearch("");
    onSearchChange("");
  }

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div className="relative w-full sm:max-w-xs">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          placeholder="Search orders…"
          className={localSearch ? "pl-8 pr-8" : "pl-8"}
        />
        {localSearch && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            aria-label="Clear search"
          >
            <X className="size-4" />
          </button>
        )}
      </div>

      <div className="flex items-center gap-2">
        {isAdmin && <OrderFormModal />}
        <ExportCsvButton orders={filteredOrders} filenamePrefix={filenamePrefix} />
        <FilterDrawer
          committed={committed}
          hasActiveFilters={hasActiveFilters}
          onApply={onApply}
          onReset={onReset}
        >
          {(draft, setDraft) => (
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">Status</Label>
              <Select
                value={draft.status}
                onValueChange={(v) => setDraft((d) => ({ ...d, status: v }))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  {availableStatuses.map((s) => (
                    <SelectItem key={s} value={s}>
                      {ORDER_STATUS_LABEL[s] ?? s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </FilterDrawer>
      </div>
    </div>
  );
}
