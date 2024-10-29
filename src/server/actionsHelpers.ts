"use server";
import { headers } from "next/headers";

const forwardedFor = (await headers()).get("x-forwarded-for");
const realIP = (await headers()).get("x-real-ip");
export function getClientIP() {
  if (forwardedFor) {
    return forwardedFor.split(",")[0]!.trim();
  } else if (realIP) {
    return realIP.trim();
  } else {
    return "0.0.0.0";
  }
}
