"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserPlus } from "lucide-react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordRevealDialog } from "@/components/common/password-reveal-dialog";
import { createMemberSchema } from "@/lib/validations/member";

export function AddMemberDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [reveal, setReveal] = useState({ open: false, email: "", password: "" });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(createMemberSchema) });

  async function onSubmit(data) {
    setSubmitting(true);
    try {
      const res = await fetch("/api/members", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) {
        toast.error(json?.error || "Failed to create member");
        return;
      }
      toast.success("Member created");
      reset();
      setOpen(false);
      setReveal({ open: true, email: json.email, password: json.password });
      router.refresh();
    } catch (e) {
      toast.error(e?.message || "Network error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={(o) => {
          setOpen(o);
          if (!o) reset();
        }}
      >
        <DialogTrigger asChild>
          <Button>
            <UserPlus className="size-4" />
            Add member
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add a new member</DialogTitle>
            <DialogDescription>
              We&apos;ll create the account and generate a one-time password for
              them.
            </DialogDescription>
          </DialogHeader>

          <form className="space-y-3" onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="space-y-1.5">
              <Label htmlFor="name">Full name</Label>
              <Input id="name" {...register("name")} />
              {errors.name && (
                <p className="text-xs text-destructive">{errors.name.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...register("email")} />
              {errors.email && (
                <p className="text-xs text-destructive">{errors.email.message}</p>
              )}
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? "Creating…" : "Create member"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <PasswordRevealDialog
        open={reveal.open}
        onOpenChange={(o) => setReveal((r) => ({ ...r, open: o }))}
        email={reveal.email}
        password={reveal.password}
        title="Member account created"
      />
    </>
  );
}
