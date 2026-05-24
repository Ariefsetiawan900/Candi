"use client";

import { useEffect } from "react";
import { useUserStore } from "@/store/user-store";

export function UserProvider({ value, children }) {
  useEffect(() => {
    useUserStore.setState(value);
  }, [value]);

  return children;
}

export { useUser } from "@/store/user-store";
