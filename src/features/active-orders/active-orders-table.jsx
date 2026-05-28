"use client";

import { useMemo } from "react";
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
import { OrderActionsCell } from "@/features/orders/order-actions-cell";
import { ActiveOrdersToolbar } from "@/features/active-orders/active-orders-toolbar";
import { useDebounce } from "@/hooks/use-debounce";
import { useUser } from "@/components/providers/user-provider";
import { formatDate } from "@/lib/utils/format-date";

export function ActiveOrdersTable({
  orders,
  availableStatuses,
  filenamePrefix,
  search,
  onSearchChange,
  statusFilter,
  page,
  onPageChange,
  pageSize,
  onPageSizeChange,
  onApplyFilters,
  onResetFilters,
}) {
  const { profile } = useUser();
  const isAdmin = profile?.role === "admin";

  const debouncedSearch = useDebounce(search, 250);

  const committed = {
    status: statusFilter ?? "all",
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
      return matchesQuery && matchesStatus;
    });
  }, [orders, debouncedSearch, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const pageItems = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  const hasActiveFilters = !!(statusFilter && statusFilter !== "all");

  return (
    <div className="space-y-3">
      <ActiveOrdersToolbar
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
              {isAdmin && <TableHead>Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {pageItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={isAdmin ? 10 : 9} className="p-0">
                  <EmptyState
                    title="No orders"
                    description={
                      search || hasActiveFilters
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
                  <TableCell
                    className="max-w-40 truncate text-sm text-muted-foreground"
                    title={o.note ?? ""}
                  >
                    {o.note || "—"}
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
