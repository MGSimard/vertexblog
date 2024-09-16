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
      {menuOpen && <StartMenu user={user} setMenuOpen={setMenuOpen} />}
    </>
  );
}
