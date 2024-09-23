"use client";
import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { useSort } from "@/components/SortContextProvider";

export function BlogsSortButton() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <span className="fe-btn-relative">
      <button
        id="blogs-sort-button"
        type="button"
        className={menuOpen ? "isActive" : ""}
        aria-haspopup="menu"
        aria-expanded={menuOpen}
        aria-controls="blogs-sort-menu"
        onClick={() => setMenuOpen(!menuOpen)}>
        Sort
      </button>
      {menuOpen && <BlogsSortMenu setMenuOpen={setMenuOpen} />}
    </span>
  );
}

function BlogsSortMenu({ setMenuOpen }: { setMenuOpen: Dispatch<SetStateAction<boolean>> }) {
  const { blogSortType, setBlogSortType } = useSort();

  const handleBlogSort = (arg: string) => {
    setBlogSortType(arg);
    setMenuOpen(false);
  };

  const handleOffsideClick = (e: MouseEvent) => {
    if (
      !document.getElementById("blogs-sort-button")?.contains(e.target as Node) &&
      !document.getElementById("blogs-sort-menu")?.contains(e.target as Node)
    ) {
      setMenuOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleOffsideClick);
    return () => document.removeEventListener("mousedown", handleOffsideClick);
  }, []);

  return (
    <div id="blogs-sort-menu" className="fe-menu outset" role="menu">
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
