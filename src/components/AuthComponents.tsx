"use client";
import { useActionState, useState, useEffect } from "react";
import { signup, signin, signout } from "@/server/actions";
import { EyeIcon, EyeSlashIcon } from "@/components/icons";
import { dialogManager } from "@/lib/DialogManager";

export function SignInOrUp() {
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <>
      {isSignUp ? <SignUp /> : <SignIn />}
      <button type="button" onClick={() => setIsSignUp(!isSignUp)} className="start-switch">
        {isSignUp ? "Already have an account? Sign In." : "New User? Create an account."}
      </button>
    </>
  );
}

export function SignUp() {
  const [formState, formAction, pending] = useActionState(signup, null);
  const [pswdVisible, setPswdVisible] = useState(false);

  useEffect(() => {
    console.log(formState?.errors ?? null);
    if (formState?.success === false) {
      dialogManager.showDialog({
        type: "Error",
        title: "Sign Up",
        message: (
          <>
            <p>{formState.message}</p>
          </>
        ),
        buttons: [{ label: "OK" }],
      });
    }
  }, [formState]);

  return (
    <form action={formAction} className="start-form">
      <h2>Sign Up</h2>
      <label htmlFor="username1">
        Username
        <input name="username" id="username1" pattern="^[^ ].+[^ ]$" minLength={4} maxLength={20} required />
      </label>
      <label htmlFor="password1">
        Password
        <div className="pswd-wrap">
          <input
            type={pswdVisible ? "text" : "password"}
            name="password"
            id="password1"
            pattern="^[^ ].+[^ ]$"
            minLength={12}
            maxLength={64}
            required
          />
          <button
            type="button"
            onClick={() => setPswdVisible(!pswdVisible)}
            aria-controls="password1"
            aria-expanded={pswdVisible}>
            {pswdVisible ? <EyeSlashIcon /> : <EyeIcon />}
          </button>
        </div>
      </label>
      <label htmlFor="confirmPassword">
        Confirm Password
        <div className="pswd-wrap">
          <input
            type={pswdVisible ? "text" : "password"}
            name="confirmPassword"
            id="confirmPassword"
            pattern="^[^ ].+[^ ]$"
            minLength={12}
            maxLength={64}
            required
          />
          <button
            type="button"
            onClick={() => setPswdVisible(!pswdVisible)}
            aria-controls="confirmPassword"
            aria-expanded={pswdVisible}>
            {pswdVisible ? <EyeSlashIcon /> : <EyeIcon />}
          </button>
        </div>
      </label>
      <button type="submit" className="outset" disabled={pending} aria-disabled={pending}>
        Sign Up
      </button>
    </form>
  );
}

export function SignIn() {
  const [formState, formAction, pending] = useActionState(signin, null);
  const [pswdVisible, setPswdVisible] = useState(false);

  useEffect(() => {
    if (formState?.success === false) {
      dialogManager.showDialog({
        type: "Error",
        title: "Sign In",
        message: <p>{formState.message}</p>,
        buttons: [{ label: "OK" }],
      });
    }
  }, [formState]);

  return (
    <form action={formAction} className="start-form">
      <h2>Sign In</h2>
      <label htmlFor="username2">
        Username
        <input name="username" id="username2" pattern="^[^ ].+[^ ]$" minLength={4} maxLength={20} required />
      </label>
      <label htmlFor="password2">
        Password
        <div className="pswd-wrap">
          <input
            type={pswdVisible ? "text" : "password"}
            name="password"
            id="password2"
            pattern="^[^ ].+[^ ]$"
            minLength={12}
            maxLength={64}
            required
          />
          <button
            type="button"
            onClick={() => setPswdVisible(!pswdVisible)}
            aria-controls="password2"
            aria-expanded={pswdVisible}>
            {pswdVisible ? <EyeSlashIcon /> : <EyeIcon />}
          </button>
        </div>
      </label>
      <button type="submit" className="outset" disabled={pending} aria-disabled={pending}>
        Sign In
      </button>
    </form>
  );
}

export function SignOut() {
  const handleSignOut = async () => {
    const result = await signout();
    if (!result.success) console.error("SIGNOUT ERROR:", result.message);
  };
  return (
    <button type="button" className="outset" onClick={handleSignOut}>
      Log out
    </button>
  );
}
