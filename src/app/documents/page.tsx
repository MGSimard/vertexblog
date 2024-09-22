import Link from "next/link";
import { CurrentPath } from "@/components/CurrentPath";
import { CreateBlogForm } from "@/components/CreateBlogForm";
import { getBlogs } from "@/server/actions";
import { FeSortButton } from "@/components/FeSortButton";
import { BlogList } from "@/components/BlogList";

export default async function Page() {
  const blogList = await getBlogs();

  // File: New, Exit
  // View: Large Icons, Small Icons, List, Refresh
  // Sort: Name, Created, Updated

  return (
    <>
      <div className="window-options winbtns">
        <button type="button">File</button>
        <button type="button">View</button>
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
