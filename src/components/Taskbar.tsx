import { validateRequest } from "@/lib/auth";
import { StartButton } from "./StartButton";
import { CurrentTime } from "./CurrentTime";

export async function Taskbar() {
  const { user } = await validateRequest();

  return (
    <div id="taskbar">
      <StartButton user={user} />
      <CurrentTime />
    </div>
  );
}
