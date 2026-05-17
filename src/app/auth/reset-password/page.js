import Link from "next/link";

import { ResetPasswordForm } from "@/features/auth/reset-password-form";

export const metadata = { title: "Reset password — CANDI" };

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-muted/30">
      <Link
        href="/"
        className="mb-6 text-2xl font-bold tracking-tight text-foreground"
      >
        CANDI
      </Link>
      <div className="w-full max-w-sm rounded-xl border bg-card p-6 shadow-sm space-y-6">
        <div className="space-y-1">
          <h1 className="text-xl font-semibold">Set a new password</h1>
          <p className="text-sm text-muted-foreground">
            Choose a new password to finish the reset.
          </p>
        </div>
        <ResetPasswordForm />
      </div>
    </div>
  );
}
