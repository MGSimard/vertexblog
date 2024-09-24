"use client";
import Link from "next/link";
import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { useNewFile } from "./NewFileContextProvider";

export function BlogsFileButton() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <span className="fe-btn-relative">
      <button
        id="blogs-file-button"
        type="button"
        className={menuOpen ? "isActive" : ""}
        aria-haspopup="menu"
        aria-expanded={menuOpen}
        aria-controls="blogs-file-menu"
        onClick={() => setMenuOpen(!menuOpen)}>
        File
      </button>
      {menuOpen && <BlogsFileMenu setMenuOpen={setMenuOpen} />}
    </span>
  );
}

function BlogsFileMenu({ setMenuOpen }: { setMenuOpen: Dispatch<SetStateAction<boolean>> }) {
  const { setIsCreatingBlog } = useNewFile();
  const handleNewBlog = () => {
    setIsCreatingBlog(true);
    setMenuOpen(false);
  };

  const handleOffsideClick = (e: MouseEvent) => {
    if (
      !document.getElementById("blogs-file-button")?.contains(e.target as Node) &&
      !document.getElementById("blogs-file-menu")?.contains(e.target as Node)
    ) {
      setMenuOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleOffsideClick);
    return () => document.removeEventListener("mousedown", handleOffsideClick);
  }, []);

  return (
    <div id="blogs-file-menu" className="fe-menu outset" role="menu">
      <button type="button" onClick={handleNewBlog} role="menuitem">
        New Blog
      </button>
      <hr />
      <Link href="/" role="menuitem">
        Exit
      </Link>
    </div>
  );
}
