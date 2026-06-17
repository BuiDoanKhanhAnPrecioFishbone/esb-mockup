"use client";

// Global "View as" role state for the mockup. One selection in the AppShell
// top-right pill flows to every surface via this context. Surfaces read
// useViewAs().role instead of holding their own role state. When rendered
// standalone (no provider), the default keeps them working as Manager.

import { createContext, useContext, type ReactNode } from "react";

export type ViewAsValue = { role: string; setRole: (role: string) => void };

const ViewAsContext = createContext<ViewAsValue>({
  role: "manager",
  setRole: () => {},
});

export function ViewAsProvider({
  value,
  children,
}: {
  value: ViewAsValue;
  children: ReactNode;
}) {
  return <ViewAsContext.Provider value={value}>{children}</ViewAsContext.Provider>;
}

export function useViewAs(): ViewAsValue {
  return useContext(ViewAsContext);
}
