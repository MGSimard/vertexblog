"use client";
import Image from "next/image";

export function StartButton() {
  return (
    <button type="button" className="start-button outset">
      <Image src="/assets/startmenu.webp" alt="" width={103} height={64} priority={true} />
      <span>Auth</span>
      {/* If not logged in show username instead of "Auth"? */}
    </button>
  );
}
