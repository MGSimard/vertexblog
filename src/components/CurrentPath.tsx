"use client";
import { usePathname } from "next/navigation";

export function CurrentPath() {
  const pathName = usePathname();

  const invertSlashes = (path: string) => {
    if (path.endsWith("documents")) return "\\Documents";
    else return decodeURIComponent(path.split("/").join("\\"));
  };

  return <div className="address-path inset">{`C:\\VERTEXBLOG${invertSlashes(pathName)}`}</div>;
}
