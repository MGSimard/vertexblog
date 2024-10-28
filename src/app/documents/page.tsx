import { Suspense } from "react";
import { getBlogs } from "@/server/actions";
import { BlogsFileButton } from "@/components/BlogsFileButton";
import { BlogsViewButton } from "@/components/BlogsViewButton";
import { BlogsSortButton } from "@/components/BlogsSortButton";
import { CurrentPath } from "@/components/CurrentPath";
import { BlogList } from "@/components/BlogList";
import { SearchInputBlogs } from "@/components/SearchInputBlogs";

const BlogListWrapper = async () => {
  const blogList = await getBlogs();
  return <BlogList blogList={blogList} />;
};

export default function Page() {
  return (
    <>
      <div className="window-options winbtns">
        <BlogsFileButton />
        <BlogsViewButton />
        <BlogsSortButton />
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
          <BlogListWrapper />
        </Suspense>
      </div>
    </>
  );
}
