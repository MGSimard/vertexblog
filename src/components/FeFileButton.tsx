"use client";
import Link from "next/link";
import { useState, useEffect, Dispatch, SetStateAction } from "react";

export function FeFileButton() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <span className="fe-btn-relative">
      <button
        id="fe-file-button"
        type="button"
        className={menuOpen ? "isActive" : ""}
        aria-haspopup="menu"
        aria-expanded={menuOpen}
        aria-controls="fe-file-menu"
        onClick={() => setMenuOpen(!menuOpen)}>
        File
      </button>
      {menuOpen && <FeFileMenu setMenuOpen={setMenuOpen} />}
    </span>
  );
}

function FeFileMenu({ setMenuOpen }: { setMenuOpen: Dispatch<SetStateAction<boolean>> }) {
  const handleNewBlog = () => {
    console.log("new blog clicked");
  };

  const handleOffsideClick = (e: MouseEvent) => {
    if (
      !document.getElementById("fe-file-button")?.contains(e.target as Node) &&
      !document.getElementById("fe-file-menu")?.contains(e.target as Node)
    ) {
      setMenuOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleOffsideClick);
    return () => document.removeEventListener("mousedown", handleOffsideClick);
  }, []);

  return (
    <div id="fe-file-menu" className="fe-menu outset" role="menu">
      <button type="button" onClick={handleNewBlog} role="menuitem">
        New
      </button>
      <hr />
      <Link href="/" role="menuitem">
        Exit
      </Link>
    </div>
  );
}
