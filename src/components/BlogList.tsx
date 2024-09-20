import Link from "next/link";
import { getBlogs } from "@/server/actions";

export async function BlogList() {
  const { success, data, message } = await getBlogs();
  // TODO: ON SUCCESS FALSE, TOAST ERROR

  return (
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
  );
}
