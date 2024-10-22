"use client";
import { useState } from "react";
import { DemaximizeIcon, MaximizeIcon } from "@/components/icons";

export function MaximizeButton() {
  const [maximized, setMaximized] = useState(false);

  return (
    <button
      className={`outset${maximized ? " maximized" : ""}`}
      type="button"
      aria-label="Maximize"
      onClick={() => setMaximized(!maximized)}>
      {maximized ? <DemaximizeIcon /> : <MaximizeIcon />}
    </button>
  );
}
