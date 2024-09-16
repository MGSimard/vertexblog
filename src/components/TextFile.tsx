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
      <button title="" onClick={handleModalOpen}>
        TestButton
      </button>
      <Modal isOpen={isModalOpen}>
        <Notepad postInfo={postInfo} onClose={() => setIsModalOpen(false)} />
      </Modal>
    </>
  );
}
