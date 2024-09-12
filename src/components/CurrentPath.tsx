"use client";
import { usePathname } from "next/navigation";

export function CurrentPath() {
  const pathName = usePathname();

  const invertSlashes = (path: string) => {
    return path.split("/").join("\\");
  };

  return <input type="input" className="inset" value={`C:\\VertexBlog${invertSlashes(pathName)}`} disabled />;
}
