"use client";
import Link from "next/link";
import { useState, useEffect, type Dispatch, type SetStateAction } from "react";
import { useNewFile } from "@/components/NewFileContextProvider";
import { deleteBlog } from "@/server/actions";
import { dialogManager } from "@/lib/DialogManager";
import { useRouter } from "next/navigation";

export function PostsFileButton({ blog }: { blog: string }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <span className="fe-btn-relative">
      <button
        id="posts-file-button"
        type="button"
        className={menuOpen ? "isActive" : ""}
        aria-haspopup="menu"
        aria-expanded={menuOpen}
        aria-controls="posts-file-menu"
        onClick={() => setMenuOpen(!menuOpen)}>
        File
      </button>
      {menuOpen && <PostsFileMenu setMenuOpen={setMenuOpen} blog={blog} />}
    </span>
  );
}

function PostsFileMenu({ setMenuOpen, blog }: { setMenuOpen: Dispatch<SetStateAction<boolean>>; blog: string }) {
  const { setIsCreatingPost } = useNewFile();
  const router = useRouter();

  const handleNewPost = () => {
    setIsCreatingPost(true);
    setMenuOpen(false);
  };

  const handleOffsideClick = (e: MouseEvent) => {
    if (
      !document.getElementById("posts-file-button")?.contains(e.target as Node) &&
      !document.getElementById("posts-file-menu")?.contains(e.target as Node)
    ) {
      setMenuOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleOffsideClick);
    return () => document.removeEventListener("mousedown", handleOffsideClick);
  }, []);

  const handleDeleteBlog = async () => {
    dialogManager.showDialog({
      type: "Warning",
      title: "Confirm Blog Deletion",
      message: `Are you sure you want to delete blog '${blog}'?`,
      buttons: [
        {
          label: "Delete",
          func: async () => {
            const deletion = await deleteBlog(blog);
            if (!deletion.success) {
              dialogManager.showDialog({
                type: "Error",
                title: "Blog Deletion",
                message: deletion.message,
                buttons: [{ label: "OK" }],
              });
            } else {
              router.push("/documents");
            }
          },
        },
        { label: "Cancel" },
      ],
    });
  };

  return (
    <div id="posts-file-menu" className="fe-menu outset" role="menu">
      <button type="button" onClick={handleNewPost} role="menuitem">
        New Post
      </button>
      <hr />
      <button type="button" onClick={handleDeleteBlog} role="menuitem">
        Delete Blog
      </button>
      <hr />
      <Link href="/" role="menuitem">
        Exit
      </Link>
    </div>
  );
}
