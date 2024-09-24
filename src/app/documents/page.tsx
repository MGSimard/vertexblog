import { getBlogs } from "@/server/actions";
import { BlogsFileButton } from "@/components/BlogsFileButton";
import { BlogsViewButton } from "@/components/BlogsViewButton";
import { BlogsSortButton } from "@/components/BlogsSortButton";
import { CurrentPath } from "@/components/CurrentPath";
import { BlogList } from "@/components/BlogList";

export default async function Page() {
  const blogList = await getBlogs();

  return (
    <>
      <div className="window-options winbtns">
        <BlogsFileButton />
        <BlogsViewButton />
        <BlogsSortButton />
        {/* SHOW USER'S FAVORITE BLOGS? */}
      </div>
      <div className="window-address">
        <span>Address</span>
        <CurrentPath />
      </div>
      <div className="window-content inset">
        <BlogList blogList={blogList} />
      </div>
    </>
  );
}
