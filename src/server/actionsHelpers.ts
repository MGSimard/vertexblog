"use server";
import { headers } from "next/headers";

export async function getClientIP() {
  // TODO: Validate this shit since it can be spoofed
  // Technically database partly handles it with inet constraint
  const headrs = await headers();
  const forwardedFor = headrs.get("x-forwarded-for");
  const realIP = headrs.get("x-real-ip");

  if (forwardedFor) {
    return forwardedFor.split(",")[0]!.trim();
  } else if (realIP) {
    return realIP.trim();
  } else {
    return "0.0.0.0";
  }
}
