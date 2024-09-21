interface FormResponseTypes {
  success: boolean;
  message: string;
  errors?: string[];
}
export type FormStatusTypes = FormResponseTypes | null;

export type UserTypes = { username: string; id: string } | null;

interface BlogInfoTypes {
  blogId: number;
  blogAuthor: string;
  blogTitle: string;
  active: boolean;
  creationDate: Date;
  updateDate: Date | null;
}
export type GetBlogsResponseTypes = { success: boolean; data?: BlogInfoTypes[]; message: string };

export interface PostInfoTypes {
  postId: number;
  parentBlog: number;
  postTitle: string;
  postContent: string;
  creationDate: Date;
  updateDate: Date | null;
}
export type GetPostsResponseTypes = { success: boolean; data?: PostInfoTypes[]; message: string };
