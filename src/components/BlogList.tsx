"use client";
import Link from "next/link";
import { useSort } from "@/components/SortContextProvider";
import type { GetBlogsResponseTypes } from "@/types/types";
import { CreateBlogForm } from "@/components/CreateBlogForm";
import { useIconView } from "@/components/IconViewProvider";

export function BlogList({ blogList }: { blogList: GetBlogsResponseTypes }) {
  const { success, data, message } = blogList;
  const { blogSortType } = useSort();
  const { iconView } = useIconView();

  // TODO: Filter blogs, either server-side with search params or client-side filtering here
  // Do sortedblogs below after

  const sortedBlogs = data?.sort((a, b) => {
    switch (blogSortType) {
      case "name":
        return a.blogTitle.localeCompare(b.blogTitle);
      case "created":
        return a.creationDate.getTime() - b.creationDate.getTime();
      case "updated":
        return (
          (b.updateDate ? b.updateDate.getTime() : b.creationDate.getTime()) -
          (a.updateDate ? a.updateDate.getTime() : b.creationDate.getTime())
        );
      default:
        return a.blogTitle.localeCompare(b.blogTitle);
    }
  });

  /** TODO:
   * - Get total amount of items (length)
   * - Get shortcut-area div width dynamically
   * - According to item size, and gap, against div width, calculate intended shortcut-area height were the items rendered
   * - Set min-height of shortcut-area to that height, this simulates accurate scrollbar at all times despite items not rendered
   * - Lazyload items
   * - This fixes load performance, especially file explorer dragging, once we get past a few hundred files rendered
   */

  // Also considered rendering empty divs that still take up space to avoid this (and only render svg + text lazily)
  // Which works fine and has perfect performance up to about ~15,000 rendered blog/post shortcuts
  // Which, considering the use case of this 4fun project would be perfectly suitable
  // But I still want to do it better, AKA be able to render a near infinite amount of things and still have flawless performance

  return (
    <ul className={`shortcut-area view-${iconView}`}>
      {/* Temporary error message */}
      <CreateBlogForm />
      {!success && message}
      {sortedBlogs?.map((blog) => (
        <li key={blog.blogId}>
          <Link href={`/documents/${encodeURIComponent(blog.blogTitle)}`} className="shortcut">
            <img src={`/assets/${blog.active ? "FilledFolder" : "EmptyFolder"}.svg`} alt="Folder" />
            <span>{blog.blogTitle}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
