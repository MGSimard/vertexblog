"use client";
import { ratelimit } from "@/server/ratelimit";

export function TestButton() {
  const handleRatelimit = async () => {
    console.log("================");
    console.log("RATELIMIT CALLED");
    const test = await ratelimit("gns3xh457qkemepj");
    console.log("RETURNED:", test);
  };

  return (
    <button type="button" onClick={handleRatelimit}>
      Test Ratelimit
    </button>
  );
}
