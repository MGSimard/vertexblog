"use client";
import { useRef } from "react";
import { PostInfoTypes } from "@/types/types";
import { WindowFrame } from "@/components/WindowFrame";
import { MaximizeButton } from "@/components/MaximizeButton";
import { NotepadFileButton } from "@/components/NotepadFileButton";
import { CloseIcon } from "@/components/icons";

export function Notepad({ postInfo, onClose }: { postInfo: PostInfoTypes; onClose: () => void }) {
  const textRef = useRef<HTMLTextAreaElement>(null);
  return (
    <WindowFrame isNotepad>
      <div className="window-header " data-dragcontrol="true">
        <span className="window-header-left">
          <img src="/assets/Notepad.svg" alt="" />
          <span>{postInfo.postTitle} - Notepad</span>
        </span>
        <div className="window-header-buttons">
          <MaximizeButton />
          <button type="button" className="outset" onClick={onClose}>
            <CloseIcon />
          </button>
        </div>
      </div>
      <div className="window-options npbtns">
        <NotepadFileButton postInfo={postInfo} textRef={textRef} onClose={onClose} />
      </div>
      <textarea
        ref={textRef}
        className="notepad-textarea window-content inset"
        spellCheck="false"
        defaultValue={postInfo.postContent}
      />
    </WindowFrame>
  );
}
