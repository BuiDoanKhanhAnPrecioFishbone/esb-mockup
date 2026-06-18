"use client";

// Global "View as" role + state for the mockup. One selection in the AppShell
// top-right controls (the View-as pill + the State switcher) flows to every
// surface via this context. Surfaces read useViewAs().role / .step instead of
// holding their own. When rendered standalone (no provider), defaults keep them
// working as Manager at each view's default state.

import { createContext, useContext, type ReactNode } from "react";

export type ViewAsValue = {
  role: string;
  setRole: (role: string) => void;
  step: string;
  setStep: (step: string) => void;
};

const ViewAsContext = createContext<ViewAsValue>({
  role: "manager",
  setRole: () => {},
  step: "",
  setStep: () => {},
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
