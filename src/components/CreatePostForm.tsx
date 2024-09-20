"use client";
import { useActionState } from "react";
import { createPost } from "@/server/actions";

export function CreatePostForm() {
  const [formState, formAction, pending] = useActionState(createPost, null);

  return (
    <form action={formAction}>
      Test Post Creation:
      <label htmlFor="postTitle">
        Post Title
        <input id="postTitle" name="postTitle" type="text" />
      </label>
      <label htmlFor="postContent">
        Post Content
        <input id="postContent" name="postContent" type="text" />
      </label>
      <button type="submit">Submit</button>
    </form>
  );
}
