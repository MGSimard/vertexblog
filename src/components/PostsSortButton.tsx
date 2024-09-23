"use client";
import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { useSort } from "@/components/SortContextProvider";

export function PostsSortButton() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <span className="fe-btn-relative">
      <button
        id="posts-sort-button"
        type="button"
        className={menuOpen ? "isActive" : ""}
        aria-haspopup="menu"
        aria-expanded={menuOpen}
        aria-controls="posts-sort-menu"
        onClick={() => setMenuOpen(!menuOpen)}>
        Sort
      </button>
      {menuOpen && <PostsSortMenu setMenuOpen={setMenuOpen} />}
    </span>
  );
}

function PostsSortMenu({ setMenuOpen }: { setMenuOpen: Dispatch<SetStateAction<boolean>> }) {
  const { postSortType, setPostSortType } = useSort();

  const handleBlogSort = (arg: string) => {
    setPostSortType(arg);
    setMenuOpen(false);
  };

  const handleOffsideClick = (e: MouseEvent) => {
    if (
      !document.getElementById("posts-sort-button")?.contains(e.target as Node) &&
      !document.getElementById("posts-sort-menu")?.contains(e.target as Node)
    ) {
      setMenuOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleOffsideClick);
    return () => document.removeEventListener("mousedown", handleOffsideClick);
  }, []);

  return (
    <div id="posts-sort-menu" className="fe-menu outset" role="menu">
      <button type="button" onClick={() => handleBlogSort("name")} role="menuitem">
        Name
      </button>
      <button type="button" onClick={() => handleBlogSort("created")} role="menuitem">
        Created
      </button>
      <button type="button" onClick={() => handleBlogSort("updated")} role="menuitem">
        Updated
      </button>
    </div>
  );
}
