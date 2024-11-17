import { Jumpscare } from "@/components/Jumpscare";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "C:\\VERTEXBLOG\\404",
};

export default function NotFound() {
  return <Jumpscare />;
}
