"use client";
import Link from "next/link";
import { useState, useEffect, Dispatch, SetStateAction } from "react";

export function FeViewButton() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <button
        id="fe-view-button"
        type="button"
        className={`fe-button${menuOpen ? " isActive" : ""}`}
        aria-haspopup="menu"
        aria-expanded={menuOpen}
        aria-controls="fe-view-menu"
        onClick={() => setMenuOpen(!menuOpen)}>
        View{menuOpen && <FeViewMenu setMenuOpen={setMenuOpen} />}
      </button>
    </>
  );
}

function FeViewMenu({ setMenuOpen }: { setMenuOpen: Dispatch<SetStateAction<boolean>> }) {
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
    <div id="fe-view-menu" className="fe-menu outset" role="fe-view-menu">
      <button type="button">Large Icons</button>
      <button type="button">Small Icons</button>
      <button type="button">List</button>
    </div>
  );
}
