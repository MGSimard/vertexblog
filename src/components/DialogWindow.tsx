"use client";

import { useEffect, useRef } from "react";
import { CloseIcon } from "@/components/icons";
import type { DialogOptionsTypes } from "@/types/types";

export function DialogWindow({ type, title, message, buttons, closeDialog }: DialogOptionsTypes) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const preventOutside = (event: Event) => {
      const target = event.target as HTMLElement;
      if (dialog && !dialog.contains(target)) {
        event.preventDefault();
      }
    };

    dialog.focus();

    document.addEventListener("mousedown", preventOutside);
    document.addEventListener("keydown", preventOutside);

    return () => {
      document.removeEventListener("mousedown", preventOutside);
      document.removeEventListener("keydown", preventOutside);
    };
  }, []);

  return (
    <div className="dialog-wrapper">
      <dialog ref={dialogRef} className="dialog-window outset" open>
        <div className="dialog-header">
          <span>{title}</span>
          <button type="button" onClick={closeDialog} aria-label="Close dialog window">
            <CloseIcon />
          </button>
        </div>
        <div className="dialog-content">
          <img src={`/assets/${type}.svg`} alt={type} />
          <div>{message}</div>
        </div>
        <div className="dialog-options">
          {buttons.map((btn) => (
            <button type="button" onClick={btn.func} key={btn.label}>
              {btn.label}
            </button>
          ))}
        </div>
      </dialog>
    </div>
  );
}
