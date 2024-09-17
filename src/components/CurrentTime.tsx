"use client";
import { useState, useEffect } from "react";

export function CurrentTime() {
  const [time, setTime] = useState(new Date());

  const handleSetTime = () => {
    setTime(new Date());
  };

  useEffect(() => {
    const secondInterval = setInterval(handleSetTime, 1000);
    return () => clearInterval(secondInterval);
  }, []);

  return (
    <div className="current-time inset">{time.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}</div>
  );
}
