"use client";
import Link from "next/link";
import { useEffect, type Dispatch, type SetStateAction } from "react";
import { SignInOrUp, SignOut } from "@/components/AuthComponents";
import type { UserTypes } from "@/types/types";

export function StartMenu({
  user,
  blogTitle,
  setMenuOpen,
}: {
  user: UserTypes;
  blogTitle: string | null;
  setMenuOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const handleOffsideClick = (e: MouseEvent) => {
    console.log(e.target);
    if (
      !document.getElementById("start-button")?.contains(e.target as Node) &&
      !document.getElementById("start-menu")?.contains(e.target as Node) &&
      !document.querySelector(".dialog-wrapper")?.contains(e.target as Node)
    ) {
      setMenuOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleOffsideClick);
    return () => document.removeEventListener("mousedown", handleOffsideClick);
  }, []);

  return (
    <div id="start-menu" className="start-menu outset" role="start-menu">
      <div className="start-user">
        {user?.username ? (
          <>
            <span>{user.username}</span>
            {blogTitle ? (
              <Link href={`/documents/${encodeURIComponent(blogTitle)}`} className="start-link">
                <img src="/assets/FilledFolder.svg" alt={`Go to ${blogTitle}`} />
              </Link>
            ) : (
              <img src="/assets/FilledFolder.svg" alt="User has no blog." className="noblog" />
            )}
          </>
        ) : (
          "GUEST"
        )}
      </div>
      <hr />
      <div className="start-action">{user ? <SignOut /> : <SignInOrUp />}</div>
    </div>
  );
}
