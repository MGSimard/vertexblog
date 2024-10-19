"use client";
import { useState, useEffect, Dispatch, SetStateAction } from "react";

export function BlogsViewButton() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <span className="fe-btn-relative">
      <button
        id="blogs-view-button"
        type="button"
        className={menuOpen ? "isActive" : ""}
        aria-haspopup="menu"
        aria-expanded={menuOpen}
        aria-controls="blogs-view-menu"
        onClick={() => setMenuOpen(!menuOpen)}>
        View
      </button>
      {menuOpen && <BlogsViewMenu setMenuOpen={setMenuOpen} />}
    </span>
  );
}

function BlogsViewMenu({ setMenuOpen }: { setMenuOpen: Dispatch<SetStateAction<boolean>> }) {
  const handleView = (arg: string) => {
    console.log(arg);
  };

  const handleOffsideClick = (e: MouseEvent) => {
    if (
      !document.getElementById("blogs-view-button")?.contains(e.target as Node) &&
      !document.getElementById("blogs-view-menu")?.contains(e.target as Node)
    ) {
      setMenuOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleOffsideClick);
    return () => document.removeEventListener("mousedown", handleOffsideClick);
  }, []);

  return (
    <div id="blogs-view-menu" className="fe-menu outset" role="menu">
      <button type="button" onClick={() => handleView("large")} role="menuitem">
        {/* DEFAULT */}
        TODO: Large Icons
      </button>
      <button type="button" onClick={() => handleView("small")} role="menuitem">
        {/* MULTI COLUMN LIST */}
        TODO: Small Icons
      </button>
      <button type="button" onClick={() => handleView("list")} role="menuitem">
        {/* SINGLE COLUMN LIST */}
        TODO: List
      </button>
      <button type="button" onClick={() => handleView("refresh")} role="menuitem">
        TODO: Refresh
      </button>
    </div>
  );
}
