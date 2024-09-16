"use client";
import { useState } from "react";
import { PostInfoTypes } from "@/types/types";
import { Modal } from "@/components/Modal";
import { Notepad } from "./Notepad";
export function TextFile({ postInfo }: { postInfo: PostInfoTypes }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  console.log(postInfo);

  const handleModalOpen = () => {
    if (!isModalOpen) {
      setIsModalOpen(true);
    }
  };

  return (
    <>
      <button title={postInfo.title} onClick={handleModalOpen} className="shortcut">
        <img src="" alt="TxtFile" />
        <span>{postInfo.title}</span>
      </button>
      <Modal isOpen={isModalOpen}>
        <Notepad postInfo={postInfo} onClose={() => setIsModalOpen(false)} />
      </Modal>
    </>
  );
}
