"use client";
import { useState, useEffect, useRef } from "react";
import { useZIndex } from "./zIndexProvider";

export function DragProvider({ children }: { children: React.ReactNode }) {
  const dragEleRef = useRef<HTMLElement | null>(null);
  const [dragging, setDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const { zIndex, incrementZIndex } = useZIndex();

  const handleMouseDown = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    // If target is a drag control, start dragging closest draggable parent
    if (target.dataset.dragcontrol) {
      dragEleRef.current = target.closest('[data-draggable="true"]') as HTMLElement;
      const { x: eleX, y: eleY } = dragEleRef.current.getBoundingClientRect();
      setDragOffset({ x: e.clientX - eleX, y: e.clientY - eleY });
      setDragging(true);
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    const taskbarHeight = 5 * parseFloat(getComputedStyle(document.documentElement).fontSize);
    const isInWindow =
      e.clientX >= 0 &&
      e.clientX <= window.innerWidth &&
      e.clientY >= 0 &&
      e.clientY <= window.innerHeight - taskbarHeight;

    if (isInWindow && dragging && dragEleRef.current) {
      const xPos = e.clientX - dragOffset.x;
      const yPos = e.clientY - dragOffset.y;
      dragEleRef.current.style.left = `${xPos}px`;
      dragEleRef.current.style.top = `${yPos}px`;
    }
  };

  const handleMouseUp = () => {
    if (dragging) setDragging(false);
  };

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging]);
  return <>{children}</>;
}
