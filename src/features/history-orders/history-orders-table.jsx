"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
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
import { HistoryOrdersToolbar } from "@/features/history-orders/history-orders-toolbar";
import { useDebounce } from "@/hooks/use-debounce";
import { useFormatDate } from "@/hooks/use-format-date";
import { useTimezone } from "@/store/user-store";
import { formatInTz } from "@/lib/utils/format-date";

export function HistoryOrdersTable({
  orders,
  availableStatuses,
  filenamePrefix,
  search,
  onSearchChange,
  statusFilter,
  orderDateFrom,
  orderDateTo,
  pickupDateFrom,
  pickupDateTo,
  page,
  onPageChange,
  pageSize,
  onPageSizeChange,
  onApplyFilters,
  onResetFilters,
}) {
  const router = useRouter();
  const { formatTs } = useFormatDate();
  const tz = useTimezone();
  const debouncedSearch = useDebounce(search, 250);

  const committed = {
    status: statusFilter ?? "all",
    orderDateFrom: orderDateFrom ?? "",
    orderDateTo: orderDateTo ?? "",
    pickupDateFrom: pickupDateFrom ?? "",
    pickupDateTo: pickupDateTo ?? "",
  };

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
      const orderDateLocal = formatInTz(o.order_date, tz, "yyyy-MM-dd");
      const pickupDateLocal = formatInTz(o.pickup_date, tz, "yyyy-MM-dd");
      const matchesOrderFrom = !orderDateFrom || orderDateLocal >= orderDateFrom;
      const matchesOrderTo = !orderDateTo || orderDateLocal <= orderDateTo;
      const matchesPickupFrom = !pickupDateFrom || pickupDateLocal >= pickupDateFrom;
      const matchesPickupTo = !pickupDateTo || pickupDateLocal <= pickupDateTo;
      return (
        matchesQuery &&
        matchesStatus &&
        matchesOrderFrom &&
        matchesOrderTo &&
        matchesPickupFrom &&
        matchesPickupTo
      );
    });
  }, [orders, debouncedSearch, statusFilter, orderDateFrom, orderDateTo, pickupDateFrom, pickupDateTo, tz]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const pageItems = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  const hasActiveFilters =
    !!(statusFilter && statusFilter !== "all") ||
    !!orderDateFrom ||
    !!orderDateTo ||
    !!pickupDateFrom ||
    !!pickupDateTo;

  return (
    <div className="space-y-3">
      <HistoryOrdersToolbar
        key={search}
        search={search}
        onSearchChange={onSearchChange}
        filteredOrders={filtered}
        filenamePrefix={filenamePrefix}
        committed={committed}
        hasActiveFilters={hasActiveFilters}
        availableStatuses={availableStatuses}
        onApply={onApplyFilters}
        onReset={onResetFilters}
      />

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
              <TableHead>Note</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pageItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="p-0">
                  <EmptyState
                    title="No orders"
                    description={
                      search || hasActiveFilters
                        ? "Try adjusting your filters."
                        : "Completed and cancelled orders will appear here."
                    }
                  />
                </TableCell>
              </TableRow>
            ) : (
              pageItems.map((o, idx) => (
                <TableRow
                  key={o.id}
                  className="cursor-pointer"
                  onClick={() => router.push(`/history/${o.id}`)}
                >
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
                  <TableCell>{formatTs(o.order_date, "dd MMM yyyy, HH:mm")}</TableCell>
                  <TableCell>{formatTs(o.pickup_date, "dd MMM yyyy, HH:mm")}</TableCell>
                  <TableCell className="text-right tabular-nums">{o.quantity}</TableCell>
                  <TableCell>
                    <StatusBadge status={o.status} />
                  </TableCell>
                  <TableCell
                    className="max-w-40 truncate text-sm text-muted-foreground"
                    title={o.note ?? ""}
                  >
                    {o.note || "—"}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

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
