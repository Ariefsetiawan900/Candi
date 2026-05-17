"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Users, Settings } from "lucide-react";

import { cn } from "@/lib/utils";
import { useUser } from "@/components/providers/user-provider";

const ALL_ITEMS = [
  { label: "Home", href: "/", icon: Home, role: "any" },
  { label: "Members", href: "/members", icon: Users, role: "admin" },
  { label: "Settings", href: "/settings", icon: Settings, role: "any" },
];

export function SidebarNav({ onNavigate }) {
  const pathname = usePathname();
  const { profile } = useUser();
  const items = ALL_ITEMS.filter(
    (item) => item.role === "any" || profile?.role === item.role
  );

  return (
    <nav className="flex flex-col gap-1">
      {items.map((item) => {
        const Icon = item.icon;
        const active =
          item.href === "/"
            ? pathname === "/"
            : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              active
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-sidebar-foreground/70"
            )}
          >
            <Icon className="size-4" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
