import { CurrentPath } from "@/components/CurrentPath";
import { CreateBlogForm } from "@/components/CreateBlogForm";
import { BlogList } from "@/components/BlogList";
import { FeFileButton } from "@/components/FeFileButton";
import { FeViewButton } from "@/components/FeViewButton";

export default function Page() {
  return (
    <>
      <div className="window-options winbtns">
        <FeFileButton />
        <FeViewButton />
        <button type="button">Sort</button>
        {/* SHOW USER'S FAVORITE BLOGS? */}
      </div>
      <div className="window-address">
        <span>Address</span>
        <CurrentPath />
      </div>
      <CreateBlogForm />
      <div className="window-content inset">
        <BlogList />
      </div>
    </>
  );
}
