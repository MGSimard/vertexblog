import Link from "next/link";
import { CurrentPath } from "@/components/CurrentPath";
import { getPosts } from "@/server/actions";
import { CreatePostForm } from "@/components/CreatePostForm";
import { TextFile } from "@/components/TextFile";

export default async function Page({ params }: { params: { blog: string } }) {
  const currentBlog = decodeURIComponent(params.blog);
  const { success, data, message } = await getPosts(currentBlog);

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
        <ul className="shortcut-area">
          {!success && message}
          {data &&
            data.map((post) => (
              <li key={post.postId}>
                <TextFile postInfo={post} />
              </li>
            ))}
        </ul>
      </div>
    </>
  );
}
