"use client";
import { useRouter } from "next/navigation";
import { startTransition, useActionState, useEffect } from "react";
import { useNewFile } from "@/components/NewFileContextProvider";
import { createBlog } from "@/server/actions";
import { dialogManager } from "@/lib/DialogManager";
import { AddFolderIcon } from "@/components/icons";

export function CreateBlogForm() {
  const router = useRouter();
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
        if (formState.url) {
          router.push(`/documents/${encodeURIComponent(formState.url)}`);
        }
      } else {
        dialogManager.showDialog({
          type: "Error",
          title: "Blog Creation",
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
