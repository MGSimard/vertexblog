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
  unique,
} from "drizzle-orm/pg-core";

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
  "blog",
  {
    id: serial("id").primaryKey(),
    author: varchar("author", { length: 20 })
      .notNull()
      .references(() => userTable.username),
    title: varchar("title", { length: 255 }).notNull(),
    active: boolean("active").default(false).notNull(),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
    deletedAt: timestamp("deleted_at"),
  },
  (table) => ({
    blogTitleUniqueIndex: uniqueIndex("blog_title_uniqueIdx").on(table.title),
  })
);

export const posts = createTable(
  "post",
  {
    id: serial("id").primaryKey(),
    parentBlog: integer("parent_blog")
      .notNull()
      .references(() => blogs.id),
    title: varchar("title", { length: 255 }).notNull(),
    content: varchar("content", { length: 40000 }).notNull(),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
    deletedAt: timestamp("deleted_at"),
  },
  (table) => ({
    postTitleIndex: index("post_title_idx").on(table.title),
  })
);
