"use client";

// Global "View as" role + preview state for the mockup. One role selection and
// one per-view state selection live in the AppShell top bar and flow to every
// surface via this context. Surfaces read useViewAs().role / .state instead of
// holding their own. When rendered standalone (no provider) the defaults keep
// them working as Manager with each view's default state.

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
