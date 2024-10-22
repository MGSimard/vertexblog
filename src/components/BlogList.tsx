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

    return () => observer.disconnect();
  }, []);

  /** PROPOSED FORMULA:
   * Variables:
   * - Container Width
   * - Item Count
   * - Item Width & Height
   * - Item Gap
   *
   * Total Columns: (CWidth + Igap) / (IWidth + IGap) = Columns (Round down)
   * Total Rows: ICount / Columns = Rows (Round Up)
   *
   * Container Height: ((IHeight + Gap) * Rows) - Gap = Container Height
   * Set as min-height just to be sure
   */

  useEffect(() => {
    if (sortedBlogs) {
      const itemCount = sortedBlogs.length;
      const itemWidth = 80;
      const itemHeight = 80;
      const gap = 30;
      const columns = Math.floor((containerWidth + gap) / (itemWidth + gap));
      const rows = Math.ceil(itemCount / columns);

      const virtualHeight = rows * (itemHeight + gap) - gap;
      console.log("CONTAINER WIDTH:", containerWidth);
      console.log("COLUMNS:", columns);
      console.log("ROWS:", rows);
      console.log("VIRTUAL HEIGHT:", virtualHeight);
    }

    // When containerwidth changes, adjust min-height of container.
  }, [containerWidth]);

  return (
    <ul ref={iconContainerRef} className={`shortcut-area view-${iconView}`}>
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
