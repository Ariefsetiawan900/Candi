import { ResetPasswordForm } from "@/features/auth/reset-password-form";

export const metadata = { title: "Reset password — CANDI" };

export default function ResetPasswordPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-xl font-semibold">Set a new password</h1>
        <p className="text-sm text-muted-foreground">
          Choose a new password to finish the reset.
        </p>
      </div>
      <ResetPasswordForm />
    </div>
  );
}
