"use client";
import { UserTypes } from "@/types/types";
import { SignInOrUp, SignOut } from "./AuthComponents";

export function StartMenu({ user }: { user: UserTypes }) {
  return (
    <div id="start-menu" className="start-menu" role="start-menu">
      <div>{user?.username ?? "GUEST"}</div>
      <div>{user ? <SignOut /> : <SignInOrUp />}</div>
    </div>
  );
}
