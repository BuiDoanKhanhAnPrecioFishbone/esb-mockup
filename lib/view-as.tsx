"use client";

// Global "View as" state for the mockup. The AppShell top-right controls (role
// pill + state switcher) write here; every surface reads from here so one
// selection flows to the whole app. `role` = which persona you're viewing as;
// `state` = which case of the current view to show (lifecycle step, dashboard
// flow state, etc). When rendered standalone (no provider) the defaults keep
// surfaces working as Manager at their default state.

import { createContext, useContext, type ReactNode } from "react";

export type ViewAsValue = {
  role: string;
  setRole: (role: string) => void;
  state: string;
  setState: (state: string) => void;
};

const ViewAsContext = createContext<ViewAsValue>({
  role: "manager",
  setRole: () => {},
  state: "",
  setState: () => {},
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
