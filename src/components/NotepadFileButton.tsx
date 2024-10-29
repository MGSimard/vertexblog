"use client";
import { usePathname } from "next/navigation";
import { useState, useEffect, type Dispatch, type SetStateAction } from "react";
import { savePost, deletePost } from "@/server/actions";
import { dialogManager } from "@/lib/DialogManager";
import type { PostInfoTypes } from "@/types/types";

export function NotepadFileButton({
  postInfo,
  textRef,
  onClose,
  isDirty,
  setIsDirty,
}: {
  postInfo: PostInfoTypes;
  textRef: React.RefObject<HTMLTextAreaElement>;
  onClose: () => void;
  isDirty: boolean;
  setIsDirty: Dispatch<SetStateAction<boolean>>;
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
        <NotepadButtonMenu
          postInfo={postInfo}
          textRef={textRef}
          onClose={onClose}
          setMenuOpen={setMenuOpen}
          isDirty={isDirty}
          setIsDirty={setIsDirty}
        />
      )}
    </span>
  );
}

function NotepadButtonMenu({
  postInfo,
  textRef,
  onClose,
  setMenuOpen,
  isDirty,
  setIsDirty,
}: {
  postInfo: PostInfoTypes;
  textRef: React.RefObject<HTMLTextAreaElement>;
  onClose: () => void;
  setMenuOpen: Dispatch<SetStateAction<boolean>>;
  isDirty: boolean;
  setIsDirty: Dispatch<SetStateAction<boolean>>;
}) {
  const pathName = usePathname();

  const handleSaveFile = async () => {
    const { postId } = postInfo;
    const newText = textRef.current?.value;
    const { success, message } = await savePost(postId, newText);
    setMenuOpen(false);
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

  const handleExit = async () => {
    if (isDirty) {
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

  const handleDeleteFile = () => {
    dialogManager.showDialog({
      type: "Warning",
      title: "Confirm Post Deletion",
      message: <p>Are you sure you want to delete '{postInfo.postTitle}'.txt?</p>,
      buttons: [
        {
          label: "Delete",
          func: async () => {
            const deletion = await deletePost(postInfo.postId);
            if (!deletion.success) {
              dialogManager.showDialog({
                type: "Error",
                title: "Post Deletion",
                message: <p>{deletion.message}</p>,
                buttons: [{ label: "OK" }],
              });
            }
          },
        },
        { label: "Cancel" },
      ],
    });
  };

  return (
    <div id="np-file-menu" className="np-file-menu outset" role="menu">
      <button type="submit" onClick={handleSaveFile} role="menuitem">
        Save
      </button>
      <hr />
      <button type="button" onClick={handleDeleteFile} role="menuitem">
        Delete
      </button>
      <hr />
      <button type="button" onClick={handleExit} role="menuitem">
        Exit
      </button>
    </div>
  );
}
