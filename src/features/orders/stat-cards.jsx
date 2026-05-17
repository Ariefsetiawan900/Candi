import { Activity, CheckCircle2, CalendarClock } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function StatCard({ label, value, icon: Icon, hint }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {label}
        </CardTitle>
        <Icon className="size-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-semibold tracking-tight tabular-nums">
          {value}
        </div>
        {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
      </CardContent>
    </Card>
  );
}

export function StatCards({ active, completed, today }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <StatCard label="Active orders" value={active} icon={Activity} hint="Pending, processing, or ready" />
      <StatCard label="Completed orders" value={completed} icon={CheckCircle2} hint="All time" />
      <StatCard label="Today's orders" value={today} icon={CalendarClock} hint="Created today" />
    </div>
  );
}
