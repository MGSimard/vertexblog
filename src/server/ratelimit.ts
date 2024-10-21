"use server";
import { db } from "@/server/db";
import { eq, and } from "drizzle-orm";
import { ratelimits } from "@/server/db/schema";
import { ratelimitEnums } from "@/lib/enums";
import type { RatelimitReturnTypes } from "@/types/types";

const rateConfig = {
  auth: { actions: 5, windowMs: 60000 },
  mutation: { actions: 10, windowMs: 60000 },
  fetch: { actions: 20, windowMs: 30000 },
};

export async function ratelimit(
  user: string,
  limitType: (typeof ratelimitEnums)[number]
): Promise<RatelimitReturnTypes> {
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
        .where(and(eq(ratelimits.user, user), eq(ratelimits.limitType, limitType)));

      // If row (user + limit type) not exist, create it, return success.
      if (!entryExists) {
        await tx.insert(ratelimits).values({ user, limitType, actions: 1, expiration: newExpiration });
        return { success: true, message: `Ratelimit row created (${user}, ${limitType}).` };
      }

      if (entryExists.expiration > currTime) {
        if (entryExists.actions < config.actions) {
          // If time unexpired & available actions, increment actions, return success.
          await tx
            .update(ratelimits)
            .set({ actions: entryExists.actions + 1 })
            .where(and(eq(ratelimits.user, user), eq(ratelimits.limitType, limitType)));
          return { success: true, message: `Ratelimit passed (${user}, ${limitType}).` };
        } else {
          // Else if reached actions limit, throw error.
          throw new Error(`Ratelimited (${user}, ${limitType}).`);
        }
      } else {
        // If expired, reset action count to 1, update new expiration, return success.
        await tx
          .update(ratelimits)
          .set({ actions: 1, expiration: newExpiration })
          .where(and(eq(ratelimits.user, user), eq(ratelimits.limitType, limitType)));
        return { success: true, message: `Expired, new expiration time updated (${user}, ${limitType}).` };
      }
    });
    return result;
  } catch (err: unknown) {
    // For caught errors, return failure + error message.
    return {
      success: false,
      message: err instanceof Error ? err.message : `UNKNOWN RATELIMIT ERROR (${user}, ${limitType}).`,
    };
  }
}
