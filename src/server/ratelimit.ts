"use server";
import { db } from "@/server/db";
import { eq } from "drizzle-orm";
import { ratelimits } from "@/server/db/schema";

const actionsLimit = 10;
const actionsWindowMs = 60 * 1000;

export async function ratelimit(userId: string): Promise<boolean> {
  const currTime = new Date();
  const newExpiration = new Date(currTime.getTime() + actionsWindowMs);

  try {
    const result = await db.transaction(async (tx) => {
      // Get user's current ratelimit records
      const [entryExists] = await tx.select().from(ratelimits).where(eq(ratelimits.userId, userId));

      // If doesn't exist, create record then return false (as not ratelimited);
      if (!entryExists) {
        await tx.insert(ratelimits).values({ userId, actions: 1, expiration: newExpiration });
        return false;
      }

      if (entryExists.expiration > currTime) {
        if (entryExists.actions < actionsLimit) {
          // If within time window (unexpired) and have actions remaining, increment actions + return not ratelimited.
          await tx
            .update(ratelimits)
            .set({ actions: entryExists.actions + 1 })
            .where(eq(ratelimits.userId, userId));
          return false;
        } else {
          // Else if we've reached actions limit in time window, return ratelimited (true).
          return true;
        }
      } else {
        // If we are in a new timeWindow, reset user actions back to 1 and set a create new expiration.
        await tx.update(ratelimits).set({ actions: 1, expiration: newExpiration }).where(eq(ratelimits.userId, userId));
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
