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

  // TODO: Clean this shit up once you have a functioning feature

  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [scrollPos, setScrollPos] = useState(0);

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

  const itemCount = 3000;
  const itemWidth = 80;
  const itemHeight = 80;
  const gap = 30;
  const bufferSize = 3;

  const columns = Math.floor((containerWidth + gap) / (itemWidth + gap));
  const rows = Math.ceil(itemCount / columns);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver(([ele]) => {
      if (ele?.target instanceof HTMLElement) {
        setContainerWidth(ele.target.clientWidth);
      }
    });
    observer.observe(containerRef.current);
    setContainerWidth(containerRef.current.clientWidth);
    // remove bg later
    containerRef.current.style.background = "red";
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (sortedBlogs && containerWidth && containerRef.current) {
      const virtualHeight = rows * (itemHeight + gap) - gap;
      containerRef.current.style.height = `${virtualHeight / 10}rem`;
    }
  }, [containerWidth]);

  /** VIRTUALIZATION PLAN:
   * - Scroll container: Position relative
   * - Group items (flex subcontainer, width 100%)
   * - Make group absolute position 0,0, then translate Y using first item's intended position using its index
   * (Basically just offset Y by amount of previous rows (row height + gap))
   * - First item should always be the matching item on the leftmost of the row, last item rightmost of last row
   * - Could decide a flat amount of items to render, could also calc how many should be rendered according to
   * container visible height and pad the top and bottom for some level of preloading like in old tilebased RPGs
   * - Get relevant index of first object to render according to current scroll position (dunno how yet)
   */

  useEffect(() => {
    const scrollEle = containerRef.current?.parentElement;
    if (scrollEle) {
      scrollEle.addEventListener("scroll", () => console.log("SCROLL POS:", scrollEle.scrollTop));

      return () => {
        scrollEle.removeEventListener("scroll", () => console.log("SCROLL POS:", scrollEle.scrollTop));
      };
    }
  }, [containerRef]);

  return (
    <div ref={containerRef} className="scroll-container">
      <CreateBlogForm />
      {/* Temporary error message */}
      {!success && message}
      <ul className={`shortcut-area view-${iconView}`}>
        {Array.from({ length: 1000 }).map((_, index) =>
          sortedBlogs?.map((blog) => (
            <li key={`${blog.blogId}-${index}`}>
              <Link href={`/documents/${encodeURIComponent(blog.blogTitle)}`} className="shortcut">
                <img src={`/assets/${blog.active ? "FilledFolder" : "EmptyFolder"}.svg`} alt="Folder" />
                <span>{blog.blogTitle}</span>
              </Link>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
