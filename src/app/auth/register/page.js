import { RegisterForm } from "@/features/auth/register-form";

export const metadata = { title: "Create admin — CANDI" };

export default function RegisterPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-xl font-semibold">Create admin account</h1>
        <p className="text-sm text-muted-foreground">
          Admins can manage orders and members. Members are added from the
          dashboard.
        </p>
      </div>
      <RegisterForm />
    </div>
  );
}
