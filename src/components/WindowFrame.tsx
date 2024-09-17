"use client";
import { useState, useEffect, useRef } from "react";

interface PropTypes {
  children: React.ReactNode;
  isNotepad?: boolean;
}

export function WindowFrame({ children, isNotepad }: PropTypes) {
  const windowRef = useRef<HTMLDivElement | null>(null);
  const [dragging, setDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    // If target is a drag control, start dragging closest draggable parent
    if (target.dataset.dragcontrol && windowRef.current) {
      const { x: eleX, y: eleY } = windowRef.current.getBoundingClientRect();
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

    if (isInWindow && dragging && windowRef.current) {
      const xPos = e.clientX - dragOffset.x;
      const yPos = e.clientY - dragOffset.y;
      windowRef.current.style.left = `${xPos}px`;
      windowRef.current.style.top = `${yPos}px`;
    }
  };

  const handleMouseUp = (e: MouseEvent) => {
    if (dragging) setDragging(false);
  };

  useEffect(() => {
    // Doing window stuff here it's smoother when re-entering viewport after doing
    // erratic random mouse movements while dragging. Clear on drag end to avoid stacking window listeners.
    const dragWindow = windowRef.current;
    if (dragWindow) {
      if (dragging) {
        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);
      } else {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      }
      dragWindow.addEventListener("mousedown", handleMouseDown);
      return () => {
        dragWindow.removeEventListener("mousedown", handleMouseDown);
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [dragging]);

  return (
    <div
      ref={windowRef}
      className="window outset"
      style={{ left: isNotepad ? "21vw" : "20vw", width: "60vw", top: isNotepad ? "21vh" : "20vh", height: "60vh" }}>
      {children}
    </div>
  );
}
