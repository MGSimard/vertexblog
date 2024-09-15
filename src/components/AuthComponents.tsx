"use client";
import { signup, signin, signout } from "@/server/actions";
import { useActionState, useState } from "react";

export function SignInOrUp() {
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <div>
      {isSignUp ? <SignUp /> : <SignIn />}
      <button type="button" onClick={() => setIsSignUp(!isSignUp)}>
        {isSignUp ? "Already have an account?" : "New User?"}
      </button>
    </div>
  );
}

export function SignUp() {
  const [formState, formAction, pending] = useActionState(signup, null);

  return (
    <form action={formAction}>
      <h2>Sign Up</h2>
      <label htmlFor="username1">
        Username
        <input name="username" id="username1" pattern="^[^ ].+[^ ]$" minLength={4} maxLength={20} required />
      </label>
      <label htmlFor="password1">
        Password
        <input
          type="password"
          name="password"
          id="password1"
          pattern="^[^ ].+[^ ]$"
          minLength={12}
          maxLength={64}
          required
        />
      </label>
      <label htmlFor="confirmPassword">
        Confirm Password
        <input
          type="password"
          name="confirmPassword"
          id="confirmPassword"
          pattern="^[^ ].+[^ ]$"
          minLength={12}
          maxLength={64}
          required
        />
      </label>
      <button type="submit">Sign Up</button>
      {/* TODO: Put all of these errors in a dismissable warning context window (toast) */}
      {formState?.success === false && formState.message}
      {formState?.errors && (
        <ul>
          {formState.errors.map((err) => (
            <li key={err}>{err}</li>
          ))}
        </ul>
      )}
    </form>
  );
}

export function SignIn() {
  const [formState, formAction, pending] = useActionState(signin, null);

  return (
    <form action={formAction}>
      <h2>Sign In</h2>
      <label htmlFor="username2">
        Username
        <input name="username" id="username2" pattern="^[^ ].+[^ ]$" minLength={4} maxLength={20} required />
      </label>
      <label htmlFor="password2">
        Password
        <input
          type="password"
          name="password"
          id="password2"
          pattern="^[^ ].+[^ ]$"
          minLength={12}
          maxLength={64}
          required
        />
      </label>
      <button type="submit">Sign In</button>
      {formState?.success === false && formState.message}
    </form>
  );
}

export function SignOut() {
  const handleSignOut = async () => {
    const result = await signout();
    if (!result.success) console.error("SIGNOUT ERROR:", result.message);
    else if (result.success) console.log("SIGNOUT SUCCESS:", result.message);
  };
  return (
    <button type="button" onClick={handleSignOut}>
      Sign out
    </button>
  );
}
