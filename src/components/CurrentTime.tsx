"use client";
import { useState, useEffect } from "react";

export function CurrentTime() {
  const [time, setTime] = useState<string>("00:00");

  useEffect(() => {
    const updateTime = () => {
      const utcDate = new Date();
      const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone ?? "UTC";
      setTime(
        utcDate.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          timeZone: userTimeZone,
        })
      );
    };
    updateTime();

    const secondInterval = setInterval(updateTime, 1000);
    return () => clearInterval(secondInterval);
  }, []);

  return <div className="current-time inset">{time}</div>;
}
