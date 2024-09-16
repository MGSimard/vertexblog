"use client";
import { PostInfoTypes } from "@/types/types";
import { MaximizeButton } from "@/components/MaximizeButton";
import { CloseIcon } from "./icons";
import { useState } from "react";

export function Notepad({ postInfo, onClose }: { postInfo: PostInfoTypes; onClose: () => void }) {
  return (
    <div className="window outset notepad noselect" data-draggable="true">
      <div className="window-header " data-dragcontrol="true">
        <span>{postInfo.title} - Notepad</span>
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
      <textarea className="notepad-textarea window-content inset" spellCheck="false" value={postInfo.content} />
    </div>
  );
}
