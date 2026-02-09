import * as React from "react";

import type { BottomNavContextValue } from "./types";

const BottomNavContext = React.createContext<BottomNavContextValue | null>(
  null
);

export function useBottomNav() {
  const context = React.useContext(BottomNavContext);
  if (!context) {
    throw new Error("useBottomNav must be used within BottomNavProvider");
  }
  return context;
}

export { BottomNavContext };
