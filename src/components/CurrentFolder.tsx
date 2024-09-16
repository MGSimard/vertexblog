"use client";
import { usePathname } from "next/navigation";

export function CurrentFolder() {
  const pathName = usePathname();

  const invertSlashes = (path: string) => {
    return path.split("/").join("\\");
  };

  return <span>Current Location</span>;
}
