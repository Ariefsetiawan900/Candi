"use client";

import { useMemo } from "react";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EmptyState } from "@/components/common/empty-state";
import { StatusBadge } from "@/components/common/status-badge";
import { PaginationControls } from "@/components/common/pagination-controls";
import { FilterDrawer } from "@/components/common/filter-drawer";
import { OrderActionsCell } from "@/features/orders/order-actions-cell";
import { ExportCsvButton } from "@/features/orders/export-csv-button";
import { useDebounce } from "@/hooks/use-debounce";
import { useUser } from "@/components/providers/user-provider";
import { formatDate } from "@/lib/utils/format-date";
import { ORDER_STATUS_LABEL } from "@/lib/constants/order-status";

export function OrdersTable({
  orders,
  availableStatuses,
  tab,
  filenamePrefix,
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  page,
  onPageChange,
  pageSize,
  onPageSizeChange,
  dateFrom,
  onDateFromChange,
  dateTo,
  onDateToChange,
  onResetFilters,
}) {
  const { profile } = useUser();
  const isAdmin = profile?.role === "admin";

  const debouncedSearch = useDebounce(search, 250);

  const filtered = useMemo(() => {
    const q = debouncedSearch.trim().toLowerCase();
    return orders.filter((o) => {
      const matchesQuery =
        !q ||
        o.customer_name.toLowerCase().includes(q) ||
        o.menu.toLowerCase().includes(q) ||
        o.package.toLowerCase().includes(q) ||
        o.order_no.toLowerCase().includes(q);
      const matchesStatus =
        !statusFilter || statusFilter === "all" || o.status === statusFilter;
      const matchesFrom = !dateFrom || o.order_date >= dateFrom;
      const matchesTo = !dateTo || o.order_date <= dateTo;
      return matchesQuery && matchesStatus && matchesFrom && matchesTo;
    });
  }, [orders, debouncedSearch, statusFilter, dateFrom, dateTo]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const pageItems = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  const hasActiveFilters =
    (statusFilter && statusFilter !== "all") || !!dateFrom || !!dateTo;

  return (
    <div className="space-y-3">
      {/* Toolbar */}
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
          <ExportCsvButton orders={filtered} filenamePrefix={filenamePrefix} />
          <FilterDrawer
            hasActiveFilters={hasActiveFilters}
            onReset={onResetFilters}
          >
            {/* Status filter — both tabs */}
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">Status</Label>
              <Select
                value={statusFilter || "all"}
                onValueChange={onStatusFilterChange}
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

            {/* Date range — history tab only */}
            {tab === "history" && (
              <>
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium">Order date from</Label>
                  <Input
                    type="date"
                    value={dateFrom ?? ""}
                    onChange={(e) => onDateFromChange(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium">Order date to</Label>
                  <Input
                    type="date"
                    value={dateTo ?? ""}
                    onChange={(e) => onDateToChange(e.target.value)}
                  />
                </div>
              </>
            )}
          </FilterDrawer>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">No</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Menu</TableHead>
              <TableHead>Package</TableHead>
              <TableHead>Order Date</TableHead>
              <TableHead>Pickup Date</TableHead>
              <TableHead className="text-right">Qty</TableHead>
              <TableHead>Status</TableHead>
              {isAdmin && <TableHead>Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {pageItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={isAdmin ? 9 : 8} className="p-0">
                  <EmptyState
                    title="No orders"
                    description={
                      search || (statusFilter && statusFilter !== "all") || dateFrom || dateTo
                        ? "Try adjusting your filters."
                        : "Orders will appear here once they're created."
                    }
                  />
                </TableCell>
              </TableRow>
            ) : (
              pageItems.map((o, idx) => (
                <TableRow key={o.id}>
                  <TableCell className="text-muted-foreground">
                    {(safePage - 1) * pageSize + idx + 1}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{o.customer_name}</span>
                      <span className="text-xs text-muted-foreground">{o.order_no}</span>
                    </div>
                  </TableCell>
                  <TableCell>{o.menu}</TableCell>
                  <TableCell>{o.package}</TableCell>
                  <TableCell>{formatDate(o.order_date)}</TableCell>
                  <TableCell>{formatDate(o.pickup_date)}</TableCell>
                  <TableCell className="text-right tabular-nums">{o.quantity}</TableCell>
                  <TableCell>
                    <StatusBadge status={o.status} />
                  </TableCell>
                  {isAdmin && (
                    <TableCell>
                      <OrderActionsCell order={o} />
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <PaginationControls
        page={safePage}
        totalPages={totalPages}
        pageSize={pageSize}
        totalItems={filtered.length}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
      />
    </div>
  );
}
