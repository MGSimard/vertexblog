"use client";
import { PostInfoTypes } from "@/types/types";
import { MaximizeButton } from "@/components/MaximizeButton";
import { CloseIcon } from "./icons";

export function Notepad({ postInfo, onClose }: { postInfo: PostInfoTypes; onClose: () => void }) {
  /**
   * When we mount a new notepad instance, remove .active-window class (z-index: 903)
   * from every .window in the DOM. (When we open a notepad, the click event sets .active-window
   * on the file explorer window where the notepad shortcut was, which would lead to spawning
   * the notepad window behind it. Due to this, we clear .active-window from everywhere to ensure
   * the new notepad instance will be on top (due to z-index: 901, and due to DOM hierarchy against
   * older notepad windows).
   *
   * From there, a set of instructions in DragProvider.tsx's click event function handles setting
   * .active-window to any window we click into, giving it the highest z-index and simulating focus.
   * A maximized window will also have 902 z-index by default (both file explorer and notepads) in
   * order to render over other notepads - unless we then swap focus by making another window .active-focus.
   */
  const windows = document.querySelectorAll(".window");
  windows.forEach((window) => window.classList.remove("active-window"));

  return (
    <div
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
