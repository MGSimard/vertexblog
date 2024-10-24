"use client";
import { useState, useEffect, useRef, useMemo } from "react";
import { useIconView } from "@/components/IconViewProvider";
import { useSort } from "@/components/SortContextProvider";
import { TextFile } from "@/components/TextFile";
import { CreatePostForm } from "@/components/CreatePostForm";
import type { GetPostsResponseTypes, PostInfoTypes } from "@/types/types";

export function PostList({ postList, currentBlog }: { postList: GetPostsResponseTypes; currentBlog: string }) {
  const { success, data, message } = postList;
  const { postSortType } = useSort();
  const { iconView } = useIconView();

  const containerRef = useRef<HTMLDivElement>(null);
  const iconGroupRef = useRef<HTMLUListElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);
  const [scrollPos, setScrollPos] = useState(0);
  const [renderedItems, setRenderedItems] = useState<PostInfoTypes[]>([]);

  const sortedPosts = useMemo(() => {
    return data?.sort((a, b) => {
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
  }, [data, postSortType]);

  const itemCount = sortedPosts?.length ?? 0;
  const itemWidth = iconView === "small" ? 200 : 80;
  const itemHeight = iconView === "large" ? 80 : 18;
  const gap = iconView === "large" ? 30 : 10;
  const columns = iconView === "list" ? 1 : Math.max(1, Math.floor((containerWidth + gap) / (itemWidth + gap)));
  const rows = Math.ceil(itemCount / columns);
  const bufferRows = iconView === "large" ? 2 : 8;

  useEffect(() => {
    const scrollEle = containerRef.current?.parentElement;
    if (!scrollEle) return;
    setContainerWidth(scrollEle.clientWidth);
    setContainerHeight(scrollEle.clientHeight);
    const observer = new ResizeObserver((entries) => {
      if (entries[0]) {
        const width = entries[0].contentRect.width;
        const height = entries[0].contentRect.height;
        setContainerWidth(width);
        setContainerHeight(height);
      }
    });
    observer.observe(scrollEle);
    scrollEle.addEventListener("scroll", () => setScrollPos(scrollEle.scrollTop));
    return () => {
      observer.disconnect();
      scrollEle.removeEventListener("scroll", () => setScrollPos(scrollEle.scrollTop));
    };
  }, []);

  useEffect(() => {
    if (sortedPosts && containerWidth && containerRef.current) {
      const virtualHeight = rows * (itemHeight + gap) - gap;
      containerRef.current.style.height = `${virtualHeight / 10}rem`;
    }
  }, [containerWidth, iconView]);

  useEffect(() => {
    if (!sortedPosts) return;
    const rowsBeforeTop = Math.floor(scrollPos / (itemHeight + gap));
    const itemsBeforeTop = rowsBeforeTop * columns;
    const rowsVisible = Math.ceil(containerHeight / (itemHeight + gap)) + 1;
    const itemsVisible = rowsVisible * columns;
    const startIndex = itemsBeforeTop - bufferRows * columns < 0 ? 0 : itemsBeforeTop - bufferRows * columns;
    const endIndex =
      itemsBeforeTop + itemsVisible + bufferRows * columns > sortedPosts.length
        ? sortedPosts.length - 1
        : itemsBeforeTop + itemsVisible + bufferRows * columns;

    const itemsToRender = sortedPosts.slice(startIndex, endIndex + 1);
    setRenderedItems(itemsToRender);
    if (iconGroupRef.current) {
      iconGroupRef.current.style.top = `${(startIndex / columns) * (itemHeight + gap)}px`;
    }
  }, [scrollPos, columns, containerHeight, iconView, sortedPosts]);

  return (
    <div ref={containerRef} className="scroll-container">
      {!success && message}
      <ul ref={iconGroupRef} className={`shortcut-area view-${iconView}`}>
        <CreatePostForm currentBlog={currentBlog} />
        {renderedItems?.map((post, index) => (
          <li key={`${post.postId}-${index}`}>
            <TextFile postInfo={post} />
          </li>
        ))}
      </ul>
    </div>
  );
}
