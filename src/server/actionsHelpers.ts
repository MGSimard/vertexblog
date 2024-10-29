"use server";
import { headers } from "next/headers";

export async function getClientIP() {
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
