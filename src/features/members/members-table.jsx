"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/common/empty-state";
import { ResetPasswordButton } from "@/features/members/reset-password-button";
import { useDebounce } from "@/hooks/use-debounce";
import { formatDate } from "@/lib/utils/format-date";

export function MembersTable({ members }) {
  const [search, setSearch] = useState("");
  const debounced = useDebounce(search, 250);

  const filtered = useMemo(() => {
    const q = debounced.trim().toLowerCase();
    if (!q) return members;
    return members.filter(
      (m) =>
        m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q)
    );
  }, [members, debounced]);

  return (
    <div className="space-y-3">
      <div className="relative max-w-xs">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search members…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-8"
        />
      </div>

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="p-0">
                  <EmptyState
                    title="No members"
                    description="Click 'Add member' to create one."
                  />
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((m) => (
                <TableRow key={m.id}>
                  <TableCell className="font-medium">{m.name}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {m.email}
                  </TableCell>
                  <TableCell>{formatDate(m.created_at)}</TableCell>
                  <TableCell className="text-right">
                    <ResetPasswordButton
                      memberId={m.id}
                      memberEmail={m.email}
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
