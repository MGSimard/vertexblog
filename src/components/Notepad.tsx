"use client";
import { usePathname, useRouter } from "next/navigation";
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
  const router = useRouter();
  const { dirtyPosts, setDirtyPosts } = useDirtyPosts();

  const handleSaveFile = async () => {
    console.log("HANDLESAVEFILE TRIGGERED.");
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
    console.log("HANDLEWARN TRIGGERED");
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
    console.log("HANDLECLOSE TRIGGERED.");
    if (!isDirty) {
      onClose();
    } else {
      handleWarn(onClose);
    }
  };

  const handleNavigate = () => {
    console.log("HANDLENAVIGATE TRIGGERED.");
  };

  // Move this to context along with event listener?
  const handlePopState = (event: PopStateEvent) => {
    console.log("HANDLEPOPSTATE TRIGGERED.");
    if (!isDirty) return;
    event.preventDefault();
    window.history.pushState(null, "", window.location.href);
  };

  // Move this to context along with event listener?
  const handleBeforeUnload = (event: BeforeUnloadEvent) => {
    console.log("HANDLEBEFOREUNLOAD TRIGGERED.");
    if (!isDirty) return;
    event.preventDefault();
    event.returnValue = "";
  };

  useEffect(() => {
    if (isDirty) {
      setDirtyPosts((prevState) => [...prevState, { id: postInfo.postId, title: postInfo.postTitle }]);
      window.history.pushState(null, "", window.location.href);
    } else {
      setDirtyPosts((prevState) => prevState.filter((post) => post.id !== postInfo.postId));
    }

    document.addEventListener("click", interceptLinkClicks, true);
    window.addEventListener("popstate", handlePopState);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      document.removeEventListener("click", interceptLinkClicks, true);
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      setDirtyPosts((prevState) => prevState.filter((post) => post.id !== postInfo.postId));
    };
  }, [isDirty]);

  const interceptLinkClicks = (e: MouseEvent) => {
    console.log("INTERCEPTLINKCLICKS TRIGGERED.");
    const link = (e.target as HTMLAnchorElement).closest("a");

    if (link && isDirty && link.target !== "_blank") {
      e.preventDefault();
      // TODO: Rework this to only push to documents if no other notepad is dirty
      // So basically just make a function that checks dirtypostscontext for length
      // And only push on length detected, otherwise run onClose()
      handleWarn(() => router.push(link.href));
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
