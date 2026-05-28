"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { ModalConfirm } from "@/components/common/modal-confirm";
import { OrderFormModal } from "@/features/orders/order-form-modal";
import { updateOrderStatusAction, deleteOrderAction } from "@/features/orders/actions";

export function OrderActionsCell({ order }) {
  const router = useRouter();
  const [isPendingComplete, startComplete] = useTransition();
  const [isPendingDelete, startDelete] = useTransition();
  const [editOpen, setEditOpen] = useState(false);
  const [completeOpen, setCompleteOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const canComplete = order.status !== "completed" && order.status !== "cancelled";

  function handleComplete() {
    startComplete(async () => {
      const res = await updateOrderStatusAction({ id: order.id, status: "completed" });
      if (res?.error) { toast.error(res.error); return; }
      toast.success("Order marked as completed");
      setCompleteOpen(false);
      router.refresh();
    });
  }

  function handleDelete() {
    startDelete(async () => {
      const res = await deleteOrderAction({ id: order.id });
      if (res?.error) { toast.error(res.error); return; }
      toast.success("Order deleted");
      setDeleteOpen(false);
      router.refresh();
    });
  }

  return (
    <div className="flex items-center gap-1">
      {canComplete && (
        <>
          <Button
            variant="outline"
            size="sm"
            className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 border-emerald-300 dark:hover:bg-emerald-950/30"
            onClick={() => setCompleteOpen(true)}
            disabled={isPendingComplete}
          >
            {isPendingComplete ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              "Selesaikan"
            )}
          </Button>
          <ModalConfirm
            open={completeOpen}
            onOpenChange={setCompleteOpen}
            title="Selesaikan pesanan?"
            description={<>Pesanan <strong>{order.order_no}</strong> akan ditandai sebagai <strong>Completed</strong> dan dipindahkan ke tab History.</>}
            confirmLabel="Selesaikan"
            confirmClassName="bg-emerald-600 hover:bg-emerald-700"
            onConfirm={handleComplete}
            isPending={isPendingComplete}
          />
        </>
      )}

      <Button
        variant="ghost"
        size="icon"
        className="size-8"
        aria-label="Edit order"
        onClick={() => setEditOpen(true)}
      >
        <Pencil className="size-4" />
      </Button>
      <OrderFormModal order={order} open={editOpen} onOpenChange={setEditOpen} />

      <Button
        variant="ghost"
        size="icon"
        className="size-8 text-destructive hover:text-destructive hover:bg-destructive/10"
        aria-label="Delete order"
        onClick={() => setDeleteOpen(true)}
        disabled={isPendingDelete}
      >
        <Trash2 className="size-4" />
      </Button>
      <ModalConfirm
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Hapus pesanan?"
        description={<>Pesanan <strong>{order.order_no}</strong> ({order.customer_name}) akan dihapus permanen dan tidak dapat dikembalikan.</>}
        confirmLabel="Hapus"
        confirmClassName="bg-destructive hover:bg-destructive/90"
        onConfirm={handleDelete}
        isPending={isPendingDelete}
      />
    </div>
  );
}
