import { cookies } from "next/headers";
import { z } from "zod";
import { db } from "@/server/db";
import { userTable } from "@/server/db/schema";
import { FormStatusTypes } from "@/types/types";
import { lucia } from "@/lib/auth";
import { generateIdFromEntropySize } from "lucia";
import { hash } from "@node-rs/argon2";

/* CREATE USER - SIGN UP ACTION */
const signUpSchema = z.object({
  id: z.string().length(16), // Ignore, generateIdFromEntropySize generation in action
  username: z
    .string()
    .min(4)
    .max(20)
    .regex(/^[a-z0-9_-]+$/, "Username must only contain letters, numbers, underscores, or dashes."),
  password: z.string().min(12).max(128),
  createdAt: z.date(), // Ignore, DB auto
  updatedAt: z.date(), // Ignore, DB auto
});
const CreateUser = signUpSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export async function signup(currentState: FormStatusTypes, formData: FormData): Promise<FormStatusTypes> {
  // TODO: ADD RATELIMIT
  // if ratelimited return { success: false, message: "RATELIMIT ERROR: Too many actions." }

  const validated = CreateUser.safeParse({
    username: formData.get("username"),
    password: formData.get("password"),
  });

  if (!validated.success) {
    return { success: false, message: "VALIDATION ERROR: Invalid fields." };
  }

  const { username, password } = validated.data;

  // TODO: CHECK IF USERNAME ALREADY EXISTS IN THE DATABASE

  const passwordHash = await hash(password, {
    // recommended minimum parameters
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1,
  });
  const userId = generateIdFromEntropySize(10); // 16 characters long

  try {
    // Existing entry conflict already handled by schema unique username index
    // (throws error code 23505 if user already exists, caught by catch block)
    await db.insert(userTable).values({ id: userId, username, passwordHash });
  } catch (err: unknown) {
    if (err instanceof Error && "code" in err && Number(err.code) === 23505) {
      return { success: false, message: "DUPLICATE ERROR: User has already exists." };
    }
    return { success: false, message: err instanceof Error ? err.message : "UNKNOWN ERROR." };
  }

  const session = await lucia.createSession(userId, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
  return { success: true, message: "SUCCESS: User created." };
}
