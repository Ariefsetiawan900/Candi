"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { orderSchema } from "@/lib/validations/order";
import {
  ORDER_STATUSES,
  ORDER_STATUS_LABEL,
} from "@/lib/constants/order-status";
import { todayISO } from "@/lib/utils/format-date";
import { createOrderAction } from "@/features/orders/actions";

export function OrderFormDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      customer_name: "",
      menu: "",
      package: "",
      order_date: todayISO(),
      pickup_date: todayISO(),
      quantity: 1,
      status: "pending",
    },
  });

  function onSubmit(data) {
    startTransition(async () => {
      const res = await createOrderAction(data);
      if (res?.error) {
        toast.error(res.error);
        return;
      }
      toast.success("Order created");
      reset();
      setOpen(false);
      router.refresh();
    });
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (!o) reset();
      }}
    >
      <DialogTrigger asChild>
        <Button>
          <Plus className="size-4" />
          Create order
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>New order</DialogTitle>
          <DialogDescription>
            Fill in the customer&apos;s order details.
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-3" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="space-y-1.5">
            <Label htmlFor="customer_name">Customer name</Label>
            <Input id="customer_name" {...register("customer_name")} />
            {errors.customer_name && (
              <p className="text-xs text-destructive">
                {errors.customer_name.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="menu">Menu</Label>
              <Input id="menu" {...register("menu")} />
              {errors.menu && (
                <p className="text-xs text-destructive">{errors.menu.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="package">Package</Label>
              <Input id="package" {...register("package")} />
              {errors.package && (
                <p className="text-xs text-destructive">
                  {errors.package.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="order_date">Order date</Label>
              <Input id="order_date" type="date" {...register("order_date")} />
              {errors.order_date && (
                <p className="text-xs text-destructive">
                  {errors.order_date.message}
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="pickup_date">Pickup date</Label>
              <Input id="pickup_date" type="date" {...register("pickup_date")} />
              {errors.pickup_date && (
                <p className="text-xs text-destructive">
                  {errors.pickup_date.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                {...register("quantity")}
              />
              {errors.quantity && (
                <p className="text-xs text-destructive">
                  {errors.quantity.message}
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="status">Status</Label>
              <Controller
                control={control}
                name="status"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ORDER_STATUSES.map((s) => (
                        <SelectItem key={s} value={s}>
                          {ORDER_STATUS_LABEL[s]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Creating…" : "Create order"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
