"use client";
import { startTransition, useActionState, useEffect } from "react";
import { useNewFile } from "@/components/NewFileContextProvider";
import { createPost } from "@/server/actions";
import { dialogManager } from "@/lib/DialogManager";
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
      } else {
        dialogManager.showDialog({
          type: "Error",
          title: "Post Creation",
          message: formState.errors ?? formState.message,
          buttons: [{ label: "OK" }],
        });
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
          <img src="/assets/Notepad.svg" alt="Folder" />
          <div>
            <input name="postTitle" type="text" autoFocus spellCheck="false" maxLength={60} required />
            <button type="submit" disabled={pending} aria-disabled={pending}>
              <AddTxtIcon />
            </button>
          </div>
          <input type="hidden" name="currentBlog" value={currentBlog} />
        </form>
      </li>
    );
  }

  return null;
}
