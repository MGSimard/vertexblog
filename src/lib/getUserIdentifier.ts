import { headers } from "next/headers";

export async function getUserIdentifier(userId?: string) {
  const forwardedFor = (await headers()).get("x-forwarded-for");
  const realIP = (await headers()).get("x-real-ip");

  if (userId) {
    return userId;
  } else if (forwardedFor) {
    return forwardedFor.split(",")[0]!.trim();
  } else if (realIP) {
    return realIP.trim();
  } else {
    return "0.0.0.0";
  }
}
