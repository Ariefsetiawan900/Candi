import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

// login, register, forgot-password redirect to / if already logged in
// reset-password is exempt (needs active session from email link)
const EXEMPT_FROM_REDIRECT = ["/auth/reset-password"];

export default async function AuthLayout({ children }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) redirect("/");

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-muted/30">
      <Link
        href="/"
        className="mb-6 text-2xl font-bold tracking-tight text-foreground"
      >
        CANDI
      </Link>
      <div className="w-full max-w-sm rounded-xl border bg-card p-6 shadow-sm">
        {children}
      </div>
    </div>
  );
}
