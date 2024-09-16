import Link from "next/link";
import { CurrentPath } from "@/components/CurrentPath";
// Temp data
import blogs from "../placeholderBlogs.json";

// THIS IS WHERE WE WILL LIST ALL THE CREATED BLOGS AS FOLDERS

export default function Page() {
  return (
    <>
      <div className="window-options">
        <button type="button">File</button>
        <button type="button">Edit</button>
        <button type="button">Go</button>
        <button type="button">Favorites</button>
        {/* SHOW USER'S FAVORITE BLOGS? */}
        <button type="button">Help</button>
      </div>
      <label className="window-address">
        <span>Address</span>
        <CurrentPath />
      </label>
      <div className="window-content inset">
        <ul className="explorer-icons">
          {blogs.map((blog) => (
            <li key={blog.id}>
              <Link href={`/documents/${blog.id}`}>{blog.title}</Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
