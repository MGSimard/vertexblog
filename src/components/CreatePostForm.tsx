"use client";
import { useActionState } from "react";
import { createPost } from "@/server/actions";

export function CreatePostForm({ currentBlog }: { currentBlog: string }) {
  const [formState, formAction, pending] = useActionState(createPost, null);
  console.log(formState);

  return (
    <form action={formAction}>
      Test Post Creation:
      <label htmlFor="postTitle">
        Post Title
        <input id="postTitle" name="postTitle" type="text" />
      </label>
      <input type="hidden" name="currentBlog" value={currentBlog} />
      <button type="submit">Submit</button>
    </form>
  );
}
