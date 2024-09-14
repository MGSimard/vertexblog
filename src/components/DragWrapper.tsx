"use client";
import { useState, useEffect, useCallback } from "react";

export function DragWrapper({ children }: { children: React.ReactNode }) {
  const [dragging, setDragging] = useState(false);
  const [elementPos, setElementPos] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e: MouseEvent) => {
    const target = e.target as HTMLElement;

    if (target.dataset.dragcontrol) {
      console.log("CLICKED DRAG CONTROL");
      setDragging(true);
      const dragElement = target.closest('[data-draggable="true"]') as HTMLElement;
      const elementPos = dragElement.getBoundingClientRect();
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    // Constantly keep track of mouse position within the document.
    console.log("DRAGGING:", dragging);
    const target = e.target;
    const mousePos = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = (e: MouseEvent) => {
    if (dragging) setDragging(false);
  };

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mousedown", handleMouseDown);
      document.addEventListener("mouseup", handleMouseUp);
    };
  }, [dragging]);
  return <>{children}</>;
}
