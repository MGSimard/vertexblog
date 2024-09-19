import Link from "next/link";
import { CurrentPath } from "@/components/CurrentPath";
import { TextFile } from "@/components/TextFile";
import blogs from "../../placeholderBlogs.json";
import posts from "../../placeholderPosts.json";

// THIS WILL BE THE ACTUAL BLOG PATHS (WITHIN THE BLOG FOLDER)

export default function Page({ params }: { params: { blog: string } }) {
  const currentBlog = decodeURIComponent(params.blog);
  const [blog] = blogs.filter((blog) => blog.title.toLocaleLowerCase() === currentBlog.toLowerCase());
  const blogPosts = posts.filter((post) => post.parentBlog === blog?.id);

  return (
    <>
      <div className="window-options">
        <Link href="/documents">&lt;=</Link>
        <button type="button">File</button>
        <button type="button">Edit</button>
        <button type="button">Go</button>
        <button type="button">Favorites</button>
        {/* SHOW USER'S FAVORITE POSTS? */}
        <button type="button">Help</button>
      </div>
      <label className="window-address">
        <span>Address</span>
        <CurrentPath />
      </label>
      <div className="window-content inset">
        <ul className="shortcut-area">
          {!blog && "BLOG NOT FOUND"}
          {blogPosts &&
            blogPosts.map((post) => (
              <li key={post.id}>
                <TextFile postInfo={post} />
              </li>
            ))}
        </ul>
      </div>
    </>
  );
}
