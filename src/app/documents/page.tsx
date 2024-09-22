import { CurrentPath } from "@/components/CurrentPath";
import { CreateBlogForm } from "@/components/CreateBlogForm";
import { BlogList } from "@/components/BlogList";

export default function Page() {
  return (
    <>
      <div className="window-options winbtns">
        <button type="button">File</button>
        <button type="button">View</button>
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
