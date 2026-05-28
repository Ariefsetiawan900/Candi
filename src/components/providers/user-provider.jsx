"use client";

import { useEffect } from "react";
import { useUserStore } from "@/store/user-store";
import { DEFAULT_TIMEZONE } from "@/lib/constants/timezones";

export function UserProvider({ value, children }) {
  useEffect(() => {
    useUserStore.setState({
      ...value,
      timezone: value.profile?.timezone ?? DEFAULT_TIMEZONE,
    });
  }, [value]);

  return children;
}

export { useUser } from "@/store/user-store";
