"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StatusBadge } from "@/components/common/status-badge";
import { formatDate } from "@/lib/utils/format-date";

function DetailField({ label, value }) {
  return (
    <div className="space-y-1">
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
        {label}
      </p>
      <p className="text-sm font-medium">{value}</p>
    </div>
  );
}

export function OrderDetail({ order }) {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <Button
        variant="ghost"
        size="sm"
        className="-ml-2 text-muted-foreground"
        onClick={() => router.back()}
      >
        <ChevronLeft className="size-4" />
        Kembali
      </Button>

      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Detail Pesanan
          </h1>
          <p className="text-sm text-muted-foreground">{order.order_no}</p>
        </div>
        <StatusBadge status={order.status} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Informasi Pesanan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <DetailField label="Nama Customer" value={order.customer_name} />
            <DetailField label="Menu" value={order.menu} />
            <DetailField label="Paket" value={order.package} />
            <DetailField label="Jumlah" value={order.quantity} />
            <DetailField
              label="Tanggal Order"
              value={formatDate(order.order_date)}
            />
            <DetailField
              label="Tanggal Pickup"
              value={formatDate(order.pickup_date)}
            />
            <DetailField
              label="Dibuat pada"
              value={formatDate(order.created_at, "dd MMM yyyy, HH:mm")}
            />
            {order.status === "completed" && (
              <DetailField
                label="Diselesaikan pada"
                value={
                  order.completed_at
                    ? formatDate(order.completed_at, "dd MMM yyyy, HH:mm")
                    : "—"
                }
              />
            )}
            {order.status === "cancelled" && (
              <DetailField
                label="Dibatalkan pada"
                value={
                  order.cancelled_at
                    ? formatDate(order.cancelled_at, "dd MMM yyyy, HH:mm")
                    : "—"
                }
              />
            )}
          </div>

          <div className="border-t pt-4 space-y-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Catatan
            </p>
            <p className="text-sm">
              {order.note || (
                <span className="text-muted-foreground italic">
                  Tidak ada catatan
                </span>
              )}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
