"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

function Modal({ open, onOpenChange, size = "md", contentProps, children }) {
  const sizeClass = {
    sm: "sm:max-w-sm",
    md: "sm:max-w-md",
    lg: "sm:max-w-lg",
    xl: "sm:max-w-xl",
    "2xl": "sm:max-w-2xl",
  }[size] ?? "sm:max-w-md";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn(sizeClass)} {...contentProps}>
        {children}
      </DialogContent>
    </Dialog>
  );
}

function ModalTitle({ className, children, ...props }) {
  return (
    <DialogHeader>
      <DialogTitle className={className} {...props}>
        {children}
      </DialogTitle>
    </DialogHeader>
  );
}

function ModalDescription({ className, children, ...props }) {
  return (
    <DialogDescription className={className} {...props}>
      {children}
    </DialogDescription>
  );
}

function ModalFooter({ className, children, ...props }) {
  return (
    <DialogFooter className={className} {...props}>
      {children}
    </DialogFooter>
  );
}

Modal.Title = ModalTitle;
Modal.Description = ModalDescription;
Modal.Footer = ModalFooter;

export { Modal };
