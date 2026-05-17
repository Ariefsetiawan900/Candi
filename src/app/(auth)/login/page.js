import { LoginForm } from "@/features/auth/login-form";

export const metadata = { title: "Sign in — CANDI" };

export default function LoginPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-xl font-semibold">Welcome back</h1>
        <p className="text-sm text-muted-foreground">
          Sign in to manage your orders.
        </p>
      </div>
      <LoginForm />
    </div>
  );
}
