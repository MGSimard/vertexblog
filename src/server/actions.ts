"use server";
import { cookies } from "next/headers";
import { z } from "zod";
import { db } from "@/server/db";
import { userTable } from "@/server/db/schema";
import { FormStatusTypes } from "@/types/types";
import { lucia } from "@/lib/auth";
import { generateIdFromEntropySize } from "lucia";
import { hash } from "@node-rs/argon2";

/* CREATE USER - SIGN UP ACTION */
const CreateUserSchema = z
  .object({
    username: z
      .string()
      .trim()
      .min(1, "Username is required.")
      .min(4, "Username must be at least 4 characters long.")
      .max(20, "Username cannot exceed 20 characters.")
      .regex(/^[A-Za-z0-9_-]+$/, "Username can only contain letters, numbers, hyphens, and underscores."),
    password: z
      .string()
      .trim()
      .min(1, "Password is required.")
      .min(12, "Password must be at least 12 characters long.")
      .max(64, "Password cannot exceed 64 characters."),
    confirmPassword: z.string().min(1, "Password confirmation is required."),
  })
  .refine(
    (values) => {
      return values.password === values.confirmPassword;
    },
    {
      message: "Passwords must match.",
      path: ["confirmPassword"],
    }
  );
export async function signup(currentState: FormStatusTypes, formData: FormData): Promise<FormStatusTypes> {
  // TODO: ADD RATELIMIT
  // if ratelimited return { success: false, message: "RATELIMIT ERROR: Too many actions." }

  const validated = CreateUserSchema.safeParse({
    username: formData.get("username"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!validated.success) {
    return {
      success: false,
      message: "VALIDATION ERROR: Invalid fields.",
      errors: validated.error.issues.map((issue) => issue.message),
    };
  }

  const { username, password } = validated.data;

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

  // Not including this in try/catch - this has no effect on the signup process.
  // If these fail user can still sign in manually afterwards, generally instinctual behaviour.
  const session = await lucia.createSession(userId, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

  return { success: true, message: "SUCCESS: User created." };
}
