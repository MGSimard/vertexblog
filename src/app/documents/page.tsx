import Link from "next/link";
import { CurrentPath } from "@/components/CurrentPath";
import { CreateBlogForm } from "@/components/CreateBlogForm";
import { getBlogs } from "@/server/actions";

export default async function Page() {
  const { success, data, message } = await getBlogs();

  return (
    <>
      <div className="window-options winbtns">
        <button type="button">File</button>
        <button type="button">View</button>
        <button type="button">Sort</button>
        {/* SHOW USER'S FAVORITE BLOGS? */}
      </div>
      <div className="window-address">
        <span>Address</span>
        <CurrentPath />
      </div>
      <CreateBlogForm />
      <div className="window-content inset">
        <ul className="shortcut-area">
          {/* Temporary error message */}
          {!success && message}
          {data &&
            data.map((blog) => (
              <li key={blog.blogId}>
                <Link href={`/documents/${encodeURIComponent(blog.blogTitle)}`} className="shortcut">
                  <img src={`/assets/${blog.active ? "FilledFolder" : "EmptyFolder"}.svg`} alt="Folder" />
                  <span>{blog.blogTitle}</span>
                </Link>
              </li>
            ))}
        </ul>
      </div>
    </>
  );
}
