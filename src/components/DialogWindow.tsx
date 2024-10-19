"use client";

import { CloseIcon } from "./icons";
import type { DialogOptionsTypes } from "@/types/types";

export function DialogWindow({ type, title, message, buttons, closeDialog }: DialogOptionsTypes) {
  return (
    <div className="dialog-wrapper">
      <dialog className="dialog-window outset" open>
        <div className="dialog-header">
          <span>{title}</span>
          <button type="button" onClick={closeDialog} aria-label="Close dialog window">
            <CloseIcon />
          </button>
        </div>
        <div className="dialog-content">
          <img src={`/assets/${type}.svg`} alt={type} />
          <div>
            <p>
              {message}
              {type === "Warning" && (
                <>
                  <br />
                  <br />
                  Do you want to save the changes?
                </>
              )}
            </p>
          </div>
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
