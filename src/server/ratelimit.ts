"use server";
import { db } from "@/server/db";
import { eq, and, isNull } from "drizzle-orm";
import { ratelimits } from "@/server/db/schema";
import type { RatelimitReturnTypes } from "@/types/types";
import type { ratelimitEnums } from "@/lib/enums";

const rateConfig = {
  auth: { actions: 3, windowMs: 60000 },
  mutation: { actions: 10, windowMs: 60000 },
  fetch: { actions: 15, windowMs: 30000 },
};

export async function ratelimit(
  limitType: (typeof ratelimitEnums)[number],
  clientIP: string,
  userId?: string
): Promise<RatelimitReturnTypes> {
  const config = rateConfig[limitType];

  if (!config) throw new Error("ERROR: Invalid ratelimit type argument.");

  const currTime = new Date();
  const newExpiration = new Date(currTime.getTime() + config.windowMs);

  try {
    const result = await db.transaction(async (tx) => {
      // Get user's current ratelimit record at limitType (auth, mutation, fetch).
      // Get by userId if present, otherwise get by clientIP where no userID.
      const [entryExists] = await tx
        .select()
        .from(ratelimits)
        .where(
          and(
            userId ? eq(ratelimits.userId, userId) : and(eq(ratelimits.clientIP, clientIP), isNull(ratelimits.userId)),
            eq(ratelimits.limitType, limitType)
          )
        );

      // If row (user + limit type) not exist, create it, return success.
      // Create as clientIP is no userId - else create as clientIP + userId
      if (!entryExists) {
        await tx
          .insert(ratelimits)
          .values({ clientIP, userId: userId ?? null, limitType, actions: 1, expiration: newExpiration });
        return { success: true, message: `Ratelimit row created.` };
      }

      if (entryExists.expiration > currTime) {
        if (entryExists.actions < config.actions) {
          // If time unexpired & available actions, increment actions, return success.
          // If no userId update where clientIP & userId is null, otherwise update where clientId
          await tx
            .update(ratelimits)
            .set({ clientIP, actions: entryExists.actions + 1 })
            .where(
              and(
                userId
                  ? eq(ratelimits.userId, userId)
                  : and(eq(ratelimits.clientIP, clientIP), isNull(ratelimits.userId)),
                eq(ratelimits.limitType, limitType)
              )
            );

          return { success: true, message: `SUCCESS: Ratelimit passed.` };
        } else {
          // Else if reached actions limit, throw error.
          throw new Error(`ERROR: Ratelimited.`);
        }
      } else {
        // If expired, reset action count to 1, update new expiration, return success.
        // If no userId update where clientIP & userId is null, otherwise update where clientId
        await tx
          .update(ratelimits)
          .set({ clientIP, actions: 1, expiration: newExpiration })
          .where(
            and(
              userId
                ? eq(ratelimits.userId, userId)
                : and(eq(ratelimits.clientIP, clientIP), isNull(ratelimits.userId)),
              eq(ratelimits.limitType, limitType)
            )
          );
        return { success: true, message: `Expired, new expiration time updated.` };
      }
    });
    return result;
  } catch (err: unknown) {
    // For caught errors, return failure + error message.
    return {
      success: false,
      message: err instanceof Error ? err.message : `UNKNOWN RATELIMIT ERROR.`,
    };
  }
}
