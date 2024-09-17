"use client";
import { createContext, useRef, useContext } from "react";

interface ZIndexContextTypes {
  incrementZIndex: () => number;
}

const ZIndexContext = createContext<ZIndexContextTypes | undefined>(undefined);

export function ZIndexContextProvider({ children }: { children: React.ReactNode }) {
  const zIndexRef = useRef(900);

  const incrementZIndex = () => {
    zIndexRef.current += 1;
    return zIndexRef.current;
  };

  return <ZIndexContext.Provider value={{ incrementZIndex }}>{children}</ZIndexContext.Provider>;
}

export function useZIndex() {
  const context = useContext(ZIndexContext);
  if (!context) {
    throw new Error("The ZIndex context must be utilized within the ZIndexContext Provider.");
  }
  return context;
}
