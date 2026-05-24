"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EmptyState } from "@/components/common/empty-state";
import { StatusBadge } from "@/components/common/status-badge";
import { OrderActionsCell } from "@/features/orders/order-actions-cell";
import { ExportCsvButton } from "@/features/orders/export-csv-button";
import { useDebounce } from "@/hooks/use-debounce";
import { useUser } from "@/components/providers/user-provider";
import { formatDate } from "@/lib/utils/format-date";
import { ORDER_STATUS_LABEL } from "@/lib/constants/order-status";

const PAGE_SIZE = 10;

export function OrdersTable({ orders, availableStatuses }) {
  const { profile } = useUser();
  const isAdmin = profile?.role === "admin";
  console.log("profile?.role ", profile?.role);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);

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
      const matchesStatus = statusFilter === "all" || o.status === statusFilter;
      return matchesQuery && matchesStatus;
    });
  }, [orders, debouncedSearch, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageItems = filtered.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE
  );

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center">
          <div className="relative w-full sm:max-w-xs">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search orders…"
              className="pl-8"
            />
          </div>
          <Select
            value={statusFilter}
            onValueChange={(v) => {
              setStatusFilter(v);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-full sm:w-45">
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
        <ExportCsvButton orders={filtered} />
      </div>

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
                      search || statusFilter !== "all"
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
                    {(safePage - 1) * PAGE_SIZE + idx + 1}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{o.customer_name}</span>
                      <span className="text-xs text-muted-foreground">
                        {o.order_no}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{o.menu}</TableCell>
                  <TableCell>{o.package}</TableCell>
                  <TableCell>{formatDate(o.order_date)}</TableCell>
                  <TableCell>{formatDate(o.pickup_date)}</TableCell>
                  <TableCell className="text-right tabular-nums">
                    {o.quantity}
                  </TableCell>
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

      {filtered.length > PAGE_SIZE && (
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs text-muted-foreground">
            Showing {(safePage - 1) * PAGE_SIZE + 1}–
            {Math.min(safePage * PAGE_SIZE, filtered.length)} of{" "}
            {filtered.length}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={safePage === 1}
            >
              Previous
            </Button>
            <span className="text-xs text-muted-foreground tabular-nums">
              Page {safePage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={safePage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
