import { NextResponse } from "next/server";

import { requireRole } from "@/lib/auth/require-role";
import { createAdminClient } from "@/lib/supabase/admin";
import { generatePassword } from "@/lib/utils/generate-password";
import { createMemberSchema } from "@/lib/validations/member";

export async function POST(request) {
  try {
    await requireRole("admin");
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = createMemberSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }

  const password = generatePassword(16);
  const admin = createAdminClient();

  const { data, error } = await admin.auth.admin.createUser({
    email: parsed.data.email,
    password,
    email_confirm: true,
    user_metadata: { name: parsed.data.name, role: "member" },
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({
    id: data.user.id,
    email: parsed.data.email,
    password,
  });
}
