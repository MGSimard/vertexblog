"use client";

import { dialogManager } from "@/lib/DialogManager";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";

export default function notFound() {
  const pathName = usePathname();
  const router = useRouter();

  useEffect(() => {
    dialogManager.showDialog({
      type: "Error",
      title: "404",
      message: `Not found. (${pathName})`,
      buttons: [{ label: "OK", func: () => router.push("/") }],
    });
  }, []);

  return null;
}
