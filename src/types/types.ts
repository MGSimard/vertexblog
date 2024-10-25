interface FormResponseTypes {
  success: boolean;
  message: string;
  errors?: string[];
}
export type FormStatusTypes = FormResponseTypes | null;

export type UserTypes = { username: string; id: string } | null;

export interface BlogInfoTypes {
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

export type SavePostResponseTypes = { success: boolean; message: string };
export type DeletePostResponseTypes = { success: boolean; message: string };

const typeEnums = ["Success", "Error", "Warning"] as const;
type buttonFormat = {
  label: string;
  func?: () => void | Promise<SavePostResponseTypes> | Promise<DeletePostResponseTypes> | Promise<void>;
};
export type DialogOptionsTypes = {
  type: (typeof typeEnums)[number];
  title: string;
  message: string | string[];
  buttons: buttonFormat[];
  closeDialog?: () => void;
  doSave?: boolean;
};

export interface RatelimitReturnTypes {
  success: boolean;
  message: string;
}
