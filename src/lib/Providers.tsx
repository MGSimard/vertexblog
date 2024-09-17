"use client";
import { ZIndexProvider } from "@/lib/zIndexProvider";
import { DragProvider } from "@/lib/DragProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ZIndexProvider>
      <DragProvider>{children}</DragProvider>
    </ZIndexProvider>
  );
}
