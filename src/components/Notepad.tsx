"use client";
import { usePathname, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
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
  const router = useRouter();

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

  const handleExit = () => {
    if (!isDirty) {
      onClose();
      return;
    }

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
  };

  const handlePopState = (event: PopStateEvent) => {
    if (!isDirty) return;

    event.preventDefault();
    handleExit();
    window.history.pushState(null, "", window.location.href);
  };

  const handleBeforeUnload = (event: BeforeUnloadEvent) => {
    if (!isDirty) return;

    event.preventDefault();
    event.returnValue = "";
  };

  useEffect(() => {
    if (isDirty) {
      window.history.pushState(null, "", window.location.href);
    }

    document.addEventListener("click", interceptLinkClicks, true);
    window.addEventListener("popstate", handlePopState);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      document.removeEventListener("click", interceptLinkClicks, true);
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isDirty]);

  const interceptLinkClicks = (e: MouseEvent) => {
    const link = (e.target as HTMLAnchorElement).closest("a");
    if (link && isDirty) {
      e.preventDefault();
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
                () => router.push("/documents");
              }
            },
          },
          { label: "Don't Save", func: () => router.push("/documents") },
          { label: "Cancel" },
        ],
      });
    }
  };

  // Planned logic move to a page Context for isDirty statechecks against navigation attempts
  // (Confirming one popup on navigation attempt will run navigation, even if there is another popup for a second file)
  // 1. on isDirty, update the context to include a global isDirty along with an array of dirty filenames
  // 2. When no longer dirty, update the context to remove entry from context array
  // 3. Think about unique identifiers, as posts are allowed to have the same title. Include title & post ID.
  // 4. On all these navigation attempts and such, check against the context rather than the local state?
  // 5. Or since the only "forced" nav on confirmation is the ahref click, only move that one to the context?

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
