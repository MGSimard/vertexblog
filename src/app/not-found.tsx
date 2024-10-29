"use client";
import type { Metadata } from "next";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { dialogManager } from "@/lib/DialogManager";

export const metadata: Metadata = {
  title: "C:\\VERTEXBLOG\\404",
};

export default function NotFound() {
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
