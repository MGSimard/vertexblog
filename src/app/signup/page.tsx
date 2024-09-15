"use client";
import { signup } from "@/server/actions";
import { useActionState } from "react";

export default function Page() {
  const [formState, formAction, pending] = useActionState(signup, null);

  return (
    <div className="signuptest">
      <h1>Temporary Signup Test</h1>
      <form action={formAction}>
        <label htmlFor="username">
          Username
          <input name="username" id="username" required />
        </label>
        <label htmlFor="password">
          Password
          <input type="password" name="password" id="password" required />
        </label>
        <label htmlFor="confirmPassword">
          Confirm Password
          <input type="password" name="confirmPassword" id="confirmPassword" required />
        </label>
        <button type="submit">Submit</button>
      </form>
      {/* TODO: Put all of these errors in a dismissable warning context window (toast) */}
      {formState?.success === false && formState.message}
      {formState?.errors && (
        <ul>
          {formState.errors.map((err) => (
            <li key={err}>{err}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
