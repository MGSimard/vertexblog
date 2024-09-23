import { getBlogs } from "@/server/actions";
import { FeFileButton } from "@/components/FeFileButton";
import { FeViewButton } from "@/components/FeViewButton";
import { FeSortButton } from "@/components/FeSortButton";
import { CreateBlogForm } from "@/components/CreateBlogForm";
import { CurrentPath } from "@/components/CurrentPath";
import { BlogList } from "@/components/BlogList";

export default async function Page() {
  const blogList = await getBlogs();

  return (
    <>
      <div className="window-options winbtns">
        <FeFileButton />
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
