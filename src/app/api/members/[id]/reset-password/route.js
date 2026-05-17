import { NextResponse } from "next/server";

import { requireRole } from "@/lib/auth/require-role";
import { createAdminClient } from "@/lib/supabase/admin";
import { generatePassword } from "@/lib/utils/generate-password";

export async function POST(_request, { params }) {
  try {
    await requireRole("admin");
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  if (!id) {
    return NextResponse.json({ error: "Missing member id" }, { status: 400 });
  }

  const password = generatePassword(16);
  const admin = createAdminClient();

  const { error } = await admin.auth.admin.updateUserById(id, { password });
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ password });
}
