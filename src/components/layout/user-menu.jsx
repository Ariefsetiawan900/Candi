"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Settings as SettingsIcon } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LogoutDialog } from "@/components/layout/logout-dialog";
import { useUser } from "@/components/providers/user-provider";
import { getInitials } from "@/lib/utils/initials";

export function UserMenu() {
  const router = useRouter();
  const { user, profile } = useUser();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const displayName = profile?.name || user?.email || "User";

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="relative size-9 rounded-full p-0"
            aria-label="Open user menu"
          >
            <Avatar>
              <AvatarFallback>{getInitials(displayName)}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>
            <div className="flex flex-col">
              <span className="truncate text-sm font-medium">{displayName}</span>
              <span className="truncate text-xs text-muted-foreground">
                {user?.email}
              </span>
              <span className="mt-1 text-xs text-muted-foreground capitalize">
                {profile?.role}
              </span>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => router.push("/settings")}>
            <SettingsIcon className="size-4" />
            Settings
          </DropdownMenuItem>
          <DropdownMenuItem
            variant="destructive"
            onClick={() => setConfirmOpen(true)}
          >
            <LogOut className="size-4" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <LogoutDialog open={confirmOpen} onOpenChange={setConfirmOpen} />
    </>
  );
}
