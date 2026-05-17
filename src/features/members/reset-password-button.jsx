"use client";

import { useState } from "react";
import { KeyRound } from "lucide-react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { PasswordRevealDialog } from "@/components/common/password-reveal-dialog";

export function ResetPasswordButton({ memberId, memberEmail }) {
  const [submitting, setSubmitting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [reveal, setReveal] = useState({ open: false, password: "" });

  async function onConfirm(e) {
    // Prevent the dialog from auto-closing on action so we can keep the password modal open.
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch(`/api/members/${memberId}/reset-password`, {
        method: "POST",
      });
      const json = await res.json();
      if (!res.ok) {
        toast.error(json?.error || "Failed to reset password");
        return;
      }
      setConfirmOpen(false);
      setReveal({ open: true, password: json.password });
    } catch (err) {
      toast.error(err?.message || "Network error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogTrigger asChild>
          <Button variant="outline" size="sm">
            <KeyRound className="size-4" />
            Reset password
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reset member password?</AlertDialogTitle>
            <AlertDialogDescription>
              A new password will be generated for <strong>{memberEmail}</strong>.
              Their current password will stop working immediately.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={submitting}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onConfirm} disabled={submitting}>
              {submitting ? "Resetting…" : "Reset password"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <PasswordRevealDialog
        open={reveal.open}
        onOpenChange={(o) => setReveal((r) => ({ ...r, open: o }))}
        email={memberEmail}
        password={reveal.password}
        title="New password generated"
      />
    </>
  );
}
