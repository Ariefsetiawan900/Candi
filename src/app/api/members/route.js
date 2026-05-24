import { NextResponse } from "next/server";

import { requireRole } from "@/lib/auth/require-role";
import { createAdminClient } from "@/lib/supabase/admin";
import { generatePassword } from "@/lib/utils/generate-password";
import { createMemberSchema } from "@/lib/validations/member";

// Convert full name to email-safe slug: "John Doe" → "john.doe"
function nameToSlug(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, ".");
}

// Build a unique email by checking existing auth users for conflicts.
// Tries "john.doe@member.candi.local", then "john.doe2", "john.doe3", …
async function buildUniqueEmail(name, adminClient) {
  const base = nameToSlug(name);
  const domain = "member.candi.local";

  const candidate = `${base}@${domain}`;

  // List all auth users and collect used emails with this base.
  const { data } = await adminClient.auth.admin.listUsers({ perPage: 1000 });
  const used = new Set(
    (data?.users ?? []).map((u) => u.email?.toLowerCase())
  );

  if (!used.has(candidate)) return candidate;

  // Append incrementing number until unique
  for (let i = 2; i <= 999; i++) {
    const next = `${base}${i}@${domain}`;
    if (!used.has(next)) return next;
  }

  // Fallback: append timestamp millis (virtually never needed)
  return `${base}_${Date.now()}@${domain}`;
}

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

  const admin = createAdminClient();
  const email = await buildUniqueEmail(parsed.data.name, admin);
  const password = generatePassword(16);

  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { name: parsed.data.name, role: "member" },
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({
    id: data.user.id,
    email,
    password,
  });
}
