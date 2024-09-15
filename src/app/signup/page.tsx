"use client";
import { signup } from "@/server/actions";
import { useActionState } from "react";

export default function Page() {
  const [formState, formAction, pending] = useActionState(signup, null);

  return (
    <>
      <h1>Create an account</h1>
      <form action={formAction}>
        <label htmlFor="username">
          Username
          <input name="username" id="username" />
        </label>
        <label htmlFor="password">
          Password
          <input type="password" name="password" id="password" />
        </label>
        <label htmlFor="confirmPassword">
          Confirm Password
          <input type="password" name="confirmPassword" id="confirmPassword" />
        </label>
        <button type="submit">Submit</button>
      </form>
    </>
  );
}
