import Link from "next/link";
import { Suspense } from "react";
import { CurrentPath } from "@/components/CurrentPath";
import { getPosts } from "@/server/actions";
import { PostList } from "@/components/PostList";
import { PostsFileButton } from "@/components/PostsFileButton";
import { PostsSortButton } from "@/components/PostsSortButton";
import { PostsViewButton } from "@/components/PostsViewButton";
import { SearchInputPosts } from "@/components/SearchInputPosts";

const PostListWrapper = async ({ currentBlog }: { currentBlog: string }) => {
  const postList = await getPosts(currentBlog);
  return <PostList postList={postList} currentBlog={currentBlog} />;
};

export default async function Page({ params }: { params: Promise<{ blog: string }> }) {
  const currentBlog = decodeURIComponent((await params).blog);

  return (
    <>
      <div className="window-options winbtns">
        <Link href="/documents" className="aasbtn">
          &lt;=
        </Link>
        <PostsFileButton blog={currentBlog} />
        <PostsViewButton />
        <PostsSortButton />
        <button type="button" disabled>
          Favorites
        </button>
      </div>
      <div className="window-fields">
        <div className="window-address">
          <span>Address</span>
          <CurrentPath />
        </div>
        <SearchInputPosts />
      </div>
      <div className="window-content inset">
        <Suspense>
          <PostListWrapper currentBlog={currentBlog} />
        </Suspense>
      </div>
    </>
  );
}
