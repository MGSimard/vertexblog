import { Portal } from "@/components/Portal";

export function Modal({ isOpen, children }: { isOpen: boolean; children: React.ReactNode }) {
  if (!isOpen) return null;

  return <Portal>{children}</Portal>;
}
