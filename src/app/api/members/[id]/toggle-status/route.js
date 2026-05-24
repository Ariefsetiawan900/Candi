import { NextResponse } from "next/server";

import { requireRole } from "@/lib/auth/require-role";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(_, { params }) {
  try {
    await requireRole("admin");
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const admin = createAdminClient();

  const { data: profile, error: fetchError } = await admin
    .from("profiles")
    .select("is_active")
    .eq("id", id)
    .single();

  if (fetchError || !profile) {
    return NextResponse.json({ error: "Member not found" }, { status: 404 });
  }

  const newStatus = !profile.is_active;

  const { error } = await admin
    .from("profiles")
    .update({ is_active: newStatus, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ is_active: newStatus });
}
