"use client";
import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { useSort } from "@/components/SortContextProvider";

export function FeSortButton() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <span className="fe-btn-relative">
      <button
        id="fe-sort-button"
        type="button"
        className={menuOpen ? "isActive" : ""}
        aria-haspopup="menu"
        aria-expanded={menuOpen}
        aria-controls="fe-sort-menu"
        onClick={() => setMenuOpen(!menuOpen)}>
        Sort
      </button>
      {menuOpen && <FeSortMenu setMenuOpen={setMenuOpen} />}
    </span>
  );
}

function FeSortMenu({ setMenuOpen }: { setMenuOpen: Dispatch<SetStateAction<boolean>> }) {
  const { blogSortType, setBlogSortType } = useSort();

  const handleBlogSort = (arg: string) => {
    setBlogSortType(arg);
    setMenuOpen(false);
  };

  const handleOffsideClick = (e: MouseEvent) => {
    if (
      !document.getElementById("fe-sort-button")?.contains(e.target as Node) &&
      !document.getElementById("fe-sort-menu")?.contains(e.target as Node)
    ) {
      setMenuOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleOffsideClick);
    return () => document.removeEventListener("mousedown", handleOffsideClick);
  }, []);

  return (
    <div id="fe-sort-menu" className="fe-menu outset" role="menu">
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
