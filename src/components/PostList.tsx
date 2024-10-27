"use client";
import { useState, useEffect, useRef, useMemo } from "react";
import { useIconView } from "@/components/IconViewProvider";
import { useSort } from "@/components/SortContextProvider";
import { useNewFile } from "@/components/NewFileContextProvider";
import { TextFile } from "@/components/TextFile";
import { CreatePostForm } from "@/components/CreatePostForm";
import type { GetPostsResponseTypes, PostInfoTypes } from "@/types/types";
import { useSearch } from "./SearchContextProvider";

export function PostList({ postList, currentBlog }: { postList: GetPostsResponseTypes; currentBlog: string }) {
  const { success, data, message } = postList;
  const { postSortType } = useSort();
  const { iconView } = useIconView();
  const { isCreatingPost } = useNewFile();
  const { postSearch } = useSearch();

  const containerRef = useRef<HTMLDivElement>(null);
  const iconGroupRef = useRef<HTMLUListElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);
  const [scrollPos, setScrollPos] = useState(0);
  const [renderedItems, setRenderedItems] = useState<PostInfoTypes[]>([]);

  // const tester = Array.from({ length: 1000 }, () => [...data]).flat();

  const filteredBlogs = useMemo(() => {
    if (!data) return [];
    if (!postSearch?.trim()) return data;

    const normalizedSearch = postSearch
      .trim()
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "");

    return data.filter((post) => {
      const normalizedTitle = post.postTitle
        .toLowerCase()
        .normalize("NFKD")
        .replace(/[\u0300-\u036f]/g, "");
      return normalizedTitle.includes(normalizedSearch);
    });
  }, [data, postSearch]);

  const sortedPosts = useMemo(() => {
    if (!filteredBlogs) return [];
    return [...filteredBlogs].sort((a, b) => {
      switch (postSortType) {
        case "name":
          return a.postTitle.localeCompare(b.postTitle);
        case "created":
          return a.creationDate.getTime() - b.creationDate.getTime();
        case "updated":
          return (
            (b.updateDate ? b.updateDate.getTime() : b.creationDate.getTime()) -
            (a.updateDate ? a.updateDate.getTime() : b.creationDate.getTime())
          );
        default:
          return a.postTitle.localeCompare(b.postTitle);
      }
    });
  }, [filteredBlogs, postSortType]);

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
    if (!sortedPosts || !containerWidth) return;

    const itemCount = sortedPosts.length;
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
    const startIndex = Math.max(0, itemsBeforeTop - bufferRows * columns);
    const endIndex = Math.min(sortedPosts.length - 1, itemsBeforeTop + itemsVisible + bufferRows * columns - 1);
    const itemsToRender = sortedPosts.slice(startIndex, endIndex + 1);
    setRenderedItems(itemsToRender);

    if (iconGroupRef.current) {
      iconGroupRef.current.style.top = `${(startIndex / columns) * (itemHeight + gap)}px`;
    }
  }, [sortedPosts, containerWidth, containerHeight, scrollPos, iconView]);

  useEffect(() => {
    if (isCreatingPost && containerRef.current?.parentElement) {
      containerRef.current.parentElement.scrollTo({ top: 0 });
    }
  }, [isCreatingPost]);

  return (
    <div ref={containerRef} className="spacetaker2000">
      {!success && message}
      <ul ref={iconGroupRef} className={`shortcut-area view-${iconView}`}>
        <CreatePostForm currentBlog={currentBlog} />
        {renderedItems?.map((post, index) => (
          <li key={post.postId}>
            <TextFile postInfo={post} />
          </li>
        ))}
      </ul>
    </div>
  );
}
