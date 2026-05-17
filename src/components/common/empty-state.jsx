import { Inbox } from "lucide-react";

export function EmptyState({ title = "Nothing here yet", description, icon: Icon = Inbox, action }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
      <div className="rounded-full bg-muted p-3">
        <Icon className="size-6 text-muted-foreground" />
      </div>
      <div className="space-y-1">
        <p className="text-sm font-medium">{title}</p>
        {description && (
          <p className="text-sm text-muted-foreground max-w-sm">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}
