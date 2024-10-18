"use client";

import { useState } from "react";
import { Portal } from "@/components/Portal";
import { CloseIcon } from "./icons";

const dialogTypeEnums = ["success", "error", "warning", "info"] as const;
const dialogOptionsEnums = ["save", "ok"] as const;
interface ContextWindowTypes {
  title: string;
  dialogType: (typeof dialogTypeEnums)[number];
  message?: string;
  filePath?: string;
  dialogOptions: (typeof dialogOptionsEnums)[number];
  execution?: () => void;
  onClose?: () => void;
}

export function DialogWindow({
  title,
  message,
  dialogType,
  dialogOptions,
  filePath,
  execution,
  onClose,
}: ContextWindowTypes) {
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
            <img src={`/assets/${dialogType}.svg`} alt={dialogType} />
            {message}
            {filePath && <MessageSave filePath={filePath} />}
          </div>
          <div className="dialog-options">
            {dialogOptions === "save" && execution && onClose && (
              <OptionsSave saveFunc={execution} closeFile={onClose} closeDialog={() => setIsModalOpen(false)} />
            )}
            {dialogOptions === "ok" && <OptionsOk closeDialog={() => setIsModalOpen(false)} />}
          </div>
        </dialog>
      </div>
    </Portal>
  );
}

function MessageSave({ filePath }: { filePath: string }) {
  return (
    <p>
      The text in {filePath} has changed.
      <br />
      <br />
      Do you want to save the changes?
    </p>
  );
}

function OptionsSave({
  saveFunc,
  closeFile,
  closeDialog,
}: {
  saveFunc: () => void;
  closeFile: () => void;
  closeDialog: () => void;
}) {
  return (
    <>
      <button type="button" onClick={saveFunc}>
        Save
      </button>
      <button type="button" onClick={closeFile}>
        Don't Save
      </button>
      <button type="button" onClick={closeDialog}>
        Cancel
      </button>
    </>
  );
}

function OptionsOk({ closeDialog }: { closeDialog: () => void }) {
  return (
    <button type="button" onClick={closeDialog}>
      Ok
    </button>
  );
}
