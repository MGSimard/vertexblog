"use server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { eq, sql, and, isNull } from "drizzle-orm";
import { db } from "@/server/db";
import { blogs, posts, userTable } from "@/server/db/schema";
import { z } from "zod";
import { lucia, validateRequest } from "@/lib/auth";
import { generateIdFromEntropySize } from "lucia";
import type { FormStatusTypes, GetBlogsResponseTypes, GetPostsResponseTypes } from "@/types/types";
import { hash, verify } from "@node-rs/argon2";

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

/* SIGN IN ACTION */
const SignInSchema = z.object({
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
});
export async function signin(currentState: FormStatusTypes, formData: FormData) {
  const { session } = await validateRequest();
  if (session) {
    throw new Error("AUTH ERROR: User is already logged in.");
  }

  // TODO: !!!!!HEAVY!!!!!!! ADD RATELIMIT, SPECIFIC TO THIS ACTION
  // if ratelimited return { success: false, message: "RATELIMIT ERROR: Too many actions." }
  const validated = SignInSchema.safeParse({
    username: formData.get("username"),
    password: formData.get("password"),
  });
  if (!validated.success) {
    return {
      success: false,
      message: "VALIDATION ERROR: Invalid fields.",
    };
  }

  const { username, password } = validated.data;

  try {
    const [existingUser] = await db
      .select()
      .from(userTable)
      .where(eq(sql`lower(${userTable.username})`, username.toLowerCase()));

    if (!existingUser) {
      throw new Error("AUTH ERROR: Invalid username or password.");
    }

    const validPassword = await verify(existingUser.passwordHash, password, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    });
    if (!validPassword) {
      throw new Error("AUTH ERROR: Invalid username or password.");
    }

    const session = await lucia.createSession(existingUser.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
  } catch (err: unknown) {
    return { success: false, message: err instanceof Error ? err.message : "UNKNOWN ERROR." };
  }

  return { success: true, message: "SUCCESS: User Signed In." };
}

export async function signout() {
  try {
    const { session } = await validateRequest();
    if (!session) {
      throw new Error("AUTH ERROR: Unauthorized");
    }
    await lucia.invalidateSession(session.id);
    const sessionCookie = lucia.createBlankSessionCookie();
    cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
  } catch (err: unknown) {
    return { success: false, message: err instanceof Error ? err.message : "UNKNOWN ERROR." };
  }

  return { success: true, message: "SUCCESS: User Signed Out." };
}

/* GET BLOGS */
export async function getBlogs(): Promise<GetBlogsResponseTypes> {
  // TODO Consider light ratelimit?
  try {
    const blogList = await db
      .select({
        blogId: blogs.id,
        blogAuthor: blogs.author,
        blogTitle: blogs.title,
        active: blogs.active,
        creationDate: blogs.createdAt,
        updateDate: blogs.updatedAt,
      })
      .from(blogs)
      .where(isNull(blogs.deletedAt));
    return { success: true, data: blogList, message: "SUCCESS: Blog list indexed." };
  } catch (err) {
    return { success: false, message: "DATABASE ERROR: Failed retrieving blogs." };
  }
}

/* GET POSTS */
export async function getPosts(currentBlog: string): Promise<GetPostsResponseTypes> {
  // TODO Consider light ratelimit?
  try {
    // GET BLOG
    const [blogInfo] = await db.select({ blogId: blogs.id }).from(blogs).where(eq(blogs.title, currentBlog));

    if (!blogInfo) throw new Error(`DATABASE ERROR: Blog not found. (${currentBlog})`);

    const postList = await db
      .select({
        postId: posts.id,
        postTitle: posts.title,
        postContent: posts.content,
        creationDate: posts.createdAt,
        updateDate: posts.updatedAt,
      })
      .from(posts)
      .where(and(eq(posts.parentBlog, blogInfo.blogId), isNull(posts.deletedAt)));

    return { success: true, data: postList, message: "SUCCESS: Blog list indexed." };
  } catch (err: unknown) {
    return { success: false, message: err instanceof Error ? err.message : "UNKNOWN ERROR." };
  }
}

/* CREATE BLOG ACTION */
const CreateBlogSchema = z.object({
  blogTitle: z
    .string()
    .trim()
    .min(1, "Blog title cannot be empty.")
    .min(4, "Blog title must be at least 4 characters long.")
    .max(60, "Blog title cannot exceed 60 characters.")
    .regex(
      /^[A-Za-z0-9]+(?: [A-Za-z0-9]+)*$/,
      "Blog title can only contain alphanumerical characters and nonconsecutive spaces."
    ),
});
export async function createBlog(currentState: FormStatusTypes, formData: FormData) {
  const { user } = await validateRequest();
  if (!user) {
    return { success: false, message: "AUTH ERROR: Unauthorized." };
  }

  // TODO: ADD RATELIMIT
  // if ratelimited return { success: false, message: "RATELIMIT ERROR: Too many actions." }

  const validated = CreateBlogSchema.safeParse({
    blogTitle: formData.get("blogTitle"),
  });
  if (!validated.success) {
    return {
      success: false,
      message: "VALIDATION ERROR: Invalid fields.",
      errors: validated.error.issues.map((issue) => issue.message),
    };
  }

  const { blogTitle } = validated.data;
  const author = user.username;

  try {
    // Existing entry conflict already handled by database.
    // 1. Blog titles have to be unique
    // 2. Only allow one not deletedAt blog entry by same user
    await db.insert(blogs).values({ author, title: blogTitle, active: false });
  } catch (err: unknown) {
    if (err instanceof Error && "code" in err && Number(err.code) === 23505) {
      return { success: false, message: "DUPLICATE ERROR: User already has a blog." };
    }
    return { success: false, message: err instanceof Error ? err.message : "UNKNOWN ERROR." };
  }

  revalidatePath(`/documents`);
  return { success: true, message: "SUCCESS: Blog created." };
}

/* CREATE BLOG POST */
/**
 *  TODO:
 *  REMOVE CONTENT PART.
 *  I FORGOT I WANTED POST CREATION TO FUNCTION LIKE TXT FILE CREATION
 *  BASICALLY, CREATE THE FILE WITH JUST TITLE
 *  I WILL HANDLE CREATING THE POST CONTENT
 *  BY THE USER OPENING THE FILE AND EDITING THE FIELD VALUE THEN SAVING
 *  THAT WILL TRIGGER A DIFFERENT SERVER ACTION *
 */
const CreatePostSchema = z.object({
  postTitle: z
    .string()
    .trim()
    .min(1, "Post title cannot be empty.")
    .max(60, "Post title cannot exceed 60 characters.")
    .regex(
      /^[A-Za-z0-9]+(?: [A-Za-z0-9]+)*$/,
      "Post title can only contain alphanumerical characters and nonconsecutive spaces."
    ),
  postContent: z.string().trim().max(40000, "Post content cannot exceed 40,000 characters."),
});
export async function createPost(currentState: FormStatusTypes, formData: FormData) {
  const { user } = await validateRequest();
  if (!user) {
    return { success: false, message: "AUTH ERROR: Unauthorized." };
  }

  // TODO: ADD RATELIMIT
  // if ratelimited return { success: false, message: "RATELIMIT ERROR: Too many actions." }

  const validated = CreatePostSchema.safeParse({
    postTitle: formData.get("postTitle"),
    postContent: formData.get("postContent"),
  });
  if (!validated.success) {
    return {
      success: false,
      message: "VALIDATION ERROR: Invalid fields.",
      errors: validated.error.issues.map((issue) => issue.message),
    };
  }

  const { postTitle, postContent } = validated.data;
  const author = user.username;

  try {
    const [blogInfo] = await db
      .select({ blogId: blogs.id, blogTitle: blogs.title })
      .from(blogs)
      .where(and(eq(blogs.author, author), isNull(blogs.deletedAt)))
      .limit(1);

    if (!blogInfo) {
      throw new Error("DATABASE ERROR: Blog doesn't exist.");
    }

    // TODO: Oh shit I forgot, add TRANSACTION, set blog active to true if not already true
    // Active just tracks if the blog has a post or not, for showing different folder icons (empty, filled)
    await db.insert(posts).values({ parentBlog: blogInfo.blogId, title: postTitle, content: postContent });
    revalidatePath(`/documents/${encodeURIComponent(blogInfo.blogTitle)}`);
  } catch (err: unknown) {
    return { success: false, message: err instanceof Error ? err.message : "UNKNOWN ERROR." };
  }
  return { success: true, message: "SUCCESS: Post added." };
}
