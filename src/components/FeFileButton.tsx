"use client";
import Link from "next/link";
import { useState, useEffect, Dispatch, SetStateAction } from "react";

export function FeFileButton() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <button
        id="fe-file-button"
        type="button"
        className={`fe-button${menuOpen ? " isActive" : ""}`}
        aria-haspopup="menu"
        aria-expanded={menuOpen}
        aria-controls="fe-file-menu"
        onClick={() => setMenuOpen(!menuOpen)}>
        File{menuOpen && <FeFileMenu setMenuOpen={setMenuOpen} />}
      </button>
    </>
  );
}

function FeFileMenu({ setMenuOpen }: { setMenuOpen: Dispatch<SetStateAction<boolean>> }) {
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
    <div id="fe-file-menu" className="fe-menu outset" role="fe-file-menu">
      <button type="submit">New Folder</button>
      <hr />
      <Link href="/">Exit</Link>
    </div>
  );
}
