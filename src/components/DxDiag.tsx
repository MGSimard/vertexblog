"use client";
import { useState } from "react";
import { Modal } from "@/components/Modal";
import { WindowFrame } from "./WindowFrame";
import { MaximizeButton } from "./MaximizeButton";
import { CloseIcon } from "./icons";

export function DxDiag() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleModalOpen = () => {
    if (!isModalOpen) {
      setIsModalOpen(true);
    }
  };

  return (
    <>
      <button title="DxDiag" onClick={handleModalOpen} className="shortcut">
        <img src="/assets/System.svg" alt="TxtFile" />
        <span>System</span>
      </button>
      <Modal isOpen={isModalOpen}>
        <WindowFrame>
          <div className="window-header " data-dragcontrol="true">
            <span className="window-header-left">
              <img src="/assets/System.svg" alt="" />
              <span>System</span>
            </span>
            <div className="window-header-buttons">
              <MaximizeButton />
              <button
                type="button"
                className="outset"
                onClick={() => setIsModalOpen(false)}
                aria-label="Close Diagnostic Tools">
                <CloseIcon />
              </button>
            </div>
          </div>
          <div>WINDOW CONTENT</div>
        </WindowFrame>
      </Modal>
    </>
  );
}
