"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { forgotPasswordSchema } from "@/lib/validations/auth";
import { forgotPasswordAction } from "@/features/auth/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ForgotPasswordForm() {
  const [isPending, startTransition] = useTransition();
  const [sent, setSent] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(forgotPasswordSchema) });

  function onSubmit(data) {
    startTransition(async () => {
      const res = await forgotPasswordAction(data);
      if (res?.error) {
        toast.error(res.error);
        return;
      }
      setSent(true);
      toast.success("Check your inbox for a reset link.");
    });
  }

  if (sent) {
    return (
      <div className="space-y-4 text-center text-sm">
        <p className="text-muted-foreground">
          If an account exists for that email, a reset link has been sent.
        </p>
        <Link
          href="/login"
          className="inline-block font-medium text-foreground hover:underline"
        >
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="space-y-1.5">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          {...register("email")}
        />
        {errors.email && (
          <p className="text-xs text-destructive">{errors.email.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "Sending…" : "Send reset link"}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        <Link href="/login" className="hover:underline">
          Back to sign in
        </Link>
      </p>
    </form>
  );
}
