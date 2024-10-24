"use client";
import Link from "next/link";
import { useState, useEffect, useRef, useMemo } from "react";
import { useIconView } from "@/components/IconViewProvider";
import { useSort } from "@/components/SortContextProvider";
import { CreateBlogForm } from "@/components/CreateBlogForm";
import type { GetBlogsResponseTypes, BlogInfoTypes } from "@/types/types";

export function BlogList({ blogList }: { blogList: GetBlogsResponseTypes }) {
  const { success, data, message } = blogList;
  const { blogSortType } = useSort();
  const { iconView } = useIconView();

  const containerRef = useRef<HTMLDivElement>(null);
  const iconGroupRef = useRef<HTMLUListElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);
  const [scrollPos, setScrollPos] = useState(0);
  const [renderedItems, setRenderedItems] = useState<BlogInfoTypes[]>([]);

  // const tester = Array.from({ length: 1000 }, () => [...data]).flat();

  const sortedBlogs = useMemo(() => {
    if (!data) return [];
    return [...data].sort((a, b) => {
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
  }, [data, blogSortType]);

  useEffect(() => {
    const scrollEle = containerRef.current?.parentElement;
    if (!scrollEle) return;

    setContainerWidth(scrollEle.clientWidth);
    setContainerHeight(scrollEle.clientHeight);

    let scrollTimeout: number;
    const handleScroll = () => {
      if (scrollTimeout) clearTimeout(scrollTimeout);
      scrollTimeout = window.setTimeout(() => {
        setScrollPos(scrollEle.scrollTop);
      }, 100);
    };
    const observer = new ResizeObserver((entries) => {
      if (entries[0]) {
        const width = entries[0].contentRect.width;
        const height = entries[0].contentRect.height;
        setContainerWidth(width);
        setContainerHeight(height);
      }
    });
    observer.observe(scrollEle);
    scrollEle.addEventListener("scroll", handleScroll);

    return () => {
      observer.disconnect();
      scrollEle.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (!sortedBlogs || !containerWidth) return;

    const itemCount = sortedBlogs.length;
    const itemWidth = iconView === "small" ? 200 : 80;
    const itemHeight = iconView === "large" ? 80 : 18;
    const gap = iconView === "large" ? 30 : 10;
    const columns = iconView === "list" ? 1 : Math.max(1, Math.floor((containerWidth + gap) / (itemWidth + gap)));
    const rows = Math.ceil(itemCount / columns);
    const bufferRows = iconView === "large" ? 2 : 8;

    if (containerRef.current) {
      const virtualHeight = rows * (itemHeight + gap) - gap;
      containerRef.current.style.height = `${virtualHeight / 10}rem`;
    }

    const rowsBeforeTop = Math.floor(scrollPos / (itemHeight + gap));
    const itemsBeforeTop = rowsBeforeTop * columns;
    const rowsVisible = Math.ceil(containerHeight / (itemHeight + gap)) + 1;
    const itemsVisible = rowsVisible * columns;
    // Adjust the calculation for start and end indexes
    const startIndex = Math.max(0, itemsBeforeTop - bufferRows * columns);

    // Adjust endIndex to ensure we capture the last item but avoid rendering extra items on a new row
    const endIndex = Math.min(sortedBlogs.length - 1, itemsBeforeTop + itemsVisible + bufferRows * columns - 1);

    // Slice the array from startIndex to endIndex (inclusive)
    const itemsToRender = sortedBlogs.slice(startIndex, endIndex + 1);
    setRenderedItems(itemsToRender);

    if (iconGroupRef.current) {
      iconGroupRef.current.style.top = `${(startIndex / columns) * (itemHeight + gap)}px`;
    }
  }, [sortedBlogs, containerWidth, containerHeight, scrollPos, iconView]);

  return (
    <div ref={containerRef} className="scroll-container">
      {!success && message}
      <ul ref={iconGroupRef} className={`shortcut-area view-${iconView}`}>
        <CreateBlogForm />
        {/* TODO: Remove index thing once done simulating duplicated blogs for count perf test */}
        {renderedItems?.map((blog, index) => (
          <li key={`${blog.blogId}-${index}`}>
            <Link href={`/documents/${encodeURIComponent(blog.blogTitle)}`} className="shortcut">
              <img src={`/assets/${blog.active ? "FilledFolder" : "EmptyFolder"}.svg`} alt="Folder" />
              <span>{blog.blogTitle}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
