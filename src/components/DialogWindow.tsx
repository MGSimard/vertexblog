"use client";

import { useState } from "react";
import { Portal } from "@/components/Portal";
import { CloseIcon } from "./icons";
import { SavePostResponseTypes } from "@/types/types";

const typeEnums = ["Success", "Error", "Warning"] as const;
type buttonFormat = { label: string; func: () => void | (() => Promise<SavePostResponseTypes>) };
interface OptionsTypes {
  type: (typeof typeEnums)[number];
  title: string;
  message: string;
  buttons: buttonFormat[];
}

export function DialogWindow({ type, title, message, buttons }: OptionsTypes) {
  const [isModalOpen, setIsModalOpen] = useState(true);

  if (!isModalOpen) return null;

  return (
    <Portal>
      <div className="dialog-wrapper">
        DIALOG WINDOW REMOVE AND USE OVER IN THE RIGHT AREAS ONCE DESIGN IS DONE
        <dialog className="dialog-window outset" open>
          <div className="dialog-header">
            <span>{title}</span>
            <button type="button" onClick={() => setIsModalOpen(false)}>
              <CloseIcon />
            </button>
          </div>
          <div className="dialog-content">
            <img src={`/assets/${type}.svg`} alt={type} />
            {message}
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
    </Portal>
  );
}
