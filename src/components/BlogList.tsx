"use client";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useIconView } from "@/components/IconViewProvider";
import { useSort } from "@/components/SortContextProvider";
import { CreateBlogForm } from "@/components/CreateBlogForm";
import type { GetBlogsResponseTypes } from "@/types/types";

export function BlogList({ blogList }: { blogList: GetBlogsResponseTypes }) {
  const { success, data, message } = blogList;
  const { blogSortType } = useSort();
  const { iconView } = useIconView();
  const iconContainerRef = useRef<HTMLUListElement>(null);

  const [containerWidth, setContainerWidth] = useState(0);

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

  useEffect(() => {
    if (!iconContainerRef.current) return;

    const observer = new ResizeObserver(([ele]) => {
      if (ele?.target instanceof HTMLElement) {
        setContainerWidth(ele.target.clientWidth);
      }
    });
    observer.observe(iconContainerRef.current);
    setContainerWidth(iconContainerRef.current.clientWidth);

    // remove
    iconContainerRef.current.style.background = "red";

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (sortedBlogs && containerWidth && iconContainerRef.current) {
      const itemCount = sortedBlogs.length;
      const itemWidth = 80;
      const itemHeight = 80;
      const gap = 30;
      const columns = Math.floor((containerWidth + gap) / (itemWidth + gap));
      const rows = Math.ceil(itemCount / columns);

      const virtualHeight = rows * (itemHeight + gap) - gap;
      iconContainerRef.current.style.minHeight = `${virtualHeight / 10}rem`;
    }
  }, [containerWidth]);

  /** VIRTUALIZATION PLAN:
   * - Scroll container: Position relative
   * - Group items (flex subcontainer, width 100%)
   * - Make group absolute position 0,0, then translate Y using first item's intended position using its index
   * - First item should always be the matching item on the leftmost of the row, last item rightmost of last row
   * - Could decide a flat amount of items to render, could also calc how many should be rendered according to
   * container visible height and pad the top and bottom for some level of preloading like in old tilebased RPGs
   * - Get relevant index of first object to render according to current scroll position (dunno how yet)
   */

  return (
    <ul ref={iconContainerRef} className={`shortcut-area view-${iconView}`}>
      <CreateBlogForm />
      {/* Temporary error message */}
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
