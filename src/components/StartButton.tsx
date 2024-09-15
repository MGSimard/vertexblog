"use client";
import Image from "next/image";
import { useState } from "react";
import { UserTypes } from "@/types/types";
import { StartMenu } from "./StartMenu";

export function StartButton({ user }: { user: UserTypes }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className={`start-button outset${menuOpen ? " isActive" : ""}`}
        aria-haspopup="menu"
        aria-expanded={menuOpen}
        aria-controls="start-menu"
        onClick={() => setMenuOpen(!menuOpen)}>
        <Image src="/assets/startmenu.webp" alt="" width={103} height={64} priority={true} />
        <span>Start</span>
      </button>
      {menuOpen && <StartMenu user={user} setMenuOpen={setMenuOpen} />}
    </>
  );
}
