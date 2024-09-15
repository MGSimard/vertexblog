"use client";
import { UserTypes } from "@/types/types";
import { SignInOrUp, SignOut } from "./AuthComponents";

export function StartMenu({ user }: { user: UserTypes }) {
  return (
    <div id="start-menu" className="start-menu outset" role="start-menu">
      <div className="start-user">{user?.username ?? "GUEST"}</div>
      <hr />
      <div className="start-action">{user ? <SignOut /> : <SignInOrUp />}</div>
    </div>
  );
}
