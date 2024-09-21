import Link from "next/link";
import { CurrentPath } from "@/components/CurrentPath";
import { PostList } from "@/components/PostList";
import { CreatePostForm } from "@/components/CreatePostForm";

export default function Page({ params }: { params: { blog: string } }) {
  const currentBlog = decodeURIComponent(params.blog);

  return (
    <>
      <div className="window-options winbtns">
        <Link href="/documents">&lt;=</Link>
        <button type="button">File</button>
        <button type="button">Edit</button>
        <button type="button">Go</button>
        <button type="button">Favorites</button>
        {/* SHOW USER'S FAVORITE POSTS? */}
        <button type="button">Help</button>
      </div>
      <div className="window-address">
        <span>Address</span>
        <CurrentPath />
      </div>
      <CreatePostForm currentBlog={currentBlog} />
      <div className="window-content inset">
        <PostList currentBlog={currentBlog} />
      </div>
    </>
  );
}
