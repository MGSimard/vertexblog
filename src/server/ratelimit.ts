"use server";
import { db } from "@/server/db";
import { eq, and } from "drizzle-orm";
import { ratelimits } from "@/server/db/schema";
import { ratelimitEnums } from "@/lib/enums";

const rateConfig = {
  auth: { actions: 5, windowMs: 60000 },
  mutation: { actions: 10, windowMs: 60000 },
  fetch: { actions: 20, windowMs: 30000 },
};

export async function ratelimit(userId: string, limitType: (typeof ratelimitEnums)[number]): Promise<boolean> {
  const config = rateConfig[limitType];

  if (!config) throw new Error("Invalid ratelimit type argument.");

  const currTime = new Date();
  const newExpiration = new Date(currTime.getTime() + config.windowMs);

  try {
    const result = await db.transaction(async (tx) => {
      // Get user's current ratelimit record at limitType (auth, mutation, fetch).
      const [entryExists] = await tx
        .select()
        .from(ratelimits)
        .where(and(eq(ratelimits.userId, userId), eq(ratelimits.limitType, limitType)));

      // If doesn't exist, create record then return false (as not ratelimited).
      if (!entryExists) {
        await tx.insert(ratelimits).values({ userId, limitType, actions: 1, expiration: newExpiration });
        return false;
      }

      if (entryExists.expiration > currTime) {
        if (entryExists.actions < config.actions) {
          // If within time window (unexpired) and have actions remaining, increment actions + return not ratelimited.
          await tx
            .update(ratelimits)
            .set({ actions: entryExists.actions + 1 })
            .where(and(eq(ratelimits.userId, userId), eq(ratelimits.limitType, limitType)));
          return false;
        } else {
          // Else if we've reached actions limit in time window, return ratelimited (true).
          return true;
        }
      } else {
        // If we are in a new timeWindow, reset user actions back to 1 and set a create new expiration.
        await tx
          .update(ratelimits)
          .set({ actions: 1, expiration: newExpiration })
          .where(and(eq(ratelimits.userId, userId), eq(ratelimits.limitType, limitType)));
        return false;
      }
    });
    console.log("RESULT:", result);
    return result;
  } catch (err: unknown) {
    console.log("ERROR:", err);
    return true;
  }
}
