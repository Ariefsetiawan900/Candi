"use client";

import { Menu } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import { useUiStore } from "@/store/ui-store";

export function MobileSidebar() {
  const { mobileSidebarOpen, setMobileSidebarOpen } = useUiStore();

  return (
    <Sheet open={mobileSidebarOpen} onOpenChange={setMobileSidebarOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          aria-label="Open menu"
        >
          <Menu className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 p-0 bg-sidebar">
        <SheetHeader className="h-14 border-b px-6 justify-center">
          <SheetTitle className="text-base font-semibold">CANDI</SheetTitle>
        </SheetHeader>
        <div className="p-3">
          <SidebarNav onNavigate={() => setMobileSidebarOpen(false)} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
