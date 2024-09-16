"use client";
import { usePathname } from "next/navigation";

export function CurrentFolder() {
  const pathName = usePathname();

  const invertSlashes = (path: string) => {
    return path.split("/").join("\\");
  };

  return "Current Location";
}
