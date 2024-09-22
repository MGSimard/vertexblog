"use client";
import Link from "next/link";
import { useSort } from "@/components/SortContextProvider";
import type { GetBlogsResponseTypes } from "@/types/types";

export function BlogList({ blogList }: { blogList: GetBlogsResponseTypes }) {
  const { success, data, message } = blogList;
  const { blogSortType } = useSort();

  const test = data?.sort((a, b) => {
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

  // BY NAME (A-Z)
  // a.blogTitle.localeCompare(b.blogTitle);

  // BY LATEST UPDATE - COMPARE CREATIONDATE IF UPDATEDATE NULL
  // (b.updateDate ? b.updateDate.getTime() : b.creationDate.getTime()) - (a.updateDate ? a.updateDate.getTime() : b.creationDate.getTime())

  // BY EARLIEST CREATION:
  // a.creationDate.getTime() - b.creationDate.getTime();

  // BY LATEST CREATION:
  // b.creationDate.getTime() - a.creationDate.getTime();

  return (
    <ul className="shortcut-area">
      {/* Temporary error message */}
      {!success && message}
      {test?.map((blog) => (
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
