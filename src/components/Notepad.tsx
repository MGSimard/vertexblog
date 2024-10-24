"use client";
import { usePathname } from "next/navigation";
import { useState, useRef } from "react";
import { savePost } from "@/server/actions";
import { dialogManager } from "@/lib/DialogManager";
import { WindowFrame } from "@/components/WindowFrame";
import { MaximizeButton } from "@/components/MaximizeButton";
import { NotepadFileButton } from "@/components/NotepadFileButton";
import { CloseIcon } from "@/components/icons";
import type { PostInfoTypes } from "@/types/types";

export function Notepad({ postInfo, onClose }: { postInfo: PostInfoTypes; onClose: () => void }) {
  const [isDirty, setIsDirty] = useState(false);
  const textRef = useRef<HTMLTextAreaElement>(null);

  const pathName = usePathname();

  // TODO: beforeunload (warn users if they try to leave notepad unsaved)

  // Trigger this on exit attempt when not saved
  const handleSaveFile = async () => {
    const { postId } = postInfo;
    const newText = textRef.current?.value;
    const { success, message } = await savePost(postId, newText);
    if (success) {
      setIsDirty(false);
    } else {
      dialogManager.showDialog({
        type: "Error",
        title: "Notepad",
        message: message,
        buttons: [{ label: "OK" }],
      });
    }
    return success;
  };

  const handleExit = async () => {
    if (isDirty) {
      dialogManager.showDialog({
        type: "Warning",
        title: "Notepad",
        message: `The text in the C:\\Documents\\${pathName.split("/").pop()}\\${
          postInfo.postTitle
        }.txt file has changed.`,
        doSave: true,
        buttons: [
          {
            label: "Save",
            func: async () => {
              const success = await handleSaveFile();
              if (success) {
                onClose();
              }
            },
          },
          { label: "Don't Save", func: () => onClose() },
          { label: "Cancel" },
        ],
      });
    } else {
      onClose();
    }
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
