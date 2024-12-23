"use client";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { savePost } from "@/server/actions";
import { dialogManager } from "@/lib/DialogManager";
import { WindowFrame } from "@/components/WindowFrame";
import { MaximizeButton } from "@/components/MaximizeButton";
import { NotepadFileButton } from "@/components/NotepadFileButton";
import { CloseIcon } from "@/components/icons";
import { useDirtyPosts } from "@/components/DirtyPostsContextProvider";
import type { PostInfoTypes } from "@/types/types";

export function Notepad({ postInfo, onClose }: { postInfo: PostInfoTypes; onClose: () => void }) {
  const [isDirty, setIsDirty] = useState(false);
  const textRef = useRef<HTMLTextAreaElement>(null);
  const pathName = usePathname();
  const { setDirtyPosts } = useDirtyPosts();

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
        message: <p>{message}</p>,
        buttons: [{ label: "OK" }],
      });
    }
    return success;
  };

  const handleWarn = (doThis: () => void) => {
    dialogManager.showDialog({
      type: "Warning",
      title: "Notepad",
      message: (
        <p>
          The text in the C:\Documents\{pathName.split("/").pop()}\{postInfo.postTitle}.txt file has changed.
          <br />
          <br />
          Do you want to save the changes?
        </p>
      ),
      buttons: [
        {
          label: "Save",
          func: async () => {
            const success = await handleSaveFile();
            if (success) {
              doThis();
            }
          },
        },
        { label: "Don't Save", func: doThis },
        { label: "Cancel" },
      ],
    });
  };

  const handleClose = () => {
    if (!isDirty) {
      onClose();
    } else {
      handleWarn(onClose);
    }
  };

  useEffect(() => {
    if (isDirty) {
      setDirtyPosts((prevState) => [...prevState, postInfo.postId]);
    } else {
      setDirtyPosts((prevState) => prevState.filter((postId) => postId !== postInfo.postId));
    }

    return () => {
      setDirtyPosts((prevState) => prevState.filter((postId) => postId !== postInfo.postId));
    };
  }, [isDirty]);

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
            <button type="button" className="outset" onClick={handleClose} aria-label="Close notepad window">
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
