"use client";
import Link from "next/link";
import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { useNewFile } from "@/components/NewFileContextProvider";

export function PostsFileButton() {
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
      {menuOpen && <PostsFileMenu setMenuOpen={setMenuOpen} />}
    </span>
  );
}

function PostsFileMenu({ setMenuOpen }: { setMenuOpen: Dispatch<SetStateAction<boolean>> }) {
  const { setIsCreatingPost } = useNewFile();
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

  return (
    <div id="posts-file-menu" className="fe-menu outset" role="menu">
      <button type="button" onClick={handleNewPost} role="menuitem">
        New Post
      </button>
      <hr />
      <Link href="/" role="menuitem">
        Exit
      </Link>
    </div>
  );
}
