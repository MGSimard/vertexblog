import { getPosts } from "@/server/actions";
import { TextFile } from "@/components/TextFile";

export async function PostList({ currentBlog }: { currentBlog: string }) {
  const { success, data, message } = await getPosts(currentBlog);
  // TODO: ON SUCCESS FALSE, TOAST ERROR`
  // TODO: DO SOMETHING WITH POST.CREATIONDATE AND POST.UPDATEDATE
  // PROBABLY FILE SORTING

  return (
    <ul className="shortcut-area">
      {!success && message}
      {data &&
        data.map((post) => (
          <li key={post.postId}>
            <TextFile postInfo={post} />
          </li>
        ))}
    </ul>
  );
}
