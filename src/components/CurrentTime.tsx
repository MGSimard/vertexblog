"use client";
import { useState, useEffect } from "react";

export function CurrentTime() {
  const [time, setTime] = useState<Date>(new Date());

  useEffect(() => {
    const updateTime = () => setTime(new Date());
    const secondInterval = setInterval(updateTime, 1000);
    return () => clearInterval(secondInterval);
  }, []);

  return (
    <div className="current-time inset">
      {time.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      })}
    </div>
  );
}
