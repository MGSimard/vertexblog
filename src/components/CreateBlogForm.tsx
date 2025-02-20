"use client";
import { useRouter } from "next/navigation";
import { startTransition, useActionState, useEffect, memo } from "react";
import { useNewFile } from "@/components/NewFileContextProvider";
import { createBlog } from "@/server/actions";
import { dialogManager } from "@/lib/DialogManager";
import { AddFolderIcon } from "@/components/icons";

export const CreateBlogForm = memo(function CreateBlogForm() {
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
    document.addEventListener("mousedown", handleOffsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOffsideClick);
      setIsCreatingBlog(false);
    };
  }, []);

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
          message: (
            <>
              <p>{formState.message}</p>
              {formState.errors && (
                <>
                  <br />
                  <ul>
                    {formState.errors.map((err) => (
                      <li key={err}>{err}</li>
                    ))}
                  </ul>
                </>
              )}
            </>
          ),
          buttons: [{ label: "OK" }],
        });
      }
    }
  }, [formState]);

  if (!isCreatingBlog) return null;
  return (
    <li id="create-blog-form" className="create-icon">
      <form onSubmit={handleSubmit} className="shortcut">
        <img src="/assets/EmptyFolder.svg" alt="Folder" />
        <div>
          <input
            id="create-blog-field-title"
            name="blogTitle"
            type="text"
            autoFocus
            spellCheck="false"
            maxLength={40}
            required
          />
          <button type="submit" disabled={pending} aria-disabled={pending}>
            <AddFolderIcon />
          </button>
        </div>
      </form>
    </li>
  );
});
