"use client";
import { useEffect, useRef } from "react";
import { PostInfoTypes } from "@/types/types";
import { MaximizeButton } from "@/components/MaximizeButton";
import { CloseIcon } from "./icons";

export function Notepad({ postInfo, onClose }: { postInfo: PostInfoTypes; onClose: () => void }) {
  /** Bit of context regarding window focus here:
   * When we open notepad, we clicked in file explorer which had set .active-window, so we clear it
   * to ensure new notepad renders on top. Technically this happens without also setting .active-window
   * on the new notepad due to explicitly higher z-index (901) and DOM hierarchy against older notepads
   * but I reckon it's functionally/thematically correct to still set .active-window on new notepad.
   *
   * From there, a set of instructions in DragProvider.tsx's click event function handles setting
   * .active-window to any window we click into, giving it the highest z-index and simulating focus.
   * A maximized window will also have 902 z-index by default (both file explorer and notepads) in
   * order to render over other notepads - unless we then swap focus by making another window .active-focus.
   */
  const notepadRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const windows = document.querySelectorAll(".window");
    windows.forEach((window) => window.classList.remove("active-window"));
    notepadRef.current!.classList.add("active-window");
  }, []);

  return (
    <div
      ref={notepadRef}
      className="window outset notepad"
      data-draggable="true"
      style={{ left: "21vw", width: "60vw", top: "21vh", height: "60vh" }}>
      <div className="window-header " data-dragcontrol="true">
        <span className="window-header-left">
          <img src="/assets/Notepad.svg" alt="" />
          <span>{postInfo.title} - Notepad</span>
        </span>
        <div className="window-header-buttons">
          <MaximizeButton />
          <button type="button" className="outset" onClick={onClose}>
            <CloseIcon />
          </button>
        </div>
      </div>
      <div className="window-options ">
        <button type="button">File</button>
        <button type="button">Edit</button>
        <button type="button">Search</button>
        <button type="button">Help</button>
      </div>
      <textarea className="notepad-textarea window-content inset" spellCheck="false" defaultValue={postInfo.content} />
    </div>
  );
}
