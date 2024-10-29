import { getCurrentUserBlog } from "@/server/actions";
import { validateRequest } from "@/server/auth";
import { StartButton } from "@/components/StartButton";
import { CurrentTime } from "@/components/CurrentTime";

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
