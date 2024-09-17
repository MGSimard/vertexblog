"use client";
import { createContext, useState } from "react";
/**
 * This provider is responsible for keeping track of a z-index number for the sake of window focus hierarchy & history.
 * Whenever a .window element is clicked, increment the number by 1 and set the target element's z-index to that number.
 * Better than a convoluted css class toggle hack, plus retains the correct order in which things were last focused.
 */
interface ZIndexContextTypes {
  zIndex: number;
  incrementZIndex: () => void;
}

const ZIndexContext = createContext<ZIndexContextTypes | undefined>(undefined);

export function ZIndexProvider({ children }: { children: React.ReactNode }) {
  const [zIndex, setZIndex] = useState(500);

  const incrementZIndex = () => {
    return setZIndex((prevZIndex) => prevZIndex + 1);
  };

  return <ZIndexContext.Provider value={{ zIndex, incrementZIndex }}>{children}</ZIndexContext.Provider>;
}
