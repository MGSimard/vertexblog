import { StartButton } from "./StartButton";
import { validateRequest } from "@/lib/auth";

export async function Taskbar() {
  const { user } = await validateRequest();
  console.log(user);
  return (
    <div id="taskbar" className="noselect">
      <StartButton /> <span>TASK BAR - USER: {user ? user.username : "GUEST"}</span>
    </div>
  );
}
