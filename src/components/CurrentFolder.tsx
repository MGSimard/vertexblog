"use client";
import { usePathname } from "next/navigation";

export function CurrentFolder() {
  const pathName = usePathname();

  const getFinalLocation = (path: string) => {
    const split = path.split("/");
    return split[split.length - 1];
  };

  return <span>{decodeURIComponent(getFinalLocation(pathName)!)}</span>;
}
