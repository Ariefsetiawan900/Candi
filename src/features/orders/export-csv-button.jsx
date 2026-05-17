"use client";

import { Download } from "lucide-react";
import Papa from "papaparse";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import {
  ORDER_STATUS_LABEL,
} from "@/lib/constants/order-status";
import { formatDate } from "@/lib/utils/format-date";

export function ExportCsvButton({ orders, filenamePrefix = "orders" }) {
  function onExport() {
    if (!orders?.length) return;
    const rows = orders.map((o, idx) => ({
      "#": idx + 1,
      "Order No": o.order_no,
      "Customer Name": o.customer_name,
      Menu: o.menu,
      Package: o.package,
      "Order Date": formatDate(o.order_date, "yyyy-MM-dd"),
      "Pickup Date": formatDate(o.pickup_date, "yyyy-MM-dd"),
      Quantity: o.quantity,
      Status: ORDER_STATUS_LABEL[o.status] ?? o.status,
    }));
    const csv = Papa.unparse(rows);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${filenamePrefix}-${format(new Date(), "yyyy-MM-dd")}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  return (
    <Button variant="outline" onClick={onExport} disabled={!orders?.length}>
      <Download className="size-4" />
      Export CSV
    </Button>
  );
}
