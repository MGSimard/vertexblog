"use client";
import { useState, useEffect, type Dispatch, type SetStateAction } from "react";
import { useIconView } from "@/components/IconViewProvider";

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
  const { iconView, setIconView } = useIconView();

  const handleView = (arg: string) => {
    setIconView(arg);
    setMenuOpen(false);
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
      <button
        type="button"
        onClick={() => handleView("large")}
        role="menuitem"
        className={iconView === "large" ? "applied" : ""}>
        Large Icons
      </button>
      <button
        type="button"
        onClick={() => handleView("small")}
        role="menuitem"
        className={iconView === "small" ? "applied" : ""}>
        Small Icons
      </button>
      <button
        type="button"
        onClick={() => handleView("list")}
        role="menuitem"
        className={iconView === "list" ? "applied" : ""}>
        List
      </button>
      {/* TODO: DO I REALLY WANT A REFRESH BUTTON HERE? */}
      <button type="button" onClick={() => handleView("refresh")} role="menuitem">
        TODO: Refresh
      </button>
    </div>
  );
}
