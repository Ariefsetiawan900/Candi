import "server-only";

import { redirect } from "next/navigation";
import { getUserWithProfile } from "@/lib/auth/get-user";

export async function requireRole(role) {
  const { user, profile } = await getUserWithProfile();
  if (!user) redirect("/auth/login");
  if (!profile || profile.role !== role) redirect("/");
  return { user, profile };
}

export async function requireAuth() {
  const { user, profile } = await getUserWithProfile();
  if (!user) redirect("/auth/login");
  return { user, profile };
}
