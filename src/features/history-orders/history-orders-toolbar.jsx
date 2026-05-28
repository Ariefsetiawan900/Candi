"use client";

import { Search } from "lucide-react";
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
import { DateRangePicker } from "@/components/common/date-range-picker";
import { ExportCsvButton } from "@/features/orders/export-csv-button";
import { ORDER_STATUS_LABEL } from "@/lib/constants/order-status";

export function HistoryOrdersToolbar({
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
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div className="relative w-full sm:max-w-xs">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search orders…"
          className="pl-8"
        />
      </div>

      <div className="flex items-center gap-2">
        <ExportCsvButton orders={filteredOrders} filenamePrefix={filenamePrefix} />
        <FilterDrawer
          committed={committed}
          hasActiveFilters={hasActiveFilters}
          onApply={onApply}
          onReset={onReset}
        >
          {(draft, setDraft) => (
            <>
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

              <DateRangePicker
                label="Order Date"
                from={draft.orderDateFrom}
                to={draft.orderDateTo}
                onFromChange={(v) => setDraft((d) => ({ ...d, orderDateFrom: v }))}
                onToChange={(v) => setDraft((d) => ({ ...d, orderDateTo: v }))}
              />

              <DateRangePicker
                label="Pickup Date"
                from={draft.pickupDateFrom}
                to={draft.pickupDateTo}
                onFromChange={(v) => setDraft((d) => ({ ...d, pickupDateFrom: v }))}
                onToChange={(v) => setDraft((d) => ({ ...d, pickupDateTo: v }))}
              />
            </>
          )}
        </FilterDrawer>
      </div>
    </div>
  );
}
