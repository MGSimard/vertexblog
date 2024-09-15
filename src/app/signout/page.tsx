"use client";
import { signout } from "@/server/actions";

export default function Page() {
  const handleSignOut = async () => {
    const result = await signout();
    if (!result.success) console.error("SIGNOUT ERROR:", result.message);
    else if (result.success) console.log("SIGNOUT SUCCESS:", result.message);
  };
  return (
    <button type="button" onClick={handleSignOut} className="signouttest">
      Sign out
    </button>
  );
}
