"use server";

import { revalidatePath } from "next/cache";
import { requireAuth } from "@/lib/auth/require-role";
import { createClient } from "@/lib/supabase/server";
import { TIMEZONE_OPTIONS } from "@/lib/constants/timezones";

export async function updateTimezone(timezone) {
  const valid = TIMEZONE_OPTIONS.map((o) => o.value);
  if (!valid.includes(timezone)) throw new Error("Invalid timezone");

  const { profile } = await requireAuth();
  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles")
    .update({ timezone })
    .eq("id", profile.id);

  if (error) throw new Error(error.message);
  revalidatePath("/settings");
}
