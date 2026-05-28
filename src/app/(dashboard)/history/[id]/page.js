import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { OrderDetail } from "@/features/orders/order-detail";
import { HISTORY_STATUSES } from "@/lib/constants/order-status";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("orders")
    .select("order_no")
    .eq("id", id)
    .single();
  return { title: data ? `${data.order_no} — CANDI` : "Detail Order — CANDI" };
}

export default async function HistoryDetailPage({ params }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: order } = await supabase
    .from("orders")
    .select(
      "id, order_no, customer_name, menu, package, order_date, pickup_date, quantity, status, note, created_at, completed_at, cancelled_at"
    )
    .eq("id", id)
    .in("status", HISTORY_STATUSES)
    .single();

  if (!order) notFound();
  return <OrderDetail order={order} />;
}
