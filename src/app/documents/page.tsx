import { Suspense } from "react";

import { getBlogs } from "@/server/actions";
import { BlogsFileButton } from "@/components/BlogsFileButton";
import { BlogsViewButton } from "@/components/BlogsViewButton";
import { BlogsSortButton } from "@/components/BlogsSortButton";
import { CurrentPath } from "@/components/CurrentPath";
import { BlogList } from "@/components/BlogList";
import { SearchInputBlogs } from "@/components/SearchInputBlogs";

export default async function Page() {
  const blogList = getBlogs();

  return (
    <>
      <div className="window-options winbtns">
        <BlogsFileButton />
        <BlogsViewButton />
        <BlogsSortButton />
        {/* SHOW USER'S FAVORITE BLOGS? */}
        <button type="button" disabled>
          Favorites
        </button>
      </div>
      <div className="window-fields">
        <div className="window-address">
          <span>Address</span>
          <CurrentPath />
        </div>
        <SearchInputBlogs />
      </div>

      <div className="window-content inset">
        <Suspense>
          <BlogList blogList={await blogList} />
        </Suspense>
      </div>
    </>
  );
}
