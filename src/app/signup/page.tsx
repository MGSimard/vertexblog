"use client";
import { signup } from "@/server/actions";
import { useActionState } from "react";

export default function Page() {
  const [formState, formAction, pending] = useActionState(signup, null);

  return (
    <>
      <h1>Create an account</h1>
      <form action={formAction}>
        <label htmlFor="username">Username</label>
        <input name="username" id="username" />
        <br />
        <label htmlFor="password">Password</label>
        <input type="password" name="password" id="password" />
        <br />
        <button>Continue</button>
      </form>
    </>
  );
}
