import { requireAuth } from "@/lib/auth/require-role";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { UserProvider } from "@/components/providers/user-provider";

export default async function DashboardLayout({ children }) {
  const { user, profile } = await requireAuth();

  const safeUser = user
    ? { id: user.id, email: user.email }
    : null;

  return (
    <UserProvider value={{ user: safeUser, profile }}>
      <div className="min-h-screen flex bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <Header />
          <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </UserProvider>
  );
}
