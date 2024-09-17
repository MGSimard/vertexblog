"use client";
import { useEffect, useRef } from "react";
import { PostInfoTypes } from "@/types/types";
import { MaximizeButton } from "@/components/MaximizeButton";
import { CloseIcon } from "./icons";
import { useZIndex } from "@/lib/zIndexProvider";

export function Notepad({ postInfo, onClose }: { postInfo: PostInfoTypes; onClose: () => void }) {
  const { zIndex, incrementZIndex } = useZIndex();

  // const notepadRef = useRef<HTMLDivElement>(null);
  // useEffect(() => {
  //   console.log("Notepad mounted.");
  //   incrementZIndex();
  //   notepadRef.current!.style.zIndex = `${zIndex}`;

  //   return () => {
  //     console.log("Notepad unmounted.");
  //   };
  // }, []);

  const test = () => {
    incrementZIndex();
    console.log(zIndex);
  };

  return (
    <div
      // ref={notepadRef}
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
        <button type="button" onClick={test}>
          Test
        </button>
      </div>
      <textarea className="notepad-textarea window-content inset" spellCheck="false" defaultValue={postInfo.content} />
    </div>
  );
}
