"use client";

import { createContext, useContext } from "react";

const UserContext = createContext({ user: null, profile: null });

export function UserProvider({ value, children }) {
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  return useContext(UserContext);
}
