"use client";
import { useState, Dispatch, SetStateAction, useEffect } from "react";
import { savePost } from "@/server/actions";
import { PostInfoTypes } from "@/types/types";

export function NotepadFileButton({
  postInfo,
  textRef,
  onClose,
}: {
  postInfo: PostInfoTypes;
  textRef: React.RefObject<HTMLTextAreaElement>;
  onClose: () => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <span className="np-btn-relative">
      <button
        id="np-file-button"
        type="button"
        className={menuOpen ? "isActive" : ""}
        aria-haspopup="menu"
        aria-expanded={menuOpen}
        aria-controls="np-file-menu"
        onClick={() => setMenuOpen(!menuOpen)}>
        File
      </button>
      {menuOpen && (
        <NotepadButtonMenu postInfo={postInfo} textRef={textRef} onClose={onClose} setMenuOpen={setMenuOpen} />
      )}
    </span>
  );
}

function NotepadButtonMenu({
  postInfo,
  textRef,
  onClose,
  setMenuOpen,
}: {
  postInfo: PostInfoTypes;
  textRef: React.RefObject<HTMLTextAreaElement>;
  onClose: () => void;
  setMenuOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const handleSaveFile = async () => {
    const { postId } = postInfo;
    const newText = textRef.current?.value;
    const saveAttempt = await savePost(postId, newText);
  };

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
    <div id="np-file-menu" className="np-file-menu outset" role="menu">
      <button type="submit" onClick={handleSaveFile} role="menuitem">
        Save
      </button>
      <hr />
      <button type="button" onClick={onClose} role="menuitem">
        Exit
      </button>
    </div>
  );
}
