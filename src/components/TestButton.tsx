"use client";
import { ratelimit } from "@/server/ratelimit";

export function TestButton() {
  const handleRatelimit = async (type: string) => {
    console.log("================");
    console.log("RATELIMIT CALLED");
    const test = await ratelimit("gns3xh457qkemepj", type);
    console.log("RETURNED:", test);
  };

  return (
    <>
      <button type="button" onClick={() => handleRatelimit("auth")}>
        Test Ratelimit (Auth)
      </button>
      <button type="button" onClick={() => handleRatelimit("mutation")}>
        Test Ratelimit (Mutate)
      </button>
      <button type="button" onClick={() => handleRatelimit("fetch")}>
        Test Ratelimit (Fetch)
      </button>
    </>
  );
}
