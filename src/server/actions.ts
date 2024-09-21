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
        parentBlog: posts.parentBlog,
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
    if (err instanceof Error && "constraint" in err) {
      if (err.constraint === "blog_title_uniqueIdx") {
        return { success: false, message: "DUPLICATE ERROR: This blog title is taken." };
      } else if (err.constraint === "blog_title_uniqueIdx") {
        return { success: false, message: "DUPLICATE ERROR: User already has a blog." };
      }
    }
    return { success: false, message: err instanceof Error ? err.message : "UNKNOWN ERROR." };
  }
  revalidatePath(`/documents`);
  return { success: true, message: "SUCCESS: Blog created." };
}

/* CREATE BLOG POST */
const CreatePostSchema = z.object({
  targetBlog: z.string().trim().max(60),
  postTitle: z
    .string()
    .trim()
    .min(1, "Post title cannot be empty.")
    .max(60, "Post title cannot exceed 60 characters.")
    .regex(
      /^[A-Za-z0-9]+(?: [A-Za-z0-9]+)*$/,
      "Post title can only contain alphanumerical characters and nonconsecutive spaces."
    ),
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
    targetBlog: formData.get("currentBlog"),
  });
  if (!validated.success) {
    return {
      success: false,
      message: "VALIDATION ERROR: Invalid fields.",
      errors: validated.error.issues.map((issue) => issue.message),
    };
  }

  const { postTitle, targetBlog } = validated.data;
  const author = user.username;

  try {
    await db.transaction(async (tx) => {
      const [blogInfo] = await tx
        .update(blogs)
        .set({ active: true })
        .where(and(eq(blogs.title, targetBlog), eq(blogs.author, author), isNull(blogs.deletedAt)))
        .returning({ blogId: blogs.id, blogTitle: blogs.title });

      if (!blogInfo) {
        throw new Error("AUTH ERROR: User is not authorized, or blog no longer exists.");
      }

      await db.insert(posts).values({ parentBlog: blogInfo.blogId, title: postTitle, content: "" });
      revalidatePath(`/documents/${encodeURIComponent(blogInfo.blogTitle)}`);
    });
  } catch (err: unknown) {
    return { success: false, message: err instanceof Error ? err.message : "UNKNOWN ERROR." };
  }
  return { success: true, message: "SUCCESS: Post added." };
}

const SavePostSchema = z.object({
  postId: z.number().int().positive().lte(2147483647),
  postContent: z.string().trim().max(40000, "Post content cannot exceed 40,000 characters."),
});
export async function savePost(inputId: number, inputText: string | undefined) {
  if (inputText === undefined) {
    return { success: false, message: "INPUT ERROR: Input not recognized." };
  }

  const { user } = await validateRequest();
  if (!user) {
    return { success: false, message: "AUTH ERROR: Unauthorized." };
  }

  // TODO: ADD RATELIMIT
  // if ratelimited return { success: false, message: "RATELIMIT ERROR: Too many actions." }

  const validated = SavePostSchema.safeParse({
    postId: inputId,
    postContent: inputText,
  });
  if (!validated.success) {
    return {
      success: false,
      message: "VALIDATION ERROR: Invalid fields.",
      errors: validated.error.issues.map((issue) => issue.message),
    };
  }

  const { postId, postContent } = validated.data;
  const author = user.username;

  try {
    console.log("This would try for savepost, checks passed:", validated.data);
    // Use postId
    // Find postId in posts, get parentBlog and content
    // look at parentBlog, get author
    // const [result] = await db.select({}).from().where();
    // If post doesn't exist throw error (deletedAt isNotNull)
    // If blog doesn't exist throw error (deletedAt isNotNull)
    // If not original author throw error (author doesn't match)
    // If post content is identical (is it really a good idea to fuckin crosscheck 40k char long strings?)
    // Maybe I just do the field dirtying thing on the front end only and if they want to fuck with it
    // In inspect element I say whatever and let them push identical text on save anyways?
    /**
     * 1. Check if person saving is original author (and if post exists at same time)
     * 2. Check if blog we're saving to exists (Even with foreign key, we soft-delete blogs,
     *    so blog can still technically not "exist" - therefore checking post presence is not enough.)
     * 3. If checks pass, update the post

     */
  } catch (err: unknown) {
    return { success: false, message: err instanceof Error ? err.message : "UNKNOWN ERROR." };
  }
  return { success: true, message: "SUCCESS: Post saved." };
}
