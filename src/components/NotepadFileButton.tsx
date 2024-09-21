"use client";
import { useState, Dispatch, SetStateAction, useEffect } from "react";
import { PostInfoTypes } from "@/types/types";

export function NotepadFileButton({ postInfo, onClose }: { postInfo: PostInfoTypes; onClose: () => void }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <button
        id="np-file-button"
        type="button"
        className={`np-file-button${menuOpen ? " isActive" : ""}`}
        aria-haspopup="menu"
        aria-expanded={menuOpen}
        aria-controls="np-file-menu"
        onClick={() => setMenuOpen(!menuOpen)}>
        File
      </button>
      {menuOpen && <NotepadButtonMenu postInfo={postInfo} onClose={onClose} setMenuOpen={setMenuOpen} />}
    </>
  );
}

function NotepadButtonMenu({
  postInfo,
  onClose,
  setMenuOpen,
}: {
  postInfo: PostInfoTypes;
  onClose: () => void;
  setMenuOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const handleOffsideClick = (e: MouseEvent) => {
    if (
      !document.getElementById("np-file-button")?.contains(e.target as Node) &&
      !document.getElementById("np-file-menu")?.contains(e.target as Node)
    ) {
      setMenuOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleOffsideClick);
    return () => document.removeEventListener("mousedown", handleOffsideClick);
  }, []);

  return (
    <div id="np-file-menu" className="np-file-menu outset" role="np-file-menu">
      <button type="button">Save</button>
      <hr />
      <button type="button" onClick={onClose}>
        Exit
      </button>
    </div>
  );
}
