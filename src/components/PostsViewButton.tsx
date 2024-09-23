"use client";
import { useState, useEffect, Dispatch, SetStateAction } from "react";

export function PostsViewButton() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <span className="fe-btn-relative">
      <button
        id="posts-view-button"
        type="button"
        className={menuOpen ? "isActive" : ""}
        aria-haspopup="menu"
        aria-expanded={menuOpen}
        aria-controls="posts-view-menu"
        onClick={() => setMenuOpen(!menuOpen)}>
        View
      </button>
      {menuOpen && <PostsViewMenu setMenuOpen={setMenuOpen} />}
    </span>
  );
}

function PostsViewMenu({ setMenuOpen }: { setMenuOpen: Dispatch<SetStateAction<boolean>> }) {
  const handleView = (arg: string) => {
    console.log(arg);
  };

  const handleOffsideClick = (e: MouseEvent) => {
    if (
      !document.getElementById("posts-view-button")?.contains(e.target as Node) &&
      !document.getElementById("posts-view-menu")?.contains(e.target as Node)
    ) {
      setMenuOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleOffsideClick);
    return () => document.removeEventListener("mousedown", handleOffsideClick);
  }, []);

  return (
    <div id="posts-view-menu" className="fe-menu outset" role="menu">
      <button type="button" onClick={() => handleView("large")} role="menuitem">
        TODO: Large Icons
      </button>
      <button type="button" onClick={() => handleView("small")} role="menuitem">
        TODO: Small Icons
      </button>
      <button type="button" onClick={() => handleView("list")} role="menuitem">
        TODO: List
      </button>
      <button type="button" onClick={() => handleView("refresh")} role="menuitem">
        TODO: Refresh
      </button>
    </div>
  );
}
