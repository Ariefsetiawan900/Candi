"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OrdersTable } from "@/features/orders/orders-table";
import { OrderFormDialog } from "@/features/orders/order-form-dialog";
import { useUser } from "@/components/providers/user-provider";
import {
  ACTIVE_STATUSES,
  HISTORY_STATUSES,
} from "@/lib/constants/order-status";

export function OrdersPage({ activeOrders, historyOrders }) {
  const { profile } = useUser();
  const isAdmin = profile?.role === "admin";

  return (
    <Tabs defaultValue="active" className="space-y-4">
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
        />
      </TabsContent>
      <TabsContent value="history">
        <OrdersTable
          orders={historyOrders}
          availableStatuses={HISTORY_STATUSES}
        />
      </TabsContent>
    </Tabs>
  );
}
