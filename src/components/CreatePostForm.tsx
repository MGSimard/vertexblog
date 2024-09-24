"use client";
import { startTransition, useActionState, useEffect } from "react";
import { createPost } from "@/server/actions";
import { useNewFile } from "@/components/NewFileContextProvider";
import { AddTxtIcon } from "@/components/icons";

export function CreatePostForm({ currentBlog }: { currentBlog: string }) {
  const { isCreatingPost, setIsCreatingPost } = useNewFile();
  const [formState, formAction, pending] = useActionState(createPost, null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    startTransition(() => formAction(formData));
  };

  const handleOffsideClick = (e: MouseEvent) => {
    if (!document.getElementById("create-post-form")?.contains(e.target as Node)) {
      setIsCreatingPost(false);
    }
  };

  useEffect(() => {
    if (formState) {
      if (formState.success) {
        setIsCreatingPost(false);
        alert("Post successfully created.");
      } else {
        if (formState.errors) alert(formState.errors);
        else alert(formState.message);
      }
    }
  }, [formState]);

  useEffect(() => {
    document.addEventListener("mousedown", handleOffsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOffsideClick);
      setIsCreatingPost(false);
    };
  }, []);

  if (isCreatingPost) {
    return (
      <li id="create-post-form" className="create-icon">
        <form onSubmit={handleSubmit} className="shortcut">
          <label htmlFor="postTitle">
            <img src="/assets/Notepad.svg" alt="Folder" />
            <fieldset>
              <input id="postTitle" name="postTitle" type="text" autoFocus spellCheck="false" maxLength={60} required />
              <button type="submit">
                <AddTxtIcon />
              </button>
            </fieldset>
            <input type="hidden" name="currentBlog" value={currentBlog} />
          </label>
        </form>
      </li>
    );
  }

  return null;
}
