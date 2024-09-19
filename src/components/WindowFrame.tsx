"use client";
import { useState, useEffect, useRef } from "react";
import { useZIndex } from "./ZIndexContextProvider";

interface PropTypes {
  children: React.ReactNode;
  isNotepad?: boolean;
}

export function WindowFrame({ children, isNotepad }: PropTypes) {
  const windowRef = useRef<HTMLDivElement | null>(null);
  const [dragging, setDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const { incrementZIndex } = useZIndex();

  const handleMouseDown = (e: MouseEvent | TouchEvent) => {
    const target = e instanceof MouseEvent ? (e.target as HTMLDivElement) : (e.touches[0]?.target as HTMLDivElement);
    const clientX = e instanceof MouseEvent ? e.clientX : e.touches[0]?.clientX;
    const clientY = e instanceof MouseEvent ? e.clientY : e.touches[0]?.clientY;
    // If target is a drag control, start dragging closest draggable parent
    if (target.dataset.dragcontrol && windowRef.current && clientX && clientY) {
      const { x: eleX, y: eleY } = windowRef.current.getBoundingClientRect();
      setDragOffset({ x: clientX - eleX, y: clientY - eleY });
      setDragging(true);
    }
    if (windowRef.current) windowRef.current.style.zIndex = `${incrementZIndex()}`;
  };

  const handleMouseMove = (e: MouseEvent | TouchEvent) => {
    const taskbarHeight = 5 * parseFloat(getComputedStyle(document.documentElement).fontSize);
    const clientX = e instanceof MouseEvent ? e.clientX : e.touches[0]?.clientX;
    const clientY = e instanceof MouseEvent ? e.clientY : e.touches[0]?.clientY;

    if (clientX && clientY) {
      const isInWindow =
        clientX >= 0 && clientX <= window.innerWidth && clientY >= 0 && clientY <= window.innerHeight - taskbarHeight;
      if (isInWindow && dragging && windowRef.current) {
        const xPos = clientX - dragOffset.x;
        const yPos = clientY - dragOffset.y;
        windowRef.current.style.left = `${xPos}px`;
        windowRef.current.style.top = `${yPos}px`;
      }
    }
  };

  const handleMouseUp = (e: MouseEvent | TouchEvent) => {
    if (dragging) setDragging(false);
  };

  useEffect(() => {
    if (windowRef.current) {
      windowRef.current.style.zIndex = `${incrementZIndex()}`;
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    const dragWindow = windowRef.current;
    if (dragWindow) {
      if (dragging) {
        window.addEventListener("mousemove", handleMouseMove, { signal });
        window.addEventListener("mouseup", handleMouseUp, { signal });
        window.addEventListener("touchmove", handleMouseMove, { signal });
        window.addEventListener("touchend", handleMouseUp, { signal });
      }
      dragWindow.addEventListener("mousedown", handleMouseDown, { signal });
      dragWindow.addEventListener("touchstart", handleMouseDown, { signal });
      return () => {
        controller.abort();
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