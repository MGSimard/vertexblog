"use client";
import { useState } from "react";
import type { UserTypes } from "@/types/types";
import { StartMenu } from "./StartMenu";

export function StartButton({ user, blogTitle }: { user: UserTypes; blogTitle: string | null }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <button
        id="start-button"
        type="button"
        className={`start-button outset${menuOpen ? " isActive" : ""}`}
        aria-haspopup="menu"
        aria-expanded={menuOpen}
        aria-controls="start-menu"
        onClick={() => setMenuOpen(!menuOpen)}>
        <img src="/assets/VB.svg" alt="" />
        <span>Start</span>
      </button>
      {menuOpen && <StartMenu user={user} blogTitle={blogTitle} setMenuOpen={setMenuOpen} />}
    </>
  );
}
