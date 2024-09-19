"use client";
import { useActionState } from "react";
import { createBlog } from "@/server/actions";

export function CreateBlogForm() {
  const [formState, formAction, pending] = useActionState(createBlog, null);

  return (
    <form action={formAction}>
      Test Blog Creation:
      <label htmlFor="blogTitle">
        <input id="blogTitle" name="blogTitle" type="text" />
      </label>
      <button type="submit">Submit</button>
    </form>
  );
}
