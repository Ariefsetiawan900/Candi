"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth/require-role";
import { orderSchema } from "@/lib/validations/order";
import { ORDER_STATUSES } from "@/lib/constants/order-status";

export async function createOrderAction(formData) {
  const { user } = await requireRole("admin");

  const parsed = orderSchema.safeParse(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("orders")
    .insert({ ...parsed.data, created_by: user.id });

  if (error) return { error: error.message };

  revalidatePath("/");
  return { ok: true };
}

export async function updateOrderStatusAction({ id, status }) {
  await requireRole("admin");

  if (!ORDER_STATUSES.includes(status)) {
    return { error: "Invalid status" };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/");
  return { ok: true };
}
