"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect, type Dispatch, type SetStateAction } from "react";
import { useIconView } from "@/components/IconViewProvider";

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
  const { iconView, setIconView } = useIconView();
  const router = useRouter();

  const handleView = (arg: string) => {
    setIconView(arg);
    setMenuOpen(false);
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
      <button type="button" onClick={() => router.refresh()} role="menuitem">
        Refresh
      </button>
    </div>
  );
}
