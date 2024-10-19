"use client";
import { createContext, useState, useContext, Dispatch, SetStateAction } from "react";

interface IconViewTypes {
  iconView: string;
  setIconView: Dispatch<SetStateAction<string>>;
}

const IconViewContext = createContext<IconViewTypes | undefined>(undefined);

export function IconViewContextProvider({ children }: { children: React.ReactNode }) {
  const [iconView, setIconView] = useState("large");

  return <IconViewContext.Provider value={{ iconView, setIconView }}>{children}</IconViewContext.Provider>;
}

export function useIconView() {
  const context = useContext(IconViewContext);
  if (!context) {
    throw new Error("The icon view context must be utilized within the IconViewContext Provider.");
  }
  return context;
}
