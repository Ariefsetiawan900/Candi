import { MobileSidebar } from "@/components/layout/mobile-sidebar";
import { UserMenu } from "@/components/layout/user-menu";
import { ThemeToggle } from "@/components/theme/theme-toggle";

export function Header() {
  return (
    <header className="h-14 border-b bg-background flex items-center px-4 md:px-6 gap-2">
      <div className="flex items-center gap-2 md:hidden">
        <MobileSidebar />
        <span className="text-base font-semibold tracking-tight">CANDI</span>
      </div>
      <div className="ml-auto flex items-center gap-2">
        <ThemeToggle />
        <UserMenu />
      </div>
    </header>
  );
}
