"use client";
import { usePathname } from "next/navigation";

export function CurrentFolder() {
  const pathName = usePathname();

  const getFinalLocation = (path: string) => {
    const split = path.split("/").pop();
    return split === "documents" ? "Documents" : split;
  };

  return <span>{decodeURIComponent(getFinalLocation(pathName)!)}</span>;
}
