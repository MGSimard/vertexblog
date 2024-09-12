import { sql } from "drizzle-orm";
import { index, pgTableCreator, serial, timestamp, varchar, integer, boolean } from "drizzle-orm/pg-core";

export const createTable = pgTableCreator((name) => `vertexblog_${name}`);

export const blogs = createTable(
  "blogs",
  {
    id: serial("id").primaryKey(),
    author: varchar("author", { length: 255 }).notNull(),
    title: varchar("title", { length: 255 }).unique().notNull(),
    active: boolean("active").default(false).notNull(),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
    deletedAt: timestamp("deleted_at"),
  },
  (table) => ({
    blogTitleIndex: index("blog_title_idx").on(table.title),
  })
);

export const posts = createTable(
  "posts",
  {
    id: serial("id").primaryKey(),
    parentBlog: integer("parent_blog")
      .notNull()
      .references(() => blogs.id),
    title: varchar("title", { length: 255 }),
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
