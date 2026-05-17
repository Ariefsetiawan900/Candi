"use client";

import { useState } from "react";
import { Copy, Check, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function PasswordRevealDialog({ open, onOpenChange, email, password, title = "One-time password" }) {
  const [copied, setCopied] = useState(false);
  const [visible, setVisible] = useState(false);

  async function onCopy() {
    if (!password) return;
    await navigator.clipboard.writeText(password);
    setCopied(true);
    toast.success("Password copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            This password is shown <strong>only once</strong>. Copy it and share
            it securely with the member — it won&apos;t be retrievable later.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          {email && (
            <div className="text-sm">
              <span className="text-muted-foreground">Email: </span>
              <span className="font-medium">{email}</span>
            </div>
          )}

          <div className="flex items-center gap-2">
            <code className="flex-1 select-all rounded-md border bg-muted px-3 py-2 font-mono text-sm">
              {visible || copied ? password : "•".repeat(password?.length || 16)}
            </code>
            <Button
              variant="outline"
              size="icon"
              type="button"
              onClick={() => setVisible((v) => !v)}
              aria-label={visible ? "Hide password" : "Show password"}
            >
              {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </Button>
            <Button
              variant="outline"
              size="icon"
              type="button"
              onClick={onCopy}
              aria-label="Copy password"
            >
              {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
            </Button>
          </div>

          <Alert variant="destructive">
            <AlertDescription>
              Save this password now. It cannot be recovered once you close this
              dialog.
            </AlertDescription>
          </Alert>
        </div>

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>I&apos;ve saved it</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
