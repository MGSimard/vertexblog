import Link from "next/link";
import { CurrentPath } from "@/components/CurrentPath";
import { getPosts } from "@/server/actions";
import { PostList } from "@/components/PostList";
import { PostsFileButton } from "@/components/PostsFileButton";
import { PostsSortButton } from "@/components/PostsSortButton";
import { PostsViewButton } from "@/components/PostsViewButton";

export default async function Page({ params }: { params: { blog: string } }) {
  const currentBlog = decodeURIComponent(params.blog);
  const postList = await getPosts(currentBlog);

  return (
    <>
      <div className="window-options winbtns">
        <Link href="/documents">&lt;=</Link>
        <PostsFileButton />
        <PostsViewButton />
        <PostsSortButton />
        <button type="button">Favorites</button>
        {/* SHOW USER'S FAVORITE POSTS? */}
      </div>
      <div className="window-address">
        <span>Address</span>
        <CurrentPath />
      </div>
      <div className="window-content inset">
        <PostList postList={postList} currentBlog={currentBlog} />
      </div>
    </>
  );
}
