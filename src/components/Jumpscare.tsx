"use client";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { dialogManager } from "@/lib/DialogManager";

export function Jumpscare() {
  const pathName = usePathname();
  const router = useRouter();
  useEffect(() => {
    dialogManager.showDialog({
      type: "Error",
      title: "404",
      message: <p>Not found. ({pathName})</p>,
      buttons: [{ label: "OK", func: () => router.push("/") }],
    });
  }, []);
  return null;
}
