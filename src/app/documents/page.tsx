import { CurrentPath } from "@/components/CurrentPath";
import { CreateBlogForm } from "@/components/CreateBlogForm";
import { CreatePostForm } from "@/components/CreatePostForm";
import { BlogList } from "@/components/BlogList";

// THIS IS WHERE WE WILL LIST ALL THE CREATED BLOGS AS FOLDERS

export default async function Page() {
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
      <div className="window-address">
        <span>Address</span>
        <CurrentPath />
      </div>
      <CreateBlogForm />
      <CreatePostForm />
      <div className="window-content inset">
        <BlogList />
      </div>
    </>
  );
}
