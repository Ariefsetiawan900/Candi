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
import { useFormatDate } from "@/hooks/use-format-date";

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
  const { formatTs } = useFormatDate();

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
              value={formatTs(order.created_at)}
            />
            {order.status === "completed" && (
              <DetailField
                label="Diselesaikan pada"
                value={formatTs(order.completed_at)}
              />
            )}
            {order.status === "cancelled" && (
              <DetailField
                label="Dibatalkan pada"
                value={formatTs(order.cancelled_at)}
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
