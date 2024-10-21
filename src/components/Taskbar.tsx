import { validateRequest } from "@/lib/auth";
import { StartButton } from "./StartButton";
import { CurrentTime } from "./CurrentTime";
import { getCurrentUserBlog } from "@/server/actions";

export async function Taskbar() {
  const { user } = await validateRequest();
  const blogTitle = await getCurrentUserBlog();

  return (
    <div id="taskbar">
      <StartButton user={user} blogTitle={blogTitle} />
      <CurrentTime />
    </div>
  );
}
