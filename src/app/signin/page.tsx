"use client";
import { signin } from "@/server/actions";
import { useActionState } from "react";

export default function Page() {
  const [formState, formAction, pending] = useActionState(signin, null);

  return (
    <div className="signintest">
      <h1>Temporary Signin Test</h1>
      <form action={formAction}>
        <label htmlFor="username">
          Username
          <input name="username" id="username" pattern="^[^ ].+[^ ]$" minLength={4} maxLength={20} required />
        </label>
        <label htmlFor="password">
          Password
          <input
            type="password"
            name="password"
            id="password"
            pattern="^[^ ].+[^ ]$"
            minLength={12}
            maxLength={64}
            required
          />
        </label>
        <button type="submit">Sign In</button>
      </form>
      {formState?.success === false && formState.message}
    </div>
  );
}
