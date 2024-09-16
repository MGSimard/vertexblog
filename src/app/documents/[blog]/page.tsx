import Link from "next/link";
import { CurrentPath } from "@/components/CurrentPath";
// Temp data
import posts from "../../placeholderPosts.json";

// THIS WILL BE THE ACTUAL BLOG PATHS (WITHIN THE BLOG FOLDER)

export default function Page({ params }: { params: { blog: number } }) {
  const blogPosts = posts.filter((post) => post.parent_blog === Number(params.blog));

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
        <ul className="explorer-icons">
          {blogPosts.map((post) => (
            <li key={post.id}>
              <button type="button">{post.title}</button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
