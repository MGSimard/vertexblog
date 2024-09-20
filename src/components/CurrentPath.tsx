"use client";
import { usePathname } from "next/navigation";

export function CurrentPath() {
  const pathName = usePathname();

  const invertSlashes = (path: string) => {
    const capsDocuments = path.replace(/documents/gi, "Documents");
    return decodeURIComponent(capsDocuments.split("/").join("\\"));
  };

  return <div className="address-path inset">{`C:\\VERTEXBLOG${invertSlashes(pathName)}`}</div>;
}
