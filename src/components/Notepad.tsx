"use client";
import { useState, useRef } from "react";
import { PostInfoTypes } from "@/types/types";
import { WindowFrame } from "@/components/WindowFrame";
import { MaximizeButton } from "@/components/MaximizeButton";
import { NotepadFileButton } from "@/components/NotepadFileButton";
import { CloseIcon } from "@/components/icons";
import { savePost } from "@/server/actions";

export function Notepad({ postInfo, onClose }: { postInfo: PostInfoTypes; onClose: () => void }) {
  const [isDirty, setIsDirty] = useState(false);
  const textRef = useRef<HTMLTextAreaElement>(null);

  // Trigger this on exit attempt when not saved
  const handleSaveFile = async () => {
    const { postId } = postInfo;
    const newText = textRef.current?.value;
    const { success, message } = await savePost(postId, newText);
    if (success) {
      setIsDirty(false);
    } else {
      // TODO: DIALOG WINDOW (ERROR, MESSAGE);
      alert(message);
    }
    return success;
  };

  const handleExit = async () => {
    // TODO: REPLACE CONFIRM WITH A DIALOG WINDOW THAT REQUIRES CONFIRMATION (SAVE, DON'T SAVE, CANCEL, X CANCEL);
    if (isDirty && confirm("Do you want to save changes?")) {
      const success = await handleSaveFile();
      if (!success) return;
    }
    onClose();
  };

  return (
    <>
      <WindowFrame isNotepad>
        <div className="window-header " data-dragcontrol="true">
          <span className="window-header-left">
            <img src="/assets/Notepad.svg" alt="" />
            <span>
              {isDirty && "*"}
              {postInfo.postTitle} - Notepad
            </span>
          </span>
          <div className="window-header-buttons">
            <MaximizeButton />
            <button type="button" className="outset" onClick={handleExit} aria-label="Close notepad window">
              <CloseIcon />
            </button>
          </div>
        </div>
        <div className="window-options npbtns">
          <NotepadFileButton
            postInfo={postInfo}
            textRef={textRef}
            onClose={onClose}
            isDirty={isDirty}
            setIsDirty={setIsDirty}
          />
        </div>
        <textarea
          ref={textRef}
          className="notepad-textarea window-content inset"
          spellCheck="false"
          defaultValue={postInfo.postContent}
          onChange={() => setIsDirty(true)}
        />
      </WindowFrame>
    </>
  );
}
