"use client";
import { startTransition, useActionState, useEffect } from "react";
import { createBlog } from "@/server/actions";
import { useNewFile } from "./NewFileContextProvider";
import { AddFolderIcon } from "@/components/icons";

export function CreateBlogForm() {
  const { isCreatingBlog, setIsCreatingBlog } = useNewFile();
  const [formState, formAction, pending] = useActionState(createBlog, null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    startTransition(() => formAction(formData));
  };

  const handleOffsideClick = (e: MouseEvent) => {
    if (!document.getElementById("create-blog-form")?.contains(e.target as Node)) {
      setIsCreatingBlog(false);
    }
  };

  useEffect(() => {
    if (formState) {
      if (formState.success) {
        setIsCreatingBlog(false);
        alert("Blog successfully created.");
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
      setIsCreatingBlog(false);
    };
  }, []);

  if (isCreatingBlog) {
    return (
      <li id="create-blog-form" className="create-icon">
        <form onSubmit={handleSubmit} className="shortcut">
          <label htmlFor="blogTitle">
            <img src="/assets/EmptyFolder.svg" alt="Folder" />
            <fieldset>
              <input id="blogTitle" name="blogTitle" type="text" autoFocus spellCheck="false" maxLength={40} required />
              <button type="submit" disabled={pending} aria-disabled={pending}>
                <AddFolderIcon />
              </button>
            </fieldset>
          </label>
        </form>
      </li>
    );
  }

  return null;
}
