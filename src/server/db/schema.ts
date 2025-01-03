import { sql } from "drizzle-orm";
import {
  index,
  pgTableCreator,
  serial,
  timestamp,
  varchar,
  integer,
  boolean,
  uniqueIndex,
  pgEnum,
  check,
  inet,
} from "drizzle-orm/pg-core";
import { ratelimitEnums } from "@/lib/enums";

export const createTable = pgTableCreator((name) => `vertexblog_${name}`);

export const userTable = createTable(
  "user",
  {
    id: varchar("id", { length: 16 }).primaryKey(),
    username: varchar("username", { length: 20 }).unique().notNull(),
    passwordHash: varchar("password_hash").notNull(),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
  },
  (table) => ({
    usernameUniqueIdx: uniqueIndex("username_uniqueIdx").on(sql`lower(${table.username})`),
  })
);

export const sessionTable = createTable("session", {
  id: varchar("id").primaryKey(),
  userId: varchar("user_id")
    .notNull()
    .references(() => userTable.id),
  expiresAt: timestamp("expires_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
});

export const blogs = createTable(
  "blogs",
  {
    id: serial("id").primaryKey(),
    author: varchar("author", { length: 20 })
      .notNull()
      .references(() => userTable.username),
    title: varchar("title", { length: 40 }).notNull(),
    /**
     * TODO: .default(false) & .default(sql`FALSE`) IS CURRENTLY BUGGED ON DRIZZLE AND DOES NOT WORK.
     * https://github.com/drizzle-team/drizzle-orm/issues/2559
     */
    active: boolean("active").default(false).notNull(),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
    deletedAt: timestamp("deleted_at"),
  },
  (table) => ({
    blogTitleUniqueIdx: uniqueIndex("blog_title_uniqueIdx").on(table.title),
    /* Only force uniqueness on author's "current" blog (don't include deleted ones) */
    authorBlogUniqueIdx: uniqueIndex("author_blog_uniqueIdx")
      .on(sql`lower(${table.author})`)
      .where(sql`"deleted_at" IS NULL`),
  })
);

export const posts = createTable(
  "posts",
  {
    id: serial("id").primaryKey(),
    parentBlog: integer("parent_blog")
      .notNull()
      .references(() => blogs.id),
    title: varchar("title", { length: 60 }).notNull(),
    content: varchar("content", { length: 40000 }).notNull(),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
  },
  (table) => ({
    postTitleIdx: index("post_title_idx").on(table.title),
  })
);

export const ratelimitTypeEnum = pgEnum("type", ratelimitEnums);
export const ratelimits = createTable(
  "ratelimits",
  {
    id: serial("id").primaryKey(),
    limitType: ratelimitTypeEnum("limit_type").notNull(),
    clientIP: inet("client_ip").notNull(),
    userId: varchar("user_id", { length: 20 }).references(() => userTable.id),
    actions: integer("actions").default(1).notNull(),
    expiration: timestamp("expiration")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => ({
    /* Index & Unique (User + Limit Type) combo */
    userLimitTypeUniqueIdx: uniqueIndex("user_limit_type_uniqueIdx")
      .on(table.userId, table.limitType)
      .where(sql`${table.userId} IS NOT NULL`),
    clientIPIdx: index("client_ip_idx").on(table.clientIP),
    expirationIdx: index("expiration_idx").on(table.expiration),
    checkConstraint: check("actions_check", sql`${table.actions} > 0`),
  })
);
