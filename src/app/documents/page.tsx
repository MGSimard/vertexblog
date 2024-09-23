import { getBlogs } from "@/server/actions";
import { FeSortButton } from "@/components/FeSortButton";
import { CreateBlogForm } from "@/components/CreateBlogForm";
import { CurrentPath } from "@/components/CurrentPath";
import { BlogList } from "@/components/BlogList";
import { FeViewButton } from "@/components/FeViewButton";

export default async function Page() {
  const blogList = await getBlogs();

  // File: New, Exit
  // View: Large Icons, Small Icons, List, Refresh
  // Sort: Name, Created, Updated

  return (
    <>
      <div className="window-options winbtns">
        <button type="button">File</button>
        <FeViewButton />
        <FeSortButton />
        {/* SHOW USER'S FAVORITE BLOGS? */}
      </div>
      <div className="window-address">
        <span>Address</span>
        <CurrentPath />
      </div>
      <CreateBlogForm />
      <div className="window-content inset">
        <BlogList blogList={blogList} />
      </div>
    </>
  );
}
