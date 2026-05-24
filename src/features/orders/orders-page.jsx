"use client";

import { useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OrdersTable } from "@/features/orders/orders-table";
import { OrderFormDialog } from "@/features/orders/order-form-dialog";
import { useUser } from "@/components/providers/user-provider";
import { ACTIVE_STATUSES, HISTORY_STATUSES } from "@/lib/constants/order-status";

function useTabFilters(prefix) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const get = (key, fallback = "") =>
    searchParams.get(`${prefix}_${key}`) ?? fallback;

  const search = get("q");
  const statusFilter = get("status", "all");
  const page = Math.max(1, Number(get("page", "1")));
  const pageSize = [10, 20, 30, 40, 50].includes(Number(get("limit", "10")))
    ? Number(get("limit", "10"))
    : 10;
  const dateFrom = get("from");
  const dateTo = get("to");

  const setFilter = useCallback(
    (updates) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, val]) => {
        const urlKey = `${prefix}_${key}`;
        if (val === "" || val === null || val === undefined) {
          params.delete(urlKey);
        } else {
          params.set(urlKey, String(val));
        }
      });
      router.replace(`?${params.toString()}`, { scroll: false });
    },
    [searchParams, router, prefix]
  );

  return { search, statusFilter, page, pageSize, dateFrom, dateTo, setFilter };
}

export function OrdersPage({ activeOrders, historyOrders }) {
  const { profile } = useUser();
  const isAdmin = profile?.role === "admin";
  const searchParams = useSearchParams();
  const router = useRouter();

  const tab = searchParams.get("tab") ?? "active";

  function setTab(value) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", value);
    router.replace(`?${params.toString()}`, { scroll: false });
  }

  const activeFilters = useTabFilters("a");
  const historyFilters = useTabFilters("h");

  return (
    <Tabs value={tab} onValueChange={setTab} className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <TabsList>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>
        {isAdmin && <OrderFormDialog />}
      </div>

      <TabsContent value="active">
        <OrdersTable
          orders={activeOrders}
          availableStatuses={ACTIVE_STATUSES}
          tab="active"
          filenamePrefix="orders(active)"
          search={activeFilters.search}
          onSearchChange={(v) => activeFilters.setFilter({ q: v, page: 1 })}
          statusFilter={activeFilters.statusFilter}
          onStatusFilterChange={(v) => activeFilters.setFilter({ status: v === "all" ? "" : v, page: 1 })}
          page={activeFilters.page}
          onPageChange={(v) => activeFilters.setFilter({ page: v })}
          pageSize={activeFilters.pageSize}
          onPageSizeChange={(v) => activeFilters.setFilter({ limit: v, page: 1 })}
          onResetFilters={() => activeFilters.setFilter({ q: "", status: "", page: 1, limit: 10 })}
        />
      </TabsContent>

      <TabsContent value="history">
        <OrdersTable
          orders={historyOrders}
          availableStatuses={HISTORY_STATUSES}
          tab="history"
          filenamePrefix="orders(history)"
          search={historyFilters.search}
          onSearchChange={(v) => historyFilters.setFilter({ q: v, page: 1 })}
          statusFilter={historyFilters.statusFilter}
          onStatusFilterChange={(v) => historyFilters.setFilter({ status: v === "all" ? "" : v, page: 1 })}
          page={historyFilters.page}
          onPageChange={(v) => historyFilters.setFilter({ page: v })}
          pageSize={historyFilters.pageSize}
          onPageSizeChange={(v) => historyFilters.setFilter({ limit: v, page: 1 })}
          dateFrom={historyFilters.dateFrom}
          onDateFromChange={(v) => historyFilters.setFilter({ from: v, page: 1 })}
          dateTo={historyFilters.dateTo}
          onDateToChange={(v) => historyFilters.setFilter({ to: v, page: 1 })}
          onResetFilters={() => historyFilters.setFilter({ q: "", status: "", page: 1, limit: 10, from: "", to: "" })}
        />
      </TabsContent>
    </Tabs>
  );
}
