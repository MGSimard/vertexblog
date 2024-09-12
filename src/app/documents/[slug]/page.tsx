import { BackButton } from "@/components/BackButton";
// Temp data
import posts from "../../placeholderPosts.json";

// THIS WILL BE THE ACTUAL BLOG PATHS (WITHIN THE BLOG FOLDER)

export default function Page({ params }: { params: { slug: number } }) {
  const blogPosts = posts.filter((post) => post.parent_blog === Number(params.slug));

  return (
    <>
      <div className="fe-options">
        <BackButton />
        <button type="button">File</button>
        <button type="button">Edit</button>
        <button type="button">Go</button>
        <button type="button">Favorites</button>
        {/* SHOW USER'S FAVORITE POSTS? */}
        <button type="button">Help</button>
      </div>
      <div className="fe-content inset">
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
