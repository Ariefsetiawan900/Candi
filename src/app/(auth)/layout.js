import Link from "next/link";

export default function AuthLayout({ children }) {
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
