"use client";
import { UserTypes } from "@/types/types";
import { SignInOrUp, SignOut } from "./AuthComponents";
import { useEffect, Dispatch, SetStateAction } from "react";

export function StartMenu({ user, setMenuOpen }: { user: UserTypes; setMenuOpen: Dispatch<SetStateAction<boolean>> }) {
  const handleOffsideClick = (e: MouseEvent) => {
    const startMenu = document.getElementById("start-menu");
    if (startMenu && !startMenu.contains(e.target as Node)) {
      setMenuOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleOffsideClick);
    return () => document.removeEventListener("mousedown", handleOffsideClick);
  }, []);

  return (
    <div id="start-menu" className="start-menu outset" role="start-menu">
      <div className="start-user">{user?.username ?? "GUEST"}</div>
      <hr />
      <div className="start-action">{user ? <SignOut /> : <SignInOrUp />}</div>
    </div>
  );
}
