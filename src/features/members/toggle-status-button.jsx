"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { ModalConfirm } from "@/components/common/modal-confirm";

export function ToggleStatusButton({ memberId, memberName, isActive }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleConfirm(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch(`/api/members/${memberId}/toggle-status`, {
        method: "POST",
      });
      const json = await res.json();
      if (!res.ok) {
        toast.error(json?.error || "Failed to update status");
        return;
      }
      toast.success(json.is_active ? "Member activated" : "Member deactivated");
      setOpen(false);
      router.refresh();
    } catch (e) {
      toast.error(e?.message || "Network error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setOpen(true)}
        className={
          isActive
            ? "text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/30"
            : "text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 border-emerald-300 dark:hover:bg-emerald-950/30"
        }
      >
        {isActive ? "Nonaktifkan" : "Aktifkan"}
      </Button>

      <ModalConfirm
        open={open}
        onOpenChange={setOpen}
        title={isActive ? "Nonaktifkan member?" : "Aktifkan member?"}
        description={
          isActive ? (
            <>
              Akun <strong>{memberName}</strong> akan dinonaktifkan dan tidak
              bisa login.
            </>
          ) : (
            <>
              Akun <strong>{memberName}</strong> akan diaktifkan kembali.
            </>
          )
        }
        confirmLabel={isActive ? "Nonaktifkan" : "Aktifkan"}
        confirmClassName={
          isActive
            ? "bg-destructive hover:bg-destructive/90"
            : "bg-emerald-600 hover:bg-emerald-700"
        }
        onConfirm={handleConfirm}
        isPending={submitting}
      />
    </>
  );
}
