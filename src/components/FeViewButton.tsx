"use client";
import { useState, useEffect, Dispatch, SetStateAction } from "react";

export function FeViewButton() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <span className="fe-btn-relative">
      <button
        id="fe-view-button"
        type="button"
        className={menuOpen ? "isActive" : ""}
        aria-haspopup="menu"
        aria-expanded={menuOpen}
        aria-controls="fe-view-menu"
        onClick={() => setMenuOpen(!menuOpen)}>
        View
      </button>
      {menuOpen && <FeViewMenu setMenuOpen={setMenuOpen} />}
    </span>
  );
}

function FeViewMenu({ setMenuOpen }: { setMenuOpen: Dispatch<SetStateAction<boolean>> }) {
  const handleView = (arg: string) => {
    console.log(arg);
  };

  const handleOffsideClick = (e: MouseEvent) => {
    if (
      !document.getElementById("fe-view-button")?.contains(e.target as Node) &&
      !document.getElementById("fe-view-menu")?.contains(e.target as Node)
    ) {
      setMenuOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleOffsideClick);
    return () => document.removeEventListener("mousedown", handleOffsideClick);
  }, []);

  return (
    <div id="fe-view-menu" className="fe-menu outset" role="menu">
      <button type="button" onClick={() => handleView("TODO")} role="menuitem">
        TODO:
      </button>
      <button type="button" onClick={() => handleView("large")} role="menuitem">
        Large Icons
      </button>
      <button type="button" onClick={() => handleView("small")} role="menuitem">
        Small Icons
      </button>
      <button type="button" onClick={() => handleView("list")} role="menuitem">
        List
      </button>
      <button type="button" onClick={() => handleView("refresh")} role="menuitem">
        Refresh
      </button>
    </div>
  );
}
