"use client";

import { useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OrdersTable } from "@/features/orders/orders-table";
import { OrderFormModal } from "@/features/orders/order-form-modal";
import { useUser } from "@/components/providers/user-provider";
import {
  ACTIVE_STATUSES,
  HISTORY_STATUSES,
} from "@/lib/constants/order-status";

const VALID_SIZES = [10, 25, 50, 100];

function useTabFilters(prefix) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const get = (key, fallback = "") =>
    searchParams.get(`${prefix}_${key}`) ?? fallback;

  const search = get("q");
  const statusFilter = get("status", "all");
  const page = Math.max(1, Number(get("page", "1")));
  const _limit = Number(get("limit", "50"));
  const pageSize = VALID_SIZES.includes(_limit) ? _limit : 50;
  const orderDateFrom = get("odf");
  const orderDateTo = get("odt");
  const pickupDateFrom = get("pdf");
  const pickupDateTo = get("pdt");

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

  return {
    search,
    statusFilter,
    page,
    pageSize,
    orderDateFrom,
    orderDateTo,
    pickupDateFrom,
    pickupDateTo,
    setFilter,
  };
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
        {isAdmin && <OrderFormModal />}
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
          orderDateFrom={activeFilters.orderDateFrom}
          orderDateTo={activeFilters.orderDateTo}
          pickupDateFrom={activeFilters.pickupDateFrom}
          pickupDateTo={activeFilters.pickupDateTo}
          page={activeFilters.page}
          onPageChange={(v) => activeFilters.setFilter({ page: v })}
          pageSize={activeFilters.pageSize}
          onPageSizeChange={(v) => activeFilters.setFilter({ limit: v, page: 1 })}
          onApplyFilters={(draft) =>
            activeFilters.setFilter({
              status: draft.status === "all" ? "" : draft.status,
              odf: draft.orderDateFrom,
              odt: draft.orderDateTo,
              pdf: draft.pickupDateFrom,
              pdt: draft.pickupDateTo,
              page: 1,
            })
          }
          onResetFilters={() =>
            activeFilters.setFilter({
              q: "",
              status: "",
              page: 1,
              limit: 50,
              odf: "",
              odt: "",
              pdf: "",
              pdt: "",
            })
          }
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
          orderDateFrom={historyFilters.orderDateFrom}
          orderDateTo={historyFilters.orderDateTo}
          pickupDateFrom={historyFilters.pickupDateFrom}
          pickupDateTo={historyFilters.pickupDateTo}
          page={historyFilters.page}
          onPageChange={(v) => historyFilters.setFilter({ page: v })}
          pageSize={historyFilters.pageSize}
          onPageSizeChange={(v) => historyFilters.setFilter({ limit: v, page: 1 })}
          onApplyFilters={(draft) =>
            historyFilters.setFilter({
              status: draft.status === "all" ? "" : draft.status,
              odf: draft.orderDateFrom,
              odt: draft.orderDateTo,
              pdf: draft.pickupDateFrom,
              pdt: draft.pickupDateTo,
              page: 1,
            })
          }
          onResetFilters={() =>
            historyFilters.setFilter({
              q: "",
              status: "",
              page: 1,
              limit: 50,
              odf: "",
              odt: "",
              pdf: "",
              pdt: "",
            })
          }
        />
      </TabsContent>
    </Tabs>
  );
}
