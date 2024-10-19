"use client";
import { useState } from "react";
import type { PostInfoTypes } from "@/types/types";
import { Modal } from "@/components/Modal";
import { Notepad } from "./Notepad";

export function TextFile({ postInfo }: { postInfo: PostInfoTypes }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleModalOpen = () => {
    if (!isModalOpen) {
      setIsModalOpen(true);
    }
  };

  return (
    <>
      <button title={postInfo.postTitle} onClick={handleModalOpen} className="shortcut">
        <img src="/assets/Notepad.svg" alt="TxtFile" />
        <span>{postInfo.postTitle}</span>
      </button>
      <Modal isOpen={isModalOpen}>
        <Notepad postInfo={postInfo} onClose={() => setIsModalOpen(false)} />
      </Modal>
    </>
  );
}
