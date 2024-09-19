"use client";
import { usePathname } from "next/navigation";

export function CurrentPath() {
  const pathName = usePathname();

  const invertSlashes = (path: string) => {
    return path.split("/").join("\\");
  };

  return <div className="address-path inset">{`C:\\VERTEXBLOG${invertSlashes(pathName)}`}</div>;
}
