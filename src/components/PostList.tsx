"use client";
import { useSort } from "@/components/SortContextProvider";
import type { GetPostsResponseTypes } from "@/types/types";
import { TextFile } from "@/components/TextFile";
import { CreatePostForm } from "@/components/CreatePostForm";
import { useIconView } from "@/components/IconViewProvider";

// REMOVE ANY
export function PostList({ postList, currentBlog }: { postList: GetPostsResponseTypes; currentBlog: string }) {
  const { success, data, message } = postList;
  const { postSortType } = useSort();
  const { iconView } = useIconView();

  const sortedPosts = data?.sort((a, b) => {
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

  return (
    <ul className={`shortcut-area view-${iconView}`}>
      {!success && message}
      <CreatePostForm currentBlog={currentBlog} />
      {sortedPosts?.map((post) => (
        <li key={post.postId}>
          <TextFile postInfo={post} />
        </li>
      ))}
    </ul>
  );
}
