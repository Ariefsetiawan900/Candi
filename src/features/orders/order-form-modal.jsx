"use client";

import { useEffect, useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus } from "lucide-react";
import { toast } from "sonner";

import { Modal } from "@/components/common/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import {
  createOrderAction,
  updateOrderAction,
} from "@/features/orders/actions";

// Statuses available when editing (completed is set only via "Selesaikan" action)
const EDIT_STATUSES = ORDER_STATUSES.filter((s) => s !== "completed");

const CREATE_DEFAULTS = {
  customer_name: "",
  menu: "",
  package: "",
  order_date: todayISO(),
  pickup_date: todayISO(),
  quantity: 1,
  status: "pending",
  note: "",
};

export function OrderFormModal({ order, open: controlledOpen, onOpenChange }) {
  const isEditMode = !!order;
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [internalOpen, setInternalOpen] = useState(false);

  const open = isEditMode ? controlledOpen : internalOpen;

  function setOpen(val) {
    if (isEditMode) onOpenChange(val);
    else setInternalOpen(val);
  }

  const editDefaults = isEditMode
    ? {
        customer_name: order.customer_name,
        menu: order.menu,
        package: order.package,
        order_date: order.order_date,
        pickup_date: order.pickup_date,
        quantity: order.quantity,
        status: order.status,
        note: order.note ?? "",
      }
    : CREATE_DEFAULTS;

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(orderSchema),
    defaultValues: isEditMode ? editDefaults : CREATE_DEFAULTS,
  });

  useEffect(() => {
    if (isEditMode && open) reset(editDefaults);
  }, [open, isEditMode]); // eslint-disable-line react-hooks/exhaustive-deps

  function handleClose() {
    setOpen(false);
    reset(isEditMode ? editDefaults : CREATE_DEFAULTS);
  }

  function onSubmit(data) {
    startTransition(async () => {
      const res = isEditMode
        ? await updateOrderAction({ id: order.id, ...data })
        : await createOrderAction(data);

      if (res?.error) {
        toast.error(res.error);
        return;
      }

      toast.success(isEditMode ? "Order updated" : "Order created");
      if (!isEditMode) reset();
      setOpen(false);
      router.refresh();
    });
  }

  return (
    <>
      {!isEditMode && (
        <Button onClick={() => setInternalOpen(true)}>
          <Plus className="size-4" />
          Create order
        </Button>
      )}

      <Modal
        open={open}
        onOpenChange={(o) => {
          if (isPending) return;
          o ? setOpen(true) : handleClose();
        }}
        size="md"
        contentProps={{
          onInteractOutside: (e) => {
            if (isPending) e.preventDefault();
          },
          onEscapeKeyDown: (e) => {
            if (isPending) e.preventDefault();
          },
        }}
      >
        <Modal.Title>{isEditMode ? "Edit order" : "New order"}</Modal.Title>
        <Modal.Description>
          {isEditMode
            ? "Update the order details below."
            : "Fill in the customer's order details."}
        </Modal.Description>

        <form
          className="space-y-3"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
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
                <p className="text-xs text-destructive">
                  {errors.menu.message}
                </p>
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
              <Input
                id="pickup_date"
                type="date"
                {...register("pickup_date")}
              />
              {errors.pickup_date && (
                <p className="text-xs text-destructive">
                  {errors.pickup_date.message}
                </p>
              )}
            </div>
          </div>

          {/* Quantity always shown; Status only in edit mode */}
          <div className={isEditMode ? "grid grid-cols-2 gap-3" : ""}>
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

            {isEditMode && (
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
                        {EDIT_STATUSES.map((s) => (
                          <SelectItem key={s} value={s}>
                            {ORDER_STATUS_LABEL[s]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            )}
          </div>

          {/* Note field */}
          <div className="space-y-1.5">
            <Label htmlFor="note">
              Note{" "}
              <span className="font-normal text-muted-foreground">
                (opsional)
              </span>
            </Label>
            <Textarea
              id="note"
              rows={3}
              maxLength={100}
              placeholder="Catatan tambahan…"
              {...register("note")}
            />
            {errors.note && (
              <p className="text-xs text-destructive">{errors.note.message}</p>
            )}
          </div>

          <Modal.Footer>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  {isEditMode ? "Saving…" : "Creating…"}
                </>
              ) : isEditMode ? (
                "Save changes"
              ) : (
                "Create order"
              )}
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    </>
  );
}
