"use client";

import { Loader2 } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

export function ModalConfirm({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Confirm",
  confirmClassName,
  onConfirm,
  isPending,
}) {
  return (
    <AlertDialog
      open={open}
      onOpenChange={(o) => { if (isPending) return; onOpenChange(o); }}
    >
      <AlertDialogContent
        onInteractOutside={(e) => { if (isPending) e.preventDefault(); }}
        onEscapeKeyDown={(e) => { if (isPending) e.preventDefault(); }}
      >
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          {description && (
            <AlertDialogDescription>{description}</AlertDialogDescription>
          )}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Batal</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isPending}
            className={cn(confirmClassName)}
          >
            {isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Memproses…
              </>
            ) : confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
