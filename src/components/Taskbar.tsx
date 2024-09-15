import { StartButton } from "./StartButton";
import { validateRequest } from "@/lib/auth";

export async function Taskbar() {
  const { user } = await validateRequest();

  return (
    <div id="taskbar" className="noselect">
      <StartButton user={user} />
    </div>
  );
}
